/**
 * 4 New Unique Design Templates — Premium, event-type adaptive
 * Each design has 4 HTML variants: wedding, birthday, graduation, jubilee
 *
 * Design 11 → Neon Glow (futuristik neon)
 * Design 12 → Elegant Marble (marmara luxury)
 * Design 13 → Boho Garden (botanik gul naqshli)
 * Design 14 → Cinema Poster (film afisha stili)
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SHARED HELPERS — sections that are similar across designs
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function buildSections(cls, sep, icons = {}) {
  const i = { date: icons.date || '📅', time: icons.time || '⏰', loc: icons.loc || '📍' };
  return {
    countdown: `
  <section class="section countdown-section ${cls}-section">
    <div class="container">
      <h2 class="section-heading ${cls}-heading" data-i18n="countdownTitle">Qolgan vaqt</h2>
      <div class="countdown ${cls}-countdown" id="countdown-timer" data-date="{{eventDate}}" data-time="{{eventTime|18:00}}">
        <div class="cd-block ${cls}-cd"><div class="cd-num" id="cd-days">00</div><div class="cd-label" data-i18n="days">Kun</div></div>
        <div class="cd-sep ${cls}-sep">${sep}</div>
        <div class="cd-block ${cls}-cd"><div class="cd-num" id="cd-hours">00</div><div class="cd-label" data-i18n="hours">Soat</div></div>
        <div class="cd-sep ${cls}-sep">${sep}</div>
        <div class="cd-block ${cls}-cd"><div class="cd-num" id="cd-min">00</div><div class="cd-label" data-i18n="minutes">Minut</div></div>
        <div class="cd-sep ${cls}-sep">${sep}</div>
        <div class="cd-block ${cls}-cd"><div class="cd-num" id="cd-sec">00</div><div class="cd-label" data-i18n="seconds">Sekund</div></div>
      </div>
    </div>
  </section>`,
    details: `
  <section class="section details-section ${cls}-section">
    <div class="container">
      <h2 class="section-heading ${cls}-heading" data-i18n="detailsTitle">Tafsilotlar</h2>
      <div class="${cls}-cards">
        <div class="${cls}-card"><div class="${cls.slice(0,2)}-icon">${i.date}</div><div class="${cls.slice(0,2)}-label" data-i18n="dateLabel">Sana</div><div class="${cls.slice(0,2)}-value">{{eventDateFormatted}}</div></div>
        <div class="${cls}-card"><div class="${cls.slice(0,2)}-icon">${i.time}</div><div class="${cls.slice(0,2)}-label" data-i18n="timeLabel">Vaqt</div><div class="${cls.slice(0,2)}-value">{{eventTime|18:00}}</div></div>
        <div class="${cls}-card"><div class="${cls.slice(0,2)}-icon">${i.loc}</div><div class="${cls.slice(0,2)}-label" data-i18n="venueLabel">Manzil</div><div class="${cls.slice(0,2)}-value">{{location}}</div></div>
      </div>
    </div>
  </section>`,
    map: `
  {{#if locationUrl}}
  <section class="section map-section ${cls}-section">
    <div class="container" style="text-align:center">
      <a href="{{locationUrl}}" target="_blank" rel="noopener" class="${cls}-map-btn">
        📍 <span data-i18n="viewMap">Xaritada ko'rish</span>
      </a>
    </div>
  </section>
  {{/if}}`,
    program: `
  {{#if program}}
  <section class="section program-section ${cls}-section">
    <div class="container">
      <h2 class="section-heading ${cls}-heading" data-i18n="programTitle">Dastur</h2>
      <div class="timeline ${cls}-timeline" id="program-data" data-program="{{program}}"></div>
    </div>
  </section>
  {{/if}}`,
  };
}

// ═══════════════════════════════════════════════════════════
// DESIGN 11: NEON GLOW
// ═══════════════════════════════════════════════════════════
const neonSections = buildSections('neon', ':');

const neonWeddingHtml = `
<main class="inv neon-inv">
  <section class="hero neon-hero">
    <div class="neon-grid"></div>
    <div class="neon-circle c1"></div>
    <div class="neon-circle c2"></div>
    <div class="hero-inner">
      <div class="neon-badge" data-i18n="eventLabel">{{eventTypeLabel|Nikoh taklifi}}</div>
      <h1 class="neon-names">
        <span class="neon-name glow-text">{{brideName|Kelin}}</span>
        <span class="neon-amp">&</span>
        <span class="neon-name glow-text">{{groomName|Kuyov}}</span>
      </h1>
      <div class="neon-date"><div class="neon-line"></div><span>{{eventDateFormatted}}</span><div class="neon-line"></div></div>
    </div>
    <div class="scroll-cue"><div class="scroll-line"></div></div>
  </section>
  <section class="section greeting-section neon-section">
    <div class="container">
      <div class="neon-divider">◈ ◈ ◈</div>
      <h2 class="section-heading neon-heading">{{guestName|Hurmatli mehmonlar!}}</h2>
      <p class="greeting-text neon-text">{{message|Sizni farzandlarimiz nikoh to'yiga taklif qilamiz}}</p>
      <p class="greeting-family neon-family">{{hostName}}</p>
    </div>
  </section>
  ${neonSections.countdown}${neonSections.details}${neonSections.map}${neonSections.program}
  <footer class="footer neon-footer"><div class="container">
    <div class="neon-footer-names"><span>{{brideName|Kelin}}</span> <span class="neon-amp">&</span> <span>{{groomName|Kuyov}}</span></div>
    <p class="neon-footer-date">{{eventDateFormatted}}</p>
    <p class="neon-footer-msg" data-i18n="waitingMsg">Sizni kutib qolamiz!</p>
  </div></footer>
</main>`;

const neonBirthdayHtml = `
<main class="inv neon-inv">
  <section class="hero neon-hero">
    <div class="neon-grid"></div>
    <div class="neon-circle c1"></div>
    <div class="neon-circle c2"></div>
    <div class="hero-inner">
      <div class="neon-badge" data-i18n="eventLabel">{{eventTypeLabel|Tug'ilgan kun}}</div>
      <div class="neon-emoji">🎂</div>
      <h1 class="neon-title glow-text">{{eventTitle|Tug'ilgan kun bayrami}}</h1>
      {{#if age}}<div class="neon-age-ring"><span class="neon-age-num">{{age}}</span><span class="neon-age-label">yosh</span></div>{{/if}}
      <div class="neon-date"><div class="neon-line"></div><span>{{eventDateFormatted}}</span><div class="neon-line"></div></div>
    </div>
    <div class="scroll-cue"><div class="scroll-line"></div></div>
  </section>
  <section class="section greeting-section neon-section">
    <div class="container">
      <div class="neon-divider">◈ ◈ ◈</div>
      <h2 class="section-heading neon-heading">{{guestName|Hurmatli mehmonlar!}}</h2>
      <p class="greeting-text neon-text">{{message|Sizni bayramimizga taklif qilamiz!}}</p>
      <p class="greeting-family neon-family">{{hostName}}</p>
    </div>
  </section>
  ${neonSections.countdown}${neonSections.details}${neonSections.map}${neonSections.program}
  <footer class="footer neon-footer"><div class="container">
    <div class="neon-footer-names"><span>{{eventTitle|Tug'ilgan kun}}</span></div>
    <p class="neon-footer-date">{{eventDateFormatted}}</p>
    <p class="neon-footer-msg" data-i18n="waitingMsg">Sizni kutib qolamiz!</p>
  </div></footer>
</main>`;

const neonGraduationHtml = `
<main class="inv neon-inv">
  <section class="hero neon-hero">
    <div class="neon-grid"></div>
    <div class="neon-circle c1"></div>
    <div class="neon-circle c2"></div>
    <div class="hero-inner">
      <div class="neon-badge" data-i18n="eventLabel">{{eventTypeLabel|Bitiruvchilar}}</div>
      <div class="neon-emoji">🎓</div>
      <h1 class="neon-title glow-text">{{eventTitle|Bitiruvchilar kechasi}}</h1>
      {{#if graduationYear}}<div class="neon-age-ring"><span class="neon-age-num">{{graduationYear}}</span><span class="neon-age-label">yil</span></div>{{/if}}
      {{#if school}}<p class="neon-school">{{school}}</p>{{/if}}
      <div class="neon-date"><div class="neon-line"></div><span>{{eventDateFormatted}}</span><div class="neon-line"></div></div>
    </div>
    <div class="scroll-cue"><div class="scroll-line"></div></div>
  </section>
  <section class="section greeting-section neon-section">
    <div class="container">
      <div class="neon-divider">◈ ◈ ◈</div>
      <h2 class="section-heading neon-heading">{{guestName|Hurmatli mehmonlar!}}</h2>
      <p class="greeting-text neon-text">{{message|Bitiruvchilar kechasiga taklif qilamiz!}}</p>
      <p class="greeting-family neon-family">{{hostName}}</p>
    </div>
  </section>
  ${neonSections.countdown}${neonSections.details}${neonSections.map}${neonSections.program}
  <footer class="footer neon-footer"><div class="container">
    <div class="neon-footer-names"><span>{{eventTitle|Bitiruvchilar kechasi}}</span></div>
    <p class="neon-footer-date">{{eventDateFormatted}}</p>
    <p class="neon-footer-msg" data-i18n="waitingMsg">Sizni kutib qolamiz!</p>
  </div></footer>
</main>`;

const neonJubileeHtml = `
<main class="inv neon-inv">
  <section class="hero neon-hero">
    <div class="neon-grid"></div>
    <div class="neon-circle c1"></div>
    <div class="neon-circle c2"></div>
    <div class="hero-inner">
      <div class="neon-badge" data-i18n="eventLabel">{{eventTypeLabel|Yubiley}}</div>
      <div class="neon-emoji">🎉</div>
      <h1 class="neon-title glow-text">{{eventTitle|Yubiley tantanasi}}</h1>
      {{#if years}}<div class="neon-age-ring"><span class="neon-age-num">{{years}}</span><span class="neon-age-label">yil</span></div>{{/if}}
      <div class="neon-date"><div class="neon-line"></div><span>{{eventDateFormatted}}</span><div class="neon-line"></div></div>
    </div>
    <div class="scroll-cue"><div class="scroll-line"></div></div>
  </section>
  <section class="section greeting-section neon-section">
    <div class="container">
      <div class="neon-divider">◈ ◈ ◈</div>
      <h2 class="section-heading neon-heading">{{guestName|Hurmatli mehmonlar!}}</h2>
      <p class="greeting-text neon-text">{{message|Sizni yubiley tantanamizga taklif qilamiz!}}</p>
      <p class="greeting-family neon-family">{{hostName}}</p>
    </div>
  </section>
  ${neonSections.countdown}${neonSections.details}${neonSections.map}${neonSections.program}
  <footer class="footer neon-footer"><div class="container">
    <div class="neon-footer-names"><span>{{eventTitle|Yubiley}}</span></div>
    <p class="neon-footer-date">{{eventDateFormatted}}</p>
    <p class="neon-footer-msg" data-i18n="waitingMsg">Sizni kutib qolamiz!</p>
  </div></footer>
</main>`;

const neonGlowCss = `
:root{--bg:#0a0a0f;--text:#e0e0e0;--accent:#00f0ff;--accent2:#ff00e6;--card:rgba(0,240,255,0.05);--glow:0 0 20px rgba(0,240,255,0.3)}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--bg);color:var(--text);font-family:'Inter',sans-serif;overflow-x:hidden}
.neon-inv{min-height:100vh}
.neon-hero{min-height:100vh;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
.neon-grid{position:absolute;inset:0;background:linear-gradient(rgba(0,240,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,240,255,0.03) 1px,transparent 1px);background-size:60px 60px;animation:gridMove 20s linear infinite}
@keyframes gridMove{to{background-position:60px 60px}}
.neon-circle{position:absolute;border-radius:50%;border:1px solid rgba(0,240,255,0.15);animation:pulse 4s ease-in-out infinite}
.c1{width:400px;height:400px;top:50%;left:50%;transform:translate(-50%,-50%)}
.c2{width:600px;height:600px;top:50%;left:50%;transform:translate(-50%,-50%);animation-delay:1s;border-color:rgba(255,0,230,0.1)}
@keyframes pulse{0%,100%{opacity:.3;transform:translate(-50%,-50%) scale(1)}50%{opacity:.8;transform:translate(-50%,-50%) scale(1.05)}}
.neon-badge{font-size:.7rem;text-transform:uppercase;letter-spacing:4px;color:var(--accent);border:1px solid rgba(0,240,255,0.3);padding:6px 20px;border-radius:30px;margin-bottom:1rem;display:inline-block;text-shadow:var(--glow)}
.neon-emoji{font-size:3.5rem;text-align:center;margin-bottom:.5rem;filter:drop-shadow(0 0 15px rgba(0,240,255,0.4))}
.neon-names{text-align:center;margin:1rem 0}
.neon-name{display:block;font-size:clamp(2.5rem,8vw,4.5rem);font-weight:800;letter-spacing:2px;text-transform:uppercase}
.neon-title{text-align:center;font-size:clamp(2rem,7vw,3.5rem);font-weight:800;letter-spacing:2px;text-transform:uppercase;margin:0}
.glow-text{background:linear-gradient(135deg,var(--accent),var(--accent2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 0 15px rgba(0,240,255,0.4))}
.neon-amp{font-size:2rem;color:var(--accent);opacity:.5;display:block;margin:.5rem 0}
.neon-age-ring{display:inline-flex;flex-direction:column;align-items:center;justify-content:center;width:100px;height:100px;border-radius:50%;border:2px solid var(--accent);margin:1.5rem auto;box-shadow:var(--glow),inset var(--glow)}
.neon-age-num{font-size:2.5rem;font-weight:900;color:var(--accent);text-shadow:var(--glow);line-height:1}
.neon-age-label{font-size:.6rem;text-transform:uppercase;letter-spacing:3px;color:rgba(0,240,255,0.6)}
.neon-school{text-align:center;color:rgba(0,240,255,0.6);font-size:.85rem;letter-spacing:1px;margin-top:.5rem}
.neon-date{display:flex;align-items:center;gap:12px;justify-content:center;margin-top:1.5rem}
.neon-date span{font-size:.9rem;letter-spacing:3px;text-transform:uppercase;color:var(--accent)}
.neon-line{width:40px;height:1px;background:linear-gradient(90deg,transparent,var(--accent),transparent)}
.neon-section{padding:4rem 1rem}.neon-heading{text-align:center;font-size:1.3rem;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:var(--accent);margin-bottom:2rem;text-shadow:var(--glow)}
.neon-divider{text-align:center;color:var(--accent);letter-spacing:8px;margin-bottom:1rem;opacity:.5}
.neon-text,.greeting-text.neon-text{text-align:center;color:rgba(255,255,255,0.7);line-height:1.8;max-width:500px;margin:0 auto 1rem}
.neon-family,.greeting-family.neon-family{text-align:center;color:var(--accent);font-weight:600;font-size:1.1rem}
.neon-countdown{display:flex;gap:8px;justify-content:center;align-items:center}
.neon-cd{background:rgba(0,240,255,0.05);border:1px solid rgba(0,240,255,0.2);border-radius:12px;padding:16px 20px;text-align:center;min-width:65px}
.neon-cd .cd-num{font-size:2rem;font-weight:800;color:var(--accent);text-shadow:var(--glow)}
.neon-cd .cd-label{font-size:.65rem;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.4);margin-top:4px}
.neon-sep{font-size:1.5rem;color:var(--accent);opacity:.3}
.neon-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:16px;max-width:500px;margin:0 auto}
.neon-card{background:rgba(0,240,255,0.03);border:1px solid rgba(0,240,255,0.15);border-radius:16px;padding:20px;text-align:center;transition:all .3s}
.neon-card:hover{border-color:var(--accent);box-shadow:var(--glow)}
.ne-icon{font-size:1.5rem;margin-bottom:8px}.ne-label{font-size:.65rem;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.4);margin-bottom:4px}
.ne-value{font-size:.95rem;font-weight:600;color:var(--accent)}
.neon-map-btn{display:flex;align-items:center;justify-content:center;gap:8px;margin:0 auto;padding:14px 28px;border:1px solid var(--accent);border-radius:30px;color:var(--accent);text-decoration:none;font-size:.9rem;transition:all .3s;max-width:250px}
.neon-map-btn:hover{background:rgba(0,240,255,0.1);box-shadow:var(--glow)}
.neon-timeline .tl-item{display:flex;gap:16px;margin-bottom:0}
.neon-timeline .tl-marker{display:flex;flex-direction:column;align-items:center}
.neon-timeline .tl-dot{width:12px;height:12px;border-radius:50%;border:2px solid var(--accent);background:var(--bg);box-shadow:0 0 8px rgba(0,240,255,0.5)}
.neon-timeline .tl-connector{width:1px;flex:1;background:linear-gradient(180deg,var(--accent),transparent)}
.neon-timeline .tl-card{padding:4px 0 24px;flex:1}
.neon-timeline .tl-time{font-size:.75rem;color:var(--accent);font-weight:700;margin-bottom:2px}
.neon-timeline .tl-card h4{font-size:.9rem;color:rgba(255,255,255,0.8);font-weight:400}
.neon-footer{text-align:center;padding:3rem 1rem;border-top:1px solid rgba(0,240,255,0.1)}
.neon-footer-names{font-size:1.5rem;font-weight:700;color:var(--accent)}
.neon-footer-names .neon-amp{font-size:1rem;margin:0 8px;opacity:.4;display:inline}
.neon-footer-date{color:rgba(255,255,255,0.4);font-size:.8rem;letter-spacing:2px;margin:.5rem 0}
.neon-footer-msg{color:rgba(255,255,255,0.5);font-size:.85rem}
.hero-inner{position:relative;z-index:1;text-align:center;padding:2rem}
.container{max-width:600px;margin:0 auto}
.scroll-cue{position:absolute;bottom:2rem;left:50%;transform:translateX(-50%)}
.scroll-line{width:1px;height:40px;background:linear-gradient(180deg,var(--accent),transparent);animation:scrollAnim 2s ease-in-out infinite}
@keyframes scrollAnim{0%{opacity:0;transform:scaleY(0)}50%{opacity:1;transform:scaleY(1)}100%{opacity:0;transform:scaleY(0)}}
section{scroll-snap-align:start}.section.greeting-section{min-height:auto}
@media(max-width:480px){.neon-name,.neon-title{font-size:2rem}.neon-cd{padding:12px 14px;min-width:55px}.neon-cd .cd-num{font-size:1.5rem}.neon-age-ring{width:80px;height:80px}.neon-age-num{font-size:2rem}}
`;


// ═══════════════════════════════════════════════════════════
// DESIGN 12: ELEGANT MARBLE
// ═══════════════════════════════════════════════════════════
const marbleSections = buildSections('marble', '·');

const marbleWeddingHtml = `
<main class="inv marble-inv">
  <section class="hero marble-hero">
    <div class="marble-texture"></div>
    <div class="hero-inner">
      <div class="marble-frame">
        <div class="mf-corner tl"></div><div class="mf-corner tr"></div><div class="mf-corner bl"></div><div class="mf-corner br"></div>
        <p class="marble-label" data-i18n="eventLabel">{{eventTypeLabel|Nikoh taklifi}}</p>
        <h1 class="marble-names"><span class="marble-name">{{brideName|Kelin}}</span><span class="marble-and">♦</span><span class="marble-name">{{groomName|Kuyov}}</span></h1>
        <div class="marble-date">{{eventDateFormatted}}</div>
      </div>
    </div>
    <div class="scroll-cue"><div class="scroll-line"></div></div>
  </section>
  <section class="section greeting-section marble-section"><div class="container">
    <div class="marble-ornament">— ❖ —</div>
    <h2 class="section-heading marble-heading">{{guestName|Hurmatli mehmonlar!}}</h2>
    <p class="greeting-text marble-text">{{message|Sizni farzandlarimiz nikoh to'yiga taklif qilamiz}}</p>
    <p class="greeting-family marble-family">{{hostName}}</p>
  </div></section>
  ${marbleSections.countdown}${marbleSections.details}${marbleSections.map}${marbleSections.program}
  <footer class="footer marble-footer"><div class="container">
    <div class="marble-ornament">— ❖ —</div>
    <p class="marble-footer-names">{{brideName|Kelin}} & {{groomName|Kuyov}}</p>
    <p class="marble-footer-msg" data-i18n="waitingMsg">Sizni kutib qolamiz!</p>
  </div></footer>
</main>`;

const marbleBirthdayHtml = `
<main class="inv marble-inv">
  <section class="hero marble-hero">
    <div class="marble-texture"></div>
    <div class="hero-inner">
      <div class="marble-frame">
        <div class="mf-corner tl"></div><div class="mf-corner tr"></div><div class="mf-corner bl"></div><div class="mf-corner br"></div>
        <p class="marble-label" data-i18n="eventLabel">{{eventTypeLabel|Tug'ilgan kun}}</p>
        <div class="marble-emoji">🎂</div>
        <h1 class="marble-single-name">{{eventTitle|Tug'ilgan kun bayrami}}</h1>
        {{#if age}}<div class="marble-age"><span class="marble-age-num">{{age}}</span><span class="marble-age-text">yosh</span></div>{{/if}}
        <div class="marble-date">{{eventDateFormatted}}</div>
      </div>
    </div>
    <div class="scroll-cue"><div class="scroll-line"></div></div>
  </section>
  <section class="section greeting-section marble-section"><div class="container">
    <div class="marble-ornament">— ❖ —</div>
    <h2 class="section-heading marble-heading">{{guestName|Hurmatli mehmonlar!}}</h2>
    <p class="greeting-text marble-text">{{message|Sizni bayramimizga taklif qilamiz!}}</p>
    <p class="greeting-family marble-family">{{hostName}}</p>
  </div></section>
  ${marbleSections.countdown}${marbleSections.details}${marbleSections.map}${marbleSections.program}
  <footer class="footer marble-footer"><div class="container">
    <div class="marble-ornament">— ❖ —</div>
    <p class="marble-footer-names">{{eventTitle|Tug'ilgan kun}}</p>
    <p class="marble-footer-msg" data-i18n="waitingMsg">Sizni kutib qolamiz!</p>
  </div></footer>
</main>`;

const marbleGraduationHtml = `
<main class="inv marble-inv">
  <section class="hero marble-hero">
    <div class="marble-texture"></div>
    <div class="hero-inner">
      <div class="marble-frame">
        <div class="mf-corner tl"></div><div class="mf-corner tr"></div><div class="mf-corner bl"></div><div class="mf-corner br"></div>
        <p class="marble-label" data-i18n="eventLabel">{{eventTypeLabel|Bitiruvchilar}}</p>
        <div class="marble-emoji">🎓</div>
        <h1 class="marble-single-name">{{eventTitle|Bitiruvchilar kechasi}}</h1>
        {{#if graduationYear}}<div class="marble-age"><span class="marble-age-num">{{graduationYear}}</span><span class="marble-age-text">yil</span></div>{{/if}}
        {{#if school}}<p class="marble-school">{{school}}</p>{{/if}}
        <div class="marble-date">{{eventDateFormatted}}</div>
      </div>
    </div>
    <div class="scroll-cue"><div class="scroll-line"></div></div>
  </section>
  <section class="section greeting-section marble-section"><div class="container">
    <div class="marble-ornament">— ❖ —</div>
    <h2 class="section-heading marble-heading">{{guestName|Hurmatli mehmonlar!}}</h2>
    <p class="greeting-text marble-text">{{message|Bitiruvchilar kechasiga taklif qilamiz!}}</p>
    <p class="greeting-family marble-family">{{hostName}}</p>
  </div></section>
  ${marbleSections.countdown}${marbleSections.details}${marbleSections.map}${marbleSections.program}
  <footer class="footer marble-footer"><div class="container">
    <div class="marble-ornament">— ❖ —</div>
    <p class="marble-footer-names">{{eventTitle|Bitiruvchilar kechasi}}</p>
    <p class="marble-footer-msg" data-i18n="waitingMsg">Sizni kutib qolamiz!</p>
  </div></footer>
</main>`;

const marbleJubileeHtml = `
<main class="inv marble-inv">
  <section class="hero marble-hero">
    <div class="marble-texture"></div>
    <div class="hero-inner">
      <div class="marble-frame">
        <div class="mf-corner tl"></div><div class="mf-corner tr"></div><div class="mf-corner bl"></div><div class="mf-corner br"></div>
        <p class="marble-label" data-i18n="eventLabel">{{eventTypeLabel|Yubiley}}</p>
        <div class="marble-emoji">🎉</div>
        <h1 class="marble-single-name">{{eventTitle|Yubiley tantanasi}}</h1>
        {{#if years}}<div class="marble-age"><span class="marble-age-num">{{years}}</span><span class="marble-age-text">yil</span></div>{{/if}}
        <div class="marble-date">{{eventDateFormatted}}</div>
      </div>
    </div>
    <div class="scroll-cue"><div class="scroll-line"></div></div>
  </section>
  <section class="section greeting-section marble-section"><div class="container">
    <div class="marble-ornament">— ❖ —</div>
    <h2 class="section-heading marble-heading">{{guestName|Hurmatli mehmonlar!}}</h2>
    <p class="greeting-text marble-text">{{message|Sizni yubiley tantanamizga taklif qilamiz!}}</p>
    <p class="greeting-family marble-family">{{hostName}}</p>
  </div></section>
  ${marbleSections.countdown}${marbleSections.details}${marbleSections.map}${marbleSections.program}
  <footer class="footer marble-footer"><div class="container">
    <div class="marble-ornament">— ❖ —</div>
    <p class="marble-footer-names">{{eventTitle|Yubiley}}</p>
    <p class="marble-footer-msg" data-i18n="waitingMsg">Sizni kutib qolamiz!</p>
  </div></footer>
</main>`;

const elegantMarbleCss = `
:root{--bg:#faf8f5;--text:#2c2520;--accent:#b8860b;--accent-light:rgba(184,134,11,0.15);--card:#fff;--border:rgba(184,134,11,0.25)}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--bg);color:var(--text);font-family:'Cormorant Garamond','Georgia',serif;overflow-x:hidden}
.marble-inv{min-height:100vh}
.marble-hero{min-height:100vh;display:flex;align-items:center;justify-content:center;position:relative;background:linear-gradient(135deg,#faf8f5 0%,#f0ebe3 50%,#faf8f5 100%)}
.marble-texture{position:absolute;inset:0;opacity:.08;background:url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")}
.marble-frame{border:1px solid var(--border);padding:3rem 2.5rem;position:relative;text-align:center;background:rgba(255,255,255,0.5);backdrop-filter:blur(10px)}
.mf-corner{position:absolute;width:20px;height:20px;border-color:var(--accent);border-style:solid}
.mf-corner.tl{top:-1px;left:-1px;border-width:2px 0 0 2px}.mf-corner.tr{top:-1px;right:-1px;border-width:2px 2px 0 0}
.mf-corner.bl{bottom:-1px;left:-1px;border-width:0 0 2px 2px}.mf-corner.br{bottom:-1px;right:-1px;border-width:0 2px 2px 0}
.marble-label{font-size:.7rem;text-transform:uppercase;letter-spacing:5px;color:var(--accent);margin-bottom:1.5rem}
.marble-emoji{font-size:3rem;margin-bottom:.5rem}
.marble-names{margin:0}.marble-name{display:block;font-size:clamp(2rem,7vw,3.5rem);font-weight:300;font-style:italic;letter-spacing:3px;color:var(--text)}
.marble-single-name{font-size:clamp(1.8rem,6vw,3rem);font-weight:300;font-style:italic;color:var(--text);margin:0}
.marble-and{display:block;font-size:1rem;color:var(--accent);margin:.5rem 0}
.marble-age{display:inline-flex;flex-direction:column;align-items:center;margin:1.2rem auto;padding:12px 24px;border:1px solid var(--border);border-radius:0}
.marble-age-num{font-size:2.5rem;font-weight:300;color:var(--accent);font-style:italic;line-height:1}
.marble-age-text{font-size:.6rem;text-transform:uppercase;letter-spacing:3px;color:rgba(44,37,32,0.5)}
.marble-school{font-size:.85rem;color:rgba(44,37,32,0.6);font-style:italic;margin-top:.5rem}
.marble-date{margin-top:1.5rem;font-size:.85rem;letter-spacing:4px;text-transform:uppercase;color:var(--accent);font-weight:500}
.marble-section{padding:4rem 1rem}.marble-heading{text-align:center;font-size:1.2rem;font-weight:400;letter-spacing:4px;text-transform:uppercase;color:var(--accent);margin-bottom:2rem;font-style:italic}
.marble-ornament{text-align:center;color:var(--accent);letter-spacing:8px;margin-bottom:1rem;font-size:.9rem}
.marble-text,.greeting-text.marble-text{text-align:center;color:rgba(44,37,32,0.7);line-height:2;max-width:480px;margin:0 auto 1rem;font-size:1.05rem}
.marble-family,.greeting-family.marble-family{text-align:center;color:var(--accent);font-weight:600;font-style:italic}
.marble-countdown{display:flex;gap:12px;justify-content:center;align-items:center}
.marble-cd{text-align:center;padding:14px 18px}
.marble-cd .cd-num{font-size:2.2rem;font-weight:300;color:var(--accent);font-style:italic}
.marble-cd .cd-label{font-size:.6rem;text-transform:uppercase;letter-spacing:3px;color:rgba(44,37,32,0.4);margin-top:4px}
.marble-sep{color:var(--accent);opacity:.3;font-size:1.5rem}
.marble-cards{max-width:400px;margin:0 auto;background:var(--card);border:1px solid var(--border);padding:1.5rem}
.marble-card{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border)}
.marble-card:last-child{border-bottom:none}
.ma-icon{font-size:1.2rem}.ma-label{font-size:.7rem;text-transform:uppercase;letter-spacing:2px;color:rgba(44,37,32,0.5);width:60px}
.ma-value{flex:1;font-weight:500;color:var(--text)}
.marble-map-btn{display:inline-block;padding:12px 30px;border:1px solid var(--accent);color:var(--accent);text-decoration:none;letter-spacing:3px;text-transform:uppercase;font-size:.75rem;transition:all .3s}
.marble-map-btn:hover{background:var(--accent);color:#fff}
.marble-timeline .tl-item{display:flex;gap:16px;margin-bottom:0}
.marble-timeline .tl-marker{display:flex;flex-direction:column;align-items:center}
.marble-timeline .tl-dot{width:8px;height:8px;border-radius:50%;background:var(--accent)}
.marble-timeline .tl-connector{width:1px;flex:1;background:var(--border)}
.marble-timeline .tl-card{padding:2px 0 20px;flex:1}
.marble-timeline .tl-time{font-size:.75rem;color:var(--accent);font-weight:500}
.marble-timeline .tl-card h4{font-size:.9rem;color:var(--text);font-weight:400;font-style:italic}
.marble-footer{text-align:center;padding:3rem 1rem;border-top:1px solid var(--border)}
.marble-footer-names{font-size:1.3rem;font-style:italic;color:var(--accent);margin:.5rem 0}
.marble-footer-msg{color:rgba(44,37,32,0.5);font-size:.85rem}
.hero-inner{position:relative;z-index:1;padding:2rem}
.container{max-width:600px;margin:0 auto}
.scroll-cue{position:absolute;bottom:2rem;left:50%;transform:translateX(-50%)}
.scroll-line{width:1px;height:40px;background:linear-gradient(180deg,var(--accent),transparent);animation:scrollAnim 2s ease-in-out infinite}
@keyframes scrollAnim{0%{opacity:0;transform:scaleY(0)}50%{opacity:1;transform:scaleY(1)}100%{opacity:0;transform:scaleY(0)}}
section{scroll-snap-align:start}.section.greeting-section{min-height:auto}
@media(max-width:480px){.marble-name,.marble-single-name{font-size:2rem}.marble-frame{padding:2rem 1.5rem}}
`;


// ═══════════════════════════════════════════════════════════
// DESIGN 13: BOHO GARDEN
// ═══════════════════════════════════════════════════════════
const bohoSections = buildSections('boho', '✦');

const bohoWeddingHtml = `
<main class="inv boho-inv">
  <section class="hero boho-hero">
    <div class="boho-leaves top-left">🌿</div><div class="boho-leaves top-right">🍃</div><div class="boho-leaves bot-left">🌸</div><div class="boho-leaves bot-right">🌺</div>
    <div class="hero-inner">
      <div class="boho-wreath">✿</div>
      <p class="boho-label" data-i18n="eventLabel">{{eventTypeLabel|Nikoh taklifi}}</p>
      <h1 class="boho-names"><span class="boho-name">{{brideName|Kelin}}</span><span class="boho-leaf">🌿</span><span class="boho-name">{{groomName|Kuyov}}</span></h1>
      <div class="boho-date-card"><span>{{eventDateFormatted}}</span></div>
    </div>
    <div class="scroll-cue"><div class="scroll-line"></div></div>
  </section>
  <section class="section greeting-section boho-section"><div class="container">
    <div class="boho-flourish">~ ✿ ~</div>
    <h2 class="section-heading boho-heading">{{guestName|Hurmatli mehmonlar!}}</h2>
    <p class="greeting-text boho-text">{{message|Sizni farzandlarimiz nikoh to'yiga taklif qilamiz}}</p>
    <p class="greeting-family boho-family">{{hostName}}</p>
  </div></section>
  ${bohoSections.countdown}${bohoSections.details}${bohoSections.map}${bohoSections.program}
  <footer class="footer boho-footer"><div class="container">
    <div class="boho-flourish">~ ✿ ~</div>
    <p class="boho-footer-names">{{brideName|Kelin}} & {{groomName|Kuyov}}</p>
    <p class="boho-footer-msg" data-i18n="waitingMsg">Sizni kutib qolamiz!</p>
  </div></footer>
</main>`;

const bohoBirthdayHtml = `
<main class="inv boho-inv">
  <section class="hero boho-hero">
    <div class="boho-leaves top-left">🌻</div><div class="boho-leaves top-right">🌸</div><div class="boho-leaves bot-left">🌼</div><div class="boho-leaves bot-right">🌺</div>
    <div class="hero-inner">
      <div class="boho-wreath">🎂</div>
      <p class="boho-label" data-i18n="eventLabel">{{eventTypeLabel|Tug'ilgan kun}}</p>
      <h1 class="boho-single-title">{{eventTitle|Tug'ilgan kun bayrami}}</h1>
      {{#if age}}<div class="boho-age-badge"><span class="boho-age-num">{{age}}</span><span class="boho-age-text">yosh</span></div>{{/if}}
      <div class="boho-date-card"><span>{{eventDateFormatted}}</span></div>
    </div>
    <div class="scroll-cue"><div class="scroll-line"></div></div>
  </section>
  <section class="section greeting-section boho-section"><div class="container">
    <div class="boho-flourish">~ ✿ ~</div>
    <h2 class="section-heading boho-heading">{{guestName|Hurmatli mehmonlar!}}</h2>
    <p class="greeting-text boho-text">{{message|Sizni bayramimizga taklif qilamiz!}}</p>
    <p class="greeting-family boho-family">{{hostName}}</p>
  </div></section>
  ${bohoSections.countdown}${bohoSections.details}${bohoSections.map}${bohoSections.program}
  <footer class="footer boho-footer"><div class="container">
    <div class="boho-flourish">~ ✿ ~</div>
    <p class="boho-footer-names">{{eventTitle|Tug'ilgan kun}}</p>
    <p class="boho-footer-msg" data-i18n="waitingMsg">Sizni kutib qolamiz!</p>
  </div></footer>
</main>`;

const bohoGraduationHtml = `
<main class="inv boho-inv">
  <section class="hero boho-hero">
    <div class="boho-leaves top-left">🍃</div><div class="boho-leaves top-right">🌿</div><div class="boho-leaves bot-left">🌸</div><div class="boho-leaves bot-right">🍂</div>
    <div class="hero-inner">
      <div class="boho-wreath">🎓</div>
      <p class="boho-label" data-i18n="eventLabel">{{eventTypeLabel|Bitiruvchilar}}</p>
      <h1 class="boho-single-title">{{eventTitle|Bitiruvchilar kechasi}}</h1>
      {{#if graduationYear}}<div class="boho-age-badge"><span class="boho-age-num">{{graduationYear}}</span><span class="boho-age-text">yil</span></div>{{/if}}
      {{#if school}}<p class="boho-school">{{school}}</p>{{/if}}
      <div class="boho-date-card"><span>{{eventDateFormatted}}</span></div>
    </div>
    <div class="scroll-cue"><div class="scroll-line"></div></div>
  </section>
  <section class="section greeting-section boho-section"><div class="container">
    <div class="boho-flourish">~ ✿ ~</div>
    <h2 class="section-heading boho-heading">{{guestName|Hurmatli mehmonlar!}}</h2>
    <p class="greeting-text boho-text">{{message|Bitiruvchilar kechasiga taklif qilamiz!}}</p>
    <p class="greeting-family boho-family">{{hostName}}</p>
  </div></section>
  ${bohoSections.countdown}${bohoSections.details}${bohoSections.map}${bohoSections.program}
  <footer class="footer boho-footer"><div class="container">
    <div class="boho-flourish">~ ✿ ~</div>
    <p class="boho-footer-names">{{eventTitle|Bitiruvchilar}}</p>
    <p class="boho-footer-msg" data-i18n="waitingMsg">Sizni kutib qolamiz!</p>
  </div></footer>
</main>`;

const bohoJubileeHtml = `
<main class="inv boho-inv">
  <section class="hero boho-hero">
    <div class="boho-leaves top-left">🌿</div><div class="boho-leaves top-right">🍃</div><div class="boho-leaves bot-left">🌻</div><div class="boho-leaves bot-right">🌺</div>
    <div class="hero-inner">
      <div class="boho-wreath">🎉</div>
      <p class="boho-label" data-i18n="eventLabel">{{eventTypeLabel|Yubiley}}</p>
      <h1 class="boho-single-title">{{eventTitle|Yubiley tantanasi}}</h1>
      {{#if years}}<div class="boho-age-badge"><span class="boho-age-num">{{years}}</span><span class="boho-age-text">yil</span></div>{{/if}}
      <div class="boho-date-card"><span>{{eventDateFormatted}}</span></div>
    </div>
    <div class="scroll-cue"><div class="scroll-line"></div></div>
  </section>
  <section class="section greeting-section boho-section"><div class="container">
    <div class="boho-flourish">~ ✿ ~</div>
    <h2 class="section-heading boho-heading">{{guestName|Hurmatli mehmonlar!}}</h2>
    <p class="greeting-text boho-text">{{message|Sizni yubiley tantanamizga taklif qilamiz!}}</p>
    <p class="greeting-family boho-family">{{hostName}}</p>
  </div></section>
  ${bohoSections.countdown}${bohoSections.details}${bohoSections.map}${bohoSections.program}
  <footer class="footer boho-footer"><div class="container">
    <div class="boho-flourish">~ ✿ ~</div>
    <p class="boho-footer-names">{{eventTitle|Yubiley}}</p>
    <p class="boho-footer-msg" data-i18n="waitingMsg">Sizni kutib qolamiz!</p>
  </div></footer>
</main>`;

const bohoGardenCss = `
:root{--bg:#f7f3ee;--text:#3e3528;--accent:#6b7c3f;--accent2:#c57b57;--card:rgba(107,124,63,0.06);--border:rgba(107,124,63,0.2)}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--bg);color:var(--text);font-family:'Playfair Display','Georgia',serif;overflow-x:hidden}
.boho-inv{min-height:100vh}
.boho-hero{min-height:100vh;display:flex;align-items:center;justify-content:center;position:relative;background:linear-gradient(180deg,#f0ebe3,#f7f3ee)}
.boho-leaves{position:absolute;font-size:3rem;opacity:.2;animation:leafSway 6s ease-in-out infinite}
.top-left{top:5%;left:5%}.top-right{top:5%;right:5%;animation-delay:1s}.bot-left{bottom:10%;left:10%;animation-delay:2s}.bot-right{bottom:10%;right:10%;animation-delay:3s}
@keyframes leafSway{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}
.boho-wreath{font-size:3rem;text-align:center;margin-bottom:1rem}
.boho-label{text-align:center;font-size:.7rem;text-transform:uppercase;letter-spacing:5px;color:var(--accent2);margin-bottom:1rem}
.boho-names{text-align:center;margin:0}
.boho-name{display:block;font-size:clamp(2rem,7vw,3.5rem);font-weight:700;color:var(--text);font-style:italic}
.boho-single-title{text-align:center;font-size:clamp(1.8rem,6vw,3rem);font-weight:700;color:var(--text);font-style:italic;margin:0}
.boho-leaf{display:block;font-size:1.5rem;margin:.3rem 0}
.boho-age-badge{display:inline-flex;flex-direction:column;align-items:center;margin:1rem auto;padding:10px 22px;border:1px solid var(--border);border-radius:20px;background:rgba(107,124,63,0.05)}
.boho-age-num{font-size:2.2rem;font-weight:700;color:var(--accent);line-height:1}
.boho-age-text{font-size:.55rem;text-transform:uppercase;letter-spacing:3px;color:rgba(62,53,40,0.5)}
.boho-school{text-align:center;color:var(--accent2);font-size:.85rem;font-style:italic;margin-top:.3rem}
.boho-date-card{text-align:center;margin-top:1.5rem;display:inline-block;padding:8px 24px;border:1px solid var(--border);border-radius:30px;font-size:.85rem;letter-spacing:3px;color:var(--accent);background:rgba(255,255,255,0.5)}
.boho-section{padding:4rem 1rem}.boho-heading{text-align:center;font-size:1.2rem;font-weight:400;color:var(--accent);letter-spacing:3px;text-transform:uppercase;margin-bottom:2rem;font-style:italic}
.boho-flourish{text-align:center;color:var(--accent);letter-spacing:8px;margin-bottom:1rem}
.boho-text,.greeting-text.boho-text{text-align:center;color:rgba(62,53,40,0.7);line-height:2;max-width:480px;margin:0 auto 1rem;font-size:1rem}
.boho-family,.greeting-family.boho-family{text-align:center;color:var(--accent2);font-weight:600}
.boho-countdown{display:flex;gap:8px;justify-content:center;align-items:center}
.boho-cd{background:rgba(107,124,63,0.08);border:1px solid var(--border);border-radius:16px;padding:14px 18px;text-align:center}
.boho-cd .cd-num{font-size:2rem;font-weight:700;color:var(--accent)}.boho-cd .cd-label{font-size:.6rem;text-transform:uppercase;letter-spacing:2px;color:rgba(62,53,40,0.4);margin-top:4px}
.boho-sep{color:var(--accent);opacity:.3;font-size:.6rem}
.boho-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;max-width:500px;margin:0 auto}
.boho-card{background:rgba(107,124,63,0.05);border:1px solid var(--border);border-radius:16px;padding:20px 12px;text-align:center}
.bo-icon{font-size:1.3rem;margin-bottom:6px}.bo-label{font-size:.6rem;text-transform:uppercase;letter-spacing:2px;color:rgba(62,53,40,0.4);margin-bottom:4px}
.bo-value{font-size:.85rem;font-weight:600;color:var(--accent)}
.boho-map-btn{display:inline-block;padding:12px 24px;background:var(--accent);color:#fff;text-decoration:none;border-radius:30px;font-size:.85rem;transition:all .3s}
.boho-map-btn:hover{background:var(--accent2)}
.boho-timeline .tl-item{display:flex;gap:16px;margin-bottom:0}
.boho-timeline .tl-marker{display:flex;flex-direction:column;align-items:center}
.boho-timeline .tl-dot{width:10px;height:10px;border-radius:50%;background:var(--accent)}
.boho-timeline .tl-connector{width:1px;flex:1;background:var(--border)}
.boho-timeline .tl-card{padding:2px 0 20px;flex:1}
.boho-timeline .tl-time{font-size:.75rem;color:var(--accent2);font-weight:600}
.boho-timeline .tl-card h4{font-size:.9rem;color:var(--text);font-weight:400;font-style:italic}
.boho-footer{text-align:center;padding:3rem 1rem;border-top:1px solid var(--border)}
.boho-footer-names{font-size:1.2rem;font-style:italic;color:var(--accent);margin:.5rem 0}
.boho-footer-msg{color:rgba(62,53,40,0.5);font-size:.85rem}
.hero-inner{position:relative;z-index:1;text-align:center;padding:2rem}
.container{max-width:600px;margin:0 auto}
.scroll-cue{position:absolute;bottom:2rem;left:50%;transform:translateX(-50%)}
.scroll-line{width:1px;height:40px;background:linear-gradient(180deg,var(--accent),transparent);animation:scrollAnim 2s ease-in-out infinite}
@keyframes scrollAnim{0%{opacity:0;transform:scaleY(0)}50%{opacity:1;transform:scaleY(1)}100%{opacity:0;transform:scaleY(0)}}
section{scroll-snap-align:start}.section.greeting-section{min-height:auto}
@media(max-width:480px){.boho-name,.boho-single-title{font-size:2rem}.boho-cards{grid-template-columns:1fr}.boho-cd{padding:10px 14px}}
`;


// ═══════════════════════════════════════════════════════════
// DESIGN 14: CINEMA POSTER
// ═══════════════════════════════════════════════════════════
const cinemaSections = buildSections('cinema', '/');

const cinemaWeddingHtml = `
<main class="inv cinema-inv">
  <section class="hero cinema-hero">
    <div class="cinema-grain"></div><div class="cinema-spotlight"></div>
    <div class="hero-inner">
      <div class="cinema-presents" data-i18n="eventLabel">{{eventTypeLabel|Nikoh taklifi}}</div>
      <h1 class="cinema-title"><span class="cinema-name-big">{{brideName|Kelin}}</span><span class="cinema-x">×</span><span class="cinema-name-big">{{groomName|Kuyov}}</span></h1>
      <div class="cinema-tagline">{{eventDateFormatted}}</div>
      <div class="cinema-rating">★ ★ ★ ★ ★</div>
    </div>
    <div class="scroll-cue"><div class="scroll-line"></div></div>
  </section>
  <section class="section greeting-section cinema-section"><div class="container">
    <div class="cinema-bar"></div>
    <h2 class="section-heading cinema-heading">{{guestName|Hurmatli mehmonlar!}}</h2>
    <p class="greeting-text cinema-text">{{message|Sizni farzandlarimiz nikoh to'yiga taklif qilamiz}}</p>
    <p class="greeting-family cinema-family">— {{hostName}} —</p>
  </div></section>
  ${cinemaSections.countdown}${cinemaSections.details}${cinemaSections.map}${cinemaSections.program}
  <footer class="footer cinema-footer"><div class="container">
    <div class="cinema-bar"></div>
    <p class="cinema-footer-names">{{brideName|Kelin}} × {{groomName|Kuyov}}</p>
    <p class="cinema-footer-date">{{eventDateFormatted}}</p>
    <p class="cinema-footer-msg" data-i18n="waitingMsg">Sizni kutib qolamiz!</p>
  </div></footer>
</main>`;

const cinemaBirthdayHtml = `
<main class="inv cinema-inv">
  <section class="hero cinema-hero">
    <div class="cinema-grain"></div><div class="cinema-spotlight"></div>
    <div class="hero-inner">
      <div class="cinema-presents" data-i18n="eventLabel">{{eventTypeLabel|Tug'ilgan kun}}</div>
      <div class="cinema-emoji">🎂</div>
      <h1 class="cinema-title"><span class="cinema-name-big">{{eventTitle|Tug'ilgan kun bayrami}}</span></h1>
      {{#if age}}<div class="cinema-badge-ring"><span class="cinema-badge-num">{{age}}</span><span class="cinema-badge-label">YOSH</span></div>{{/if}}
      <div class="cinema-tagline">{{eventDateFormatted}}</div>
      <div class="cinema-rating">★ ★ ★ ★ ★</div>
    </div>
    <div class="scroll-cue"><div class="scroll-line"></div></div>
  </section>
  <section class="section greeting-section cinema-section"><div class="container">
    <div class="cinema-bar"></div>
    <h2 class="section-heading cinema-heading">{{guestName|Hurmatli mehmonlar!}}</h2>
    <p class="greeting-text cinema-text">{{message|Sizni bayramimizga taklif qilamiz!}}</p>
    <p class="greeting-family cinema-family">— {{hostName}} —</p>
  </div></section>
  ${cinemaSections.countdown}${cinemaSections.details}${cinemaSections.map}${cinemaSections.program}
  <footer class="footer cinema-footer"><div class="container">
    <div class="cinema-bar"></div>
    <p class="cinema-footer-names">{{eventTitle|Tug'ilgan kun}}</p>
    <p class="cinema-footer-date">{{eventDateFormatted}}</p>
    <p class="cinema-footer-msg" data-i18n="waitingMsg">Sizni kutib qolamiz!</p>
  </div></footer>
</main>`;

const cinemaGraduationHtml = `
<main class="inv cinema-inv">
  <section class="hero cinema-hero">
    <div class="cinema-grain"></div><div class="cinema-spotlight"></div>
    <div class="hero-inner">
      <div class="cinema-presents" data-i18n="eventLabel">{{eventTypeLabel|Bitiruvchilar}}</div>
      <div class="cinema-emoji">🎓</div>
      <h1 class="cinema-title"><span class="cinema-name-big">{{eventTitle|Bitiruvchilar kechasi}}</span></h1>
      {{#if graduationYear}}<div class="cinema-badge-ring"><span class="cinema-badge-num">{{graduationYear}}</span><span class="cinema-badge-label">YIL</span></div>{{/if}}
      {{#if school}}<p class="cinema-school">{{school}}</p>{{/if}}
      <div class="cinema-tagline">{{eventDateFormatted}}</div>
      <div class="cinema-rating">★ ★ ★ ★ ★</div>
    </div>
    <div class="scroll-cue"><div class="scroll-line"></div></div>
  </section>
  <section class="section greeting-section cinema-section"><div class="container">
    <div class="cinema-bar"></div>
    <h2 class="section-heading cinema-heading">{{guestName|Hurmatli mehmonlar!}}</h2>
    <p class="greeting-text cinema-text">{{message|Bitiruvchilar kechasiga taklif qilamiz!}}</p>
    <p class="greeting-family cinema-family">— {{hostName}} —</p>
  </div></section>
  ${cinemaSections.countdown}${cinemaSections.details}${cinemaSections.map}${cinemaSections.program}
  <footer class="footer cinema-footer"><div class="container">
    <div class="cinema-bar"></div>
    <p class="cinema-footer-names">{{eventTitle|Bitiruvchilar}}</p>
    <p class="cinema-footer-date">{{eventDateFormatted}}</p>
    <p class="cinema-footer-msg" data-i18n="waitingMsg">Sizni kutib qolamiz!</p>
  </div></footer>
</main>`;

const cinemaJubileeHtml = `
<main class="inv cinema-inv">
  <section class="hero cinema-hero">
    <div class="cinema-grain"></div><div class="cinema-spotlight"></div>
    <div class="hero-inner">
      <div class="cinema-presents" data-i18n="eventLabel">{{eventTypeLabel|Yubiley}}</div>
      <div class="cinema-emoji">🎉</div>
      <h1 class="cinema-title"><span class="cinema-name-big">{{eventTitle|Yubiley tantanasi}}</span></h1>
      {{#if years}}<div class="cinema-badge-ring"><span class="cinema-badge-num">{{years}}</span><span class="cinema-badge-label">YIL</span></div>{{/if}}
      <div class="cinema-tagline">{{eventDateFormatted}}</div>
      <div class="cinema-rating">★ ★ ★ ★ ★</div>
    </div>
    <div class="scroll-cue"><div class="scroll-line"></div></div>
  </section>
  <section class="section greeting-section cinema-section"><div class="container">
    <div class="cinema-bar"></div>
    <h2 class="section-heading cinema-heading">{{guestName|Hurmatli mehmonlar!}}</h2>
    <p class="greeting-text cinema-text">{{message|Sizni yubiley tantanamizga taklif qilamiz!}}</p>
    <p class="greeting-family cinema-family">— {{hostName}} —</p>
  </div></section>
  ${cinemaSections.countdown}${cinemaSections.details}${cinemaSections.map}${cinemaSections.program}
  <footer class="footer cinema-footer"><div class="container">
    <div class="cinema-bar"></div>
    <p class="cinema-footer-names">{{eventTitle|Yubiley}}</p>
    <p class="cinema-footer-date">{{eventDateFormatted}}</p>
    <p class="cinema-footer-msg" data-i18n="waitingMsg">Sizni kutib qolamiz!</p>
  </div></footer>
</main>`;

const cinemaPosterCss = `
:root{--bg:#0d0d0d;--text:#f5f5f5;--accent:#e8c547;--card:rgba(232,197,71,0.05);--border:rgba(232,197,71,0.2)}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--bg);color:var(--text);font-family:'Bebas Neue','Impact',sans-serif;overflow-x:hidden}
.cinema-inv{min-height:100vh}
.cinema-hero{min-height:100vh;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
.cinema-grain{position:absolute;inset:0;opacity:.04;background:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23g)'/%3E%3C/svg%3E")}
.cinema-spotlight{position:absolute;top:-20%;left:50%;transform:translateX(-50%);width:300px;height:400px;background:radial-gradient(ellipse,rgba(232,197,71,0.08),transparent 70%);animation:spot 5s ease-in-out infinite alternate}
@keyframes spot{0%{opacity:.5;transform:translateX(-50%) scale(1)}100%{opacity:1;transform:translateX(-50%) scale(1.2)}}
.cinema-presents{font-size:.8rem;text-transform:uppercase;letter-spacing:8px;color:var(--accent);margin-bottom:1rem;font-family:'Inter',sans-serif;font-weight:300}
.cinema-emoji{font-size:3.5rem;text-align:center;margin-bottom:.5rem}
.cinema-title{text-align:center}
.cinema-name-big{display:block;font-size:clamp(3rem,12vw,6rem);line-height:1;letter-spacing:4px;text-transform:uppercase;color:var(--text)}
.cinema-x{display:block;font-size:1.5rem;color:var(--accent);margin:.5rem 0;font-family:'Inter',sans-serif}
.cinema-badge-ring{display:inline-flex;flex-direction:column;align-items:center;justify-content:center;width:90px;height:90px;border:2px solid var(--accent);margin:1rem auto}
.cinema-badge-num{font-size:2.5rem;color:var(--accent);letter-spacing:2px;line-height:1}
.cinema-badge-label{font-size:.5rem;letter-spacing:4px;color:rgba(232,197,71,0.6);font-family:'Inter',sans-serif}
.cinema-school{text-align:center;color:rgba(232,197,71,0.5);font-size:.85rem;letter-spacing:2px;font-family:'Inter',sans-serif;margin-top:.3rem}
.cinema-tagline{text-align:center;margin-top:1.5rem;font-size:1rem;letter-spacing:5px;text-transform:uppercase;color:var(--accent);font-family:'Inter',sans-serif;font-weight:300}
.cinema-rating{text-align:center;margin-top:.8rem;font-size:.8rem;color:var(--accent);letter-spacing:4px}
.cinema-section{padding:4rem 1rem}.cinema-heading{text-align:center;font-size:1.5rem;letter-spacing:6px;text-transform:uppercase;color:var(--accent);margin-bottom:2rem}
.cinema-bar{width:60px;height:2px;background:var(--accent);margin:0 auto 1.5rem}
.cinema-text,.greeting-text.cinema-text{text-align:center;color:rgba(245,245,245,0.6);line-height:1.8;max-width:500px;margin:0 auto 1rem;font-family:'Inter',sans-serif;font-size:.95rem;font-weight:300}
.cinema-family,.greeting-family.cinema-family{text-align:center;color:var(--accent);font-family:'Inter',sans-serif;font-size:.95rem;font-weight:400;letter-spacing:2px}
.cinema-countdown{display:flex;gap:8px;justify-content:center;align-items:center}
.cinema-cd{text-align:center;padding:14px 18px;background:var(--card);border:1px solid var(--border)}
.cinema-cd .cd-num{font-size:2.5rem;color:var(--accent);letter-spacing:2px}
.cinema-cd .cd-label{font-size:.55rem;text-transform:uppercase;letter-spacing:3px;color:rgba(245,245,245,0.3);margin-top:4px;font-family:'Inter',sans-serif}
.cinema-sep{color:var(--accent);opacity:.3;font-size:1rem;font-family:'Inter',sans-serif}
.cinema-cards{max-width:400px;margin:0 auto;border:1px solid var(--border)}
.cinema-card{display:flex;justify-content:space-between;align-items:center;padding:14px 20px;border-bottom:1px solid var(--border)}
.cinema-card:last-child{border-bottom:none}
.ci-icon{font-size:1.1rem}.ci-label{font-size:.7rem;letter-spacing:3px;color:rgba(245,245,245,0.4);font-family:'Inter',sans-serif}
.ci-value{font-size:1rem;color:var(--accent);letter-spacing:1px}
.cinema-map-btn{display:inline-block;padding:12px 30px;border:1px solid var(--accent);color:var(--accent);text-decoration:none;letter-spacing:3px;text-transform:uppercase;font-size:.8rem;transition:all .3s;font-family:'Inter',sans-serif}
.cinema-map-btn:hover{background:var(--accent);color:var(--bg)}
.cinema-timeline .tl-item{display:flex;gap:16px;margin-bottom:0}
.cinema-timeline .tl-marker{display:flex;flex-direction:column;align-items:center}
.cinema-timeline .tl-dot{width:8px;height:8px;background:var(--accent)}
.cinema-timeline .tl-connector{width:1px;flex:1;background:var(--border)}
.cinema-timeline .tl-card{padding:2px 0 20px;flex:1}
.cinema-timeline .tl-time{font-size:.8rem;color:var(--accent);letter-spacing:2px}
.cinema-timeline .tl-card h4{font-size:.95rem;color:rgba(245,245,245,0.7);font-weight:300;font-family:'Inter',sans-serif}
.cinema-footer{text-align:center;padding:3rem 1rem;border-top:1px solid var(--border)}
.cinema-footer-names{font-size:2rem;letter-spacing:4px;color:var(--accent);margin:.5rem 0}
.cinema-footer-date{color:rgba(245,245,245,0.3);font-size:.75rem;letter-spacing:3px;font-family:'Inter',sans-serif}
.cinema-footer-msg{color:rgba(245,245,245,0.4);font-size:.85rem;margin-top:.5rem;font-family:'Inter',sans-serif;font-weight:300}
.hero-inner{position:relative;z-index:1;text-align:center;padding:2rem}
.container{max-width:600px;margin:0 auto}
.scroll-cue{position:absolute;bottom:2rem;left:50%;transform:translateX(-50%)}
.scroll-line{width:1px;height:40px;background:linear-gradient(180deg,var(--accent),transparent);animation:scrollAnim 2s ease-in-out infinite}
@keyframes scrollAnim{0%{opacity:0;transform:scaleY(0)}50%{opacity:1;transform:scaleY(1)}100%{opacity:0;transform:scaleY(0)}}
section{scroll-snap-align:start}.section.greeting-section{min-height:auto}
@media(max-width:480px){.cinema-name-big{font-size:2.5rem}.cinema-cd{padding:10px 14px}.cinema-cd .cd-num{font-size:1.8rem}.cinema-badge-ring{width:70px;height:70px}.cinema-badge-num{font-size:2rem}}
`;


// ═══════════════════════════════════════════════════════════
// COLOR VARIATIONS — 10 per design
// ═══════════════════════════════════════════════════════════

// Neon design — 10 neon color combos (dark backgrounds)
const neonColors = [
  { key: '01', slug: 'neon-cyan',    name: 'Neon Siyanuv',      desc: 'Neon ko\'k-yashil chiziqlar',    vars: '--accent:#00f0ff;--accent2:#ff00e6;--glow:0 0 20px rgba(0,240,255,0.3)' },
  { key: '02', slug: 'neon-pink',    name: 'Neon Pushti',       desc: 'Neon pushti va sariq',            vars: '--accent:#ff2d95;--accent2:#ffb800;--glow:0 0 20px rgba(255,45,149,0.3)' },
  { key: '03', slug: 'neon-green',   name: 'Neon Yashil',       desc: 'Neon yashil va ko\'k',            vars: '--accent:#39ff14;--accent2:#00d4ff;--glow:0 0 20px rgba(57,255,20,0.3)' },
  { key: '04', slug: 'neon-purple',  name: 'Neon Binafsha',     desc: 'Neon binafsha va pushti',         vars: '--accent:#bf5fff;--accent2:#ff6b9d;--glow:0 0 20px rgba(191,95,255,0.3)' },
  { key: '05', slug: 'neon-orange',  name: 'Neon To\'q sariq',  desc: 'Neon sariq va qizil',             vars: '--accent:#ff6b00;--accent2:#ff0055;--glow:0 0 20px rgba(255,107,0,0.3)' },
  { key: '06', slug: 'neon-yellow',  name: 'Neon Sariq',        desc: 'Neon sariq va yashil',            vars: '--accent:#ffea00;--accent2:#00ff88;--glow:0 0 20px rgba(255,234,0,0.3)' },
  { key: '07', slug: 'neon-red',     name: 'Neon Qizil',        desc: 'Neon qizil va sariq',             vars: '--accent:#ff073a;--accent2:#ffb700;--glow:0 0 20px rgba(255,7,58,0.3)' },
  { key: '08', slug: 'neon-ice',     name: 'Neon Muz',          desc: 'Neon oq-ko\'k muzday',            vars: '--accent:#b0e0e6;--accent2:#87ceeb;--glow:0 0 20px rgba(176,224,230,0.3)' },
  { key: '09', slug: 'neon-gold',    name: 'Neon Oltin',        desc: 'Neon oltin va bronza',            vars: '--accent:#ffd700;--accent2:#cd7f32;--glow:0 0 20px rgba(255,215,0,0.3)' },
  { key: '10', slug: 'neon-mint',    name: 'Neon Yalpiz',       desc: 'Neon yalpiz va lavanda',          vars: '--accent:#00ffab;--accent2:#c77dff;--glow:0 0 20px rgba(0,255,171,0.3)' },
];

// Marble design — 10 elegant accent colors (light backgrounds)
const marbleColors = [
  { key: '01', slug: 'marble-gold',     name: 'Marmara Oltin',      desc: 'Oq marmara va oltin aksentlar',    vars: '--accent:#b8860b;--border:rgba(184,134,11,0.25);--bg:#faf8f5' },
  { key: '02', slug: 'marble-rose',     name: 'Marmara Pushti',     desc: 'Marmara va atirgul pushti',        vars: '--accent:#b76e79;--border:rgba(183,110,121,0.25);--bg:#fdf6f7' },
  { key: '03', slug: 'marble-navy',     name: 'Marmara Ko\'k',      desc: 'Marmara va to\'q ko\'k',          vars: '--accent:#2c3e6b;--border:rgba(44,62,107,0.25);--bg:#f5f7fa' },
  { key: '04', slug: 'marble-emerald',  name: 'Marmara Zumrad',     desc: 'Marmara va zumrad yashil',         vars: '--accent:#2e8b57;--border:rgba(46,139,87,0.25);--bg:#f5faf7' },
  { key: '05', slug: 'marble-plum',     name: 'Marmara Olxo\'ri',   desc: 'Marmara va olxo\'ri rang',         vars: '--accent:#8e4585;--border:rgba(142,69,133,0.25);--bg:#faf5fa' },
  { key: '06', slug: 'marble-copper',   name: 'Marmara Mis',        desc: 'Marmara va mis rangli aksent',     vars: '--accent:#b87333;--border:rgba(184,115,51,0.25);--bg:#faf7f3' },
  { key: '07', slug: 'marble-silver',   name: 'Marmara Kumush',     desc: 'Marmara va kumush aksent',         vars: '--accent:#708090;--border:rgba(112,128,144,0.25);--bg:#f7f8fa' },
  { key: '08', slug: 'marble-burgundy', name: 'Marmara Sharob',     desc: 'Marmara va sharob qizil',          vars: '--accent:#722f37;--border:rgba(114,47,55,0.25);--bg:#faf5f5' },
  { key: '09', slug: 'marble-teal',     name: 'Marmara Moviy',      desc: 'Marmara va moviy aksent',          vars: '--accent:#008080;--border:rgba(0,128,128,0.25);--bg:#f5fafa' },
  { key: '10', slug: 'marble-charcoal', name: 'Marmara Ko\'mir',    desc: 'Qorong\'u marmara va oltin',       vars: '--accent:#c5a258;--border:rgba(197,162,88,0.25);--bg:#1a1a1a;--text:#e8e0d4;--card:#222' },
];

// Boho design — 10 nature color combos (warm backgrounds)
const bohoColors = [
  { key: '01', slug: 'boho-sage',     name: 'Boho O\'t',         desc: 'Yashil o\'t va terrakota',         vars: '--accent:#6b7c3f;--accent2:#c57b57;--bg:#f7f3ee' },
  { key: '02', slug: 'boho-terracota', name: 'Boho Terrakota',   desc: 'Terrakota va zaytun',              vars: '--accent:#c57b57;--accent2:#8b7355;--bg:#faf5ef' },
  { key: '03', slug: 'boho-lavender', name: 'Boho Lavanda',      desc: 'Lavanda va pushti',                vars: '--accent:#9b8ec4;--accent2:#d4829d;--bg:#f8f5fc' },
  { key: '04', slug: 'boho-dusty',    name: 'Boho Changli',      desc: 'Changli pushti va yashil',         vars: '--accent:#c9a9a6;--accent2:#7d9b76;--bg:#fdf5f4' },
  { key: '05', slug: 'boho-ocean',    name: 'Boho Okean',        desc: 'Okean ko\'k va qum',               vars: '--accent:#5c8a8a;--accent2:#c9a96e;--bg:#f3f8f8' },
  { key: '06', slug: 'boho-sunset',   name: 'Boho Quyosh',       desc: 'Quyosh botishi va zangori',        vars: '--accent:#d4845a;--accent2:#e8a87c;--bg:#fdf6f0' },
  { key: '07', slug: 'boho-forest',   name: 'Boho O\'rmon',      desc: 'O\'rmon yashil va jigarrang',      vars: '--accent:#3d5c3a;--accent2:#8b6f4e;--bg:#f4f7f3' },
  { key: '08', slug: 'boho-blush',    name: 'Boho Qizaruv',      desc: 'Qizil pushti va oltin',            vars: '--accent:#d4a0a0;--accent2:#c5a258;--bg:#fdf5f5' },
  { key: '09', slug: 'boho-mustard',  name: 'Boho Gorchitsa',    desc: 'Gorchitsa sariq va yashil',        vars: '--accent:#c9a227;--accent2:#6b7c3f;--bg:#fbf8ee' },
  { key: '10', slug: 'boho-dark',     name: 'Boho Tun',          desc: 'Qorong\'u boho stil',              vars: '--accent:#a89070;--accent2:#d4a574;--bg:#1e1c19;--text:#e0d5c5;--border:rgba(168,144,112,0.3)' },
];

// Cinema design — 10 film color combos (dark backgrounds)
const cinemaColors = [
  { key: '01', slug: 'cinema-gold',     name: 'Kino Oltin',       desc: 'Klassik oltin afisha',            vars: '--accent:#e8c547;--border:rgba(232,197,71,0.2)' },
  { key: '02', slug: 'cinema-red',      name: 'Kino Qizil',      desc: 'Qizil kino gilam stili',         vars: '--accent:#e84040;--border:rgba(232,64,64,0.2)' },
  { key: '03', slug: 'cinema-teal',     name: 'Kino Moviy',      desc: 'Moviy kino dramatik',             vars: '--accent:#4db8a4;--border:rgba(77,184,164,0.2)' },
  { key: '04', slug: 'cinema-silver',   name: 'Kino Kumush',     desc: 'Kumush noir stili',               vars: '--accent:#c0c0c0;--border:rgba(192,192,192,0.2)' },
  { key: '05', slug: 'cinema-amber',    name: 'Kino Qahrabo',    desc: 'Qahrabo rangli vintage',          vars: '--accent:#ffbf00;--border:rgba(255,191,0,0.2)' },
  { key: '06', slug: 'cinema-purple',   name: 'Kino Binafsha',   desc: 'Binafsha sci-fi stili',           vars: '--accent:#a855f7;--border:rgba(168,85,247,0.2)' },
  { key: '07', slug: 'cinema-emerald',  name: 'Kino Zumrad',     desc: 'Zumrad qorong\'u stili',          vars: '--accent:#50c878;--border:rgba(80,200,120,0.2)' },
  { key: '08', slug: 'cinema-coral',    name: 'Kino Marjon',     desc: 'Marjon pushti stili',              vars: '--accent:#ff6f61;--border:rgba(255,111,97,0.2)' },
  { key: '09', slug: 'cinema-ice',      name: 'Kino Muz',        desc: 'Muz ko\'k stili',                 vars: '--accent:#87ceeb;--border:rgba(135,206,235,0.2)' },
  { key: '10', slug: 'cinema-white',    name: 'Kino Oq',         desc: 'Minimalist oq kino stili',        vars: '--accent:#ffffff;--border:rgba(255,255,255,0.15);--text:#f0f0f0' },
];

/**
 * Replace :root{...} vars in a base CSS string with new color vars
 */
