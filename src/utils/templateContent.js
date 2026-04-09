/**
 * Premium Invitation Templates — 10 unique wedding themes + birthday
 * All wedding themes share the same HTML, differentiated by CSS color palettes
 */

// ═══════════════════════════════════════════════════════════
// SHARED WEDDING HTML (used by all 10 wedding themes)
// ═══════════════════════════════════════════════════════════
const weddingSharedHtml = `
<main class="inv">

  <!-- ====== HERO ====== -->
  <section class="hero">
    <div class="hero-shapes">
      <div class="shape s1"></div>
      <div class="shape s2"></div>
      <div class="shape s3"></div>
    </div>
    <div class="hero-inner">
      <div class="ornament-top">
        <svg viewBox="0 0 120 20"><path d="M0,10 C20,0 40,20 60,10 C80,0 100,20 120,10" stroke="url(#gg)" fill="none" stroke-width="0.8"/><defs><linearGradient id="gg"><stop offset="0%" stop-color="transparent"/><stop offset="30%" stop-color="var(--accent)"/><stop offset="70%" stop-color="var(--accent)"/><stop offset="100%" stop-color="transparent"/></linearGradient></defs></svg>
      </div>
      <p class="hero-label">{{eventTypeLabel|Nikoh taklifi}}</p>
      <h1 class="hero-names">
        <span class="hero-name">{{brideName|Kelin}}</span>
        <span class="hero-amp">&</span>
        <span class="hero-name">{{groomName|Kuyov}}</span>
      </h1>
      <div class="hero-date-badge">
        <div class="date-line"></div>
        <span class="hero-date">{{eventDateFormatted}}</span>
        <div class="date-line"></div>
      </div>
      <div class="ornament-bot">
        <svg viewBox="0 0 120 20"><path d="M0,10 C20,20 40,0 60,10 C80,20 100,0 120,10" stroke="url(#gg2)" fill="none" stroke-width="0.8"/><defs><linearGradient id="gg2"><stop offset="0%" stop-color="transparent"/><stop offset="30%" stop-color="var(--accent)"/><stop offset="70%" stop-color="var(--accent)"/><stop offset="100%" stop-color="transparent"/></linearGradient></defs></svg>
      </div>
    </div>
    <div class="scroll-cue"><div class="scroll-line"></div></div>
  </section>

  <!-- ====== GREETING ====== -->
  <section class="section greeting-section">
    <div class="container">
      <div class="gold-ornament">✦ ✦ ✦</div>
      <h2 class="section-heading cream-heading">{{guestName|Hurmatli mehmonlar!}}</h2>
      <p class="greeting-text">{{message|Sizni farzandlarimiz nikoh to'yiga tashrif buyurishingizni so'rab qolamiz.}}</p>
      <p class="greeting-family">{{hostName}}</p>
      <div class="greeting-hearts">
        <span class="g-heart">♥</span>
        <span class="g-heart g-heart-big">♥</span>
        <span class="g-heart">♥</span>
      </div>
    </div>
  </section>

  <!-- ====== COUNTDOWN ====== -->
  <section class="section countdown-section">
    <div class="container">
      <h2 class="section-heading light">To'ygacha qolgan vaqt</h2>
      <div class="countdown" id="countdown-timer" data-date="{{eventDate}}" data-time="{{eventTime|18:00}}">
        <div class="cd-block"><div class="cd-num" id="cd-days">00</div><div class="cd-label">Kun</div></div>
        <div class="cd-sep">:</div>
        <div class="cd-block"><div class="cd-num" id="cd-hours">00</div><div class="cd-label">Soat</div></div>
        <div class="cd-sep">:</div>
        <div class="cd-block"><div class="cd-num" id="cd-min">00</div><div class="cd-label">Minut</div></div>
        <div class="cd-sep">:</div>
        <div class="cd-block"><div class="cd-num" id="cd-sec">00</div><div class="cd-label">Sekund</div></div>
      </div>
    </div>
  </section>

  <!-- ====== DETAILS ====== -->
  <section class="section details-section">
    <div class="container">
      <h2 class="section-heading cream-heading">To'y tafsilotlari</h2>
      <div class="cards-row">
        <div class="info-card">
          <div class="ic-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
          <div class="ic-title">Sana</div>
          <div class="ic-value">{{eventDateFormatted}}</div>
        </div>
        <div class="info-card">
          <div class="ic-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
          <div class="ic-title">Vaqt</div>
          <div class="ic-value">{{eventTime|18:00}}</div>
          <div class="ic-sub">Mehmonlarni kutib olish</div>
        </div>
        <div class="info-card">
          <div class="ic-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
          <div class="ic-title">Manzil</div>
          <div class="ic-value">{{location}}</div>
          <div class="ic-sub">{{location}}</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ====== LOCATION / MAP ====== -->
  {{#if locationUrl}}
  <section class="section map-section">
    <div class="container">
      <h2 class="section-heading light">Lokatsiya</h2>
      <div class="map-card">
        <div class="map-venue-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
        <h3 class="map-venue-name">{{location}}</h3>
        <p class="map-venue-addr">{{location}}</p>
        <a href="{{locationUrl}}" target="_blank" rel="noopener" class="map-nav-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
          Xaritada ko'rish
        </a>
      </div>
    </div>
  </section>
  {{/if}}

  <!-- ====== PROGRAM / TIMELINE ====== -->
  {{#if program}}
  <section class="section program-section">
    <div class="container">
      <h2 class="section-heading light">Kechaning dasturi</h2>
      <div class="timeline" id="program-data" data-program="{{program}}">
      </div>
    </div>
  </section>
  {{/if}}

  {{#unless program}}
  <section class="section program-section">
    <div class="container">
      <h2 class="section-heading light">Kechaning dasturi</h2>
      <div class="timeline">
        <div class="tl-item"><div class="tl-marker"><div class="tl-dot"></div><div class="tl-connector"></div></div><div class="tl-card"><div class="tl-time">{{eventTime|18:00}}</div><h4>Mehmonlarni kutib olish</h4></div></div>
        <div class="tl-item"><div class="tl-marker"><div class="tl-dot"></div><div class="tl-connector"></div></div><div class="tl-card"><div class="tl-time">18:30</div><h4>Rasmiy nikoh marosimi</h4></div></div>
        <div class="tl-item"><div class="tl-marker"><div class="tl-dot"></div><div class="tl-connector"></div></div><div class="tl-card"><div class="tl-time">19:00</div><h4>Ziyofat dasturxoni</h4></div></div>
        <div class="tl-item"><div class="tl-marker"><div class="tl-dot"></div></div><div class="tl-card"><div class="tl-time">21:00</div><h4>Musiqa va ko'ngil ochar lahzalar</h4></div></div>
      </div>
    </div>
  </section>
  {{/unless}}

  {{#if dressCode}}
  <section class="section dresscode-section">
    <div class="container center">
      <div class="dresscode-badge">👔 Dress code: {{dressCode}}</div>
    </div>
  </section>
  {{/if}}

  <!-- ====== FOOTER ====== -->
  <footer class="footer">
    <div class="container">
      <div class="footer-names">
        <span class="fn">{{brideName|Kelin}}</span>
        <span class="fa">&</span>
        <span class="fn">{{groomName|Kuyov}}</span>
      </div>
      <div class="footer-date">{{eventDateFormatted}}</div>
      <p class="footer-msg">Sizni kutib qolamiz!</p>
      <div class="footer-hearts">♥ ♥ ♥</div>
    </div>
  </footer>

</main>

<script>
(function(){
  var ct = document.getElementById('countdown-timer');
  if(!ct) return;
  var d = ct.dataset.date, t = ct.dataset.time || '18:00';
  if(!d) return;
  var target = new Date(d + 'T' + t + ':00').getTime();
  function update(){
    var now = Date.now(), diff = target - now;
    if(diff < 0) diff = 0;
    var days = Math.floor(diff / 86400000);
    var hrs = Math.floor((diff % 86400000) / 3600000);
    var mins = Math.floor((diff % 3600000) / 60000);
    var secs = Math.floor((diff % 60000) / 1000);
    var de = document.getElementById('cd-days');
    var he = document.getElementById('cd-hours');
    var me = document.getElementById('cd-min');
    var se = document.getElementById('cd-sec');
    if(de) de.textContent = String(days).padStart(2,'0');
    if(he) he.textContent = String(hrs).padStart(2,'0');
    if(me) me.textContent = String(mins).padStart(2,'0');
    if(se) se.textContent = String(secs).padStart(2,'0');
  }
  update();
  setInterval(update, 1000);
})();
</script>`;

