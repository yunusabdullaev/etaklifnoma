import re

with open('client/src/components/Step3Content.jsx', 'r') as f:
    text = f.read()

# I will find the Language Toggle settings block end:
dropdown = """
        {/* Default Language Selector */}
        <div className="pt-3 border-t border-white/5">
          <label className="label mb-1">Asosiy tilni tanlash (Taklifnoma ochilganda)</label>
          <div className="flex gap-2">
            {[
              { code: 'uz', label: 'UZ', icon: '🇺🇿', active: isUzOn },
              { code: 'qq', label: 'QQ', icon: '🇰🇦', active: data.customFields?.langQq },
              { code: 'ru', label: 'RU', icon: '🇷🇺', active: data.customFields?.langRu }
            ].filter(l => l.active !== false).map((langOpt) => {
              const def = data.customFields?.defaultLang || (isUzOn ? 'uz' : (data.customFields?.langQq ? 'qq' : 'ru'));
              const isSelected = def === langOpt.code;
              return (
                <button
                  key={langOpt.code}
                  type="button"
                  onClick={() => handleCustomFieldChange('defaultLang', langOpt.code)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isSelected ? 'bg-primary-500/20 text-primary-300 border border-primary-500/50 shadow-[0_0_10px_rgba(var(--color-primary-500),0.1)]' : 'bg-white/[0.03] text-surface-500 border border-white/5 hover:bg-white/[0.05]'
                  }`}
                >
                  <span className="text-sm">{langOpt.icon}</span> {langOpt.label}
                </button>
              );
            })}
          </div>
        </div>
"""

# The toggle block ends at:
search_block = """                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${isOn ? 'left-[22px]' : 'left-0.5'}`} />
                </span>
              </button>
            );
          })}
        </div>"""

text = text.replace(search_block, search_block + '\n' + dropdown)

with open('client/src/components/Step3Content.jsx', 'w') as f:
    f.write(text)

print("SUCCESS Default lang selector added.")
