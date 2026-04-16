import re

with open('client/src/components/Step3Content.jsx', 'r') as f:
    text = f.read()

# Remove the nasty CSS block
search_css = '''      <div className="glass p-5 flex flex-col gap-8">
        <style dangerouslySetInnerHTML={{__html: `
          .matnlar-block[style*="order: 0"] { margin-top: 0 !important; border-top: none !important; padding-top: 0 !important; }
        `}} />'''
replace_css = '''      <div className="glass p-5 flex flex-col gap-8">'''
text = text.replace(search_css, replace_css)

# Update UZ block
search_uz = '''<div className="space-y-4 matnlar-block pt-6 border-t border-white/5" style={{ order: orderArr.indexOf('uz') }}>'''
replace_uz = '''<div className={`space-y-4 ${orderArr.indexOf('uz') !== 0 ? 'pt-6 border-t border-white/5' : ''}`} style={{ order: orderArr.indexOf('uz') }}>'''
text = text.replace(search_uz, replace_uz)

# Update QQ block
search_qq = '''<div className="space-y-4 matnlar-block pt-6 border-t border-white/5" style={{ order: orderArr.indexOf('qq') }}>'''
replace_qq = '''<div className={`space-y-4 ${orderArr.indexOf('qq') !== 0 ? 'pt-6 border-t border-white/5' : ''}`} style={{ order: orderArr.indexOf('qq') }}>'''
text = text.replace(search_qq, replace_qq)

# Update RU block
search_ru = '''<div className="space-y-4 matnlar-block pt-6 border-t border-white/5" style={{ order: orderArr.indexOf('ru') }}>'''
replace_ru = '''<div className={`space-y-4 ${orderArr.indexOf('ru') !== 0 ? 'pt-6 border-t border-white/5' : ''}`} style={{ order: orderArr.indexOf('ru') }}>'''
text = text.replace(search_ru, replace_ru)

with open('client/src/components/Step3Content.jsx', 'w') as f:
    f.write(text)

print("SUCCESS: Cleaned up filthy React hack.")
