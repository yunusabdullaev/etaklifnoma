import re

with open('src/utils/templateEngine.js', 'r') as f:
    text = f.read()

# Replace "var configuredDefault = ..." block with the new defaultLang determination logic using d.langOrder
search_default = """
    // Determine initial language
    var configuredDefault = d.defaultLang || '';
    var defaultLang = configuredDefault && ((configuredDefault === 'uz' && hasUz) || (configuredDefault === 'qq' && hasQq) || (configuredDefault === 'ru' && hasRu))
      ? configuredDefault 
      : (hasUz ? 'uz' : (hasQq ? 'qq' : 'ru'));
"""
replace_default = """
    // Determine initial language based on strictly defined order
    var orderArr = d.langOrder ? d.langOrder.split(',') : ['uz','ru','qq'];
    var defaultLang = null;
    for(var i=0; i<orderArr.length; i++) {
       if (orderArr[i] === 'uz' && hasUz) { defaultLang = 'uz'; break; }
       if (orderArr[i] === 'qq' && hasQq) { defaultLang = 'qq'; break; }
       if (orderArr[i] === 'ru' && hasRu) { defaultLang = 'ru'; break; }
    }
    if(!defaultLang) defaultLang = hasUz ? 'uz' : (hasQq ? 'qq' : 'ru');
"""

# Replace the show/hide buttons block to also apply `flex order` so that the bottom container reflects the desired order
search_buttons = """
    // Show/hide buttons
    var uzBtn = document.getElementById('langUz');
    var qqBtn = document.getElementById('langQq');
    var ruBtn = document.getElementById('langRu');
    if(uzBtn) uzBtn.style.display = hasUz ? '' : 'none';
    if(qqBtn) qqBtn.style.display = hasQq ? '' : 'none';
    if(ruBtn) ruBtn.style.display = hasRu ? '' : 'none';
"""
replace_buttons = """
    // Show/hide and visual ordering of layout buttons
    var uzBtn = document.getElementById('langUz');
    var qqBtn = document.getElementById('langQq');
    var ruBtn = document.getElementById('langRu');
    
    var orderArr = d.langOrder ? d.langOrder.split(',') : ['uz','ru','qq'];
    if(uzBtn) { uzBtn.style.display = hasUz ? '' : 'none'; uzBtn.style.order = orderArr.indexOf('uz'); }
    if(qqBtn) { qqBtn.style.display = hasQq ? '' : 'none'; qqBtn.style.order = orderArr.indexOf('qq'); }
    if(ruBtn) { ruBtn.style.display = hasRu ? '' : 'none'; ruBtn.style.order = orderArr.indexOf('ru'); }
"""

text = text.replace(search_default.strip(), replace_default.strip())
text = text.replace(search_buttons.strip(), replace_buttons.strip())

with open('src/utils/templateEngine.js', 'w') as f:
    f.write(text)

print("SUCCESSfully patched templateEngine.js language sorting logic")
