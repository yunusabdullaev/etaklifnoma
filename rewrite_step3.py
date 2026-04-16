with open("client/src/components/Step3Content.jsx", "r") as f:
    text = f.read()

# I will extract each block exactly from its comment inside `formContent`
def extract_block(start_marker, stop_marker):
    start = text.find(start_marker)
    stop = text.find(stop_marker, start)
    return text[start:stop]

b_core = extract_block("{/* Core fields */}", "{/* Date & location */}")
b_date_loc = extract_block("{/* Date & location */}", "{/* Message */}")
b_message = extract_block("{/* Message */}", "{/* Language Toggle settings */}")
b_lang_setup = extract_block("{/* Language Toggle settings */}", "{/* QQ fields — when Karakalpak is ON */}")
b_qq_basic = extract_block("{/* QQ fields — when Karakalpak is ON */}", "{/* RU fields — when Russian is ON */}")
b_ru_basic = extract_block("{/* RU fields — when Russian is ON */}", "      </div>\n\n      {/* Template custom fields */}")
b_template = extract_block("{/* Template custom fields */}", "{/* Extra features: music + telegram */}")
b_extras = extract_block("{/* Extra features: music + telegram */}", "{/* Program / Timeline editor */}")
b_prog_uz = extract_block("{/* Program / Timeline editor */}", "{/* Karakalpak Program editor — when QQ is ON */}")
b_prog_qq = extract_block("{/* Karakalpak Program editor — when QQ is ON */}", "{/* Russian Program editor — when RU is ON */}")
b_prog_ru = extract_block("{/* Russian Program editor — when RU is ON */}", "{/* Photo Gallery */}")
b_gallery_and_end = text[text.find("{/* Photo Gallery */}") : text.find("  const handleCustomFieldChange")]
# actually, "Photo Gallery" to the end of formContent
start_gallery = text.find("{/* Photo Gallery */}")
end_gallery = text.find("    </div>\n  );\n\n  return (", start_gallery)
b_gallery = text[start_gallery:end_gallery]

# Now let's assemble them in the requested logical order:
# 1. Language Setup
# 2. Template Fields
# 3. Date & Location
# 4. Uzbek Block (Core + Message + Prog Uz) -> wrapped nicely
# 5. Qq Block (Basic + Prog Qq) -> wrapped nicely
# 6. Ru Block (Basic + Prog Ru) -> wrapped nicely
# 7. Extras (Music + Gallery)

# Format the UZ block:
uz_block = f"""
      {{/* ----- O'ZBEK TILI MA'LUMOTLARI ----- */}}
{b_core}{b_message}      {{isUzOn && (
      <div className="glass p-5 space-y-4">
{b_prog_uz.replace('{isUzOn && (', '').replace(')}', '', 1)}      </div>
      )}}
"""

qq_block = f"""
      {{/* ----- QORAQALPOQ TILI MA'LUMOTLARI ----- */}}
      {{data.customFields?.langQq && (
      <div className="glass p-5 space-y-4">
        <h3 className="text-xs font-semibold text-surface-300 uppercase tracking-wider flex items-center gap-2">
          🔵 Qaraqalpoq tili
        </h3>
{b_qq_basic.replace('{data.customFields?.langQq && (', '').replace(')}', '', 1)}{b_prog_qq.replace('{data.customFields?.langQq && (', '').replace(')}', '', 1)}      </div>
      )}}
"""

ru_block = f"""
      {{/* ----- RUS TILI MA'LUMOTLARI ----- */}}
      {{data.customFields?.langRu && (
      <div className="glass p-5 space-y-4">
        <h3 className="text-xs font-semibold text-surface-300 uppercase tracking-wider flex items-center gap-2">
          🔴 Русский язык
        </h3>
{b_ru_basic.replace('{data.customFields?.langRu && (', '').replace(')}', '', 1)}{b_prog_ru.replace('{data.customFields?.langRu && (', '').replace(')}', '', 1)}      </div>
      )}}
"""

# Assembly
new_formContent = (
    b_lang_setup + 
    "      </div>\n\n" + 
    b_template + 
    b_date_loc + 
    uz_block + 
    qq_block + 
    ru_block + 
    b_extras + 
    b_gallery
)

start_idx = text.find("{/* Core fields */}")
new_text = text[:start_idx] + new_formContent + text[end_gallery:]

with open("client/src/components/Step3Content.jsx", "w") as f:
    f.write(new_text)

print("Replacement Complete")
