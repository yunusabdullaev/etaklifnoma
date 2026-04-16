import re

with open('client/src/components/Dashboard.jsx', 'r') as f:
    text = f.read()

# Insert the handleCreateNew function around line 23 right before useEffect
search_insert = "  useEffect(() => { fetchInvitations(); }, []);"
replace_insert = """
  const handleCreateNew = () => {
    let defaultSettings = null;
    if (invitations && invitations.length > 0) {
      const lastInv = invitations[0];
      if (lastInv.customFields) {
        defaultSettings = {
          telegramChatId: lastInv.customFields.telegramChatId,
          telegramBot: lastInv.customFields.telegramBot,
          langUz: lastInv.customFields.langUz,
          langQq: lastInv.customFields.langQq,
          langRu: lastInv.customFields.langRu,
          defaultLang: lastInv.customFields.defaultLang,
          showShareWa: lastInv.customFields.showShareWa,
          showShareTg: lastInv.customFields.showShareTg,
          showCalendarBtn: lastInv.customFields.showCalendarBtn,
          showPrintBtn: lastInv.customFields.showPrintBtn,
          enableWishes: lastInv.customFields.enableWishes,
          musicUrl: lastInv.customFields.musicUrl,
        };
      }
    }
    onCreateNew(defaultSettings);
  };

  useEffect(() => { fetchInvitations(); }, []);"""

text = text.replace(search_insert, replace_insert)

# Replace all onClick={onCreateNew} with onClick={handleCreateNew}
text = text.replace('onClick={onCreateNew}', 'onClick={handleCreateNew}')

with open('client/src/components/Dashboard.jsx', 'w') as f:
    f.write(text)

print("Dashboard updated seamlessly.")
