import re
import sys

with open('client/src/components/Step3Content.jsx', 'r') as f:
    content = f.read()

def getBlock(pattern):
    match = re.search(pattern, content, re.DOTALL)
    if not match:
        print(f"FAILED TO MATCH: {pattern[:50]}")
        sys.exit(1)
    return match.group(1)

langToggles = getBlock(r'(<div className="space-y-2">\s*\{\[\s*[\s\S]*?</div>\s*</div>)')
qqSettingsFields = getBlock(r'\{\/\* QQ fields — when Karakalpak is ON \*\/\}.*?<div className="space-y-3[^>]*>([\s\S]*?)</div>\s*\)\}')
ruSettingsFields = getBlock(r'\{\/\* RU fields — when Russian is ON \*\/\}.*?<div className="space-y-3[^>]*>([\s\S]*?)</div>\s*\)\}')
templateFields = getBlock(r'\{\/\* Template custom fields \*\/\}\s*\{templateFields.length > 0 && \(([\s\S]*?)\)\}')
uzCoreFields = getBlock(r'\{\/\* Core fields \*\/\}\s*\{isUzOn && \(\s*<div className="glass p-5 space-y-4">\s*<h3.*?</h3>([\s\S]*?)</div>\s*\)\}')
dateLocation = getBlock(r'\{\/\* Date & location \*\/\}\s*<div className="glass p-5 space-y-4">\s*<h3.*?</h3>([\s\S]*?)</div>')
uzMessage = getBlock(r'\{\/\* Message \*\/\}\s*\{isUzOn && \(\s*<div className="glass p-5 space-y-3">\s*<h3.*?</h3>([\s\S]*?)</div>\s*\)\}')
musicBlock = getBlock(r'<div>\s*<label className="label flex items-center gap-1\.5">🎵 \{t\(\'step3\.music\'\)\}</label>([\s\S]*?)(?=\{\/\* Program / Timeline editor \*\/})')
uzProgram = getBlock(r'\{\/\* Program / Timeline editor \*\/\}\s*\{isUzOn && \(\s*(<div>[\s\S]*?(?=</div>\s*\)\})</div>)\s*\)\}')
qqProgram = getBlock(r'\{\/\* Karakalpak Program editor — when QQ is ON \*\/\}\s*\{data\.customFields\?\.langQq && \(\s*(<div>[\s\S]*?(?=</div>\s*\)\})</div>)\s*\)\}')
ruProgram = getBlock(r'\{\/\* Russian Program editor — when RU is ON \*\/\}\s*\{data\.customFields\?\.langRu && \(\s*(<div>[\s\S]*?(?=</div>\s*\)\})</div>)\s*\)\}')
restExtras = getBlock(r'\{\/\* Color Palette \*\/\}([\s\S]*?)(?=</div>\s*</div>\s*\);\s*return \()')

new_form_content = f"""  const formContent = (
    <div className="space-y-6">
      
      {{/* 1. TILLARNI TANLASH SOZLAMALARI / LANG TOGGLES ONLY */}}
      <div className="glass p-5 space-y-4">
        <h3 className="text-xs font-semibold text-surface-300 uppercase tracking-wider flex items-center gap-2">
          🌐 {{t('step3.langSettings')}}
        </h3>
        <p className="text-[11px] text-surface-500">{{t('step3.langDesc')}}</p>
        
{langToggles}
      

      {{/* 2. MATNLAR (TILLAR KESIMIDA) / TEXT FIELDS PER LANGUAGE */}}
      <div className="glass p-5 space-y-8">
        <h3 className="text-[13px] font-bold text-primary-300 uppercase tracking-wider flex items-center gap-2 mb-2 border-b border-primary-500/20 pb-4">
          ✍️ Matnlar (Barcha tillardagi ismlar va yozuvlar)
        </h3>
        
        {{isUzOn && (
          <div className="space-y-4 pb-4">
            <h4 className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 inline-block px-2.5 py-1 rounded-md border border-emerald-500/20 shadow-sm">🇺🇿 O'zbek tili</h4>
{uzCoreFields}
{uzMessage}
            <div>
{uzProgram}
            </div>
          </div>
        )}}

        {{data.customFields?.langQq && (
          <div className="space-y-4 border-t border-white/10 pt-6 pb-4">
            <h4 className="text-[11px] font-bold text-sky-400 bg-sky-500/10 inline-block px-2.5 py-1 rounded-md border border-sky-500/20 shadow-sm">🇺🇿 Qaraqalpaq tili</h4>
{qqSettingsFields}
            <div>
{qqProgram}
            </div>
          </div>
        )}}

        {{data.customFields?.langRu && (
          <div className="space-y-4 border-t border-white/10 pt-6 pb-4">
            <h4 className="text-[11px] font-bold text-rose-400 bg-rose-500/10 inline-block px-2.5 py-1 rounded-md border border-rose-500/20 shadow-sm">🇷🇺 Rus tili</h4>
{ruSettingsFields}
            <div>
{ruProgram}
            </div>
          </div>
        )}}
      </div>

      {{/* 3. UMUMIY O'ZGARMAS SOZLAMALAR / GLOBAL NON-LANGUAGE SPECIFIC INFO */}}
      <div className="glass p-5 space-y-8">
        <h3 className="text-[13px] font-bold text-primary-300 uppercase tracking-wider flex items-center gap-2 mb-2 border-b border-primary-500/20 pb-4">
          ⚙️ O'zgarmas ma'lumotlar va Sozlamalar
        </h3>
        
        {{templateFields.length > 0 && (
          <div className="space-y-4 mb-6">
            <h4 className="text-[11px] font-bold text-surface-400 bg-white/5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md mb-2">
              <span className="text-base">{{data.eventType?.icon}}</span> 🛠 Shablonga xos maydonlar
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
{templateFields}
            </div>
          </div>
        )}}

        <div className="space-y-4 pb-4">
{dateLocation}
        </div>

        <div className="space-y-4 pb-4 border-t border-white/10 pt-6">
          <label className="text-[11px] font-bold text-surface-400 bg-white/5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md mb-1">🎵 Qo'shimcha: Musiqa fondi</label>
{musicBlock}
        </div>

        <div className="space-y-6 pt-2">
          {{/* Color Palette */}}
{restExtras}
        </div>
      </div>

    </div>
  );"""

match = re.search(r'const formContent = \([\s\S]*?</div>\s*</div>\s*\);\s*return \(', content)
if match:
    new_all = content[:match.start()] + new_form_content + "\n\n  return (" + content[match.end():]
    with open('client/src/components/Step3Content.jsx', 'w') as f:
        f.write(new_all)
    print("SUCCESS")
else:
    print("FAILED TO REPLACE")

