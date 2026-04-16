import re

with open('src/utils/templateEngine.js', 'r') as f:
    text = f.read()

search1 = """      document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
      try { localStorage.setItem('taklifnoma-lang', lang); } catch(e){}"""
replace1 = """      document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';"""

search2 = """    // Execute initialization
    var saved = null;
    try { saved = localStorage.getItem('taklifnoma-lang'); } catch(e){}
    
    // Auto-switch to strictly only language, OR use saved cache, OR fallback to configured priority default
    if (!hasUz && !hasQq && hasRu) { switchLang('ru'); }
    else if (!hasUz && hasQq && !hasRu) { switchLang('qq'); }
    else if (!hasRu && !hasQq && hasUz) { switchLang('uz'); }
    else if (saved && langs.indexOf(saved) !== -1) { switchLang(saved); }
    else { switchLang(defaultLang); }"""

replace2 = """    // Execute initialization (no caching to respect host priority)
    if (!hasUz && !hasQq && hasRu) { switchLang('ru'); }
    else if (!hasUz && hasQq && !hasRu) { switchLang('qq'); }
    else if (!hasRu && !hasQq && hasUz) { switchLang('uz'); }
    else { switchLang(defaultLang); }"""

text = text.replace(search1, replace1)
text = text.replace(search2, replace2)

with open('src/utils/templateEngine.js', 'w') as f:
    f.write(text)

print("SUCCESS: Caching disabled")
