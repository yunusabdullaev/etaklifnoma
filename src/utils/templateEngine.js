/**
 * Taklifnoma Template Engine
 *
 * Replaces {{placeholder}} tokens in HTML/CSS templates with actual data.
 * Supports nested custom fields, conditional blocks, date/time formatting,
 * and safe HTML escaping.
 */

// ── Uzbek month names ───────────────────────────────────────
const UZ_MONTHS = [
  'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
  'iyul', 'avgust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr',
];

const UZ_DAYS = [
  'Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba',
  'Payshanba', 'Juma', 'Shanba',
];

// ── Russian month/day names ───────────────────────────────────
const RU_MONTHS = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];

const RU_DAYS = [
  'Воскресенье', 'Понедельник', 'Вторник', 'Среда',
  'Четверг', 'Пятница', 'Суббота',
];

/**
 * Escapes HTML special characters to prevent XSS.
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return String(str ?? '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Formats a date string (YYYY-MM-DD) into Uzbek human-readable format.
 */
function formatDateUz(dateStr) {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    const dayName = UZ_DAYS[d.getDay()];
    return `${day} ${UZ_MONTHS[month - 1]} ${year}-yil, ${dayName}`;
  } catch {
    return dateStr;
  }
}

/**
 * Formats a date string (YYYY-MM-DD) into Russian human-readable format.
 */
function formatDateRu(dateStr) {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    const dayName = RU_DAYS[d.getDay()];
    return `${day} ${RU_MONTHS[month - 1]} ${year} г., ${dayName}`;
  } catch {
    return dateStr;
  }
}

/**
 * Formats time string (HH:MM:SS or HH:MM) into short format.
 */
function formatTime(timeStr) {
  if (!timeStr) return '';
  return timeStr.slice(0, 5);
}

/**
 * Builds a flat context map from invitation + event data.
 * All keys are lowercased for case-insensitive matching.
 */
function buildContext(invitation, eventType, template) {
  const ctx = {};

  // Core invitation fields
  ctx['hostName'] = invitation.hostName || '';
  ctx['host_name'] = invitation.hostName || '';
  ctx['guestName'] = invitation.guestName || '';
  ctx['guest_name'] = invitation.guestName || '';
  ctx['eventTitle'] = invitation.eventTitle || '';
  ctx['event_title'] = invitation.eventTitle || '';
  ctx['eventDate'] = invitation.eventDate || '';
  ctx['event_date'] = invitation.eventDate || '';
  ctx['eventDateFormatted'] = formatDateUz(invitation.eventDate);
  ctx['event_date_formatted'] = formatDateUz(invitation.eventDate);
  ctx['date'] = formatDateUz(invitation.eventDate);
  ctx['dateRu'] = formatDateRu(invitation.eventDate);
  ctx['date_ru'] = formatDateRu(invitation.eventDate);
  ctx['eventTime'] = formatTime(invitation.eventTime);
  ctx['event_time'] = formatTime(invitation.eventTime);
  ctx['time'] = formatTime(invitation.eventTime);
  ctx['location'] = invitation.location || '';
  ctx['locationUrl'] = invitation.locationUrl || '';
  ctx['location_url'] = invitation.locationUrl || '';
  ctx['message'] = invitation.message || '';
  ctx['name'] = invitation.hostName || '';
  ctx['slug'] = invitation.slug || '';

  // Event type info
  if (eventType) {
    ctx['eventTypeName'] = eventType.name || '';
    ctx['eventTypeLabel'] = eventType.label || '';
    ctx['eventTypeIcon'] = eventType.icon || '';
    ctx['event_type'] = eventType.label || '';
    ctx['icon'] = eventType.icon || '';
  }

  // Template info
  if (template) {
    ctx['templateName'] = template.name || '';
  }

  // Merge custom fields (flattened)
  const customFields = invitation.customFields || {};
  for (const [key, value] of Object.entries(customFields)) {
    // If it's an empty array string "[]" or "[\n]", treat it as empty
    if (typeof value === 'string' && value.replace(/\s/g, '') === '[]') {
      ctx[key] = '';
    } else {
      ctx[key] = value;
    }
  }

  return ctx;
}

/**
 * Replaces all {{placeholder}} tokens in a string using the context map.
 * Supports:
 *   {{key}}                 — simple replacement
 *   {{key|default_value}}   — fallback if key is empty
 *   {{#if key}}...{{/if}}   — conditional block (shows content if key is truthy)
 *   {{#unless key}}...{{/unless}} — inverse conditional
 */
