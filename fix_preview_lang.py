import re

# 1. Update templateEngine.js
with open('src/utils/templateEngine.js', 'r') as f:
    text = f.read()

text = text.replace('${buildLanguageToggle()}', '${buildLanguageToggle(invitation.customFields)}')

search_toggle = """function buildLanguageToggle() {
  return `
  <div class="lang-toggle" id="langToggle">
    <button class="lang-btn active" id="langUz" onclick="switchLang('uz')">UZ</button>
    <button class="lang-btn" id="langQq" onclick="switchLang('qq')" style="display:none">QQ</button>
    <button class="lang-btn" id="langRu" onclick="switchLang('ru')" style="display:none">RU</button>
  </div>"""

replace_toggle = """function buildLanguageToggle(cf) {
  var orderArr = (cf && cf.langOrder) ? cf.langOrder.split(',') : ['uz', 'ru', 'qq'];
  var uzOrder = orderArr.indexOf('uz');
  var ruOrder = orderArr.indexOf('ru');
  var qqOrder = orderArr.indexOf('qq');

  return `
  <div class="lang-toggle" id="langToggle">
    <button class="lang-btn active" id="langUz" onclick="switchLang('uz')" style="order:${uzOrder}">UZ</button>
    <button class="lang-btn" id="langQq" onclick="switchLang('qq')" style="display:none; order:${qqOrder}">QQ</button>
    <button class="lang-btn" id="langRu" onclick="switchLang('ru')" style="display:none; order:${ruOrder}">RU</button>
  </div>"""

text = text.replace(search_toggle, replace_toggle)

with open('src/utils/templateEngine.js', 'w') as f:
    f.write(text)


# 2. Update LivePreview.jsx
with open('client/src/components/LivePreview.jsx', 'r') as f:
    content = f.read()

search_preview = """        // 2. Force correct language from __INVITE_DATA__ flags (poll until switchLang is ready)
        (function poll(n){
          if (typeof window.switchLang === 'function') {
            var d = window.__INVITE_DATA__ || {};
            var lang = (d.langUz !== false) ? 'uz' : (d.langQq ? 'qq' : 'ru');
            window.switchLang(lang);
          } else if (n < 25) { setTimeout(function(){ poll(n+1); }, 80); }
        })(0);"""

content = content.replace(search_preview, "")

with open('client/src/components/LivePreview.jsx', 'w') as f:
    f.write(content)

print("SUCCESS: Fixed preview lang override and toggle ordering.")
