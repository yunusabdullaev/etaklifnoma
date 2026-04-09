/**
 * Taklifnoma Template Engine
 *
 * Replaces {{placeholder}} tokens in HTML/CSS templates with actual data.
 * Supports nested custom fields, conditional blocks, date/time formatting,
 * and safe HTML escaping.
 */

// ── Uzbek month names ───────────────────────────────────
const UZ_MONTHS = [
  'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
  'iyul', 'avgust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr',
];

const UZ_DAYS = [
  'Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba',
  'Payshanba', 'Juma', 'Shanba',
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
  const musicUrl = invitation.customFields?.musicUrl || '';
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
  </style>
</head>
<body>
  ${renderedBody}
  ${wishesForm}
  ${musicPlayer}
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

module.exports = {
  renderString,
  renderInvitation,
  renderPreviewFragment,
  buildContext,
  escapeHtml,
  formatDateUz,
  formatTime,
};
