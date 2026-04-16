import re

with open('src/utils/templateEngine.js', 'r') as f:
    text = f.read()

# 1. Update translations dict
search_tr_uz = """        envOpen: 'Ochish uchun bosing',"""
replace_tr_uz = """        envOpen: 'Ochish uchun bosing',
        shareWa: 'WhatsApp orqali ulashish',
        shareTg: 'Telegram orqali ulashish',
        calBtn: 'Kalendarimga qo\\'shish',
        printBtn: 'PDF qilib saqlash',
        inviteText: '💍 Sizni taklifnomamizga taklif etamiz!',"""
text = text.replace(search_tr_uz, replace_tr_uz)

search_tr_qq = """        envOpen: 'Ashıw ushın basıń',"""
replace_tr_qq = """        envOpen: 'Ashıw ushın basıń',
        shareWa: 'WhatsApp tarmaǵında úlesiw',
        shareTg: 'Telegram tarmaǵında úlesiw',
        calBtn: 'Kalendarıma qosıw',
        printBtn: 'PDF qılıp saqlaw',
        inviteText: '💍 Sizdi taklifnamamızǵa shaqıramız!',"""
text = text.replace(search_tr_qq, replace_tr_qq)

search_tr_ru = """        envOpen: 'Нажмите, чтобы открыть',"""
replace_tr_ru = """        envOpen: 'Нажмите, чтобы открыть',
        shareWa: 'Поделиться в WhatsApp',
        shareTg: 'Поделиться в Telegram',
        calBtn: 'Добавить в календарь',
        printBtn: 'Сохранить как PDF',
        inviteText: '💍 Приглашаем вас на наше торжество!',"""
text = text.replace(search_tr_ru, replace_tr_ru)

# 2. Add [data-i18n-title] processor to switchLang
search_switch = """      document.querySelectorAll('[data-i18n]').forEach(function(el){"""
replace_switch = """      document.querySelectorAll('[data-i18n-title]').forEach(function(el){
        var key = el.getAttribute('data-i18n-title');
        if(t[key]) el.setAttribute('title', t[key]);
      });
      document.querySelectorAll('[data-i18n]').forEach(function(el){"""
text = text.replace(search_switch, replace_switch)

# 3. Add share href updates to switchLang
search_switch_end = """        } else if(t[key]) {"""
replace_switch_end = """        } else if(t[key]) {"""
# Actually, let's inject it at the end of switchLang
search_switch_finalize = """      // Fire an event in case other scripts need to know
      window.dispatchEvent(new Event('langChanged'));"""
replace_switch_finalize = """      // Update share links
      var txtEnc = encodeURIComponent(t['inviteText'] || '💍 Sizni taklifnomamizga taklif etamiz!');
      var curUrl = encodeURIComponent(window.location.href);
      var wa = document.getElementById('waShareBtn'); if(wa) wa.href = 'https://wa.me/?text=' + txtEnc + '%20' + curUrl;
      var tg = document.getElementById('tgShareBtn'); if(tg) tg.href = 'https://t.me/share/url?url=' + curUrl + '&text=' + txtEnc;
      
      // Fire an event in case other scripts need to know
      window.dispatchEvent(new Event('langChanged'));"""
text = text.replace(search_switch_finalize, replace_switch_finalize)

# 4. Inject data-i18n-title into buttons
text = text.replace('title="WhatsApp orqali ulashish"', 'title="WhatsApp orqali ulashish" data-i18n-title="shareWa"')
text = text.replace('title="Telegram orqali ulashish"', 'title="Telegram orqali ulashish" data-i18n-title="shareTg"')
text = text.replace('title="Kalendarimga qo\\'shish"', 'title="Kalendarimga qo\\'shish" data-i18n-title="calBtn"')
text = text.replace('title="PDF qilib saqlash"', 'title="PDF qilib saqlash" data-i18n-title="printBtn"')

with open('src/utils/templateEngine.js', 'w') as f:
    f.write(text)

with open('client/src/components/Dashboard.jsx', 'r') as f:
    dash = f.read()

# 5. Fix Dashboard floating buttons default off
# Search for the block starting with showShareWa
dash = re.sub(
    r'showShareWa:\s*lastInv\.customFields\.showShareWa,\s*showShareTg:\s*lastInv\.customFields\.showShareTg,\s*showCalendarBtn:\s*lastInv\.customFields\.showCalendarBtn,\s*showPrintBtn:\s*lastInv\.customFields\.showPrintBtn,',
    """showShareWa: false,
          showShareTg: false,
          showCalendarBtn: false,
          showPrintBtn: false,""",
    dash
)

with open('client/src/components/Dashboard.jsx', 'w') as f:
    f.write(dash)

print("SUCCESS")
