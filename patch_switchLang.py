import re

with open('src/utils/templateEngine.js', 'r') as f:
    text = f.read()

switch_lang_code = """
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
      if(scriptToggle) scriptToggle.style.display = (lang === 'ru') ? 'none' : 'flex';

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
"""

# Regex replacing switchLang(lang) up to var txtEnc
text = re.sub(r'function switchLang\(lang\) \{.*?(?=function swapTextInPage)', switch_lang_code + "\n    ", text, flags=re.DOTALL)

with open('src/utils/templateEngine.js', 'w') as f:
    f.write(text)
    
print("Patched successfully")