// ═══════════════════════════════════════════════════════════
// BASE CSS — shared structural rules (identical for all themes)
// ═══════════════════════════════════════════════════════════
const baseCss = `
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth;overflow-x:hidden}
body{font-family:var(--ff-sans);background:var(--dark);color:var(--text-light);line-height:1.7;overflow-x:hidden;-webkit-font-smoothing:antialiased;min-height:100vh;display:block}
.container{max-width:860px;margin:0 auto;padding:0 24px}
.center{text-align:center}
.inv{width:100%;max-width:100%}
.invitation-card{width:100%;max-width:100%;margin:0;border-radius:0}

/* ──── HERO ──── */
.hero{position:relative;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;overflow:hidden;background:var(--hero-bg)}
.hero-shapes{position:absolute;inset:0;overflow:hidden;pointer-events:none}
.shape{position:absolute;border-radius:50%;opacity:0.04;filter:blur(80px)}
.s1{width:500px;height:500px;background:var(--accent);top:-150px;left:-100px}
.s2{width:400px;height:400px;background:var(--secondary);bottom:-100px;right:-100px}
.s3{width:300px;height:300px;background:var(--accent);top:50%;left:50%;transform:translate(-50%,-50%)}
.hero-inner{position:relative;z-index:2;padding:40px 20px}
.ornament-top,.ornament-bot{display:flex;justify-content:center;margin:10px 0;opacity:0.7}
.ornament-top svg,.ornament-bot svg{width:140px;height:20px}
.hero-label{font-family:var(--ff-sans);font-size:0.88rem;font-weight:300;letter-spacing:7px;text-transform:uppercase;color:var(--accent);margin-bottom:24px;opacity:0.8}
.hero-names{display:flex;flex-direction:column;align-items:center;gap:2px;margin:10px 0}
.hero-name{font-family:var(--ff-script);font-size:clamp(3.2rem,9vw,6.5rem);font-weight:400;color:var(--white);line-height:1.05;text-shadow:0 0 60px var(--glow)}
.hero-amp{font-family:var(--ff-script);font-size:clamp(1.8rem,4vw,3rem);color:var(--accent);opacity:0.7;line-height:1;margin:4px 0}
.hero-date-badge{display:flex;align-items:center;gap:20px;margin-top:36px}
.date-line{width:50px;height:1px;background:linear-gradient(90deg,transparent,var(--accent),transparent)}
.hero-date{font-family:var(--ff-serif);font-size:1.25rem;letter-spacing:6px;color:var(--accent-bright);font-weight:300}
.scroll-cue{position:absolute;bottom:40px;left:50%;transform:translateX(-50%)}
.scroll-line{width:1px;height:50px;background:linear-gradient(180deg,var(--accent),transparent);animation:scroll-pulse 2s ease-in-out infinite}
@keyframes scroll-pulse{0%,100%{opacity:0.3;transform:scaleY(0.6)}50%{opacity:0.8;transform:scaleY(1)}}

/* ──── SECTIONS ──── */
.section{padding:90px 0;position:relative;z-index:1}
.section-heading{font-family:var(--ff-serif);font-size:clamp(1.9rem,4vw,2.6rem);font-weight:400;text-align:center;letter-spacing:2px;margin-bottom:45px;color:var(--accent-bright)}
.cream-heading{color:var(--secondary)}
.gold-ornament{text-align:center;color:var(--accent);font-size:0.85rem;letter-spacing:12px;margin-bottom:20px;opacity:0.5}

/* ──── GREETING ──── */
.greeting-section{background:var(--greeting-bg);text-align:center}
.greeting-text{font-family:var(--ff-serif);font-size:1.3rem;font-weight:400;line-height:2;color:var(--greeting-text);max-width:580px;margin:0 auto;font-style:italic}
.greeting-family{font-family:var(--ff-serif);font-size:1.2rem;font-weight:600;color:var(--secondary);margin-top:28px;letter-spacing:2px;opacity:0.85}
.greeting-hearts{display:flex;justify-content:center;gap:16px;margin-top:36px}
.g-heart{color:var(--secondary);font-size:1rem;opacity:0.4;animation:hb 2s ease-in-out infinite}
.g-heart-big{font-size:1.5rem;opacity:0.7;animation-delay:0.3s}
@keyframes hb{0%,100%{transform:scale(1)}50%{transform:scale(1.25)}}

/* ──── COUNTDOWN ──── */
.countdown-section{background:var(--countdown-bg);text-align:center;overflow:hidden;position:relative}
.countdown-section::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,var(--glow) 0%,transparent 60%);pointer-events:none;opacity:0.5}
.countdown{display:flex;justify-content:center;align-items:center;gap:12px;flex-wrap:wrap}
.cd-block{display:flex;flex-direction:column;align-items:center;min-width:80px;padding:22px 16px;background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:18px;backdrop-filter:blur(12px);transition:all 0.4s cubic-bezier(.25,.46,.45,.94)}
.cd-block:hover{background:var(--glass-hover);border-color:var(--glass-border-hover);transform:translateY(-4px);box-shadow:0 12px 40px var(--glow)}
.cd-num{font-family:var(--ff-serif);font-size:clamp(2.4rem,5vw,3.2rem);font-weight:300;color:var(--accent-bright);line-height:1}
.cd-label{font-size:0.8rem;letter-spacing:2px;text-transform:uppercase;color:rgba(232,226,214,0.4);margin-top:10px;font-weight:300}
.cd-sep{font-family:var(--ff-serif);font-size:2.2rem;color:var(--accent);opacity:0.3;padding-bottom:20px}

/* ──── DETAILS ──── */
.details-section{background:var(--details-bg)}
.cards-row{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.info-card{background:var(--card-bg);border:1px solid var(--card-border);border-radius:20px;padding:36px 20px;text-align:center;position:relative;overflow:hidden;transition:box-shadow 0.4s ease,transform 0.4s ease}
.info-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,var(--accent),transparent);opacity:0;transition:opacity 0.4s ease}
.info-card:hover{box-shadow:0 12px 40px rgba(0,0,0,0.08);transform:translateY(-4px)}
.info-card:hover::before{opacity:1}
.ic-icon{width:44px;height:44px;margin:0 auto 18px;color:var(--accent)}
.ic-icon svg{width:100%;height:100%}
.ic-title{font-family:var(--ff-serif);font-size:1rem;font-weight:600;text-transform:uppercase;letter-spacing:3px;color:var(--secondary);margin-bottom:10px}
.ic-value{font-family:var(--ff-serif);font-size:1.3rem;font-weight:600;color:var(--card-text);margin-bottom:4px}
.ic-sub{font-size:0.9rem;color:var(--text-dim);font-weight:300;letter-spacing:1px}

/* ──── MAP / LOCATION ──── */
.map-section{background:var(--countdown-bg);overflow:hidden}
.map-card{background:rgba(11,13,23,0.9);backdrop-filter:blur(20px);padding:50px 30px;border-radius:20px;border:1px solid var(--glass-border);text-align:center;box-shadow:0 12px 40px rgba(0,0,0,0.3);max-width:520px;margin:0 auto}
.map-venue-icon{width:40px;height:40px;color:var(--accent);margin:0 auto 16px}
.map-venue-icon svg{width:100%;height:100%}
.map-venue-name{font-family:var(--ff-serif);font-size:1.65rem;font-weight:500;color:var(--accent-bright);margin-bottom:8px}
.map-venue-addr{font-size:1rem;color:rgba(232,226,214,0.5);font-weight:300;margin-bottom:20px}
.map-nav-btn{display:inline-flex;align-items:center;gap:10px;padding:13px 30px;background:var(--btn-bg);border-radius:50px;color:var(--btn-text);font-family:var(--ff-sans);font-size:0.9rem;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;transition:all 0.4s cubic-bezier(.25,.46,.45,.94);text-decoration:none}
.map-nav-btn:hover{transform:translateY(-2px);box-shadow:0 8px 28px var(--glow)}

/* ──── PROGRAM / TIMELINE ──── */
.program-section{background:var(--program-bg)}
.timeline{max-width:560px;margin:0 auto;display:flex;flex-direction:column;gap:0}
.tl-item{display:flex;align-items:stretch;gap:20px}
.tl-marker{display:flex;flex-direction:column;align-items:center;width:24px;flex-shrink:0;padding-top:22px}
.tl-dot{width:14px;height:14px;background:var(--accent);border-radius:50%;border:3px solid var(--dark-2);box-shadow:0 0 0 2px var(--accent),0 0 16px var(--glow);flex-shrink:0;position:relative;z-index:2}
.tl-connector{width:2px;flex:1;background:linear-gradient(180deg,var(--accent) 0%,rgba(201,168,76,0.15) 100%);margin-top:4px}
.tl-item:last-child .tl-connector{display:none}
.tl-card{flex:1;background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:16px;padding:20px 24px;margin-bottom:16px;backdrop-filter:blur(12px);transition:all 0.4s cubic-bezier(.25,.46,.45,.94);position:relative;overflow:hidden}
.tl-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--accent),transparent);opacity:0;transition:opacity 0.4s ease}
.tl-card:hover{background:var(--glass-hover);border-color:var(--glass-border-hover);box-shadow:0 8px 32px var(--glow);transform:translateX(4px)}
.tl-card:hover::before{opacity:1}
.tl-time{font-family:var(--ff-serif);font-size:1.45rem;font-weight:600;color:var(--accent-bright);margin-bottom:8px;letter-spacing:2px}
.tl-card h4{font-family:var(--ff-serif);font-size:1.2rem;font-weight:500;color:var(--text-light);line-height:1.5}

/* ──── DRESS CODE ──── */
.dresscode-section{background:var(--dark);padding:40px 0}
.dresscode-badge{display:inline-block;padding:12px 28px;border:1px solid var(--glass-border);border-radius:50px;font-family:var(--ff-serif);font-size:1.1rem;color:var(--accent-bright);letter-spacing:2px;background:var(--glass-bg)}

/* ──── FOOTER ──── */
.footer{background:var(--dark);padding:60px 0 40px;text-align:center;position:relative}
.footer::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--accent),transparent);opacity:0.2}
.footer-names{display:flex;justify-content:center;align-items:center;gap:14px;margin-bottom:12px}
.fn{font-family:var(--ff-script);font-size:2.2rem;color:var(--accent-bright)}
.fa{font-family:var(--ff-script);font-size:1.5rem;color:var(--accent);opacity:0.5}
.footer-date{font-family:var(--ff-serif);font-size:1.05rem;letter-spacing:5px;color:rgba(232,226,214,0.35);margin-bottom:18px;font-weight:300}
.footer-msg{font-family:var(--ff-serif);font-size:1.15rem;color:rgba(232,226,214,0.5);font-style:italic;margin-bottom:12px}
.footer-hearts{color:var(--secondary);font-size:0.95rem;opacity:0.5;letter-spacing:8px}

/* ──── RESPONSIVE ──── */
@media(max-width:768px){
  .cards-row{grid-template-columns:1fr}
  .section{padding:70px 0}
  .cd-block{min-width:65px;padding:18px 12px}
  .cd-sep{font-size:1.5rem}
  .timeline{max-width:100%}
  .tl-card{padding:16px 18px}
  .tl-marker{width:20px}
  .tl-dot{width:12px;height:12px}
}
@media(max-width:480px){
  .hero-label{font-size:0.6rem;letter-spacing:5px}
  .cd-num{font-size:2rem}
}
`;

