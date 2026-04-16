import re

with open('src/utils/templateEngine.js', 'r') as f:
    text = f.read()

# Fix calendar and print
search_components = """  ${buildShareButtons(invitation.customFields)}
  ${(invitation.customFields?.showCalendarBtn !== false) ? buildCalendarButton() : ''}
  ${(invitation.customFields?.showPrintBtn !== false) ? buildPrintButton() : ''}
  ${(invitation.customFields?.envelopeAnim !== false) ? buildEnvelopeAnimation(eventType) : ''}"""

replace_components = """  ${buildShareButtons(invitation.customFields)}
  ${(invitation.customFields?.showCalendarBtn === true) ? buildCalendarButton() : ''}
  ${(invitation.customFields?.showPrintBtn === true) ? buildPrintButton() : ''}
  ${(invitation.customFields?.envelopeAnim !== false) ? buildEnvelopeAnimation(eventType) : ''}"""

text = text.replace(search_components, replace_components)

search_wa_tg = """function buildShareButtons(cf) {
  const showWa = !cf || cf.showShareWa !== false;
  const showTg = !cf || cf.showShareTg !== false;"""

replace_wa_tg = """function buildShareButtons(cf) {
  const showWa = cf && cf.showShareWa === true;
  const showTg = cf && cf.showShareTg === true;"""

text = text.replace(search_wa_tg, replace_wa_tg)

with open('src/utils/templateEngine.js', 'w') as f:
    f.write(text)

print("SUCCESS: Default floating buttons OFF logic synchronized!")