function renderString(template, context, shouldEscape = true) {
  if (!template) return '';

  let output = template;

  // 1. Process {{#if key}}...{{/if}} blocks
  output = output.replace(
    /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/gi,
    (_, key, content) => {
      const val = context[key];
      return val && val.toString().trim() ? content : '';
    },
  );

  // 2. Process {{#unless key}}...{{/unless}} blocks
  output = output.replace(
    /\{\{#unless\s+(\w+)\}\}([\s\S]*?)\{\{\/unless\}\}/gi,
    (_, key, content) => {
      const val = context[key];
      return !val || !val.toString().trim() ? content : '';
    },
  );

  // 3. Replace {{key|default}} and {{key}} placeholders
  output = output.replace(
    /\{\{\s*(\w+)(?:\|([^}]*))?\s*\}\}/g,
    (_, key, defaultVal) => {
      let val = context[key];
      if (val === undefined || val === null || val === '') {
        val = defaultVal !== undefined ? defaultVal : '';
      }
      return shouldEscape ? escapeHtml(val) : val;
    },
  );

  return output;
}

/**
 * Renders a full HTML page from a template + invitation data.
 * Returns a complete standalone HTML document.
 */
function renderInvitation(invitation, eventType, template) {
  const context = buildContext(invitation, eventType, template);

  // Render template HTML and CSS
  let renderedBody = renderString(template?.htmlContent || '', context);
  let renderedCss = renderString(template?.cssContent || '', context, false);

  // Fix body height constraint — ensure scrolling works for wishes/RSVP sections
  // Only replace standalone height:100vh, skip min-height:100vh
  renderedCss = renderedCss.replace(/body\s*\{([^}]*?)(?<!min-)height\s*:\s*100vh/g, 'body{$1min-height:100vh');

  // Swap greeting-section and wishes-section so wishes appear before greeting
  const greetMatch = renderedBody.match(/<section class="section\s+greeting-section"[\s\S]*?<\/section>/);
  const wishMatch = renderedBody.match(/<section class="section\s+wishes-section"[\s\S]*?<\/section>/);
  if (greetMatch && wishMatch) {
    renderedBody = renderedBody
      .replace(greetMatch[0], '{{__GREETING_PLACEHOLDER__}}')
      .replace(wishMatch[0], '{{__WISHES_PLACEHOLDER__}}')
      .replace('{{__GREETING_PLACEHOLDER__}}', wishMatch[0])
      .replace('{{__WISHES_PLACEHOLDER__}}', greetMatch[0]);
  }

  // OG metadata
  const ogTitle = escapeHtml(invitation.eventTitle || eventType?.label || 'Taklifnoma');
  const ogDesc = escapeHtml(`${invitation.hostName || ''} — ${formatDateUz(invitation.eventDate)}`);
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  const ogUrl = `${appUrl}/invite/${invitation.slug}/view`;

  // Music support — check customFields for musicUrl
  let musicUrl = invitation.customFields?.musicUrl || '';
  // Fix file URLs: normalize to relative, then make absolute
  const fixFileUrl = (url) => {
    if (!url) return url;
    // Strip old absolute URLs to relative
    url = url.replace(/^https?:\/\/[^/]+\/api\/files\//, '/api/files/');
    // Convert relative to absolute
    if (url.startsWith('/api/files/')) {
      url = `${appUrl}${url}`;
    }
    return url;
  };
  musicUrl = fixFileUrl(musicUrl);

  // Fix photo URLs too
  let photos = invitation.customFields?.photos || [];
  photos = photos.map(fixFileUrl);
  const musicPlayer = musicUrl ? buildMusicPlayer(musicUrl) : '';

  // Wishes form — requires Telegram Bot connection to be enabled
  const telegramChatId = invitation.customFields?.telegramChatId || invitation.customFields?.telegramBot || '';
  const isWishesEnabled = invitation.customFields?.enableWishes === undefined ? !!telegramChatId : invitation.customFields?.enableWishes;
  const wishesForm = isWishesEnabled ? buildWishesForm(telegramChatId, invitation.slug) : '';

  // Build full page
  return `<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${ogDesc}">
  <title>${ogTitle}</title>

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Crect x='40' y='140' width='432' height='280' rx='24' fill='%23c8d3e0' stroke='%233d4f6a' stroke-width='14'/%3E%3Cpath d='M54 154 L256 310 L458 154' fill='none' stroke='%233d4f6a' stroke-width='14' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M256 340 C256 340 196 280 196 248 C196 220 220 204 244 216 C252 220 256 228 256 228 C256 228 260 220 268 216 C292 204 316 220 316 248 C316 280 256 340 256 340Z' fill='%23e63946' stroke='%23c1121f' stroke-width='6'/%3E%3C/svg%3E" />

  <!-- Open Graph (link preview for WhatsApp / Telegram / iMessage) -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="${ogTitle}">
  <meta property="og:description" content="${ogDesc}">
  <meta property="og:url" content="${ogUrl}">
  <meta property="og:site_name" content="eTaklifnoma.uz">
  <meta property="og:image" content="https://image.thum.io/get/width/1200/crop/630/noanimate/${ogUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/jpeg">

  <!-- Twitter / X Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${ogTitle}">
  <meta name="twitter:description" content="${ogDesc}">
  <meta name="twitter:image" content="https://image.thum.io/get/width/1200/crop/630/noanimate/${ogUrl}">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600&family=Montserrat:wght@200;300;400;500;600&family=Great+Vibes&family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    ${getBaseStyles()}
    ${renderedCss}
    ${getMusicPlayerStyles()}
    ${getWishesFormStyles()}
    ${getLanguageToggleStyles()}
  </style>
</head>
<body>
  ${(() => {
    // Inject gallery, wishes, rsvp BEFORE the footer section (so footer is always last)
    const gallery = buildPhotoGallery(photos);
    const rsvp = invitation.customFields?.enableRsvp === true ? buildRsvpForm(invitation.slug, invitation.customFields?.rsvpLang || 'uz') : '';
    const extras = gallery + wishesForm + rsvp;
    
    // Try to inject before footer (keeps footer at bottom)
    if (renderedBody.includes('<!-- ====== FOOTER ====== -->')) {
      return renderedBody.replace('<!-- ====== FOOTER ====== -->', extras + '\n  <!-- ====== FOOTER ====== -->');
    }
    // Fallback: try before <footer
    if (renderedBody.includes('<footer')) {
      return renderedBody.replace('<footer', extras + '\n  <footer');
    }
    // Last fallback: before </main>
    if (renderedBody.includes('</main>')) {
      return renderedBody.replace('</main>', extras + '</main>');
    }
    return renderedBody + extras;
  })()}
  ${musicPlayer}
  <script>window.__INVITE_DATA__=${JSON.stringify({
    dateUz: context['date'] || '',
    dateRu: context['dateRu'] || '',
    message: context['message'] || (eventType==='wedding' ? "Sizni farzandlarimiz nikoh to'yiga tashrif buyurishingizni so'rab qolamiz." : eventType==='birthday' ? "Sizni bayramimizga taklif qilamiz. Birga shodlanaylik!" : eventType==='graduation' ? "Universitetni tamomlash quvonchini biz bilan baham ko'ring!" : "Orzular ushalgan yubiley oqshomimizga lutfan taklif etamiz!"),
    messageRu: context['messageRu'] || (eventType==='wedding' ? "Приглашаем вас разделить радость нашего бракосочетания." : eventType==='birthday' ? "Приглашаем вас на наш праздник. Если вы приедете, мы будем счастливы." : eventType==='graduation' ? "Разделите с нами радость окончания университета!" : "Пожалуйста, приглашаем вас на наш юбилейный вечер!"),
    messageQq: context['messageQq'] || (eventType==='wedding' ? "Sizdi perzentlerimizdeń neke toyına shaqırıp qalamız." : eventType==='birthday' ? "Sizdi bayramımızǵa shaqıramız. Qosılıp quwanayıq!" : eventType==='graduation' ? "Universitetti pitiriw quwanıshın biz benen bólesiń!" : "Ármanlar orınlanǵan yubiley aqshamımızǵa lutfan shaqıramız!"),
    location: context['location'] || '',
    hostName: context['hostName'] || '',
    hostNameRu: context['hostNameRu'] || '',
    hostNameQq: context['hostNameQq'] || '',
    guestName: context['guestName'] || 'Hurmatli mehmonlar!',
    guestNameRu: context['guestNameRu'] || 'Уважаемые гости!',
    guestNameQq: context['guestNameQq'] || 'Húrmetli miymanlar!',
    eventTitle: context['eventTitle'] || (eventType==='birthday' ? "Tug'ilgan kun bayrami" : eventType==='graduation' ? "Bitiruv kechasi" : "Yubiley bayramiga taklif"),
    eventTitleRu: context['eventTitleRu'] || (eventType==='birthday' ? "Праздник дня рождения" : eventType==='graduation' ? "Выпускной вечер" : "Приглашение на юбилей"),
    eventTitleQq: context['eventTitleQq'] || (eventType==='birthday' ? 'Tuwılǵan kún bayramı' : eventType==='graduation' ? 'Pitiriw keshesi' : 'Yubileyge shaqırıw'),
    eventTime: context['time'] || '',
    langMode: context['langMode'] || '',
    langUz: context['langUz'] !== false && context['langUz'] !== 'false',
    langQq: context['langQq'] === true || context['langQq'] === 'true',
    langRu: context['langRu'] === true || context['langRu'] === 'true',
    enableAlphabetSwitcher: context['enableAlphabetSwitcher'] === true || context['enableAlphabetSwitcher'] === 'true',
    baseAlphabetUz: context['baseAlphabetUz'] || 'latin',
    baseAlphabetQq: context['baseAlphabetQq'] || 'latin',
    langOrder: context['langOrder'] || 'uz,ru,qq',
    program: context['program'] || '',
    programRu: context['programRu'] || '',
    programQq: context['programQq'] || '',
    programCustomTitle: context['programCustomTitle'] || '',
    programCustomTitleRu: context['programCustomTitleRu'] || '',
    programCustomTitleQq: context['programCustomTitleQq'] || '',
    eventDateRaw: invitation.eventDate || '',
    eventTimeRaw: invitation.eventTime ? invitation.eventTime.substring(0, 5) : '',
    eventTitleDisplay: context['eventTitle'] || context['hostName'] || '',
    locationDisplay: context['location'] || '',
  })};</script>
  ${buildLanguageToggle(invitation.customFields)}
  ${buildShareButtons(invitation.customFields)}
  ${(invitation.customFields?.showCalendarBtn === true) ? buildCalendarButton() : ''}
  ${(invitation.customFields?.showPrintBtn === true) ? buildPrintButton() : ''}
  ${(invitation.customFields?.envelopeAnim !== false) ? buildEnvelopeAnimation(eventType) : ''}
  ${buildColorPaletteCss(invitation.customFields?.colorPalette || 'gold')}
  ${buildBrandingFooter()}
</body>
</html>`;
}

/**
 * Renders just the HTML body fragment (for iframe preview).
 */
function renderPreviewFragment(data, eventType, template) {
  const context = buildContext(data, eventType, template);
  const renderedBody = renderString(template?.htmlContent || '', context);
  const renderedCss = renderString(template?.cssContent || '', context, false);
  return { html: renderedBody, css: `${getBaseStyles()}\n${renderedCss}` };
}

/**
 * Base CSS reset + shared styles injected into every rendered invitation.
 */
function getBaseStyles() {
  return `
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; overflow-x: hidden; }
    body {
      font-family: 'Montserrat', 'Outfit', system-ui, sans-serif;
      min-height: 100vh;
      background: #0b0d17;
      color: #e8e2d6;
      line-height: 1.7;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }
    img { max-width: 100%; display: block; }
    a { text-decoration: none; color: inherit; }
  `;
}

/**
 * Builds the floating music player HTML with toggle button.
 */
function buildMusicPlayer(musicUrl) {
  return `
  <div class="music-toggle" id="musicToggle" onclick="toggleMusic()">
    <svg class="music-icon playing" id="musicIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M9 18V5l12-2v13"/>
      <circle cx="6" cy="18" r="3"/>
      <circle cx="18" cy="16" r="3"/>
    </svg>
  </div>
  <audio id="bgMusic" loop preload="auto">
    <source src="${musicUrl}" type="audio/mpeg">
  </audio>
  <script>
  (function() {
    var audio = document.getElementById('bgMusic');
    var btn = document.getElementById('musicToggle');
    var icon = document.getElementById('musicIcon');
    var playing = false;

    function toggleMusic() {
      if (playing) {
        audio.pause();
        icon.classList.remove('playing');
        playing = false;
      } else {
        audio.play().catch(function(){});
        icon.classList.add('playing');
        playing = true;
      }
    }
    window.toggleMusic = toggleMusic;

    // Auto-play on first user interaction
    function autoPlay() {
      audio.play().then(function() {
        playing = true;
        icon.classList.add('playing');
      }).catch(function(){});
      document.removeEventListener('click', autoPlay);
      document.removeEventListener('touchstart', autoPlay);
      document.removeEventListener('scroll', autoPlay);
    }
    document.addEventListener('click', autoPlay, { once: true });
    document.addEventListener('touchstart', autoPlay, { once: true });
    document.addEventListener('scroll', autoPlay, { once: true });
  })();
  </script>`;
}

/**
 * Builds floating WhatsApp + Telegram share buttons.
 * @param {object} cf - customFields from invitation (optional)
 */
function buildShareButtons(cf) {
  const showWa = cf && cf.showShareWa === true;
  const showTg = cf && cf.showShareTg === true;
  if (!showWa && !showTg) return '';

  const waBtn = showWa ? `
    <a id="waShareBtn" href="#" target="_blank" rel="noopener"
      title="WhatsApp orqali ulashish" data-i18n-title="shareWa"
      style="width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;
             background:rgba(37,211,102,0.12);border:1px solid rgba(37,211,102,0.25);backdrop-filter:blur(12px);
             cursor:pointer;transition:all 0.3s ease;text-decoration:none;box-shadow:0 4px 16px rgba(0,0,0,0.3);">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="#25d366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12.004 2c-5.514 0-9.993 4.478-9.993 9.993 0 1.76.463 3.464 1.344 4.97L2 22l5.184-1.361a9.945 9.945 0 004.82 1.232h.004c5.512 0 9.991-4.48 9.991-9.994 0-2.67-1.039-5.18-2.927-7.069A9.952 9.952 0 0012.004 2z"/></svg>
    </a>` : '';

  const tgBtn = showTg ? `
    <a id="tgShareBtn" href="#" target="_blank" rel="noopener"
      title="Telegram orqali ulashish" data-i18n-title="shareTg"
      style="width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;
             background:rgba(36,162,222,0.12);border:1px solid rgba(36,162,222,0.25);backdrop-filter:blur(12px);
             cursor:pointer;transition:all 0.3s ease;text-decoration:none;box-shadow:0 4px 16px rgba(0,0,0,0.3);">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="#24a2de"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z"/></svg>
    </a>` : '';

  return `
  <div id="sharePanel" style="position:fixed;bottom:88px;right:24px;z-index:9998;display:flex;flex-direction:column;gap:8px;">
    ${waBtn}
    ${tgBtn}
  </div>
  <script>
  (function(){
    var url = encodeURIComponent(window.location.href);
    var text = encodeURIComponent('💍 Sizni taklifnomamizga taklif etamiz!');
    ${showWa ? "var wa=document.getElementById('waShareBtn');if(wa)wa.href='https://wa.me/?text='+text+'%20'+url;" : ''}
    ${showTg ? "var tg=document.getElementById('tgShareBtn');if(tg)tg.href='https://t.me/share/url?url='+url+'&text='+text;" : ''}
    ['waShareBtn','tgShareBtn'].forEach(function(id){
      var el=document.getElementById(id);if(!el)return;
      el.addEventListener('mouseenter',function(){this.style.transform='scale(1.12)';this.style.boxShadow='0 8px 24px rgba(0,0,0,0.4)';});
      el.addEventListener('mouseleave',function(){this.style.transform='scale(1)';this.style.boxShadow='0 4px 16px rgba(0,0,0,0.3)';});
    });
  })();
  <\/script>`;
}


/**
 * Builds the Telegram wishes form HTML.
 */
function buildWishesForm(chatId, invitationSlug) {
  return `
  <section class="section wishes-section" id="wishes">
    <div class="container">
      <h2 class="section-heading" style="margin-bottom:12px">💌 Tilak va tabriklar</h2>
      <p class="wishes-subtitle">Tilak va tabriklaringizni qoldiring</p>
      <form class="wishes-form" id="wishesForm" onsubmit="sendWish(event)">
        <input type="text" name="name" placeholder="Ismingiz" required class="wishes-input" />
        <textarea name="message" placeholder="Tilaklaringiz..." required rows="3" class="wishes-input wishes-textarea"></textarea>
        <input type="hidden" name="slug" value="${invitationSlug}" />
        <input type="hidden" name="chatId" value="${chatId}" />
        <button type="submit" class="wishes-btn" id="wishesBtn">
          <span id="wishesBtnText">Yuborish</span>
        </button>
        <p class="wishes-status" id="wishesStatus"></p>
      </form>
    </div>
  </section>
  <script>
  function sendWish(e) {
    e.preventDefault();
    var form = e.target;
    var btn = document.getElementById('wishesBtn');
    var btnText = document.getElementById('wishesBtnText');
    var status = document.getElementById('wishesStatus');
    var name = form.name.value.trim();
    var message = form.message.value.trim();
    var chatId = form.chatId ? form.chatId.value : '';
    var slug = form.slug.value;

    if (!name || !message) return;

    btnText.textContent = 'Yuborilmoqda...';
    btn.disabled = true;

    const serverUrl = '${process.env.APP_URL || ""}';
    const apiUrl = serverUrl ? serverUrl + '/api/wishes' : '/api/wishes';

    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, message: message, chatId: chatId, slug: slug })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.success) {
        status.textContent = 'Tilaklaringiz yuborildi! Rahmat!';
        status.style.color = 'var(--accent-bright, #e8d07e)';
        form.reset();
      } else {
        status.textContent = 'Xatolik yuz berdi. Qayta urinib ko\\'ring.';
        status.style.color = '#ef4444';
      }
    })
    .catch(function() {
      status.textContent = 'Tarmoq xatoligi.';
      status.style.color = '#ef4444';
    })
    .finally(function() {
      btnText.textContent = 'Yuborish';
      btn.disabled = false;
    });
  }
  </script>`;
}

function getMusicPlayerStyles() {
  return `
  .music-toggle{position:fixed;bottom:24px;right:24px;z-index:9999;width:52px;height:52px;background:rgba(255,255,255,0.08);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.12);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.3s ease;box-shadow:0 4px 20px rgba(0,0,0,0.3)}
  .music-toggle:hover{transform:scale(1.1);border-color:var(--accent, #c9a84c)}
  .music-icon{width:24px;height:24px;color:rgba(255,255,255,0.5);transition:color 0.3s ease}
  .music-icon.playing{color:var(--accent-bright, #e8d07e);animation:pulse-music 2s ease-in-out infinite}
  @keyframes pulse-music{0%,100%{opacity:1}50%{opacity:0.5}}
  `;
}

function getWishesFormStyles() {
  return `
  .wishes-section{background:var(--dark);text-align:center;padding:80px 0;position:relative}
  .wishes-subtitle{font-size:0.95rem;color:var(--text-light);opacity:0.6;margin-bottom:32px;font-weight:300;font-family:var(--ff-serif)}
  .wishes-form{max-width:480px;margin:0 auto;display:flex;flex-direction:column;gap:16px}
  .wishes-input{background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:14px;padding:14px 20px;font-family:var(--ff-sans);font-size:0.95rem;color:var(--text-light);outline:none;transition:border-color 0.3s ease;backdrop-filter:blur(8px)}
  .wishes-input:focus{border-color:var(--accent)}
  .wishes-input::placeholder{color:var(--text-light);opacity:0.4}
  .wishes-textarea{resize:vertical;min-height:100px}
  .wishes-btn{padding:14px 32px;background:var(--btn-bg);border:none;border-radius:50px;color:var(--btn-text);font-family:var(--ff-sans);font-size:0.95rem;font-weight:600;letter-spacing:1px;cursor:pointer;transition:all 0.3s ease}
  .wishes-btn:hover{transform:translateY(-2px);box-shadow:0 6px 24px var(--glow)}
  .wishes-btn:disabled{opacity:0.6;cursor:not-allowed;transform:none}
  .wishes-status{font-size:0.9rem;margin-top:8px;min-height:24px}
  `;
}

/**
 * Language toggle button + translations system (UZ / QQ / RU)
 */
function buildLanguageToggle(cf) {
  var orderArr = (cf && cf.langOrder) ? cf.langOrder.split(',') : ['uz', 'ru', 'qq'];
  var uzOrder = orderArr.indexOf('uz');
  var ruOrder = orderArr.indexOf('ru');
  var qqOrder = orderArr.indexOf('qq');

  return `
  <div class="lang-toggle" id="langToggle">
    <div style="display:flex;gap:4px;">
      <button class="lang-btn active" id="langUz" onclick="switchLang('uz')" style="order:${uzOrder}">UZ</button>
      <button class="lang-btn" id="langQq" onclick="switchLang('qq')" style="display:none; order:${qqOrder}">QQ</button>
      <button class="lang-btn" id="langRu" onclick="switchLang('ru')" style="display:none; order:${ruOrder}">RU</button>
    </div>
    <div id="scriptToggle" style="display:flex;gap:4px;border-left:1px solid rgba(255,255,255,0.2);padding-left:4px;">
      <button class="lang-btn active" id="scrLat" onclick="switchScript('latin')">Lot</button>
      <button class="lang-btn" id="scrCyr" onclick="switchScript('cyrillic')">Кир</button>
    </div>
  </div>
  <script>
  (function(){
    var d = window.__INVITE_DATA__ || {};

    var scriptToggle = document.getElementById('scriptToggle');
    if (scriptToggle && !d.enableAlphabetSwitcher) {
      scriptToggle.style.display = 'none';
    }

    // New toggle system: langUz, langQq, langRu (boolean flags)
    var hasUz = d.langUz !== false;
    var hasQq = !!d.langQq;
    var hasRu = !!d.langRu;

    // Backward compat: old langMode → new flags
    if(d.langMode) {
      if(d.langMode === 'uz') { hasUz = true; hasQq = false; hasRu = false; }
      else if(d.langMode === 'uzru') { hasUz = true; hasQq = false; hasRu = true; }
      else if(d.langMode === 'ru') { hasUz = false; hasQq = false; hasRu = true; }
    }

    var langs = [];
    if(hasUz) langs.push('uz');
    if(hasQq) langs.push('qq');
    if(hasRu) langs.push('ru');

    // Show/hide and visual ordering of layout buttons
    var uzBtn = document.getElementById('langUz');
    var qqBtn = document.getElementById('langQq');
    var ruBtn = document.getElementById('langRu');
    
    var orderArr = d.langOrder ? d.langOrder.split(',') : ['uz','ru','qq'];
    if(uzBtn) { uzBtn.style.display = hasUz ? '' : 'none'; uzBtn.style.order = orderArr.indexOf('uz'); }
    if(qqBtn) { qqBtn.style.display = hasQq ? '' : 'none'; qqBtn.style.order = orderArr.indexOf('qq'); }
    if(ruBtn) { ruBtn.style.display = hasRu ? '' : 'none'; ruBtn.style.order = orderArr.indexOf('ru'); }

    // Hide only the language switcher buttons if 1 language, keep toggle container for script toggle
    var toggle = document.getElementById('langToggle');
    var langBtnsContainer = toggle ? toggle.querySelector('div:first-child') : null;
    if(langs.length <= 1 && langBtnsContainer) {
      langBtnsContainer.style.display = 'none';
      var scriptCont = document.getElementById('scriptToggle');
      if (scriptCont) {
        scriptCont.style.borderLeft = 'none';
        scriptCont.style.paddingLeft = '0';
      }
      if(langs[0] === 'ru' && toggle) toggle.style.display = 'none';
    }

    var currentLang = 'uz';

    var translations = {
      uz: {
        eventLabel: 'Nikoh taklifi',
        countdownTitle: "To'ygacha qolgan vaqt",
        days: 'Kun', hours: 'Soat', minutes: 'Minut', seconds: 'Sekund',
        detailsTitle: "To'y tafsilotlari",
        dateLabel: 'Sana', timeLabel: 'Vaqt', venueLabel: 'Manzil',
        guestWelcome: 'Mehmonlarni kutib olish',
        locationTitle: 'Lokatsiya',
        viewMap: "Xaritada ko'rish",
        programTitle: 'Kechaning dasturi',
        dressCode: 'Dress code',
        waitingMsg: 'Sizni kutib qolamiz!',
        galleryTitle: 'Foto lavhalar',
        wishesTitle: '💌 Tilak va tabriklar',
        wishesSubtitle: 'Tilak va tabriklaringizni qoldiring',
        wishesName: 'Ismingiz',
        wishesMessage: 'Tilaklaringiz...',
        wishesSend: 'Yuborish',
        wishesSent: 'Tilaklaringiz yuborildi! Rahmat!',
        wishesError: 'Xatolik yuz berdi.',
        envOpen: 'Ochish uchun bosing',
        shareWa: 'WhatsApp orqali ulashish',
        shareTg: 'Telegram orqali ulashish',
        calBtn: 'Kalendarimga qo\\'shish',
        printBtn: 'PDF qilib saqlash',
        inviteText: '💍 Sizni taklifnomamizga taklif etamiz!',

        bdEventLabel: "Tug'ilgan kun taklifi",
        bdCountdownTitle: "Bayramgacha qolgan vaqt",
        bdDetailsTitle: "Bayram tafsilotlari",
        bdWaitingMsg: "Sizni kutib qolamiz! 🎉",
        bdProgramTitle: "Bayram dasturi",
        bdAge: "yosh",
        gradYear: "bitiruvchilar",
        jubYears: "yillik",

        gradEventLabel: 'Bitiruvchilar kechasi',
        gradCountdownTitle: 'Tadbirgacha qolgan vaqt',
        gradDetailsTitle: 'Tadbir tafsilotlari',
        gradProgramTitle: 'Kecha dasturi',

        jubEventLabel: 'Yubiley taklifi',
        jubCountdownTitle: 'Bayramgacha qolgan vaqt',
        jubDetailsTitle: 'Tafsilotlar',
        jubProgramTitle: 'Tantana dasturi'
      },
      qq: {
        eventLabel: 'Nikax shaqırıwı',
        countdownTitle: 'Toyǵa shekem qalǵan waqıt',
        days: 'Kún', hours: 'Saǵat', minutes: 'Minut', seconds: 'Sekund',
        detailsTitle: 'Toy tafsilatları',
        dateLabel: 'Sána', timeLabel: 'Waqıt', venueLabel: 'Mánzil',
        guestWelcome: 'Mexmanlar kútip alıw',
        locationTitle: 'Lokatsiya',
        viewMap: 'Kartada kóriw',
        programTitle: 'Kesheniń baǵdarlanması',
        dressCode: 'Dress kod',
        waitingMsg: 'Sizdi kútip qalamız!',
        galleryTitle: 'Foto kórgezbe',
        wishesTitle: '💌 Tilek hám qutlıqlaw',
        wishesSubtitle: 'Tilek hém qutlıqlawlarıńızdı qaldırıń',
        wishesName: 'Atıńız',
        wishesMessage: 'Tilekleriniz...',
        wishesSend: 'Jiberiw',
        wishesSent: 'Tilekleriniz jiberildi! Raxmet!',
        wishesError: 'Qátelik júz berdi.',
        envOpen: 'Ashıw ushın basıń',
        shareWa: 'WhatsApp tarmaǵında úlesiw',
        shareTg: 'Telegram tarmaǵında úlesiw',
        calBtn: 'Kalendarıma qosıw',
        printBtn: 'PDF qılıp saqlaw',
        inviteText: '💍 Sizdi taklifnamamızǵa shaqıramız!',

        bdEventLabel: 'Tuwılǵan kún shaqırıwı',
        bdCountdownTitle: 'Bayramǵa shekem qalǵan waqıt',
        bdDetailsTitle: 'Bayram tafsilatları',
        bdWaitingMsg: 'Sizdi kútip qalamız! 🎉',
        bdProgramTitle: 'Bayram baǵdarlanması',
        bdAge: "jas",
        gradYear: "pitiriwshiler",
        jubYears: "jıllıq",

        gradEventLabel: 'Pitkeriwshiler keshesi',
        gradCountdownTitle: 'Ilájegeche qalǵan waqıt',
        gradDetailsTitle: 'Ilaje tafsilatları',
        gradProgramTitle: 'Keshe baǵdarlanması',

        jubEventLabel: 'Yubilej shaqırıwı',
        jubCountdownTitle: 'Bayramǵa shekem qalǵan waqıt',
        jubDetailsTitle: 'Tafsilatlar',
        jubProgramTitle: 'Tantana baǵdarlanması'
      },
      ru: {
        eventLabel: 'Свадебное приглашение',
        countdownTitle: 'До свадьбы осталось',
        days: 'Дней', hours: 'Часов', minutes: 'Минут', seconds: 'Секунд',
        detailsTitle: 'Детали свадьбы',
        dateLabel: 'Дата', timeLabel: 'Время', venueLabel: 'Место',
        guestWelcome: 'Встреча гостей',
        locationTitle: 'Локация',
        viewMap: 'Показать на карте',
        programTitle: 'Программа вечера',
        dressCode: 'Дресс-код',
        waitingMsg: 'Ждём вас!',
        galleryTitle: 'Фотогалерея',
        wishesTitle: '💌 Пожелания',
        wishesSubtitle: 'Оставьте ваши пожелания',
        wishesName: 'Ваше имя',
        wishesMessage: 'Ваши пожелания...',
        wishesSend: 'Отправить',
        wishesSent: 'Ваши пожелания отправлены! Спасибо!',
        wishesError: 'Произошла ошибка.',
        envOpen: 'Нажмите, чтобы открыть',
        shareWa: 'Поделиться в WhatsApp',
        shareTg: 'Поделиться в Telegram',
        calBtn: 'Добавить в календарь',
        printBtn: 'Сохранить как PDF',
        inviteText: '💍 Приглашаем вас на наше торжество!',

        bdEventLabel: 'Приглашение на день рождения',
        bdCountdownTitle: 'До праздника осталось',
        bdDetailsTitle: 'Детали праздника',
        bdWaitingMsg: 'Ждём вас! 🎉',
        bdProgramTitle: 'Программа праздника',
        bdAge: "лет",
        gradYear: "выпускники",
        jubYears: "лет",

        gradEventLabel: 'Выпускной вечер',
        gradCountdownTitle: 'До мероприятия осталось',
        gradDetailsTitle: 'Детали мероприятия',
        gradProgramTitle: 'Программа вечера',

        jubEventLabel: 'Приглашение на юбилей',
        jubCountdownTitle: 'До юбилея осталось',
        jubDetailsTitle: 'Подробности',
        jubProgramTitle: 'Программа торжества'
      }
    };

    function translit(str, script) {
      if (!str) return str;
      var ltCy = { 'Ya':'Я','ya':'я','Ye':'Е','ye':'е','Yo':'Ё','yo':'ё','Yu':'Ю','yu':'ю','Ch':'Ч','ch':'ч',
        'Sh':'Ш','sh':'ш', "O'":"Ў", "o'":"ў", "O‘":"Ў", "o‘":"ў", "Oʻ":"Ў", "oʻ":"ў", "G'":"Ғ", "g'":"ғ", "G‘":"Ғ", "g‘":"ғ", "Gʻ":"Ғ", "gʻ":"ғ",
        'A':'А','a':'а','B':'Б','b':'б','D':'Д','d':'д','E':'Э','e':'э','F':'Ф','f':'ф','G':'Г','g':'г','H':'Ҳ','h':'ҳ','I':'И','i':'и','J':'Ж','j':'ж','K':'К','k':'к','L':'Л','l':'л',
        'M':'М','m':'м','N':'Н','n':'н','O':'О','o':'о','P':'П','p':'п','Q':'Қ','q':'қ','R':'Р','r':'р','S':'С','s':'с','T':'Т','t':'т','U':'У','u':'у','V':'В','v':'в',
        'X':'Х','x':'х','Y':'Й','y':'й','Z':'З','z':'з',"'":"Ъ",'’':'Ъ','‘':'Ъ'};
      var cyLt = {};
      for (var k in ltCy) { cyLt[ltCy[k]] = k; }
      cyLt['Е'] = 'Ye'; cyLt['е'] = 'ye'; cyLt['Э'] = 'E'; cyLt['э'] = 'e'; cyLt['Ц'] = 'Ts'; cyLt['ц'] = 'ts';
      var map, regex;
      if (script === 'cyrillic') {
        map = ltCy;
        var keys = Object.keys(map).sort(function(a,b){return b.length - a.length;});
        regex = new RegExp(keys.join('|'), 'g');
      } else {
        map = cyLt;
        var keys = Object.keys(map).sort(function(a,b){return b.length - a.length;});
        regex = new RegExp(keys.join('|'), 'g');
      }
      return str.replace(regex, function(m) { return map[m]; });
    }
    
    window._curScript = d.baseAlphabetUz || 'latin';
    if(d.langUz === false && d.langQq) window._curScript = d.baseAlphabetQq || 'latin';
    
    var _scrLatBtn = document.getElementById('scrLat');
    var _scrCyrBtn = document.getElementById('scrCyr');
    if(_scrLatBtn) _scrLatBtn.className = (window._curScript==='latin') ? 'lang-btn active' : 'lang-btn';
    if(_scrCyrBtn) _scrCyrBtn.className = (window._curScript==='cyrillic') ? 'lang-btn active' : 'lang-btn';

    // Data maps for each language
    var langData = {
      uz: { host: d.hostName, guest: d.guestName, title: d.eventTitle, message: d.message, program: d.program, date: d.dateUz, programTitle: d.programCustomTitle },
      qq: { host: d.hostNameQq || d.hostName, guest: d.guestNameQq || d.guestName, title: d.eventTitleQq || d.eventTitle, message: d.messageQq || d.message, program: d.programQq || d.program, date: d.dateUz, programTitle: d.programCustomTitleQq || d.programCustomTitle },
      ru: { host: d.hostNameRu || d.hostName, guest: d.guestNameRu || d.guestName, title: d.eventTitleRu || d.eventTitle, message: d.messageRu || d.message, program: d.programRu || d.program, date: d.dateRu || d.dateUz, programTitle: d.programCustomTitleRu || d.programCustomTitle },
    };

    
    window.switchScript = function(script) {
        if(window._curScript === script) return;
        var lat = document.getElementById('scrLat');
        var cyr = document.getElementById('scrCyr');
        if(lat) lat.className = (script==='latin') ? 'lang-btn active' : 'lang-btn';
        if(cyr) cyr.className = (script==='cyrillic') ? 'lang-btn active' : 'lang-btn';
        window._curScript = script;
        switchLang(window.currentLang || 'uz', true);
    };

    function switchLang(lang, isScriptChange) {
      if(!isScriptChange && window.currentLang === lang && !window._forceSwap) return;
      var t = translations[lang];
      if(!t) return;

      var prevLang = window.currentLang || 'uz';
      var prevData = langData[prevLang] || langData.uz;
      var newData = langData[lang] || langData.uz;
      
      var pScr = isScriptChange ? (window._curScript === 'cyrillic' ? 'latin' : 'cyrillic') : window._curScript;
      var nScr = window._curScript;
      
      function ptr(v) { return (prevLang==='uz'||prevLang==='qq') ? translit(v, pScr) : v; }
      function ntr(v) { return (lang==='uz'||lang==='qq') ? translit(v, nScr) : v; }

      var scriptToggle = document.getElementById('scriptToggle');
      if(scriptToggle && d.enableAlphabetSwitcher) {
        scriptToggle.style.display = (lang === 'ru') ? 'none' : 'flex';
      } else if(scriptToggle) {
        scriptToggle.style.display = 'none';
      }

      var uzBtn = document.getElementById('langUz');
      var qqBtn = document.getElementById('langQq');
      var ruBtn = document.getElementById('langRu');

      if(uzBtn) uzBtn.classList.toggle('active', lang === 'uz');
      if(qqBtn) qqBtn.classList.toggle('active', lang === 'qq');
      if(ruBtn) ruBtn.classList.toggle('active', lang === 'ru');

      document.querySelectorAll('[data-i18n-title]').forEach(function(el){
        var key = el.getAttribute('data-i18n-title');
        if(t[key]) el.setAttribute('title', ntr(t[key]));
      });
      document.querySelectorAll('[data-i18n]').forEach(function(el){
        var key = el.getAttribute('data-i18n');
        var v = (key === 'programTitle' && newData.programTitle) ? newData.programTitle : t[key];
        if (v) el.textContent = ntr(v);
      });

      var nameInput = document.querySelector('.wishes-input[name="name"]');
      var msgInput = document.querySelector('.wishes-textarea[name="message"]');
      var wishesBtn = document.getElementById('wishesBtnText');
      var wishesTitle = document.querySelector('.wishes-section .section-heading');
      var wishesSub = document.querySelector('.wishes-subtitle');

      if(nameInput) nameInput.placeholder = t.wishesName ? ntr(t.wishesName) : '';
      if(msgInput) msgInput.placeholder = t.wishesMessage ? ntr(t.wishesMessage) : '';
      if(wishesBtn) wishesBtn.textContent = t.wishesSend ? ntr(t.wishesSend) : '';
      if(wishesTitle) wishesTitle.textContent = t.wishesTitle ? ntr(t.wishesTitle) : '';
      if(wishesSub) wishesSub.textContent = t.wishesSubtitle ? ntr(t.wishesSubtitle) : '';

      if(prevData.date && newData.date && prevData.date !== newData.date) {
        swapTextInPage(prevData.date, newData.date);
      }

      if(prevData.message && newData.message) swapTextInPage(ptr(prevData.message), ntr(newData.message));
      if(prevData.host && newData.host) swapTextInPage(ptr(prevData.host), ntr(newData.host));
      if(prevData.guest && newData.guest) swapTextInPage(ptr(prevData.guest), ntr(newData.guest));
      if(prevData.title && newData.title) swapTextInPage(ptr(prevData.title), ntr(newData.title));

      var progEl = document.getElementById('program-data');
      if(progEl && newData.program) {
        try {
          var items = JSON.parse(newData.program);
          if(Array.isArray(items) && items.length) {
            var h = '';
            items.forEach(function(item, i) {
              var last = i === items.length - 1;
              h += '<div class="tl-item revealed"><div class="tl-marker"><div class="tl-dot"></div>' +
                (last ? '' : '<div class="tl-connector"></div>') +
                '</div><div class="tl-card"><div class="tl-time">' +
                (item.time || '') + '</div><h4>' + ntr(item.text || '') + '</h4></div></div>';
            });
            progEl.innerHTML = h;
          }
        } catch(e) {}
      }

      window.currentLang = lang;
      document.documentElement.lang = lang;
      try { localStorage.setItem('taklifnoma-lang', lang); } catch(e){}

      var txtEnc = encodeURIComponent(ntr(t['inviteText'] || '💍 Sizni taklifnomamizga taklif etamiz!'));
      var curUrl = encodeURIComponent(window.location.href);
      var wa = document.getElementById('waShareBtn'); if(wa) wa.href = 'https://wa.me/?text=' + txtEnc + '%20' + curUrl;
      var tg = document.getElementById('tgShareBtn'); if(tg) tg.href = 'https://t.me/share/url?url=' + curUrl + '&text=' + txtEnc;
    }

    function swapTextInPage(from, to) {
      if(!from || !to || from === to) return;
      var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
      while(walker.nextNode()) {
        var node = walker.currentNode;
        if(node.nodeValue && node.nodeValue.indexOf(from) !== -1) {
          node.nodeValue = node.nodeValue.split(from).join(to);
        }
      }
    }
    window.switchLang = switchLang;

    // Determine initial language based on strictly defined order
    var orderArr = d.langOrder ? d.langOrder.split(',') : ['uz','ru','qq'];
    var defaultLang = null;
    for(var i=0; i<orderArr.length; i++) {
       if (orderArr[i] === 'uz' && hasUz) { defaultLang = 'uz'; break; }
       if (orderArr[i] === 'qq' && hasQq) { defaultLang = 'qq'; break; }
       if (orderArr[i] === 'ru' && hasRu) { defaultLang = 'ru'; break; }
    }
    if(!defaultLang) defaultLang = hasUz ? 'uz' : (hasQq ? 'qq' : 'ru');

    // Execute initialization (no caching to respect host priority)
    if (!hasUz && !hasQq && hasRu) { switchLang('ru'); }
    else if (!hasUz && hasQq && !hasRu) { switchLang('qq'); }
    else if (!hasRu && !hasQq && hasUz) { switchLang('uz'); }
    else { switchLang(defaultLang); }
  })();
  </script>`
}


function getLanguageToggleStyles() {
  return `
  .lang-toggle{position:fixed;bottom:24px;left:24px;z-index:9999;display:flex;gap:0;border-radius:50px;overflow:hidden;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);backdrop-filter:blur(16px);box-shadow:0 4px 20px rgba(0,0,0,0.3)}
  .lang-btn{padding:10px 16px;font-family:var(--ff-sans, 'Montserrat', sans-serif);font-size:0.75rem;font-weight:600;letter-spacing:1.5px;border:none;background:transparent;color:rgba(255,255,255,0.4);cursor:pointer;transition:all 0.3s ease;text-transform:uppercase}
  .lang-btn.active{background:var(--accent, #c9a84c);color:var(--dark, #0b0d17)}
  .lang-btn:hover:not(.active){color:rgba(255,255,255,0.8);background:rgba(255,255,255,0.05)}
  `;
}

/**
 * Builds a Google Calendar "Add to Calendar" floating button.
 */
function buildCalendarButton() {
  return `
  <a id="calendarBtn" href="#" target="_blank" rel="noopener"
    title="Kalendarimga qo'shish" data-i18n-title="calBtn"
    style="position:fixed;bottom:88px;left:24px;z-index:9998;
           width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;
           background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);backdrop-filter:blur(12px);
           cursor:pointer;transition:all 0.3s ease;text-decoration:none;
           box-shadow:0 4px 16px rgba(0,0,0,0.3);">
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  </a>
  <script>
  (function(){
    var d = window.__INVITE_DATA__ || {};
    if (!d.eventDateRaw) return;
    // Build Google Calendar URL
    var rawDate = d.eventDateRaw.replace(/-/g,'');
    var startDt = rawDate + (d.eventTimeRaw ? 'T' + d.eventTimeRaw.replace(':','') + '00' : '');
    var endDt   = rawDate + (d.eventTimeRaw ? 'T' + d.eventTimeRaw.replace(':','') + '00' : '');
    var calUrl = 'https://calendar.google.com/calendar/r/eventedit?' +
      'text=' + encodeURIComponent(d.eventTitleDisplay || 'Taklifnoma') +
      '&dates=' + startDt + '/' + endDt +
      '&location=' + encodeURIComponent(d.locationDisplay || '') +
      '&details=' + encodeURIComponent('eTaklifnoma.uz orqali yuborildi');
    var btn = document.getElementById('calendarBtn');
    btn.href = calUrl;
    btn.addEventListener('mouseenter', function(){ this.style.transform='scale(1.12)'; this.style.background='rgba(255,255,255,0.14)'; });
    btn.addEventListener('mouseleave', function(){ this.style.transform='scale(1)'; this.style.background='rgba(255,255,255,0.08)'; });
  })();
  </script>`;
}

/**
 * Builds a Print / PDF floating button.
 */
function buildPrintButton() {
  return `
  <button id="printBtn" onclick="window.print()"
    title="Chop etish / PDF yuklab olish" data-i18n-title="printBtn"
    style="position:fixed;bottom:140px;left:24px;z-index:9998;
           width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;
           background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);backdrop-filter:blur(12px);
           cursor:pointer;transition:all 0.3s ease;
           box-shadow:0 4px 16px rgba(0,0,0,0.3);">
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2">
      <polyline points="6 9 6 2 18 2 18 9"/>
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
      <rect x="6" y="14" width="12" height="8"/>
    </svg>
  </button>
  <style>
  @media print {
    .lang-toggle, #sharePanel, #calendarBtn, #printBtn, .music-toggle, .etaklifnoma-branding { display:none!important; }
    body { background:#fff!important; }
    .inv { background:#fff!important; color:#111!important; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  }
  </style>
  <script>
  (function(){
    var btn = document.getElementById('printBtn');
    btn.addEventListener('mouseenter', function(){ this.style.transform='scale(1.12)'; this.style.background='rgba(255,255,255,0.14)'; });
    btn.addEventListener('mouseleave', function(){ this.style.transform='scale(1)'; this.style.background='rgba(255,255,255,0.08)'; });
  })();
  </script>`;
}

/**
 * Builds the envelope opening animation overlay.
 * Shows once per device (localStorage flag). Fades away after animation.
 */
function buildEnvelopeAnimation(eventType) {
  const icon = eventType && eventType.icon ? eventType.icon : '💍';
  return `
  <div id="envelopeOverlay" style="
    position:fixed;inset:0;z-index:99999;
    background:linear-gradient(135deg,#0b0d17 0%,#1a1e38 100%);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    gap:24px;transition:opacity 0.8s ease;">
    <div id="envelope" style="width:200px;height:140px;position:relative;cursor:pointer;" onclick="openInvite()">
      <!-- Envelope body -->
      <div style="width:100%;height:100%;background:linear-gradient(135deg,#1e2240,#2a2f58);
           border:1px solid rgba(212,168,83,0.3);border-radius:4px;position:absolute;bottom:0;"></div>
      <!-- Envelope flap (top triangle) -->
      <div id="envFlap" style="width:0;height:0;
           border-left:100px solid transparent;border-right:100px solid transparent;
           border-top:70px solid #2a2f58;
           position:absolute;top:0;left:0;
           transform-origin:top center;transition:transform 0.6s cubic-bezier(0.4,0,0.2,1);
           filter:drop-shadow(0 2px 4px rgba(0,0,0,0.4));"></div>
      <!-- V fold line inside -->
      <div style="width:0;height:0;
           border-left:100px solid transparent;border-right:100px solid transparent;
           border-bottom:68px solid rgba(212,168,83,0.08);
           position:absolute;top:0;left:0;"></div>
      <!-- Gold seal -->
      <div id="envSeal" style="
           position:absolute;top:50%;left:50%;transform:translate(-50%,-30%);
           width:40px;height:40px;border-radius:50%;
           background:radial-gradient(circle,#f5d89a,#d4a853);
           border:2px solid rgba(255,255,255,0.2);
           display:flex;align-items:center;justify-content:center;
           font-size:18px;box-shadow:0 2px 12px rgba(212,168,83,0.4);
           transition:all 0.4s ease;">${icon}</div>
    </div>
    <p style="color:rgba(212,168,83,0.8);font-size:13px;letter-spacing:2px;text-transform:uppercase;
              font-family:'Montserrat',sans-serif;animation:float 2s ease-in-out infinite;" data-i18n="envOpen">
      Ochish uchun bosing
    </p>
    <style>
    @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
    @keyframes floatEnv { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    #envelope { animation: floatEnv 3s ease-in-out infinite; }
    </style>
  </div>
  <script>
  (function(){
    var overlay = document.getElementById('envelopeOverlay');
    if (!overlay) return;
    // Skip animation if already seen
    var slug = (window.location.pathname.match(/\\/invite\\/([^/]+)/) || [])[1] || 'inv';
    var key = 'env_seen_' + slug;
    if (localStorage.getItem(key)) {
      overlay.style.display = 'none';
      return;
    }
    // Prevent body scroll while overlay is shown
    document.body.style.overflow = 'hidden';
    window.openInvite = function() {
      var flap = document.getElementById('envFlap');
      var seal = document.getElementById('envSeal');
      if (flap) flap.style.transform = 'rotateX(180deg)';
      if (seal) { seal.style.transform = 'translate(-50%,-30%) scale(0)'; seal.style.opacity='0'; }
      setTimeout(function(){
        overlay.style.opacity = '0';
        setTimeout(function(){
          overlay.style.display = 'none';
          document.body.style.overflow = '';
          localStorage.setItem(key, '1');
        }, 800);
      }, 600);
    };
  })();
  </script>`;
}

/**
 * Builds CSS overrides for a named color palette.
 * @param {string} palette - 'gold'|'silver'|'ocean'|'rose'|'lavender'|'teal'|'amber'
 */
function buildColorPaletteCss(palette) {
  const palettes = {
    gold:     null, // default, no override needed
    silver:   { accent: '#9da8b8', accentBright: '#c8d0dc', glow: 'rgba(157,168,184,0.35)', btnBg: 'linear-gradient(135deg,#7a8599,#9da8b8)', dark: '#0d1018', glassBg: 'rgba(157,168,184,0.04)' },
    ocean:    { accent: '#4a9fe8', accentBright: '#7bbdee', glow: 'rgba(74,159,232,0.35)', btnBg: 'linear-gradient(135deg,#2b7fd4,#4a9fe8)', dark: '#060e1a', glassBg: 'rgba(74,159,232,0.04)' },
    rose:     { accent: '#e8749a', accentBright: '#f09ab8', glow: 'rgba(232,116,154,0.35)', btnBg: 'linear-gradient(135deg,#c4476c,#e8749a)', dark: '#150810', glassBg: 'rgba(232,116,154,0.04)' },
    lavender: { accent: '#a07ee8', accentBright: '#bea0ee', glow: 'rgba(160,126,232,0.35)', btnBg: 'linear-gradient(135deg,#7a58c4,#a07ee8)', dark: '#0e0a18', glassBg: 'rgba(160,126,232,0.04)' },
    teal:     { accent: '#3bbdaa', accentBright: '#60cebb', glow: 'rgba(59,189,170,0.35)', btnBg: 'linear-gradient(135deg,#1f9e8c,#3bbdaa)', dark: '#060f0d', glassBg: 'rgba(59,189,170,0.04)' },
    amber:    { accent: '#e8a84a', accentBright: '#f0c070', glow: 'rgba(232,168,74,0.35)', btnBg: 'linear-gradient(135deg,#c47c20,#e8a84a)', dark: '#110c02', glassBg: 'rgba(232,168,74,0.04)' },
    emerald:  { accent: '#4ae898', accentBright: '#70eeb0', glow: 'rgba(74,232,152,0.35)', btnBg: 'linear-gradient(135deg,#20c060,#4ae898)', dark: '#040f08', glassBg: 'rgba(74,232,152,0.04)' },
  };
  const p = palettes[palette];
  if (!p) return ''; // default gold — no override
  return `
  <style>
  :root {
    --accent: ${p.accent} !important;
    --accent-bright: ${p.accentBright} !important;
    --glow: ${p.glow} !important;
    --btn-bg: ${p.btnBg} !important;
    --dark: ${p.dark} !important;
    --glass-bg: ${p.glassBg} !important;
  }
  </style>`;
}

/**
 * Builds the branding/promotional footer — appears at the very bottom of every invitation.
 */
function buildBrandingFooter() {
  return `
  <div class="etaklifnoma-branding" style="
    text-align:center;
    padding:16px 20px;
    background:linear-gradient(180deg,transparent 0%,rgba(0,0,0,0.3) 100%);
    border-top:1px solid rgba(255,255,255,0.06);
  ">
    <a href="https://etaklifnoma.uz" target="_blank" rel="noopener" style="
      display:inline-flex;
      align-items:center;
      gap:6px;
      text-decoration:none;
      color:rgba(255,255,255,0.35);
      font-family:'Montserrat','Helvetica Neue',sans-serif;
      font-size:11px;
      letter-spacing:1.5px;
      transition:color 0.3s;
    " onmouseover="this.style.color='rgba(255,255,255,0.7)'" onmouseout="this.style.color='rgba(255,255,255,0.35)'">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
      ETAKLIFNOMA.UZ — Premium taklifnomalar
    </a>
  </div>`;
}

/**
 * Build Photo Gallery section
 */
function buildPhotoGallery(photos) {
  if (!photos || !Array.isArray(photos) || photos.length === 0) return '';
  
  const photoItems = photos.map((url, i) => `
    <div class="gallery-item" onclick="openLightbox(${i})" style="cursor:pointer;border-radius:12px;overflow:hidden;aspect-ratio:1;position:relative">
      <img src="${escapeHtml(url)}" alt="Foto ${i + 1}" loading="lazy" style="width:100%;height:100%;object-fit:cover;transition:transform 0.4s" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" />
    </div>
  `).join('');

  return `
  <section class="section photo-gallery-section" id="gallery" style="background:var(--greeting-bg);padding:80px 0;text-align:center;position:relative">
    <div style="position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--accent),transparent);opacity:0.2"></div>
    <div class="container" style="max-width:600px;margin:0 auto;padding:0 24px">
      <h2 class="section-heading light" data-i18n="galleryTitle" style="margin-bottom:24px;color:var(--greeting-text)">Foto lavhalar</h2>
      <div style="display:grid;grid-template-columns:repeat(${photos.length === 1 ? 1 : photos.length === 2 ? 2 : 3},1fr);gap:8px">
        ${photoItems}
      </div>
    </div>
  </section>

  <!-- Lightbox -->
  <div id="lightbox" onclick="if(event.target===this)closeLightbox()" style="display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.95);align-items:center;justify-content:center;flex-direction:column">
    <button onclick="closeLightbox()" style="position:absolute;top:16px;right:16px;background:none;border:none;color:white;font-size:28px;cursor:pointer;z-index:10">✕</button>
    <button onclick="prevPhoto()" style="position:absolute;left:10px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.1);border:none;color:white;font-size:24px;padding:12px 16px;border-radius:50%;cursor:pointer">‹</button>
    <button onclick="nextPhoto()" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.1);border:none;color:white;font-size:24px;padding:12px 16px;border-radius:50%;cursor:pointer">›</button>
    <img id="lightboxImg" style="max-width:90vw;max-height:80vh;border-radius:12px;object-fit:contain" />
    <p id="lightboxCounter" style="color:rgba(255,255,255,0.5);margin-top:12px;font-size:0.85rem"></p>
  </div>

  <script>
  var galleryPhotos = ${JSON.stringify(photos)};
  var currentPhoto = 0;
  function openLightbox(i) {
    currentPhoto = i;
    document.getElementById('lightbox').style.display = 'flex';
    document.getElementById('lightboxImg').src = galleryPhotos[i];
    document.getElementById('lightboxCounter').textContent = (i+1) + ' / ' + galleryPhotos.length;
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
    document.body.style.overflow = '';
  }
  function nextPhoto() { openLightbox((currentPhoto + 1) % galleryPhotos.length); }
  function prevPhoto() { openLightbox((currentPhoto - 1 + galleryPhotos.length) % galleryPhotos.length); }
  document.addEventListener('keydown', function(e) {
    if (document.getElementById('lightbox').style.display === 'flex') {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    }
  });
  </script>`;
}

/**
 * Build RSVP attendance form
 */
function buildRsvpForm(slug, lang = 'uz') {
  const txt = {
    uz: {
      title: 'Qatnashishni tasdiqlang',
      subtitle: 'Iltimos, qatnashishingizni tasdiqlang',
      name: 'Ismingiz',
      yes: 'Kelaman',
      maybe: 'Bilmayman',
      no: 'Kelolmayman',
      person: 'kishi',
      submit: 'Tasdiqlash',
      sending: 'Yuborilmoqda...',
      success: 'Javobingiz qabul qilindi! Rahmat! 🎉',
      error: 'Xatolik yuz berdi',
      network: 'Tarmoq xatoligi',
    },
    ru: {
      title: 'Подтвердите участие',
      subtitle: 'Пожалуйста, подтвердите ваше присутствие',
      name: 'Ваше имя',
      yes: 'Приду',
      maybe: 'Не уверен(а)',
      no: 'Не смогу',
      person: 'чел.',
      submit: 'Подтвердить',
      sending: 'Отправка...',
      success: 'Ваш ответ принят! Спасибо! 🎉',
      error: 'Произошла ошибка',
      network: 'Ошибка сети',
    },
    en: {
      title: 'Confirm Attendance',
      subtitle: 'Please confirm your attendance',
      name: 'Your name',
      yes: 'Attending',
      maybe: 'Maybe',
      no: "Can't make it",
      person: 'guest(s)',
      submit: 'Confirm',
      sending: 'Sending...',
      success: 'Your response has been received! Thank you! 🎉',
      error: 'An error occurred',
      network: 'Network error',
    },
  };
  const t = txt[lang] || txt.uz;

  return `
  <section class="section rsvp-section" id="rsvp" style="background:var(--greeting-bg);text-align:center;padding:100px 0;position:relative">
    <div style="max-width:460px;margin:0 auto;padding:0 24px">
      <div style="margin-bottom:28px">
        <div style="width:56px;height:56px;margin:0 auto 16px;border-radius:16px;background:linear-gradient(135deg,rgba(76,175,80,0.15),rgba(76,175,80,0.05));display:flex;align-items:center;justify-content:center;border:1px solid rgba(76,175,80,0.2)">
          <span style="font-size:28px">💌</span>
        </div>
        <h2 style="font-family:var(--ff-serif);font-size:1.8rem;font-weight:700;color:var(--greeting-text);margin:0 0 8px">${t.title}</h2>
        <p style="font-size:0.9rem;color:var(--greeting-text);opacity:0.75;margin:0;font-family:var(--ff-serif)">${t.subtitle}</p>
      </div>

      <form id="rsvpForm" onsubmit="submitRsvp(event)" style="display:flex;flex-direction:column;gap:14px">
        <input type="text" name="guestName" placeholder="${t.name}" required
          style="padding:14px 18px;border-radius:14px;border:1px solid rgba(0,0,0,0.08);background:rgba(255,255,255,0.7);color:#333;font-size:0.95rem;outline:none;transition:border-color 0.3s;font-family:var(--ff-sans);box-shadow:inset 0 2px 6px rgba(0,0,0,0.02)"
          onfocus="this.style.borderColor='var(--accent)';this.style.background='#fff'" onblur="this.style.borderColor='rgba(0,0,0,0.08)';this.style.background='rgba(255,255,255,0.7)'" />

        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px" id="rsvpButtons">
          <label style="cursor:pointer">
            <input type="radio" name="status" value="attending" checked style="display:none" />
            <div class="rsvp-opt rsvp-active" onclick="selectRsvp(this,'attending')"
              style="padding:14px 8px;border-radius:14px;border:1px solid rgba(76,175,80,0.3);background:rgba(76,175,80,0.15);color:#388e3c;text-align:center;transition:all 0.3s;font-size:0.82rem;font-weight:600">
              ${t.yes}
            </div>
          </label>
          <label style="cursor:pointer">
            <input type="radio" name="status" value="maybe" style="display:none" />
            <div class="rsvp-opt" onclick="selectRsvp(this,'maybe')"
              style="padding:14px 8px;border-radius:14px;border:1px solid rgba(255,152,0,0.3);background:rgba(255,152,0,0.1);color:#f57c00;text-align:center;transition:all 0.3s;font-size:0.82rem;font-weight:600">
              ${t.maybe}
            </div>
          </label>
          <label style="cursor:pointer">
            <input type="radio" name="status" value="not_attending" style="display:none" />
            <div class="rsvp-opt" onclick="selectRsvp(this,'not_attending')"
              style="padding:14px 8px;border-radius:14px;border:1px solid rgba(244,67,54,0.3);background:rgba(244,67,54,0.08);color:#d32f2f;text-align:center;transition:all 0.3s;font-size:0.82rem;font-weight:600">
              ${t.no}
            </div>
          </label>
        </div>

        <select name="guestCount"
          style="padding:14px 18px;border-radius:14px;border:1px solid rgba(0,0,0,0.08);background:rgba(255,255,255,0.7);color:#333;font-size:0.95rem;outline:none;font-family:var(--ff-sans);appearance:auto;box-shadow:inset 0 2px 6px rgba(0,0,0,0.02)">
          <option value="1">1 ${t.person}</option>
          <option value="2">2 ${t.person}</option>
          <option value="3">3 ${t.person}</option>
          <option value="4">4 ${t.person}</option>
          <option value="5">5+ ${t.person}</option>
        </select>

        <input type="hidden" name="slug" value="${slug}" />
        <button type="submit" id="rsvpBtn"
          style="padding:16px;border-radius:50px;border:none;background:var(--btn-bg);color:var(--btn-text);font-weight:700;font-size:0.95rem;cursor:pointer;transition:all 0.3s;box-shadow:0 8px 24px var(--glow);font-family:var(--ff-sans);letter-spacing:1px">
          ${t.submit}
        </button>
        <p id="rsvpStatus" style="font-size:0.85rem;margin-top:4px;color:var(--text-color, inherit)"></p>
      </form>
    </div>
  </section>
  <script>
  var _rsvpTxt = ${JSON.stringify(t)};
  function selectRsvp(el, val) {
    document.querySelectorAll('.rsvp-opt').forEach(function(o){
      o.style.borderColor = o.style.borderColor.replace(/0\\.3/,'0.15');
      o.style.background = o.style.background.replace(/0\\.12/,'0.04');
      o.classList.remove('rsvp-active');
    });
    el.classList.add('rsvp-active');
    if(val==='attending'){el.style.borderColor='rgba(76,175,80,0.3)';el.style.background='rgba(76,175,80,0.12)';}
    else if(val==='maybe'){el.style.borderColor='rgba(255,193,7,0.3)';el.style.background='rgba(255,193,7,0.12)';}
    else{el.style.borderColor='rgba(244,67,54,0.3)';el.style.background='rgba(244,67,54,0.12)';}
    el.closest('label').querySelector('input[type=radio]').checked = true;
  }
  function submitRsvp(e) {
    e.preventDefault();
    var f = e.target;
    var btn = document.getElementById('rsvpBtn');
    var st = document.getElementById('rsvpStatus');
    btn.textContent = _rsvpTxt.sending;
    btn.disabled = true;
    btn.style.opacity = '0.7';
    var status = f.querySelector('input[name=status]:checked')?.value || 'attending';
    fetch('/api/invitations/' + f.slug.value + '/rsvp', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        guestName: f.guestName.value.trim(),
        status: status,
        guestCount: parseInt(f.guestCount.value) || 1,
      })
    })
    .then(function(r){return r.json()})
    .then(function(d){
      if(d.success){
        st.textContent = _rsvpTxt.success;
        st.style.color = '#66bb6a';
        btn.style.background = 'linear-gradient(135deg,#2e7d32,#1b5e20)';
      } else {
        st.textContent = '❌ ' + _rsvpTxt.error;
        st.style.color = '#ef5350';
      }
    })
    .catch(function(){
      st.textContent = '❌ ' + _rsvpTxt.network;
      st.style.color = '#ef5350';
    })
    .finally(function(){
      btn.textContent = _rsvpTxt.submit;
      btn.disabled = false;
      btn.style.opacity = '1';
    });
  }
  </script>`;
}

module.exports = {
  renderString,
  renderInvitation,
  renderPreviewFragment,
  buildContext,
  escapeHtml,
  formatDateUz,
  formatTime,
};