// ═══════════════════════════════════════════════════════════
// 10 WEDDING CSS THEMES — each defines unique CSS custom properties
// ═══════════════════════════════════════════════════════════

// 1. Klassik Qorong'u Oltin — Classic Dark Gold
const theme01_DarkGold = `
:root {
  --accent: #c9a84c; --accent-bright: #e8d07e; --accent-dim: #9e7e2e;
  --secondary: #6b1d3a; --secondary-deep: #3e0f22;
  --dark: #0b0d17; --dark-2: #12152a; --dark-3: #1a1e38;
  --white: #ffffff; --cream: #faf5eb;
  --text-light: #e8e2d6; --text-dim: #8c8474;
  --glow: rgba(201,168,76,0.1);
  --ff-script: 'Great Vibes', cursive;
  --ff-serif: 'Cormorant Garamond', 'Georgia', serif;
  --ff-sans: 'Montserrat', 'Helvetica Neue', sans-serif;
  --hero-bg: radial-gradient(ellipse at 50% 30%,rgba(107,29,58,0.2) 0%,transparent 60%),radial-gradient(ellipse at 50% 80%,rgba(201,168,76,0.05) 0%,transparent 50%),#0b0d17;
  --greeting-bg: linear-gradient(180deg,#0b0d17 0%,#faf5eb 30%,#faf5eb 70%,#0b0d17 100%);
  --greeting-text: #3a3228;
  --countdown-bg: linear-gradient(135deg,#12152a 0%,#3e0f22 50%,#1a1e38 100%);
  --details-bg: linear-gradient(180deg,#0b0d17 0%,#faf5eb 30%,#faf5eb 70%,#0b0d17 100%);
  --program-bg: linear-gradient(135deg,#12152a,#1a1e38);
  --glass-bg: rgba(255,255,255,0.03); --glass-border: rgba(201,168,76,0.15);
  --glass-hover: rgba(201,168,76,0.08); --glass-border-hover: rgba(201,168,76,0.35);
  --card-bg: #ffffff; --card-border: rgba(201,168,76,0.12); --card-text: #2a2520;
  --btn-bg: linear-gradient(135deg,#c9a84c,#9e7e2e); --btn-text: #0b0d17;
}
`;

