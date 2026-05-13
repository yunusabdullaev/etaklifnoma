import re

with open('src/utils/templateEngine.js', 'r') as f:
    text = f.read()

# 1. Add Transliterate Function
translit_func = """    function translit(str, script) {
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
    
    window._curScript = 'latin';
"""

text = text.replace("    // Data maps for each language", translit_func + "\n    // Data maps for each language")

# 2. Add Script Switcher UI
ui_patch = """
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
"""

text = re.sub(r'<div class="lang-toggle" id="langToggle">.*?</div>', ui_patch.strip(), text, flags=re.DOTALL)

# 3. Modify switchLang to handle transliteration correctly
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

      // 1. Translate UI
      var scriptToggle = document.getElementById('scriptToggle');
      if(scriptToggle) scriptToggle.style.display = (lang === 'ru') ? 'none' : 'flex';

      document.querySelectorAll('.lang-btn[id^="lang"]').forEach(function(btn){
        btn.classList.remove('active');
        if(btn.id === 'lang' + lang.charAt(0).toUpperCase() + lang.slice(1)) btn.classList.add('active');
      });

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

      if(nameInput && t.wishesName) nameInput.placeholder = ntr(t.wishesName);
      if(msgInput && t.wishesMessage) msgInput.placeholder = ntr(t.wishesMessage);
      if(wishesBtn && t.wishesSend) wishesBtn.textContent = ntr(t.wishesSend);
      if(wishesTitle && t.wishesTitle) wishesTitle.textContent = ntr(t.wishesTitle);
      if(wishesSub && t.wishesSubtitle) wishesSub.textContent = ntr(t.wishesSubtitle);

      if(prevData.date && newData.date && prevData.date !== newData.date) swapTextInPage(prevData.date, newData.date);

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
               h += '<div class="tl-item revealed"><div class="tl-marker"><div class="tl-dot"></div>' +
                    (i !== items.length - 1 ? '<div class="tl-line"></div>' : '') +
                    '</div><div class="tl-content"><div class="tl-time-box">' +
                    item.time + '</div><div class="tl-text">' + ntr(item.desc) + '</div></div></div>';
            });
            progEl.innerHTML = h;
          }
        } catch(e){}
      }
      
      window.currentLang = lang;
    }
"""

text = re.sub(r'function switchLang\(lang\) \{.*?\n      // 5\. Swap program/timeline\n.*?catch\(e\)\{\}\n      \}\n', switch_lang_code, text, flags=re.DOTALL)

with open('src/utils/templateEngine.js', 'w') as f:
    f.write(text)
    
print("Patched successfully")
