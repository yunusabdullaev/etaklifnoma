import re

with open('client/src/components/Step3Content.jsx', 'r') as f:
    text = f.read()

# 1. Update trStep3 to include uz, qq, ru prefix definitions properly!
trStep3_old = re.search(r'const trStep3 = \{[\s\S]*?\n\};\n', text).group(0)

trStep3_new = """const trStep3 = {
  uz: {
    uzFields: 'O\\'zbekcha matnlar', qqFields: 'Qaraqalpoqcha matnlar', ruFields: 'Ruscha matnlar',
    uzHostName: 'Mezbon ismi', uzGuestName: 'Mehmon ismi', uzEventTitle: 'Tadbir nomi', msg: 'Xabar matni',
    qqHostName: 'Mezbon ismi (QQ)', qqGuestName: 'Mehmon ismi (QQ)', qqEventTitle: 'Tadbir nomi (QQ)',
    ruHostName: 'Mezbon ismi (RU)', ruGuestName: 'Mehmon ismi (RU)', ruEventTitle: 'Tadbir nomi (RU)',
    age: 'Yoshi', theme: 'Bayram mavzusi', years: 'Yillar (Masalan: 50)', school: "Ta'lim muassasasi", graduationYear: 'Bitiruv yili', brideName: 'Kelinning ismi', groomName: 'Kuyovning ismi',
    palette: '🎨 Rang palitrasi',
    gold: 'Oltin', silver: 'Kumush', ocean: 'Okean', rose: 'Gul', lavender: 'Lavanda', teal: 'Yashil', amber: 'Sariq', emerald: 'Zumrad'
  },
  ru: {
    uzFields: 'Тексты на узбекском', qqFields: 'Тексты на каракалпакском', ruFields: 'Тексты на русском',
    uzHostName: 'Имя хозяина (Uzbek)', uzGuestName: 'Имя гостя (Uzbek)', uzEventTitle: 'Событие (Uzbek)',
    qqHostName: 'Имя хозяина (Qaraqalpaq)', qqGuestName: 'Имя гостя (Qaraqalpaq)', qqEventTitle: 'Событие (Qaraqalpaq)', msg: 'Сообщение',
    ruHostName: 'Имя хозяина', ruGuestName: 'Имя гостя', ruEventTitle: 'Название мероприятия',
    age: 'Возраст', theme: 'Тема праздника', years: 'Лет (Например: 50)', school: "Учебное заведение", graduationYear: 'Год выпуска', brideName: 'Имя невесты', groomName: 'Имя жениха',
    palette: '🎨 Цветовая палитра',
    gold: 'Золото', silver: 'Серебро', ocean: 'Океан', rose: 'Роза', lavender: 'Лаванда', teal: 'Бирюза', amber: 'Янтарь', emerald: 'Изумруд'
  },
  qq: {
    uzFields: 'Ózbekshe tekstler', qqFields: 'Qaraqalpaqsha tekstler', ruFields: 'Russha tekstler',
    uzHostName: 'Mezban atı (UZ)', uzGuestName: 'Mehman atı (UZ)', uzEventTitle: 'Ilaje atı (UZ)',
    qqHostName: 'Mezban atı', qqGuestName: 'Mehman atı', qqEventTitle: 'Ilaje atı', msg: 'Xabar',
    ruHostName: 'Mezban atı (RU)', ruGuestName: 'Mehman atı (RU)', ruEventTitle: 'Ilaje atı (RU)',
    age: 'Jası', theme: 'Bayram temasi', years: 'Jıllar (Mısalı: 50)', school: "Oqıw ornı", graduationYear: 'Pitkeriw jılı', brideName: 'Kelinniń atı', groomName: 'Kúyewdiń atı',
    palette: '🎨 Reńler palitrası',
    gold: 'Altın', silver: 'Gúmis', ocean: 'Okean', rose: 'Gúl', lavender: 'Lavanda', teal: 'Máviy', amber: 'Sarı', emerald: 'Zúmret'
  },
  en: {
    uzFields: 'Uzbek Texts', qqFields: 'Karakalpak Texts', ruFields: 'Russian Texts',
    uzHostName: 'Host Name (UZ)', uzGuestName: 'Guest Name (UZ)', uzEventTitle: 'Event Title (UZ)',
    qqHostName: 'Host Name (QQ)', qqGuestName: 'Guest Name (QQ)', qqEventTitle: 'Event Title (QQ)', msg: 'Message',
    ruHostName: 'Host Name (RU)', ruGuestName: 'Guest Name (RU)', ruEventTitle: 'Event Title (RU)',
    age: 'Age', theme: 'Theme', years: 'Years (e.g. 50)', school: "School", graduationYear: 'Graduation Year', brideName: 'Bride Name', groomName: 'Groom Name',
    palette: '🎨 Color palette',
    gold: 'Gold', silver: 'Silver', ocean: 'Ocean', rose: 'Rose', lavender: 'Lavender', teal: 'Teal', amber: 'Amber', emerald: 'Emerald'
  }
};
"""
text = text.replace(trStep3_old, trStep3_new)

