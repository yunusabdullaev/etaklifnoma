with open("client/src/components/Step3Content.jsx", "r") as f:
    text = f.read()

# 1. Grab Language Toggles
start_lang = text.find("{/* Language Toggle settings */}")
end_lang = text.find("{/* QQ fields — when Karakalpak is ON */}")
lang_block = text[start_lang:end_lang]

# Wait, lang block has a closing </div> at the end of RU fields!
# Language Toggle settings starts at 128, and ends at 239 where the </div> is.
end_ru = text.find("{/* Template custom fields */}")
lang_full_container = text[start_lang:end_ru]

# 2. Grab Template Fields
start_temp = text.find("{/* Template custom fields */}")
end_temp = text.find("{/* Extra features: music + telegram */}")
temp_block = text[start_temp:end_temp]

# We will cut them from their original positions and prepend them at the start of `formContent`
text = text.replace(lang_full_container, "")
text = text.replace(temp_block, "")

# Find start of Core fields
insert_pos = text.find("{/* Core fields */}")

# Prepend
new_text = text[:insert_pos] + lang_full_container + temp_block + text[insert_pos:]

with open("client/src/components/Step3Content.jsx", "w") as f:
    f.write(new_text)

print("SUCCESS")