// 2. Romantik Pushti — Romantic Blush Pink
const theme02_BlushPink = `
:root {
  --accent: #d4858e; --accent-bright: #f0b3ba; --accent-dim: #b5636d;
  --secondary: #8b3a5e; --secondary-deep: #4a1a33;
  --dark: #1a0e14; --dark-2: #2a1520; --dark-3: #321a28;
  --white: #ffffff; --cream: #fdf2f4;
  --text-light: #f0e0e4; --text-dim: #9c8088;
  --glow: rgba(212,133,142,0.1);
  --ff-script: 'Great Vibes', cursive;
  --ff-serif: 'Cormorant Garamond', 'Georgia', serif;
  --ff-sans: 'Montserrat', 'Helvetica Neue', sans-serif;
  --hero-bg: radial-gradient(ellipse at 50% 30%,rgba(139,58,94,0.2) 0%,transparent 60%),radial-gradient(ellipse at 50% 80%,rgba(212,133,142,0.06) 0%,transparent 50%),#1a0e14;
  --greeting-bg: linear-gradient(180deg,#1a0e14 0%,#fdf2f4 30%,#fdf2f4 70%,#1a0e14 100%);
  --greeting-text: #3d2830;
  --countdown-bg: linear-gradient(135deg,#2a1520 0%,#4a1a33 50%,#321a28 100%);
  --details-bg: linear-gradient(180deg,#1a0e14 0%,#fdf2f4 30%,#fdf2f4 70%,#1a0e14 100%);
  --program-bg: linear-gradient(135deg,#2a1520,#321a28);
  --glass-bg: rgba(255,255,255,0.03); --glass-border: rgba(212,133,142,0.18);
  --glass-hover: rgba(212,133,142,0.1); --glass-border-hover: rgba(212,133,142,0.4);
  --card-bg: #ffffff; --card-border: rgba(212,133,142,0.15); --card-text: #3d2830;
  --btn-bg: linear-gradient(135deg,#d4858e,#b5636d); --btn-text: #ffffff;
}
`;

// 3. Minimalist Oq — Minimalist White & Charcoal
const theme03_MinimalistWhite = `
:root {
  --accent: #2c2c2c; --accent-bright: #444444; --accent-dim: #1a1a1a;
  --secondary: #888888; --secondary-deep: #444444;
  --dark: #fafafa; --dark-2: #f0f0f0; --dark-3: #e8e8e8;
  --white: #ffffff; --cream: #f5f5f0;
  --text-light: #333333; --text-dim: #999999;
  --glow: rgba(0,0,0,0.05);
  --ff-script: 'Great Vibes', cursive;
  --ff-serif: 'Cormorant Garamond', 'Georgia', serif;
  --ff-sans: 'Montserrat', 'Helvetica Neue', sans-serif;
  --hero-bg: linear-gradient(180deg,#fafafa 0%,#f0f0f0 100%);
  --greeting-bg: linear-gradient(180deg,#fafafa 0%,#f5f5f0 30%,#f5f5f0 70%,#fafafa 100%);
  --greeting-text: #333333;
  --countdown-bg: linear-gradient(135deg,#1a1a1a 0%,#2c2c2c 50%,#1a1a1a 100%);
  --details-bg: linear-gradient(180deg,#fafafa 0%,#f5f5f0 30%,#f5f5f0 70%,#fafafa 100%);
  --program-bg: linear-gradient(135deg,#1a1a1a,#2c2c2c);
  --glass-bg: rgba(255,255,255,0.06); --glass-border: rgba(255,255,255,0.12);
  --glass-hover: rgba(255,255,255,0.12); --glass-border-hover: rgba(255,255,255,0.25);
  --card-bg: #ffffff; --card-border: rgba(0,0,0,0.08); --card-text: #2a2a2a;
  --btn-bg: linear-gradient(135deg,#2c2c2c,#1a1a1a); --btn-text: #ffffff;
}
.hero{color:#1a1a1a}
.hero-name{color:#1a1a1a;text-shadow:none}
.scroll-line{background:linear-gradient(180deg,#2c2c2c,transparent)}
.countdown-section .cd-label,.countdown-section .section-heading,.program-section .section-heading,.program-section .tl-card h4,.map-section .section-heading{color:rgba(255,255,255,0.7)}
.countdown-section .cd-label{color:rgba(255,255,255,0.4)}
.countdown-section .cd-num{color:#ffffff}
.countdown-section .section-heading{color:#ffffff}
.program-section .tl-card h4{color:rgba(255,255,255,0.85)}
.program-section .section-heading{color:#ffffff}
.map-section .section-heading{color:#ffffff}
.footer{background:#1a1a1a}
.footer-date{color:rgba(255,255,255,0.35)}
.footer-msg{color:rgba(255,255,255,0.5)}
.fn{color:#ffffff}
.fa{color:rgba(255,255,255,0.5)}
.footer-hearts{color:rgba(255,255,255,0.3)}
`;

// 4. Qirollik Binafsha — Royal Purple & Silver
const theme04_RoyalPurple = `
:root {
  --accent: #9b7ec8; --accent-bright: #c4a8e8; --accent-dim: #7a5aaa;
  --secondary: #4a2d7a; --secondary-deep: #2a1650;
  --dark: #0e0b18; --dark-2: #17122a; --dark-3: #1e1835;
  --white: #ffffff; --cream: #f5f0fa;
  --text-light: #ddd4e8; --text-dim: #8a7d9a;
  --glow: rgba(155,126,200,0.1);
  --ff-script: 'Great Vibes', cursive;
  --ff-serif: 'Cormorant Garamond', 'Georgia', serif;
  --ff-sans: 'Montserrat', 'Helvetica Neue', sans-serif;
  --hero-bg: radial-gradient(ellipse at 50% 30%,rgba(74,45,122,0.25) 0%,transparent 60%),radial-gradient(ellipse at 50% 80%,rgba(155,126,200,0.06) 0%,transparent 50%),#0e0b18;
  --greeting-bg: linear-gradient(180deg,#0e0b18 0%,#f5f0fa 30%,#f5f0fa 70%,#0e0b18 100%);
  --greeting-text: #3a2d50;
  --countdown-bg: linear-gradient(135deg,#17122a 0%,#2a1650 50%,#1e1835 100%);
  --details-bg: linear-gradient(180deg,#0e0b18 0%,#f5f0fa 30%,#f5f0fa 70%,#0e0b18 100%);
  --program-bg: linear-gradient(135deg,#17122a,#1e1835);
  --glass-bg: rgba(255,255,255,0.03); --glass-border: rgba(155,126,200,0.18);
  --glass-hover: rgba(155,126,200,0.1); --glass-border-hover: rgba(155,126,200,0.4);
  --card-bg: #ffffff; --card-border: rgba(155,126,200,0.12); --card-text: #2a2530;
  --btn-bg: linear-gradient(135deg,#9b7ec8,#7a5aaa); --btn-text: #ffffff;
}
`;

// 5. Tabiat Yashil — Nature Green & Forest
const theme05_NatureGreen = `
:root {
  --accent: #6b9e78; --accent-bright: #96c8a4; --accent-dim: #4a7a58;
  --secondary: #2d5e3e; --secondary-deep: #1a3a28;
  --dark: #0a1410; --dark-2: #11201a; --dark-3: #172a20;
  --white: #ffffff; --cream: #f0f7f2;
  --text-light: #d4e8da; --text-dim: #7a9a82;
  --glow: rgba(107,158,120,0.1);
  --ff-script: 'Great Vibes', cursive;
  --ff-serif: 'Cormorant Garamond', 'Georgia', serif;
  --ff-sans: 'Montserrat', 'Helvetica Neue', sans-serif;
  --hero-bg: radial-gradient(ellipse at 50% 30%,rgba(45,94,62,0.2) 0%,transparent 60%),radial-gradient(ellipse at 50% 80%,rgba(107,158,120,0.06) 0%,transparent 50%),#0a1410;
  --greeting-bg: linear-gradient(180deg,#0a1410 0%,#f0f7f2 30%,#f0f7f2 70%,#0a1410 100%);
  --greeting-text: #2a3d30;
  --countdown-bg: linear-gradient(135deg,#11201a 0%,#1a3a28 50%,#172a20 100%);
  --details-bg: linear-gradient(180deg,#0a1410 0%,#f0f7f2 30%,#f0f7f2 70%,#0a1410 100%);
  --program-bg: linear-gradient(135deg,#11201a,#172a20);
  --glass-bg: rgba(255,255,255,0.03); --glass-border: rgba(107,158,120,0.18);
  --glass-hover: rgba(107,158,120,0.1); --glass-border-hover: rgba(107,158,120,0.4);
  --card-bg: #ffffff; --card-border: rgba(107,158,120,0.12); --card-text: #2a3020;
  --btn-bg: linear-gradient(135deg,#6b9e78,#4a7a58); --btn-text: #ffffff;
}
`;