function recolorCss(baseCss, newVars) {
  return baseCss.replace(/:root\{[^}]+\}/, (match) => {
    // Parse existing vars
    const existing = {};
    match.replace(/:root\{(.*)\}/, (_, inner) => {
      inner.split(';').forEach(pair => {
        const [k, ...vParts] = pair.split(':');
        if (k && vParts.length) existing[k.trim()] = vParts.join(':').trim();
      });
    });
    // Parse new vars (overrides)
    newVars.split(';').forEach(pair => {
      const [k, ...vParts] = pair.split(':');
      if (k && vParts.length) existing[k.trim()] = vParts.join(':').trim();
    });
    // Rebuild
    const entries = Object.entries(existing).map(([k, v]) => `${k}:${v}`).join(';');
    return `:root{${entries}}`;
  });
}

// Base design definitions
const baseDesigns = [
  {
    baseCss: neonGlowCss,
    colors: neonColors,
    html: { wedding: neonWeddingHtml, birthday: neonBirthdayHtml, graduation: neonGraduationHtml, jubilee: neonJubileeHtml },
  },
  {
    baseCss: elegantMarbleCss,
    colors: marbleColors,
    html: { wedding: marbleWeddingHtml, birthday: marbleBirthdayHtml, graduation: marbleGraduationHtml, jubilee: marbleJubileeHtml },
  },
  {
    baseCss: bohoGardenCss,
    colors: bohoColors,
    html: { wedding: bohoWeddingHtml, birthday: bohoBirthdayHtml, graduation: bohoGraduationHtml, jubilee: bohoJubileeHtml },
  },
  {
    baseCss: cinemaPosterCss,
    colors: cinemaColors,
    html: { wedding: cinemaWeddingHtml, birthday: cinemaBirthdayHtml, graduation: cinemaGraduationHtml, jubilee: cinemaJubileeHtml },
  },
];

// Generate all color variants
const newDesigns = [];
for (const design of baseDesigns) {
  for (const color of design.colors) {
    newDesigns.push({
      key: color.key,
      slug: color.slug,
      name: color.name,
      desc: color.desc,
      css: recolorCss(design.baseCss, color.vars),
      html: design.html,
    });
  }
}

module.exports = { newDesigns };

