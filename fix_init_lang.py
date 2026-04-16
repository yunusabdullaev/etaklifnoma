import re

with open('src/utils/templateEngine.js', 'r') as f:
    text = f.read()

search_init = """
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
"""
replace_init = """
    // Execute initialization
    var saved = null;
    try { saved = localStorage.getItem('taklifnoma-lang'); } catch(e){}
    
    // Auto-switch to strictly only language, OR use saved cache, OR fallback to configured priority default
    if (!hasUz && !hasQq && hasRu) { switchLang('ru'); }
    else if (!hasUz && hasQq && !hasRu) { switchLang('qq'); }
    else if (!hasRu && !hasQq && hasUz) { switchLang('uz'); }
    else if (saved && langs.indexOf(saved) !== -1) { switchLang(saved); }
    else { switchLang(defaultLang); }
"""

text = text.replace(search_init.strip(), replace_init.strip())

with open('src/utils/templateEngine.js', 'w') as f:
    f.write(text)

print("Init logic solved!")
