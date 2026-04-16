import re

with open('client/src/components/Step3Content.jsx', 'r') as f:
    text = f.read()

uz_timeline = """
{/* O'zbek Program editor */}
        {isUzOn && (
          <div className="mt-4 border-t border-white/5 pt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="label flex items-center gap-2 mb-0">📅 Dastur (UZ)</label>
              <input
                type="text"
                placeholder="Sarlavha (UZ)"
                value={data.customFields?.programCustomTitle || ''}
                onChange={(e) => handleCustomFieldChange('programCustomTitle', e.target.value)}
                className="input-field text-xs py-1 px-3 w-[150px] shadow-sm bg-surface-50 border-surface-200"
              />
            </div>
            {(() => {
              let items = [];
              try {
                items = data.customFields?.program ? JSON.parse(data.customFields.program) : [];
              } catch { items = []; }
              if (items.length === 0) {
                items = [
                  { time: data.eventTime || '18:00', text: 'Mehmonlarni kutib olish' },
                  { time: '18:30', text: 'Rasmiy qism' },
                  { time: '19:00', text: 'Bayram dasturxoni' },
                  { time: '21:00', text: 'Musiqiy tanaffus' },
                ];
              }
              const updateProgram = (newItems) => {
                handleCustomFieldChange('program', JSON.stringify(newItems));
              };
              return (
                <div className="space-y-2">
                  {items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input type="time" value={item.time}
                        onChange={(e) => { const n = [...items]; n[i] = { ...n[i], time: e.target.value }; updateProgram(n); }}
                        className="input-field w-28 text-center" />
                      <input type="text" value={item.text}
                        onChange={(e) => { const n = [...items]; n[i] = { ...n[i], text: e.target.value }; updateProgram(n); }}
                        className="input-field flex-1" placeholder="Tadbir nomi" />
                      {items.length > 1 && (
                        <button type="button" onClick={() => updateProgram(items.filter((_, j) => j !== i))}
                          className="text-red-400 hover:text-red-300 text-sm px-2 py-1 shrink-0">✕</button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => updateProgram([...items, { time: '', text: '' }])}
                    className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1 mt-1">
                    + Punkt qo'shish
                  </button>
                </div>
              );
            })()}
          </div>
        )}
"""

# Insert UZ timeline
import re
text = re.sub(r'(className="input-field resize-none"\s*/>\s*</div>\s*)\)}', r'\1' + uz_timeline + r'\n      )}', text, count=1)

ru_timeline = """
{/* Russian Program editor — when RU is ON */}
        {data.customFields?.langRu && (
          <div className="mt-4 border-t border-white/5 pt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="label flex items-center gap-2 mb-0">📅 Программа (RU)</label>
              <input
                type="text"
                placeholder="Заголовок (RU)"
                value={data.customFields?.programCustomTitleRu || ''}
                onChange={(e) => handleCustomFieldChange('programCustomTitleRu', e.target.value)}
                className="input-field text-xs py-1 px-3 w-[150px] shadow-sm bg-surface-50 border-surface-200"
              />
            </div>
            {(() => {
              let items = [];
              try {
                items = data.customFields?.programRu ? JSON.parse(data.customFields.programRu) : [];
              } catch { items = []; }
              if (items.length === 0) {
                items = [
                  { time: data.eventTime || '18:00', text: 'Встреча гостей' },
                  { time: '18:30', text: 'Торжественная часть' },
                  { time: '19:00', text: 'Праздничный банкет' },
                  { time: '21:00', text: 'Музыкальная программа' },
                ];
              }
              const updateProgramRu = (newItems) => {
                handleCustomFieldChange('programRu', JSON.stringify(newItems));
              };
              return (
                <div className="space-y-2">
                  {items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input type="time" value={item.time}
                        onChange={(e) => { const n = [...items]; n[i] = { ...n[i], time: e.target.value }; updateProgramRu(n); }}
                        className="input-field w-28 text-center" />
                      <input type="text" value={item.text}
                        onChange={(e) => { const n = [...items]; n[i] = { ...n[i], text: e.target.value }; updateProgramRu(n); }}
                        className="input-field flex-1" placeholder="Событие" />
                      {items.length > 1 && (
                        <button type="button" onClick={() => updateProgramRu(items.filter((_, j) => j !== i))}
                          className="text-red-400 hover:text-red-300 text-sm px-2 py-1 shrink-0">✕</button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => updateProgramRu([...items, { time: '', text: '' }])}
                    className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1 mt-1">
                    + Добавить пункт
                  </button>
                </div>
              );
            })()}
          </div>
        )}
"""

# The RU block currently has QQ timeline appended to it. We need to replace it.
ru_block_match = re.search(r'\{\/\* Karakalpak Program editor — when QQ is ON \*\/\}[\s\S]*?\+ Punkt qosıw\n\s*</button>\n\s*</div>\n\s*\);\n\s*\}\)\(\)\}\n\s*</div>\n\s*\)\}', text)

if ru_block_match:
    # we just need to replace the SECOND match of qq_prog because there is one inside the QQ block itself!
    # Wait, the QQ block one is completely fine, but the RU block has the EXACT SAME Karakalpak string down to `{data.customFields?.langQq && (`!
    text = text.replace(ru_block_match.group(0), ru_timeline)

with open('client/src/components/Step3Content.jsx', 'w') as f:
    f.write(text)

print("Timelines patched.")