// 6. Sharqona Zar — Oriental Deep Red & Gold
const theme06_OrientalRed = `
:root {
  --accent: #d4a24c; --accent-bright: #f0c878; --accent-dim: #b08030;
  --secondary: #8c1a2a; --secondary-deep: #500e18;
  --dark: #120808; --dark-2: #1e0e0e; --dark-3: #2a1414;
  --white: #ffffff; --cream: #faf2e8;
  --text-light: #f0dcc8; --text-dim: #9a8474;
  --glow: rgba(212,162,76,0.1);
  --ff-script: 'Great Vibes', cursive;
  --ff-serif: 'Cormorant Garamond', 'Georgia', serif;
  --ff-sans: 'Montserrat', 'Helvetica Neue', sans-serif;
  --hero-bg: radial-gradient(ellipse at 50% 30%,rgba(140,26,42,0.25) 0%,transparent 60%),radial-gradient(ellipse at 50% 80%,rgba(212,162,76,0.06) 0%,transparent 50%),#120808;
  --greeting-bg: linear-gradient(180deg,#120808 0%,#faf2e8 30%,#faf2e8 70%,#120808 100%);
  --greeting-text: #3a2820;
  --countdown-bg: linear-gradient(135deg,#1e0e0e 0%,#500e18 50%,#2a1414 100%);
  --details-bg: linear-gradient(180deg,#120808 0%,#faf2e8 30%,#faf2e8 70%,#120808 100%);
  --program-bg: linear-gradient(135deg,#1e0e0e,#2a1414);
  --glass-bg: rgba(255,255,255,0.03); --glass-border: rgba(212,162,76,0.18);
  --glass-hover: rgba(212,162,76,0.1); --glass-border-hover: rgba(212,162,76,0.4);
  --card-bg: #ffffff; --card-border: rgba(212,162,76,0.12); --card-text: #2a2018;
  --btn-bg: linear-gradient(135deg,#d4a24c,#b08030); --btn-text: #120808;
}
`;

// 7. Zamonaviy Qora — Modern Black & Neon
const theme07_ModernBlack = `
:root {
  --accent: #e8e8e8; --accent-bright: #ffffff; --accent-dim: #b0b0b0;
  --secondary: #666666; --secondary-deep: #333333;
  --dark: #000000; --dark-2: #0a0a0a; --dark-3: #111111;
  --white: #ffffff; --cream: #f8f8f8;
  --text-light: #dedddb; --text-dim: #777777;
  --glow: rgba(255,255,255,0.06);
  --ff-script: 'Great Vibes', cursive;
  --ff-serif: 'Cormorant Garamond', 'Georgia', serif;
  --ff-sans: 'Montserrat', 'Helvetica Neue', sans-serif;
  --hero-bg: radial-gradient(ellipse at 50% 30%,rgba(60,60,60,0.2) 0%,transparent 60%),#000000;
  --greeting-bg: linear-gradient(180deg,#000000 0%,#f8f8f8 30%,#f8f8f8 70%,#000000 100%);
  --greeting-text: #1a1a1a;
  --countdown-bg: linear-gradient(135deg,#0a0a0a 0%,#1a1a1a 50%,#111111 100%);
  --details-bg: linear-gradient(180deg,#000000 0%,#f8f8f8 30%,#f8f8f8 70%,#000000 100%);
  --program-bg: linear-gradient(135deg,#0a0a0a,#111111);
  --glass-bg: rgba(255,255,255,0.04); --glass-border: rgba(255,255,255,0.1);
  --glass-hover: rgba(255,255,255,0.08); --glass-border-hover: rgba(255,255,255,0.25);
  --card-bg: #ffffff; --card-border: rgba(0,0,0,0.06); --card-text: #111111;
  --btn-bg: linear-gradient(135deg,#ffffff,#cccccc); --btn-text: #000000;
}
`;

// 8. Vintage Sepia — Warm Retro Tones
const theme08_VintageSepia = `
:root {
  --accent: #c8a06a; --accent-bright: #e0c898; --accent-dim: #a07840;
  --secondary: #6e4a2a; --secondary-deep: #3a2510;
  --dark: #1a1510; --dark-2: #252018; --dark-3: #302a20;
  --white: #ffffff; --cream: #f8f0e0;
  --text-light: #e8d8c0; --text-dim: #998870;
  --glow: rgba(200,160,106,0.1);
  --ff-script: 'Great Vibes', cursive;
  --ff-serif: 'Cormorant Garamond', 'Georgia', serif;
  --ff-sans: 'Montserrat', 'Helvetica Neue', sans-serif;
  --hero-bg: radial-gradient(ellipse at 50% 30%,rgba(110,74,42,0.2) 0%,transparent 60%),radial-gradient(ellipse at 50% 80%,rgba(200,160,106,0.05) 0%,transparent 50%),#1a1510;
  --greeting-bg: linear-gradient(180deg,#1a1510 0%,#f8f0e0 30%,#f8f0e0 70%,#1a1510 100%);
  --greeting-text: #3a3020;
  --countdown-bg: linear-gradient(135deg,#252018 0%,#3a2510 50%,#302a20 100%);
  --details-bg: linear-gradient(180deg,#1a1510 0%,#f8f0e0 30%,#f8f0e0 70%,#1a1510 100%);
  --program-bg: linear-gradient(135deg,#252018,#302a20);
  --glass-bg: rgba(255,255,255,0.03); --glass-border: rgba(200,160,106,0.18);
  --glass-hover: rgba(200,160,106,0.1); --glass-border-hover: rgba(200,160,106,0.4);
  --card-bg: #ffffff; --card-border: rgba(200,160,106,0.12); --card-text: #3a3020;
  --btn-bg: linear-gradient(135deg,#c8a06a,#a07840); --btn-text: #1a1510;
}
`;

// 9. Okean Ko'k — Ocean Blue & Teal
const theme09_OceanBlue = `
:root {
  --accent: #4db8c7; --accent-bright: #7ed0dc; --accent-dim: #2a8e9e;
  --secondary: #1a5e72; --secondary-deep: #0d3a48;
  --dark: #080e12; --dark-2: #0e1820; --dark-3: #142028;
  --white: #ffffff; --cream: #eef7f9;
  --text-light: #c8e4ea; --text-dim: #6a9aa4;
  --glow: rgba(77,184,199,0.1);
  --ff-script: 'Great Vibes', cursive;
  --ff-serif: 'Cormorant Garamond', 'Georgia', serif;
  --ff-sans: 'Montserrat', 'Helvetica Neue', sans-serif;
  --hero-bg: radial-gradient(ellipse at 50% 30%,rgba(26,94,114,0.25) 0%,transparent 60%),radial-gradient(ellipse at 50% 80%,rgba(77,184,199,0.06) 0%,transparent 50%),#080e12;
  --greeting-bg: linear-gradient(180deg,#080e12 0%,#eef7f9 30%,#eef7f9 70%,#080e12 100%);
  --greeting-text: #1a3a42;
  --countdown-bg: linear-gradient(135deg,#0e1820 0%,#0d3a48 50%,#142028 100%);
  --details-bg: linear-gradient(180deg,#080e12 0%,#eef7f9 30%,#eef7f9 70%,#080e12 100%);
  --program-bg: linear-gradient(135deg,#0e1820,#142028);
  --glass-bg: rgba(255,255,255,0.03); --glass-border: rgba(77,184,199,0.18);
  --glass-hover: rgba(77,184,199,0.1); --glass-border-hover: rgba(77,184,199,0.4);
  --card-bg: #ffffff; --card-border: rgba(77,184,199,0.12); --card-text: #1a3040;
  --btn-bg: linear-gradient(135deg,#4db8c7,#2a8e9e); --btn-text: #ffffff;
}
`;

