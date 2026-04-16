import re

with open('client/src/components/Step3Content.jsx', 'r') as f:
    text = f.read()

# 1. Update the glass container to use flex flex-col gap-8
search_glass = '      <div className="glass p-5 space-y-8">'
replace_glass = """      <div className="glass p-5 flex flex-col gap-8">
        <style dangerouslySetInnerHTML={{__html: `
          .matnlar-block[style*="order: 0"] { margin-top: 0 !important; border-top: none !important; padding-top: 0 !important; }
        `}} />"""
text = text.replace(search_glass, replace_glass)

# 2. Add the order array near the top of the component
search_render = 'const trLocal = trStep3[lang] || trStep3[\'uz\'];'
replace_render = """const trLocal = trStep3[lang] || trStep3['uz'];
  const orderArr = (data.customFields?.langOrder || 'uz,ru,qq').split(',');"""
if search_render in text and "const orderArr" not in text:
    text = text.replace(search_render, replace_render)
else:
    # already exists or cannot find
    pass

# 3. Update the UZ block
# replace `<div className="space-y-4">` directly after `{isUzOn && (`
search_uz = """        {/* UZ fields */}
        {isUzOn && (
          <div className="space-y-4">"""
replace_uz = """        {/* UZ fields */}
        {isUzOn && (
          <div className="space-y-4 matnlar-block pt-6 border-t border-white/5" style={{ order: orderArr.indexOf('uz') }}>"""
text = text.replace(search_uz, replace_uz)

# 4. Update the QQ block
search_qq = """        {/* QQ fields */}
        {data.customFields?.langQq && (
          <div className="space-y-4 border-t border-white/5 pt-6 mt-6">"""
replace_qq = """        {/* QQ fields */}
        {data.customFields?.langQq && (
          <div className="space-y-4 matnlar-block pt-6 border-t border-white/5" style={{ order: orderArr.indexOf('qq') }}>"""
text = text.replace(search_qq, replace_qq)

# 5. Update the RU block
search_ru = """        {/* RU fields */}
        {data.customFields?.langRu && (
          <div className="space-y-4 border-t border-white/5 pt-6 mt-6">"""
replace_ru = """        {/* RU fields */}
        {data.customFields?.langRu && (
          <div className="space-y-4 matnlar-block pt-6 border-t border-white/5" style={{ order: orderArr.indexOf('ru') }}>"""
text = text.replace(search_ru, replace_ru)

with open('client/src/components/Step3Content.jsx', 'w') as f:
    f.write(text)

print("SUCCESS: Display flex order implemented.")
