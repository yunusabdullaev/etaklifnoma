import sys

with open('client/src/components/Step3Content.jsx', 'r') as f:
    text = f.read()

# 1. Close Lang Settings box and start Texts box BEFORE QQ fields
target1 = """
        {/* QQ fields — when Karakalpak is ON */}"""
rep1 = """
      </div>

      {/* TEXT FIELDS COMPONENT */}
      <div className="glass p-5 space-y-8">
        <h3 className="text-[13px] font-bold text-primary-300 uppercase tracking-wider flex items-center gap-2 mb-2 border-b border-primary-500/20 pb-4">
          ✍️ Matnlar (Barcha tillardagi yozuvlar)
        </h3>

        {/* QQ fields — when Karakalpak is ON */}"""
text = text.replace(target1, rep1)

# 2. Extract UZ Core Fields & UZ Message to put BEFORE QQ Fields
uz_core_target = """      {/* Core fields */}
      {isUzOn && (
      <div className="glass p-5 space-y-4">
        <h3 className="text-xs font-semibold text-surface-300 uppercase tracking-wider flex items-center gap-2">
          <User size={13} /> {t('step3.basicInfo')}
        </h3>"""

uz_core_end = """        </div>
      </div>
      )}"""
# I need to match everything between uz_core_target and uz_core_end
import re
uz_core_match = re.search(r'\{\/\* Core fields \*\/\}.*?</div>\n      </div>\n      \)\}', text, re.DOTALL)
uz_msg_match = re.search(r'\{\/\* Message \*\/\}.*?</div>\n      \)\}', text, re.DOTALL)

if uz_core_match and uz_msg_match:
    uz_core_str = uz_core_match.group(0)
    uz_msg_str = uz_msg_match.group(0)
    
    # Remove them from their original spots
    text = text.replace(uz_core_str + '\n\n', '')
    text = text.replace(uz_msg_str + '\n\n', '')
    
    # Now build the UZ wrapper
    uz_wrapper = f"""
        {{/* UZ fields */}}
        {{isUzOn && (
          <div className="space-y-4 pb-4 border-b border-white/5">
            <h4 className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 inline-block px-2.5 py-1 rounded-md border border-emerald-500/20 shadow-sm">🇺🇿 O'zbek tili</h4>
{uz_core_str}

{uz_msg_str}
          </div>
        )}}
"""
    # Fix their inner structure (remove 'glass p-5')
    uz_wrapper = uz_wrapper.replace('<div className="glass p-5 space-y-4">', '<div className="space-y-4">')
    uz_wrapper = uz_wrapper.replace('<div className="glass p-5 space-y-3">', '<div className="space-y-3">')
    
    # Insert UZ wrapper right before QQ fields
    text = text.replace('{/* QQ fields — when Karakalpak is ON */}', uz_wrapper + '\n        {/* QQ fields — when Karakalpak is ON */}')

# 3. Put Programs into their language blocks!
qq_prog_match = re.search(r'\{\/\* Karakalpak Program editor — when QQ is ON \*\/\}.*?</div>\n        \)\}', text, re.DOTALL)
ru_prog_match = re.search(r'\{\/\* Russian Program editor — when RU is ON \*\/\}.*?</div>\n        \)\}', text, re.DOTALL)
uz_prog_match = re.search(r'\{\/\* Program / Timeline editor \*\/\}.*?</div>\n        \)\}', text, re.DOTALL)

if qq_prog_match and ru_prog_match and uz_prog_match:
    qq_prog = qq_prog_match.group(0)
    ru_prog = ru_prog_match.group(0)
    uz_prog = uz_prog_match.group(0)
    
    text = text.replace(qq_prog + '\n\n', '')
    text = text.replace(ru_prog + '\n\n', '')
    text = text.replace(uz_prog + '\n\n', '')
    
    # Append UZ prog inside UZ wrapper
    text = text.replace(uz_msg_str + '\n          </div>\n        )}', uz_msg_str + '\n' + uz_prog + '\n          </div>\n        )}')
    
    # Append QQ prog inside QQ wrapper
    text = text.replace('className="input-field resize-none" />\n            </div>\n          </div>', 'className="input-field resize-none" />\n            </div>\n\n' + qq_prog + '\n          </div>')

    # Append RU prog inside RU wrapper (Wait, RU wrapper ends with </div>)} )
    text = text.replace('className="input-field resize-none" />\n            </div>\n          </div>\n        )}', 'className="input-field resize-none" />\n            </div>\n\n' + ru_prog + '\n          </div>\n        )}')

# 4. End Texts Box and Start Global Box
# The RU wrapper ends at `</div>\n        )}`
end_texts_target = """          </div>
        )}

      {/* Template specific fields */}"""
rep4 = """          </div>
        )}
      </div>

      {/* GLOBAL SETTINGS COMPONENT */}
      <div className="glass p-5 space-y-8">
        <h3 className="text-[13px] font-bold text-primary-300 uppercase tracking-wider flex items-center gap-2 mb-2 border-b border-primary-500/20 pb-4">
          ⚙️ O'zgarmas ma'lumotlar va Sozlamalar
        </h3>

      {/* Template specific fields */}"""
# Because RU prog might have messed this up, we just match RU block end
ru_block_end = """            </div>\n\n""" + ru_prog + """\n          </div>\n        )}"""
text = text.replace(ru_block_end + "\n\n", ru_block_end + "\n      </div>\n\n      {/* GLOBAL SETTINGS COMPONENT */}\n      <div className=\"glass p-5 space-y-8\">\n        <h3 className=\"text-[13px] font-bold text-primary-300 uppercase tracking-wider flex items-center gap-2 mb-2 border-b border-primary-500/20 pb-4\">\n          ⚙️ O'zgarmas ma'lumotlar va Sozlamalar\n        </h3>\n\n")

# Remove extra glass boxes from Date/Location and Extras
text = text.replace('<div className="glass p-5 space-y-4">\n        <h3 className="text-xs font-semibold text-surface-300 uppercase tracking-wider flex items-center gap-2">\n          <Calendar size={13} /> {t(\'step3.dateLocation\')}\n        </h3>', '<div className="space-y-4">\n        <h3 className="text-xs font-semibold text-surface-300 uppercase tracking-wider flex items-center gap-2">\n          <Calendar size={13} /> {t(\'step3.dateLocation\')}\n        </h3>')

text = text.replace('{/* Extra features: music + telegram */}\n      <div className="glass p-5 space-y-4">', '{/* Extra features: music + telegram */}\n      <div className="space-y-4">')

with open('client/src/components/Step3Content.jsx', 'w') as f:
    f.write(text)

print("UI Re-organized successfully.")