# 2. Update UZ Block Labels
uz_labels_old = """
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="label">{t('step3.host')} *</label>
                <input type="text" placeholder="Aliyev Jasur"
                  value={data.hostName || ''} onChange={(e) => handleChange('hostName', e.target.value)}
                  className="input-field" />
              </div>
              <div>
                <label className="label">{t('step3.guest')}</label>
                <input type="text" placeholder="Hurmatli mehmon"
                  value={data.guestName || ''} onChange={(e) => handleChange('guestName', e.target.value)}
                  className="input-field" />
              </div>
            </div>
            <div>
              <label className="label flex items-center gap-1.5"><Type size={13} /> {t('step3.eventTitle')}</label>
              <input type="text" placeholder="Nikoh marosimi"
                value={data.eventTitle || ''} onChange={(e) => handleChange('eventTitle', e.target.value)}
                className="input-field" />
            </div>

        {/* Message */}
      {isUzOn && (
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-surface-300 uppercase tracking-wider flex items-center gap-2">
          <MessageSquare size={13} /> {t('step3.message')}
        </h3>
        <textarea rows={3} placeholder={t('step3.messagePlaceholder')}
          value={data.message || ''} onChange={(e) => handleChange('message', e.target.value)}
          className="input-field resize-none" />
      </div>
      )}
"""

uz_labels_new = """
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="label">👤 {trLocal.uzHostName} *</label>
                <input type="text" placeholder="Aliyev Jasur"
                  value={data.hostName || ''} onChange={(e) => handleChange('hostName', e.target.value)}
                  className="input-field" />
              </div>
              <div>
                <label className="label">👥 {trLocal.uzGuestName}</label>
                <input type="text" placeholder="Hurmatli mehmon"
                  value={data.guestName || ''} onChange={(e) => handleChange('guestName', e.target.value)}
                  className="input-field" />
              </div>
            </div>
            <div>
              <label className="label flex items-center gap-1.5">✏️ {trLocal.uzEventTitle}</label>
              <input type="text" placeholder="Nikoh marosimi"
                value={data.eventTitle || ''} onChange={(e) => handleChange('eventTitle', e.target.value)}
                className="input-field" />
            </div>
            
            <div className="space-y-3">
              <label className="label flex items-center gap-1.5">💬 {trLocal.msg}</label>
              <textarea rows={3} placeholder={t('step3.messagePlaceholder')}
                value={data.message || ''} onChange={(e) => handleChange('message', e.target.value)}
                className="input-field resize-none" />
            </div>
"""
# Since UZ block was injected in a specific way by last script, let's just regex replace the labels directly instead of big blocks.

text = re.sub(r'<label className="label">\{t\(\'step3\.host\'\)\} \*</label>', r'<label className="label">👤 {trLocal.uzHostName} *</label>', text)
text = re.sub(r'<label className="label">\{t\(\'step3\.guest\'\)\}</label>', r'<label className="label">👥 {trLocal.uzGuestName}</label>', text)
text = re.sub(r'<label className="label flex items-center gap-1\.5"><Type size=\{13\} /> \{t\(\'step3\.eventTitle\'\)\}</label>', r'<label className="label">✏️ {trLocal.uzEventTitle}</label>', text)
text = re.sub(r'<h3 className="text-xs font-semibold text-surface-300 uppercase tracking-wider flex items-center gap-2">\s*<MessageSquare size=\{13\} /> \{t\(\'step3\.message\'\)\}\s*</h3>', r'<label className="label">💬 {trLocal.msg}</label>', text)

# Remove the surrounding {isUzOn && ( <div className="space-y-3"> around the message textarea
text = re.sub(r'\{\s*/\*\s*Message\s*\*/\s*\}\s*\{isUzOn && \(\s*<div className="space-y-3">\s*<label className="label">💬 \{trLocal\.msg\}</label>', r'<div className="space-y-3 mt-3">\n              <label className="label">💬 {trLocal.msg}</label>', text)
text = text.replace('className="input-field resize-none" />\n      </div>\n      )}', 'className="input-field resize-none" />\n            </div>')

with open('client/src/components/Step3Content.jsx', 'w') as f:
    f.write(text)

print("UZ fields patched.")
