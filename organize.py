import os

with open("client/src/components/Step3Content.jsx", "r") as f:
    orig = f.read()

def extract_block(header):
    start = orig.find(header)
    if start == -1: return ""
    # Find next top-level comment as end
    end = orig.find("{/*", start + 10)
    # Special cases:
    if "Russian Program editor" in header:
        end = orig.find("{/* Photo Gallery */}")
    return orig[start:end].rstrip() + "\n\n      "

b_core = extract_block("{/* Core fields */}")
b_loc = extract_block("{/* Date & location */}")
b_msg = extract_block("{/* Message */}")
b_lang = extract_block("{/* Language Toggle settings */}")
# QQ fields extract has a problem because it's wrapped. We'll extract carefully
b_qq_fields = extract_block("{/* QQ fields — when Karakalpak is ON */}")
b_ru_fields = extract_block("{/* RU fields — when Russian is ON */}")

# Remove the '      </div>\n' from the end of b_ru_fields because the '</div>' belongs to 'Language Toggle settings' container
if b_ru_fields.endswith("</div>\n\n      "):
    b_ru_fields = b_ru_fields[:-14] + "\n      "

b_template = extract_block("{/* Template custom fields */}")
b_extras = extract_block("{/* Extra features: music + telegram */}")
b_prog_uz = extract_block("{/* Program / Timeline editor */}")
b_prog_qq = extract_block("{/* Karakalpak Program editor — when QQ is ON */}")
b_prog_ru = extract_block("{/* Russian Program editor — when RU is ON */}")
b_gallery = orig[orig.find("{/* Photo Gallery */}"):orig.find("    </div>\n  );\n\n  return (")]

# Since QQ fields are inside `data.customFields?.langQq && (`, we wrap QQ basic and QQ program in ONE panel:
def make_panel_qq(basic, prog):
    inner_b = basic.replace("{data.customFields?.langQq && (", "", 1).strip()
    if inner_b.endswith(")}"):
        inner_b = inner_b[:-2].strip()
    inner_p = prog.replace("{data.customFields?.langQq && (", "", 1).strip()
    if inner_p.endswith(")}"):
        inner_p = inner_p[:-2].strip()
    return f"""{{/* QQ Panel */}}
      {{data.customFields?.langQq && (
      <div className="glass p-5 space-y-4">
        <h3 className="text-xs font-semibold text-surface-300 uppercase tracking-wider flex items-center gap-2">
          🔵 Qaraqalpoq tili
        </h3>
        {inner_b}
        {inner_p}
      </div>
      )}}
"""

def make_panel_ru(basic, prog):
    inner_b = basic.replace("{data.customFields?.langRu && (", "", 1).strip()
    if inner_b.endswith(")}"):
        inner_b = inner_b[:-2].strip()
    inner_p = prog.replace("{data.customFields?.langRu && (", "", 1).strip()
    if inner_p.endswith(")}"):
        inner_p = inner_p[:-2].strip()
    return f"""{{/* RU Panel */}}
      {{data.customFields?.langRu && (
      <div className="glass p-5 space-y-4">
        <h3 className="text-xs font-semibold text-surface-300 uppercase tracking-wider flex items-center gap-2">
          🔴 Русский язык
        </h3>
        {inner_b}
        {inner_p}
      </div>
      )}}
"""

# Let's cleanly put UZ all in one block
def make_panel_uz(core, msg, prog):
    # These are individually wrapped with `{isUzOn && (`
    return f"""{{/* UZ Panel */}}
      {core.strip()}
      {msg.strip()}
      {prog.strip()}
"""

lang_toggles = b_lang.strip() + "\n      </div>\n\n"

new_middle = (
    lang_toggles +
    b_template +
    b_loc +
    make_panel_uz(b_core, b_msg, b_prog_uz) + "\n\n      " +
    make_panel_qq(b_qq_fields, b_prog_qq) + "\n\n      " +
    make_panel_ru(b_ru_fields, b_prog_ru) + "\n\n      " +
    b_extras +
    b_gallery
)

start_idx = orig.find("{/* Core fields */}")
end_idx = orig.find("    </div>\n  );\n\n  return (")

new_text = orig[:start_idx] + new_middle + "\n" + orig[end_idx:]

with open("client/src/components/Step3Content.test.jsx", "w") as f:
    f.write(new_text)

os.system('export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH" && cp client/src/components/Step3Content.test.jsx client/src/components/Step3Content.jsx && cd client && npm run build')