// 10. Quyosh Oltin — Sunset Warm Amber
const theme10_SunsetAmber = `
:root {
  --accent: #e89830; --accent-bright: #f0b858; --accent-dim: #c07820;
  --secondary: #9a3a10; --secondary-deep: #5a2008;
  --dark: #140c06; --dark-2: #201408; --dark-3: #2a1a10;
  --white: #ffffff; --cream: #fdf5ea;
  --text-light: #f0dcc0; --text-dim: #a08868;
  --glow: rgba(232,152,48,0.1);
  --ff-script: 'Great Vibes', cursive;
  --ff-serif: 'Cormorant Garamond', 'Georgia', serif;
  --ff-sans: 'Montserrat', 'Helvetica Neue', sans-serif;
  --hero-bg: radial-gradient(ellipse at 50% 30%,rgba(154,58,16,0.2) 0%,transparent 60%),radial-gradient(ellipse at 50% 80%,rgba(232,152,48,0.06) 0%,transparent 50%),#140c06;
  --greeting-bg: linear-gradient(180deg,#140c06 0%,#fdf5ea 30%,#fdf5ea 70%,#140c06 100%);
  --greeting-text: #3a2a18;
  --countdown-bg: linear-gradient(135deg,#201408 0%,#5a2008 50%,#2a1a10 100%);
  --details-bg: linear-gradient(180deg,#140c06 0%,#fdf5ea 30%,#fdf5ea 70%,#140c06 100%);
  --program-bg: linear-gradient(135deg,#201408,#2a1a10);
  --glass-bg: rgba(255,255,255,0.03); --glass-border: rgba(232,152,48,0.18);
  --glass-hover: rgba(232,152,48,0.1); --glass-border-hover: rgba(232,152,48,0.4);
  --card-bg: #ffffff; --card-border: rgba(232,152,48,0.12); --card-text: #2a2018;
  --btn-bg: linear-gradient(135deg,#e89830,#c07820); --btn-text: #140c06;
}
`;

// ═══════════════════════════════════════════════════════════
// EXPORTS — each wedding theme gets shared HTML + unique CSS
// ═══════════════════════════════════════════════════════════

// Wedding HTML (shared for all)
exports.weddingPremiumHtml = weddingSharedHtml;

// Wedding CSS themes (each = theme variables + base structural CSS)
exports.weddingTheme01Css = theme01_DarkGold + baseCss;
exports.weddingTheme02Css = theme02_BlushPink + baseCss;
exports.weddingTheme03Css = theme03_MinimalistWhite + baseCss;
exports.weddingTheme04Css = theme04_RoyalPurple + baseCss;
exports.weddingTheme05Css = theme05_NatureGreen + baseCss;
exports.weddingTheme06Css = theme06_OrientalRed + baseCss;
exports.weddingTheme07Css = theme07_ModernBlack + baseCss;
exports.weddingTheme08Css = theme08_VintageSepia + baseCss;
exports.weddingTheme09Css = theme09_OceanBlue + baseCss;
exports.weddingTheme10Css = theme10_SunsetAmber + baseCss;

// Backward compat alias
exports.weddingPremiumCss = exports.weddingTheme01Css;

// ═══════════════════════════════════════════════════════════
// BIRTHDAY — Premium Tug'ilgan Kun (orange theme)
// ═══════════════════════════════════════════════════════════
exports.birthdayPremiumHtml = `
<main class="inv">

  <section class="hero bd-hero">
    <div class="hero-shapes">
      <div class="shape s1"></div>
      <div class="shape s2"></div>
    </div>
    <div class="hero-inner">
      <div class="bd-emoji">🎂</div>
      <p class="hero-label">{{eventTypeLabel|Tug'ilgan kun}}</p>
      <h1 class="bd-title">{{eventTitle|Tug'ilgan kun bayrami}}</h1>
      {{#if age}}
      <div class="bd-age-badge">
        <span class="bd-age-num">{{age}}</span>
        <span class="bd-age-text">yosh</span>
      </div>
      {{/if}}
      <div class="hero-date-badge">
        <div class="date-line"></div>
        <span class="hero-date">{{eventDateFormatted}}</span>
        <div class="date-line"></div>
      </div>
    </div>
  </section>

  <section class="section greeting-section">
    <div class="container">
      <div class="gold-ornament">✦ ✦ ✦</div>
      <h2 class="section-heading cream-heading">{{guestName|Hurmatli mehmonlar!}}</h2>
      <p class="greeting-text">{{message|Sizni bayramimizga taklif qilamiz. Birga shodlanaylik!}}</p>
      <p class="greeting-family">{{hostName}}</p>
    </div>
  </section>

  <section class="section countdown-section">
    <div class="container">
      <h2 class="section-heading light">Bayramgacha qolgan vaqt</h2>
      <div class="countdown" id="countdown-timer" data-date="{{eventDate}}" data-time="{{eventTime|18:00}}">
        <div class="cd-block"><div class="cd-num" id="cd-days">00</div><div class="cd-label">Kun</div></div>
        <div class="cd-sep">:</div>
        <div class="cd-block"><div class="cd-num" id="cd-hours">00</div><div class="cd-label">Soat</div></div>
        <div class="cd-sep">:</div>
        <div class="cd-block"><div class="cd-num" id="cd-min">00</div><div class="cd-label">Minut</div></div>
        <div class="cd-sep">:</div>
        <div class="cd-block"><div class="cd-num" id="cd-sec">00</div><div class="cd-label">Sekund</div></div>
      </div>
    </div>
  </section>

  <section class="section details-section">
    <div class="container">
      <h2 class="section-heading cream-heading">Tafsilotlar</h2>
      <div class="cards-row">
        <div class="info-card"><div class="ic-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div><div class="ic-title">Sana</div><div class="ic-value">{{eventDateFormatted}}</div></div>
        <div class="info-card"><div class="ic-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div><div class="ic-title">Vaqt</div><div class="ic-value">{{eventTime|18:00}}</div></div>
        <div class="info-card"><div class="ic-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div><div class="ic-title">Manzil</div><div class="ic-value">{{location}}</div></div>
      </div>
    </div>
  </section>

  {{#if locationUrl}}
  <section class="section map-section">
    <div class="container">
      <div class="map-card">
        <div class="map-venue-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
        <h3 class="map-venue-name">{{location}}</h3>
        <a href="{{locationUrl}}" target="_blank" rel="noopener" class="map-nav-btn">Xaritada ko'rish</a>
      </div>
    </div>
  </section>
  {{/if}}

  {{#if theme}}
  <section class="section dresscode-section">
    <div class="container center"><div class="dresscode-badge">🎨 Mavzu: {{theme}}</div></div>
  </section>
  {{/if}}

  <footer class="footer">
    <div class="container">
      <div class="footer-names"><span class="fn bd-fn">{{hostName}}</span></div>
      <div class="footer-date">{{eventDateFormatted}}</div>
      <p class="footer-msg">Sizni kutib qolamiz! 🎈</p>
    </div>
  </footer>

</main>

<script>
(function(){var ct=document.getElementById('countdown-timer');if(!ct)return;var d=ct.dataset.date,t=ct.dataset.time||'18:00';if(!d)return;var target=new Date(d+'T'+t+':00').getTime();function u(){var n=Date.now(),diff=target-n;if(diff<0)diff=0;var de=document.getElementById('cd-days'),he=document.getElementById('cd-hours'),me=document.getElementById('cd-min'),se=document.getElementById('cd-sec');if(de)de.textContent=String(Math.floor(diff/86400000)).padStart(2,'0');if(he)he.textContent=String(Math.floor((diff%86400000)/3600000)).padStart(2,'0');if(me)me.textContent=String(Math.floor((diff%3600000)/60000)).padStart(2,'0');if(se)se.textContent=String(Math.floor((diff%60000)/1000)).padStart(2,'0')}u();setInterval(u,1000)})();
</script>`;

