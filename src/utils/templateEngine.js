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
  const renderedBody = renderString(template?.htmlContent || '', context);
  const renderedCss = renderString(template?.cssContent || '', context, false);

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

  // Telegram bot support
  const telegramBot = invitation.customFields?.telegramBot || '';
  const wishesForm = telegramBot ? buildWishesForm(telegramBot, invitation.slug) : '';

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
  ${renderedBody}
  ${wishesForm}
  ${musicPlayer}
  <script>window.__INVITE_DATA__=${JSON.stringify({
    dateUz: context['date'] || '',
    dateRu: context['dateRu'] || '',
    message: context['message'] || '',
    messageRu: context['messageRu'] || '',
    location: context['location'] || '',
    hostName: context['hostName'] || '',
    hostNameRu: context['hostNameRu'] || '',
    guestName: context['guestName'] || '',
    guestNameRu: context['guestNameRu'] || '',
    eventTitle: context['eventTitle'] || '',
    eventTitleRu: context['eventTitleRu'] || '',
    eventTime: context['time'] || '',
    langMode: context['langMode'] || 'uz',
    program: context['program'] || '',
    programRu: context['programRu'] || '',
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
 * Language toggle button + translations system
 */
function buildLanguageToggle() {
  return `
  <div class="lang-toggle" id="langToggle">
    <button class="lang-btn active" id="langUz" onclick="switchLang('uz')">UZ</button>
    <button class="lang-btn" id="langRu" onclick="switchLang('ru')">RU</button>
  </div>
  <script>
  (function(){
    var d = window.__INVITE_DATA__ || {};
    var mode = d.langMode || 'uz';

    // uz = hide toggle entirely
    // ru = hide toggle, auto-switch to Russian
    // uzru = show toggle
    if(mode === 'uz') {
      var toggle = document.getElementById('langToggle');
      if(toggle) toggle.style.display = 'none';
      return;
    }
    if(mode === 'ru') {
      var toggle = document.getElementById('langToggle');
      if(toggle) toggle.style.display = 'none';
      // Will auto-switch to RU at the end
    }

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
        prog1: 'Mehmonlarni kutib olish',
        prog2: 'Rasmiy nikoh marosimi',
        prog3: 'Ziyofat dasturxoni',
        prog4: "Musiqa va ko'ngil ochar lahzalar",
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
        prog1: 'Встреча гостей',
        prog2: 'Официальная церемония',
        prog3: 'Праздничный ужин',
        prog4: 'Музыка и развлечения',
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

    function switchLang(lang) {
      var t = translations[lang];
      if(!t) return;

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

      // 3. Swap dates (UZ ↔ RU)
      if(d.dateUz && d.dateRu) {
        var fromDate = lang === 'ru' ? d.dateUz : d.dateRu;
        var toDate = lang === 'ru' ? d.dateRu : d.dateUz;
        swapTextInPage(fromDate, toDate);
      }

      // 4. Swap user-entered content (UZ ↔ RU)
      if(lang === 'ru') {
        if(d.messageRu) swapTextInPage(d.message, d.messageRu);
        if(d.hostNameRu) swapTextInPage(d.hostName, d.hostNameRu);
        if(d.guestNameRu) swapTextInPage(d.guestName, d.guestNameRu);
        if(d.eventTitleRu) swapTextInPage(d.eventTitle, d.eventTitleRu);
      } else {
        if(d.messageRu) swapTextInPage(d.messageRu, d.message);
        if(d.hostNameRu) swapTextInPage(d.hostNameRu, d.hostName);
        if(d.guestNameRu) swapTextInPage(d.guestNameRu, d.guestName);
        if(d.eventTitleRu) swapTextInPage(d.eventTitleRu, d.eventTitle);
      }

      // 5. Swap program/timeline (UZ ↔ RU)
      var progEl = document.getElementById('program-data');
      if(progEl && d.programRu) {
        try {
          var src = lang === 'ru' ? d.programRu : d.program;
          if(src) {
            var items = JSON.parse(src);
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
          }
        } catch(e) {}
      }

      // 6. Toggle active button
      var uzBtn = document.getElementById('langUz');
      var ruBtn = document.getElementById('langRu');
      if(uzBtn) uzBtn.classList.toggle('active', lang === 'uz');
      if(ruBtn) ruBtn.classList.toggle('active', lang === 'ru');

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

    // Auto-switch or restore language
    if(mode === 'ru') {
      switchLang('ru');
    } else {
      try {
        var saved = localStorage.getItem('taklifnoma-lang');
        if(saved === 'ru') switchLang('ru');
      } catch(e){}
    }
  })();
  </script>`;
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

module.exports = {
  renderString,
  renderInvitation,
  renderPreviewFragment,
  buildContext,
  escapeHtml,
  formatDateUz,
  formatTime,
};
