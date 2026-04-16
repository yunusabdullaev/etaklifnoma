import re

with open('client/src/components/Step3Content.jsx', 'r') as f:
    text = f.read()

# I want to find where `{/* Template custom fields */}` starts.
idx_start = text.find('{/* Template custom fields */}')

# I want to find where `formContent` closes: `    </div>\n  );`
idx_end = text.find('    </div>\n  );\n\n  return (')

if idx_start != -1 and idx_end != -1:
    body = text[idx_start:idx_end]
    
    # Remove any existing glass p-5 from Template fields
    body = body.replace('<div className="glass p-5 space-y-4">', '<div className="space-y-4 mb-4">', 1)
    
    # We will wrap the entire body in the Global block
    new_body = """
      {/* GLOBAL SETTINGS COMPONENT */}
      <div className="glass p-5 space-y-6">
        <h3 className="text-[13px] font-bold text-primary-300 uppercase tracking-wider flex items-center gap-2 mb-2 border-b border-primary-500/20 pb-4">
          ⚙️ O'zgarmas ma'lumotlar va Sozlamalar
        </h3>
        
        """ + body + """
      </div>"""
      
    text = text[:idx_start] + new_body + text[idx_end:]

    with open('client/src/components/Step3Content.jsx', 'w') as f:
        f.write(text)
    print("SUCCESS")
else:
    print("FAILED TO FIND BOUNDARIES")