// ═══════════════════════════════════════════════════════════
// EXTRA CSS — event-type-specific class additions
// ═══════════════════════════════════════════════════════════
const bdExtraCss = `
.bd-emoji{font-size:4rem;margin-bottom:16px}
.bd-title{font-family:var(--ff-serif);font-size:clamp(2.4rem,7vw,4.5rem);font-weight:400;color:var(--white);line-height:1.15}
.bd-age-badge{margin:24px auto;display:flex;flex-direction:column;align-items:center;justify-content:center;width:120px;height:120px;border-radius:50%;background:rgba(var(--accent-rgb,251,146,60),0.08);border:2px solid rgba(var(--accent-rgb,251,146,60),0.3)}
.bd-age-num{font-family:var(--ff-serif);font-size:3.5rem;font-weight:300;color:var(--accent-bright);line-height:1}
.bd-age-text{font-size:0.75rem;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.4)}
.bd-fn{font-family:var(--ff-serif)}
`;

const gradExtraCss = `
.grad-emoji{font-size:4rem;margin-bottom:16px}
.grad-title{font-family:var(--ff-serif);font-size:clamp(2.4rem,7vw,4.5rem);font-weight:400;color:var(--white);line-height:1.15}
.grad-year-badge{margin:24px auto;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px 32px;border-radius:16px;background:var(--glass-bg);border:1px solid var(--glass-border)}
.grad-year-num{font-family:var(--ff-serif);font-size:3rem;font-weight:300;color:var(--accent-bright);line-height:1}
.grad-year-text{font-size:0.75rem;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.4);margin-top:4px}
.grad-fn{font-family:var(--ff-serif)}
`;

const jubExtraCss = `
.jub-emoji{font-size:4rem;margin-bottom:16px}
.jub-title{font-family:var(--ff-serif);font-size:clamp(2.4rem,7vw,4.5rem);font-weight:400;color:var(--white);line-height:1.15}
.jub-years-badge{margin:24px auto;display:flex;flex-direction:column;align-items:center;justify-content:center;width:130px;height:130px;border-radius:50%;background:var(--glass-bg);border:2px solid var(--glass-border)}
.jub-years-num{font-family:var(--ff-serif);font-size:3.5rem;font-weight:300;color:var(--accent-bright);line-height:1}
.jub-years-text{font-size:0.75rem;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.4)}
.jub-fn{font-family:var(--ff-serif)}
`;

// Backward compat
exports.birthdayPremiumCss = exports.weddingTheme01Css + bdExtraCss;

// ═══════════════════════════════════════════════════════════
// GRADUATION — Premium Bitiruv Kechasi HTML
// ═══════════════════════════════════════════════════════════
exports.graduationPremiumHtml = `
<main class="inv">

  <section class="hero">
    <div class="hero-shapes">
      <div class="shape s1"></div>
      <div class="shape s2"></div>
    </div>
    <div class="hero-inner">
      <div class="grad-emoji">🎓</div>
      <p class="hero-label">{{eventTypeLabel|Bitiruv kechasi}}</p>
      <h1 class="grad-title">{{eventTitle|Bitiruv kechasi}}</h1>
      {{#if graduationYear}}
      <div class="grad-year-badge">
        <span class="grad-year-num">{{graduationYear}}</span>
        <span class="grad-year-text">bitiruvchilar</span>
      </div>
      {{/if}}
      <div class="hero-date-badge">
        <div class="date-line"></div>
        <span class="hero-date">{{eventDateFormatted}}</span>
        <div class="date-line"></div>
      </div>
    </div>
    <div class="scroll-cue"><div class="scroll-line"></div></div>
  </section>

  <section class="section greeting-section">
    <div class="container">
      <div class="gold-ornament">✦ ✦ ✦</div>
      <h2 class="section-heading cream-heading">{{guestName|Hurmatli mehmonlar!}}</h2>
      <p class="greeting-text">{{message|Bizning bitiruv kechamizga marhamat qiling!}}</p>
      <p class="greeting-family">{{hostName}}</p>
    </div>
  </section>

  <section class="section countdown-section">
    <div class="container">
      <h2 class="section-heading light">Kechagacha qolgan vaqt</h2>
      <div class="countdown" id="countdown-timer" data-date="{{eventDate}}" data-time="{{eventTime|18:00}}">
        <div class="cd-block"><div class="cd-num" id="cd-days">00</div><div class="cd-label">Kun</div></div>
        <div class="cd-sep">:</div>
        <div class="cd-block"><div class="cd-num" id="cd-hours">00</div><div class="cd-label">Soat</div></div>
        <div class="cd-sep">:</div>
        <div class="cd-block"><div class="cd-num" id="cd-min">00</div><div class="cd-label">Minut</div></div>
        <div class="cd-sep">:</div>
        <div class="cd-block"><div class="cd-num" id="cd-sec">00</div><div class="cd-label">Sekund</div></div>
      </div>
    </div>
  </section>

  <section class="section details-section">
    <div class="container">
      <h2 class="section-heading cream-heading">Tafsilotlar</h2>
      <div class="cards-row">
        <div class="info-card"><div class="ic-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div><div class="ic-title">Sana</div><div class="ic-value">{{eventDateFormatted}}</div></div>
        <div class="info-card"><div class="ic-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div><div class="ic-title">Vaqt</div><div class="ic-value">{{eventTime|18:00}}</div></div>
        <div class="info-card"><div class="ic-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div><div class="ic-title">Manzil</div><div class="ic-value">{{location}}</div></div>
      </div>
    </div>
  </section>

  {{#if locationUrl}}
  <section class="section map-section">
    <div class="container">
      <div class="map-card">
        <div class="map-venue-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
        <h3 class="map-venue-name">{{location}}</h3>
        <a href="{{locationUrl}}" target="_blank" rel="noopener" class="map-nav-btn">Xaritada ko'rish</a>
      </div>
    </div>
  </section>
  {{/if}}

  <footer class="footer">
    <div class="container">
      <div class="footer-names"><span class="fn grad-fn">{{hostName}}</span></div>
      <div class="footer-date">{{eventDateFormatted}}</div>
      <p class="footer-msg">Sizni kutib qolamiz! 🎓</p>
    </div>
  </footer>

</main>

<script>
(function(){var ct=document.getElementById('countdown-timer');if(!ct)return;var d=ct.dataset.date,t=ct.dataset.time||'18:00';if(!d)return;var target=new Date(d+'T'+t+':00').getTime();function u(){var n=Date.now(),diff=target-n;if(diff<0)diff=0;var de=document.getElementById('cd-days'),he=document.getElementById('cd-hours'),me=document.getElementById('cd-min'),se=document.getElementById('cd-sec');if(de)de.textContent=String(Math.floor(diff/86400000)).padStart(2,'0');if(he)he.textContent=String(Math.floor((diff%86400000)/3600000)).padStart(2,'0');if(me)me.textContent=String(Math.floor((diff%3600000)/60000)).padStart(2,'0');if(se)se.textContent=String(Math.floor((diff%60000)/1000)).padStart(2,'0')}u();setInterval(u,1000)})();
</script>`;

