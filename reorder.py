import re

with open('client/src/components/Step3Content.jsx', 'r') as f:
    text = f.read()

# Define patterns to capture the blocks
patterns = {
    'coreFields': r'(\{/\* Core fields \*/\}.*?)\{/\* Date & location \*/\}',
    'dateLoc': r'(\{/\* Date & location \*/\}.*?)\{/\* Message \*/\}',
    'msg': r'(\{/\* Message \*/\}.*?)\{/\* Language Toggle settings \*/\}',
    'lang': r'(\{/\* Language Toggle settings \*/\}.*?)\{/\* QQ fields — when Karakalpak is ON \*/\}',
    'qqBasic': r'(\{/\* QQ fields — when Karakalpak is ON \*/\}.*?)\{/\* RU fields — when Russian is ON \*/\}',
    'ruBasic': r'(\{/\* RU fields — when Russian is ON \*/\}.*?)\{/\* Template custom fields \*/\}',
    'template': r'(\{/\* Template custom fields \*/\}.*?)\{/\* Upload Photo \*/\}',
    'photo': r'(\{/\* Upload Photo \*/\}.*?)\{/\* Music URL / Upload \*/\}',
    'music': r'(\{/\* Music URL / Upload \*/\}.*?)\{/\* Program / Timeline editor \*/\}',
    'programUz': r'(\{/\* Program / Timeline editor \*/\}.*?)\{/\* Karakalpak Program editor — when QQ is ON \*/\}',
    'programQq': r'(\{/\* Karakalpak Program editor — when QQ is ON \*/\}.*?)\{/\* Russian Program editor — when RU is ON \*/\}',
    'programRu': r'(\{/\* Russian Program editor — when RU is ON \*/\}.*?)\{/\* Photo Gallery \*/\}',
    'gallery': r'(\{/\* Photo Gallery \*/\}.*?)(?=  const handleAddPhoto)'
}

blocks = {}
for name, p in patterns.items():
    m = re.search(p, text, re.DOTALL)
    if m:
        blocks[name] = m.group(1).rstrip() + '\n\n      '
    else:
        print(f"FAILED to find {name}")

# Reorder
new_order = [
    'lang',
    'coreFields',
    'msg',
    'programUz',
    'qqBasic',
    'programQq',
    'ruBasic',
    'programRu',
    'dateLoc',
    'template',
    'photo',
    'music',
    'gallery'
]

# We need to replace the entire chunk
start_marker = r'\{/\* Core fields \*/\}'
end_marker = r'(?=  const handleAddPhoto)'
full_pattern = start_marker + r'.*?' + end_marker

m = re.search(full_pattern, text, re.DOTALL)
if m:
    replacement = ""
    for b in new_order:
        replacement += blocks[b]
    
    # We must ensure we put '{/* Core fields */}' back correctly, wait `replacement` contains the comment headers natively.
    new_text = text[:m.start()] + replacement + text[m.end():]
    with open('client/src/components/Step3Content.jsx', 'w') as f:
        f.write(new_text)
    print("SUCCESS")
else:
    print("FAILED to find full block")

