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
    ctx[key] = value;
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
  // Convert relative URL to absolute
  if (musicUrl && musicUrl.startsWith('/')) {
    musicUrl = `${appUrl}${musicUrl}`;
  }
  const musicPlayer = musicUrl ? buildMusicPlayer(musicUrl) : '';

  // Wishes form — always shown by default, Telegram bot is optional
  const telegramBot = invitation.customFields?.telegramBot || '';
  const wishesForm = invitation.customFields?.enableWishes !== false
    ? buildWishesForm(telegramBot, invitation.slug) : '';

  // Build full page
  return `<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${ogDesc}">
  <title>${ogTitle}</title>

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="${ogTitle}">
  <meta property="og:description" content="${ogDesc}">
  <meta property="og:url" content="${ogUrl}">
  <meta property="og:site_name" content="Taklifnoma">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${ogTitle}">
  <meta name="twitter:description" content="${ogDesc}">

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
    // Inject gallery, wishes, rsvp INSIDE the main wrapper (before </main>)
    const gallery = buildPhotoGallery(invitation.customFields?.photos);
    const rsvp = invitation.customFields?.enableRsvp !== false ? buildRsvpForm(invitation.slug) : '';
    const extras = gallery + wishesForm + rsvp;
    
    if (renderedBody.includes('</main>')) {
      return renderedBody.replace('</main>', extras + '</main>');
    }
    // Fallback: append after body if no main wrapper
    return renderedBody + extras;
  })()}
  ${musicPlayer}
  <script>window.__INVITE_DATA__=${JSON.stringify({
    dateUz: context['date'] || '',
    dateRu: context['dateRu'] || '',
    message: context['message'] || '',
    messageRu: context['messageRu'] || '',
    messageQq: context['messageQq'] || '',
    location: context['location'] || '',
    hostName: context['hostName'] || '',
    hostNameRu: context['hostNameRu'] || '',
    hostNameQq: context['hostNameQq'] || '',
    guestName: context['guestName'] || '',
    guestNameRu: context['guestNameRu'] || '',
    guestNameQq: context['guestNameQq'] || '',
    eventTitle: context['eventTitle'] || '',
    eventTitleRu: context['eventTitleRu'] || '',
    eventTitleQq: context['eventTitleQq'] || '',
    eventTime: context['time'] || '',
    langMode: context['langMode'] || '',
    langUz: context['langUz'] !== false && context['langUz'] !== 'false',
    langQq: context['langQq'] === true || context['langQq'] === 'true',
    langRu: context['langRu'] === true || context['langRu'] === 'true',
    program: context['program'] || '',
    programRu: context['programRu'] || '',
    programQq: context['programQq'] || '',
  })};</script>
  ${buildLanguageToggle()}
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
 * Builds the Telegram wishes form HTML.
 */
function buildWishesForm(telegramBot, invitationSlug) {
  return `
  <section class="section wishes-section" id="wishes">
    <div class="container">
      <h2 class="section-heading light" style="margin-bottom:12px">💌 Tilak va tabriklar</h2>
      <p class="wishes-subtitle">Tilak va tabriklaringizni qoldiring</p>
      <form class="wishes-form" id="wishesForm" onsubmit="sendWish(event)">
        <input type="text" name="name" placeholder="Ismingiz" required class="wishes-input" />
        <textarea name="message" placeholder="Tilaklaringiz..." required rows="3" class="wishes-input wishes-textarea"></textarea>
        <input type="hidden" name="slug" value="${invitationSlug}" />
        <input type="hidden" name="bot" value="${telegramBot}" />
        <button type="submit" class="wishes-btn" id="wishesBtn">
          <span id="wishesBtnText">Yuborish 💬</span>
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
    var bot = form.bot.value;
    var slug = form.slug.value;

    if (!name || !message) return;

    btnText.textContent = 'Yuborilmoqda...';
    btn.disabled = true;

    fetch('/api/wishes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, message: message, bot: bot, slug: slug })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.success) {
        status.textContent = '✅ Tilaklaringiz yuborildi! Rahmat!';
        status.style.color = 'var(--accent-bright, #e8d07e)';
        form.reset();
      } else {
        status.textContent = '❌ Xatolik yuz berdi. Qayta urinib ko\\'ring.';
        status.style.color = '#ef4444';
      }
    })
    .catch(function() {
      status.textContent = '❌ Tarmoq xatoligi.';
      status.style.color = '#ef4444';
    })
    .finally(function() {
      btnText.textContent = 'Yuborish 💬';
      btn.disabled = false;
    });
  }
  </script>`;
}

function getMusicPlayerStyles() {
  return `
  .music-toggle{position:fixed;bottom:24px;right:24px;z-index:9999;width:52px;height:52px;background:var(--glass-bg, rgba(255,255,255,0.08));backdrop-filter:blur(16px);border:1px solid var(--glass-border, rgba(255,255,255,0.12));border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.3s ease;box-shadow:0 4px 20px rgba(0,0,0,0.3)}
  .music-toggle:hover{transform:scale(1.1);border-color:var(--accent, #c9a84c)}
  .music-icon{width:24px;height:24px;color:rgba(255,255,255,0.5);transition:color 0.3s ease}
  .music-icon.playing{color:var(--accent-bright, #e8d07e);animation:pulse-music 2s ease-in-out infinite}
  @keyframes pulse-music{0%,100%{opacity:1}50%{opacity:0.5}}
  `;
}

function getWishesFormStyles() {
  return `
  .wishes-section{background:var(--countdown-bg, linear-gradient(135deg,#12152a,#1a1e38));text-align:center;padding:80px 0}
  .wishes-subtitle{font-size:0.95rem;color:rgba(232,226,214,0.5);margin-bottom:32px;font-weight:300}
  .wishes-form{max-width:480px;margin:0 auto;display:flex;flex-direction:column;gap:16px}
  .wishes-input{background:var(--glass-bg, rgba(255,255,255,0.05));border:1px solid var(--glass-border, rgba(255,255,255,0.1));border-radius:14px;padding:14px 20px;font-family:var(--ff-sans, 'Montserrat', sans-serif);font-size:0.95rem;color:var(--text-light, #e8e2d6);outline:none;transition:border-color 0.3s ease}
  .wishes-input:focus{border-color:var(--accent, #c9a84c)}
  .wishes-input::placeholder{color:rgba(232,226,214,0.3)}
  .wishes-textarea{resize:vertical;min-height:100px}
  .wishes-btn{padding:14px 32px;background:var(--btn-bg, linear-gradient(135deg,#c9a84c,#9e7e2e));border:none;border-radius:50px;color:var(--btn-text, #0b0d17);font-family:var(--ff-sans, 'Montserrat', sans-serif);font-size:0.95rem;font-weight:600;letter-spacing:1px;cursor:pointer;transition:all 0.3s ease}
  .wishes-btn:hover{transform:translateY(-2px);box-shadow:0 6px 24px var(--glow, rgba(201,168,76,0.2))}
  .wishes-btn:disabled{opacity:0.6;cursor:not-allowed;transform:none}
  .wishes-status{font-size:0.9rem;margin-top:8px;min-height:24px}
  `;
}

/**
 * Language toggle button + translations system (UZ / QQ / RU)
 */
function buildLanguageToggle() {
  return `
  <div class="lang-toggle" id="langToggle">
    <button class="lang-btn active" id="langUz" onclick="switchLang('uz')">UZ</button>
    <button class="lang-btn" id="langQq" onclick="switchLang('qq')" style="display:none">QQ</button>
    <button class="lang-btn" id="langRu" onclick="switchLang('ru')" style="display:none">RU</button>
  </div>
  <script>
  (function(){
    var d = window.__INVITE_DATA__ || {};

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

    // Show/hide buttons
    var uzBtn = document.getElementById('langUz');
    var qqBtn = document.getElementById('langQq');
    var ruBtn = document.getElementById('langRu');
    if(uzBtn) uzBtn.style.display = hasUz ? '' : 'none';
    if(qqBtn) qqBtn.style.display = hasQq ? '' : 'none';
    if(ruBtn) ruBtn.style.display = hasRu ? '' : 'none';

    // Hide toggle if only 1 language
    var toggle = document.getElementById('langToggle');
    if(langs.length <= 1 && toggle) toggle.style.display = 'none';

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
        wishesTitle: '💌 Tilak va tabriklar',
        wishesSubtitle: 'Tilak va tabriklaringizni qoldiring',
        wishesName: 'Ismingiz',
        wishesMessage: 'Tilaklaringiz...',
        wishesSend: 'Yuborish 💬',
        wishesSent: '✅ Tilaklaringiz yuborildi! Rahmat!',
        wishesError: '❌ Xatolik yuz berdi.',

        bdEventLabel: "Tug'ilgan kun taklifi",
        bdCountdownTitle: "Bayramgacha qolgan vaqt",
        bdDetailsTitle: "Bayram tafsilotlari",
        bdWaitingMsg: "Sizni kutib qolamiz! 🎉",
        bdProgramTitle: "Bayram dasturi",

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
        wishesTitle: '💌 Tilek hám qutlıqlaw',
        wishesSubtitle: 'Tilek hém qutlıqlawlarıńızdı qaldırıń',
        wishesName: 'Atıńız',
        wishesMessage: 'Tilekleriniz...',
        wishesSend: 'Jiberiw 💬',
        wishesSent: '✅ Tilekleriniz jiberildi! Raxmet!',
        wishesError: '❌ Qátelik júz berdi.',

        bdEventLabel: 'Tuwılǵan kún shaqırıwı',
        bdCountdownTitle: 'Bayramǵa shekem qalǵan waqıt',
        bdDetailsTitle: 'Bayram tafsilatları',
        bdWaitingMsg: 'Sizdi kútip qalamız! 🎉',
        bdProgramTitle: 'Bayram baǵdarlanması',

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
        wishesTitle: '💌 Пожелания',
        wishesSubtitle: 'Оставьте ваши пожелания',
        wishesName: 'Ваше имя',
        wishesMessage: 'Ваши пожелания...',
        wishesSend: 'Отправить 💬',
        wishesSent: '✅ Ваши пожелания отправлены! Спасибо!',
        wishesError: '❌ Произошла ошибка.',

        bdEventLabel: 'Приглашение на день рождения',
        bdCountdownTitle: 'До праздника осталось',
        bdDetailsTitle: 'Детали праздника',
        bdWaitingMsg: 'Ждём вас! 🎉',
        bdProgramTitle: 'Программа праздника',

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

    // Data maps for each language
    var langData = {
      uz: { host: d.hostName, guest: d.guestName, title: d.eventTitle, message: d.message, program: d.program, date: d.dateUz },
      qq: { host: d.hostNameQq || d.hostName, guest: d.guestNameQq || d.guestName, title: d.eventTitleQq || d.eventTitle, message: d.messageQq || d.message, program: d.programQq || d.program, date: d.dateUz },
      ru: { host: d.hostNameRu || d.hostName, guest: d.guestNameRu || d.guestName, title: d.eventTitleRu || d.eventTitle, message: d.messageRu || d.message, program: d.programRu || d.program, date: d.dateRu || d.dateUz },
    };

    function switchLang(lang) {
      var t = translations[lang];
      if(!t) return;

      var prevData = langData[currentLang] || langData.uz;
      var newData = langData[lang] || langData.uz;

      // 1. Translate data-i18n elements
      document.querySelectorAll('[data-i18n]').forEach(function(el){
        var key = el.getAttribute('data-i18n');
        if(t[key]) el.textContent = t[key];
      });

      // 2. Update wishes form placeholders
      var nameInput = document.querySelector('.wishes-input[name="name"]');
      var msgInput = document.querySelector('.wishes-textarea[name="message"]');
      var wishesBtn = document.getElementById('wishesBtnText');
      var wishesTitle = document.querySelector('.wishes-section .section-heading');
      var wishesSub = document.querySelector('.wishes-subtitle');

      if(nameInput) nameInput.placeholder = t.wishesName || '';
      if(msgInput) msgInput.placeholder = t.wishesMessage || '';
      if(wishesBtn) wishesBtn.textContent = t.wishesSend || '';
      if(wishesTitle) wishesTitle.textContent = t.wishesTitle || '';
      if(wishesSub) wishesSub.textContent = t.wishesSubtitle || '';

      // 3. Swap dates
      if(prevData.date && newData.date && prevData.date !== newData.date) {
        swapTextInPage(prevData.date, newData.date);
      }

      // 4. Swap user-entered content
      if(prevData.message && newData.message && prevData.message !== newData.message) swapTextInPage(prevData.message, newData.message);
      if(prevData.host && newData.host && prevData.host !== newData.host) swapTextInPage(prevData.host, newData.host);
      if(prevData.guest && newData.guest && prevData.guest !== newData.guest) swapTextInPage(prevData.guest, newData.guest);
      if(prevData.title && newData.title && prevData.title !== newData.title) swapTextInPage(prevData.title, newData.title);

      // 5. Swap program/timeline
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
                (item.time || '') + '</div><h4>' + (item.text || '') + '</h4></div></div>';
            });
            progEl.innerHTML = h;
          }
        } catch(e) {}
      }

      // 6. Toggle active button
      if(uzBtn) uzBtn.classList.toggle('active', lang === 'uz');
      if(qqBtn) qqBtn.classList.toggle('active', lang === 'qq');
      if(ruBtn) ruBtn.classList.toggle('active', lang === 'ru');

      currentLang = lang;
      document.documentElement.lang = lang;
      try { localStorage.setItem('taklifnoma-lang', lang); } catch(e){}
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

    // Determine initial language
    var defaultLang = hasUz ? 'uz' : (hasQq ? 'qq' : 'ru');

    // Only RU mode → auto-switch
    if(!hasUz && !hasQq && hasRu) {
      switchLang('ru');
    } else if(!hasUz && hasQq && !hasRu) {
      switchLang('qq');
    } else {
      try {
        var saved = localStorage.getItem('taklifnoma-lang');
        if(saved && langs.indexOf(saved) !== -1) switchLang(saved);
      } catch(e){}
    }
  })();
  </script>`
}


function getLanguageToggleStyles() {
  return `
  .lang-toggle{position:fixed;bottom:24px;left:24px;z-index:9999;display:flex;gap:0;border-radius:50px;overflow:hidden;border:1px solid var(--glass-border, rgba(255,255,255,0.12));background:var(--glass-bg, rgba(255,255,255,0.05));backdrop-filter:blur(16px);box-shadow:0 4px 20px rgba(0,0,0,0.3)}
  .lang-btn{padding:10px 16px;font-family:var(--ff-sans, 'Montserrat', sans-serif);font-size:0.75rem;font-weight:600;letter-spacing:1.5px;border:none;background:transparent;color:rgba(255,255,255,0.4);cursor:pointer;transition:all 0.3s ease;text-transform:uppercase}
  .lang-btn.active{background:var(--accent, #c9a84c);color:var(--dark, #0b0d17)}
  .lang-btn:hover:not(.active){color:rgba(255,255,255,0.8);background:rgba(255,255,255,0.05)}
  `;
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
  <section class="section photo-gallery-section" id="gallery" style="background:var(--dark, #0b0d17);padding:60px 0;text-align:center">
    <div class="container" style="max-width:600px;margin:0 auto;padding:0 24px">
      <h2 class="section-heading light" style="margin-bottom:24px">📸 Foto lavhalar</h2>
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
function buildRsvpForm(slug) {
  return `
  <section class="section rsvp-section" id="rsvp" style="background:var(--countdown-bg, linear-gradient(135deg,#12152a,#1a1e38));text-align:center;padding:60px 0">
    <div class="container" style="max-width:500px;margin:0 auto;padding:0 24px">
      <h2 class="section-heading light" style="margin-bottom:8px">✅ Qatnashishni tasdiqlang</h2>
      <p style="font-size:0.9rem;color:rgba(232,226,214,0.5);margin-bottom:24px">Iltimos, qatnashishingizni tasdiqlang</p>
      <form id="rsvpForm" onsubmit="submitRsvp(event)" style="display:flex;flex-direction:column;gap:12px">
        <input type="text" name="guestName" placeholder="Ismingiz" required style="padding:12px 16px;border-radius:12px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);color:#e8e2d6;font-size:0.95rem;outline:none" />
        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap" id="rsvpButtons">
          <label style="flex:1;min-width:100px">
            <input type="radio" name="status" value="attending" checked style="display:none" />
            <div class="rsvp-opt rsvp-active" onclick="selectRsvp(this,'attending')" style="padding:10px;border-radius:10px;border:1px solid rgba(76,175,80,0.3);background:rgba(76,175,80,0.15);color:#66bb6a;cursor:pointer;font-size:0.85rem;text-align:center;transition:all 0.3s">✅ Kelaman</div>
          </label>
          <label style="flex:1;min-width:100px">
            <input type="radio" name="status" value="maybe" style="display:none" />
            <div class="rsvp-opt" onclick="selectRsvp(this,'maybe')" style="padding:10px;border-radius:10px;border:1px solid rgba(255,193,7,0.3);background:rgba(255,193,7,0.05);color:#ffa726;cursor:pointer;font-size:0.85rem;text-align:center;transition:all 0.3s">🤔 Bilmayman</div>
          </label>
          <label style="flex:1;min-width:100px">
            <input type="radio" name="status" value="not_attending" style="display:none" />
            <div class="rsvp-opt" onclick="selectRsvp(this,'not_attending')" style="padding:10px;border-radius:10px;border:1px solid rgba(244,67,54,0.3);background:rgba(244,67,54,0.05);color:#ef5350;cursor:pointer;font-size:0.85rem;text-align:center;transition:all 0.3s">❌ Kelolmayman</div>
          </label>
        </div>
        <select name="guestCount" style="padding:12px 16px;border-radius:12px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);color:#e8e2d6;font-size:0.95rem;outline:none">
          <option value="1">1 kishi</option>
          <option value="2">2 kishi</option>
          <option value="3">3 kishi</option>
          <option value="4">4 kishi</option>
          <option value="5">5+ kishi</option>
        </select>
        <input type="hidden" name="slug" value="${slug}" />
        <button type="submit" id="rsvpBtn" style="padding:14px;border-radius:12px;border:none;background:linear-gradient(135deg,#4caf50,#66bb6a);color:white;font-weight:600;font-size:0.95rem;cursor:pointer;transition:all 0.3s">
          Tasdiqlash
        </button>
        <p id="rsvpStatus" style="font-size:0.85rem;margin-top:4px"></p>
      </form>
    </div>
  </section>
  <script>
  function selectRsvp(el, val) {
    document.querySelectorAll('.rsvp-opt').forEach(function(o){
      o.style.background = o.style.background.replace(/0\\.15/,'0.05');
      o.classList.remove('rsvp-active');
    });
    el.classList.add('rsvp-active');
    el.style.background = el.style.background.replace(/0\\.05/,'0.15');
    el.closest('label').querySelector('input[type=radio]').checked = true;
  }
  function submitRsvp(e) {
    e.preventDefault();
    var f = e.target;
    var btn = document.getElementById('rsvpBtn');
    var st = document.getElementById('rsvpStatus');
    btn.textContent = 'Yuborilmoqda...';
    btn.disabled = true;
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
        st.textContent = '✅ Javobingiz qabul qilindi! Rahmat!';
        st.style.color = '#66bb6a';
      } else {
        st.textContent = '❌ Xatolik yuz berdi';
        st.style.color = '#ef5350';
      }
    })
    .catch(function(){
      st.textContent = '❌ Tarmoq xatoligi';
      st.style.color = '#ef5350';
    })
    .finally(function(){
      btn.textContent = 'Tasdiqlash';
      btn.disabled = false;
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
