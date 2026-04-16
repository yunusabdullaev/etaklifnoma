import re

with open('client/src/components/Step3Content.jsx', 'r') as f:
    content = f.read()

def getBlock(pattern):
    match = re.search(pattern, content, re.DOTALL)
    if match:
        return True, len(match.group(1))
    return False, 0

print("1. langToggles", getBlock(r'<div className="space-y-2">\s*\{\[\s*[\s\S]*?</div>\s*</div>\s*\{\/\* QQ fields'))
print("2. qqSettings", getBlock(r'\{\/\* QQ fields — when Karakalpak is ON \*\/\}.*?<div className="space-y-3[^>]*>([\s\S]*?)</div>\s*\)\}'))
print("3. ruSettings", getBlock(r'\{\/\* RU fields — when Russian is ON \*\/\}.*?<div className="space-y-3[^>]*>([\s\S]*?)</div>\s*\)\}'))
print("4. templateFields", getBlock(r'\{\/\* Template specific fields \*\/\}\s*\{templateFields.length > 0 && \(([\s\S]*?)\)\}'))
print("5. uzCore", getBlock(r'\{\/\* Core fields \*\/\}\s*\{isUzOn && \(\s*<div className="glass p-5 space-y-4">\s*<h3.*?</h3>([\s\S]*?)</div>\s*\)\}'))
print("6. dateLoc", getBlock(r'\{\/\* Date & location \*\/\}\s*<div className="glass p-5 space-y-4">\s*<h3.*?</h3>([\s\S]*?)</div>'))
print("7. uzMsg", getBlock(r'\{\/\* Message \*\/\}\s*\{isUzOn && \(\s*<div className="glass p-5 space-y-3">\s*<h3.*?</h3>([\s\S]*?)</div>\s*\)\}'))
print("8. music", getBlock(r'<div>\s*<label className="label flex items-center gap-1\.5">🎵 \{t\(\'step3\.music\'\)\}</label>([\s\S]*?)(?=\{\/\* Program / Timeline editor \*\/})'))
print("9. uzProg", getBlock(r'\{\/\* Program / Timeline editor \*\/\}\s*\{isUzOn && \(\s*(<div>[\s\S]*?(?=</div>\s*\)\})</div>)\s*\)\}'))
print("10. qqProg", getBlock(r'\{\/\* Karakalpak Program editor — when QQ is ON \*\/\}\s*\{data\.customFields\?\.langQq && \(\s*(<div>[\s\S]*?(?=</div>\s*\)\})</div>)\s*\)\}'))
print("11. ruProg", getBlock(r'\{\/\* Russian Program editor — when RU is ON \*\/\}\s*\{data\.customFields\?\.langRu && \(\s*(<div>[\s\S]*?(?=</div>\s*\)\})</div>)\s*\)\}'))
print("12. restEx", getBlock(r'\{\/\* Color Palette \*\/\}([\s\S]*?)(?=</div>\s*</div>\s*\);\s*return \()'))