// ═══════════════════════════════════════════════════════════
// JUBILEE — Premium Yubiley HTML
// ═══════════════════════════════════════════════════════════
exports.jubileePremiumHtml = `
<main class="inv">

  <section class="hero">
    <div class="hero-shapes">
      <div class="shape s1"></div>
      <div class="shape s2"></div>
    </div>
    <div class="hero-inner">
      <div class="jub-emoji">🎉</div>
      <p class="hero-label">{{eventTypeLabel|Yubiley}}</p>
      <h1 class="jub-title">{{eventTitle|Yubiley bayramiga taklif}}</h1>
      {{#if years}}
      <div class="jub-years-badge">
        <span class="jub-years-num">{{years}}</span>
        <span class="jub-years-text">yillik</span>
      </div>
      {{/if}}
      <div class="hero-date-badge">
        <div class="date-line"></div>
        <span class="hero-date">{{eventDateFormatted}}</span>
        <div class="date-line"></div>
      </div>
    </div>
    <div class="scroll-cue"><div class="scroll-line"></div></div>
  </section>

  <section class="section greeting-section">
    <div class="container">
      <div class="gold-ornament">✦ ✦ ✦</div>
      <h2 class="section-heading cream-heading">{{guestName|Hurmatli mehmonlar!}}</h2>
      <p class="greeting-text">{{message|Yubiley bayramimizga marhamat qiling!}}</p>
      <p class="greeting-family">{{hostName}}</p>
    </div>
  </section>

  <section class="section countdown-section">
    <div class="container">
      <h2 class="section-heading light">Bayramgacha qolgan vaqt</h2>
      <div class="countdown" id="countdown-timer" data-date="{{eventDate}}" data-time="{{eventTime|18:00}}">
        <div class="cd-block"><div class="cd-num" id="cd-days">00</div><div class="cd-label">Kun</div></div>
        <div class="cd-sep">:</div>
        <div class="cd-block"><div class="cd-num" id="cd-hours">00</div><div class="cd-label">Soat</div></div>
        <div class="cd-sep">:</div>
        <div class="cd-block"><div class="cd-num" id="cd-min">00</div><div class="cd-label">Minut</div></div>
        <div class="cd-sep">:</div>
        <div class="cd-block"><div class="cd-num" id="cd-sec">00</div><div class="cd-label">Sekund</div></div>
      </div>
    </div>
  </section>

  <section class="section details-section">
    <div class="container">
      <h2 class="section-heading cream-heading">Tafsilotlar</h2>
      <div class="cards-row">
        <div class="info-card"><div class="ic-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div><div class="ic-title">Sana</div><div class="ic-value">{{eventDateFormatted}}</div></div>
        <div class="info-card"><div class="ic-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div><div class="ic-title">Vaqt</div><div class="ic-value">{{eventTime|18:00}}</div></div>
        <div class="info-card"><div class="ic-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div><div class="ic-title">Manzil</div><div class="ic-value">{{location}}</div></div>
      </div>
    </div>
  </section>

  {{#if locationUrl}}
  <section class="section map-section">
    <div class="container">
      <div class="map-card">
        <div class="map-venue-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
        <h3 class="map-venue-name">{{location}}</h3>
        <a href="{{locationUrl}}" target="_blank" rel="noopener" class="map-nav-btn">Xaritada ko'rish</a>
      </div>
    </div>
  </section>
  {{/if}}

  <footer class="footer">
    <div class="container">
      <div class="footer-names"><span class="fn jub-fn">{{hostName}}</span></div>
      <div class="footer-date">{{eventDateFormatted}}</div>
      <p class="footer-msg">Sizni kutib qolamiz! 🎉</p>
    </div>
  </footer>

</main>

<script>
(function(){var ct=document.getElementById('countdown-timer');if(!ct)return;var d=ct.dataset.date,t=ct.dataset.time||'18:00';if(!d)return;var target=new Date(d+'T'+t+':00').getTime();function u(){var n=Date.now(),diff=target-n;if(diff<0)diff=0;var de=document.getElementById('cd-days'),he=document.getElementById('cd-hours'),me=document.getElementById('cd-min'),se=document.getElementById('cd-sec');if(de)de.textContent=String(Math.floor(diff/86400000)).padStart(2,'0');if(he)he.textContent=String(Math.floor((diff%86400000)/3600000)).padStart(2,'0');if(me)me.textContent=String(Math.floor((diff%3600000)/60000)).padStart(2,'0');if(se)se.textContent=String(Math.floor((diff%60000)/1000)).padStart(2,'0')}u();setInterval(u,1000)})();
</script>`;

// ═══════════════════════════════════════════════════════════
// THEME ARRAYS — 10 themes for each event type
// ═══════════════════════════════════════════════════════════

// Helper: build themed CSS for a given event type's extra classes
function buildThemeCss(themeVars, extraCss) {
  return themeVars + baseCss + (extraCss || '');
}

// Build all 10 themes per event type
const themeNames = [
  { key: '01', slug: 'dark-gold',     name: "Klassik Qorong'u Oltin", desc: "Klassik qorong'u fon va oltin aksentlar" },
  { key: '02', slug: 'pushti',        name: 'Romantik Pushti',         desc: 'Romantik pushti va atirgul ranglari' },
  { key: '03', slug: 'minimalist-oq', name: 'Minimalist Oq',           desc: 'Toza oq minimalist dizayn' },
  { key: '04', slug: 'binafsha',      name: 'Qirollik Binafsha',       desc: 'Qirollik binafsha va kumush ranglar' },
  { key: '05', slug: 'yashil',        name: 'Tabiat Yashil',           desc: "Tabiiy yashil va o'rmon ranglari" },
  { key: '06', slug: 'sharqona',      name: 'Sharqona Zar',            desc: 'Sharqona qizil va zar aksentlar' },
  { key: '07', slug: 'qora',          name: 'Zamonaviy Qora',          desc: 'Zamonaviy qora va oq kontrast' },
  { key: '08', slug: 'sepia',         name: 'Vintage Sepia',           desc: 'Vintage iliq sepia ohanglar' },
  { key: '09', slug: 'kok',           name: "Okean Ko'k",              desc: "Okean ko'k va moviy ranglar" },
  { key: '10', slug: 'oltin',         name: 'Quyosh Oltin',            desc: 'Quyoshli iliq oltin ranglar' },
];

const themeVarsMap = {
  '01': theme01_DarkGold,
  '02': theme02_BlushPink,
  '03': theme03_MinimalistWhite,
  '04': theme04_RoyalPurple,
  '05': theme05_NatureGreen,
  '06': theme06_OrientalRed,
  '07': theme07_ModernBlack,
  '08': theme08_VintageSepia,
  '09': theme09_OceanBlue,
  '10': theme10_SunsetAmber,
};

// Wedding themes
exports.weddingThemes = themeNames.map((t, i) => ({
  slug: `toy-${t.slug}`,
  name: t.name,
  description: t.desc,
  css: buildThemeCss(themeVarsMap[t.key], ''),
  sortOrder: i + 1,
}));

// Birthday themes
exports.birthdayThemes = themeNames.map((t, i) => ({
  slug: `tgk-${t.slug}`,
  name: t.name,
  description: t.desc,
  css: buildThemeCss(themeVarsMap[t.key], bdExtraCss),
  sortOrder: i + 1,
}));

// Graduation themes
exports.graduationThemes = themeNames.map((t, i) => ({
  slug: `grad-${t.slug}`,
  name: t.name,
  description: t.desc,
  css: buildThemeCss(themeVarsMap[t.key], gradExtraCss),
  sortOrder: i + 1,
}));

// Jubilee themes
exports.jubileeThemes = themeNames.map((t, i) => ({
  slug: `jub-${t.slug}`,
  name: t.name,
  description: t.desc,
  css: buildThemeCss(themeVarsMap[t.key], jubExtraCss),
  sortOrder: i + 1,
}));
