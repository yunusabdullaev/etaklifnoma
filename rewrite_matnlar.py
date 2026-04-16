import re

with open('client/src/components/Step3Content.jsx', 'r') as f:
    text = f.read()

idx_start = text.find('{/* TEXT FIELDS COMPONENT */}')
idx_end = text.find('{/* GLOBAL SETTINGS COMPONENT */}')

if idx_start == -1 or idx_end == -1:
    print("COULD NOT FIND START OR END")
    exit(1)

new_block = """{/* TEXT FIELDS COMPONENT */}
      <div className="glass p-5 space-y-8">
        <h3 className="text-[13px] font-bold text-primary-300 uppercase tracking-wider flex items-center gap-2 mb-2 border-b border-primary-500/20 pb-4">
          ✍️ Matnlar (Barcha tillardagi yozuvlar)
        </h3>

        {/* UZ fields */}
        {isUzOn && (
          <div className="space-y-4">
            <h4 className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 inline-block px-2.5 py-1 rounded-md border border-emerald-500/20 shadow-sm">🇺🇿 {trLocal.uzFields}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="label">👤 {trLocal.uzHostName} *</label>
                <input type="text" placeholder="Aliyev Jasur"
                  value={data.hostName || ''} onChange={(e) => handleChange('hostName', e.target.value)}
                  className="input-field" />
              </div>
              <div>
                <label className="label">👥 {trLocal.uzGuestName}</label>
                <input type="text" placeholder="Hurmatli mehmon"
                  value={data.guestName || ''} onChange={(e) => handleChange('guestName', e.target.value)}
                  className="input-field" />
              </div>
            </div>
            <div>
              <label className="label flex items-center gap-1.5">✏️ {trLocal.uzEventTitle}</label>
              <input type="text" placeholder="Nikoh marosimi"
                value={data.eventTitle || ''} onChange={(e) => handleChange('eventTitle', e.target.value)}
                className="input-field" />
            </div>
            
            <div className="space-y-3 mt-3">
              <label className="label flex items-center gap-1.5">💬 {trLocal.msg}</label>
              <textarea rows={3} placeholder="Hurmatli mehmonlar, sizni..."
                value={data.message || ''} onChange={(e) => handleChange('message', e.target.value)}
                className="input-field resize-none" />
            </div>

            <div className="mt-4 border-t border-white/5 pt-4">
              <div className="flex items-center justify-between mb-2">
                <label className="label flex items-center gap-2 mb-0">📅 Dastur (UZ)</label>
                <input type="text" placeholder="Sarlavha (UZ)" value={data.customFields?.programCustomTitle || ''}
                  onChange={(e) => handleCustomFieldChange('programCustomTitle', e.target.value)}
                  className="input-field text-xs py-1 px-3 w-[150px] shadow-sm bg-surface-50 border-surface-200" />
              </div>
              {(() => {
                let items = [];
                try { items = data.customFields?.program ? JSON.parse(data.customFields.program) : []; } catch { items = []; }
                if (items.length === 0) {
                  items = [
                    { time: data.eventTime || '18:00', text: 'Mehmonlarni kutib olish' },
                    { time: '18:30', text: 'Rasmiy qism' },
                    { time: '19:00', text: 'Bayram dasturxoni' },
                    { time: '21:00', text: 'Musiqiy tanaffus' },
                  ];
                }
                const updateProgram = (newItems) => { handleCustomFieldChange('program', JSON.stringify(newItems)); };
                return (
                  <div className="space-y-2">
                    {items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input type="time" value={item.time} onChange={(e) => { const n = [...items]; n[i] = { ...n[i], time: e.target.value }; updateProgram(n); }} className="input-field w-28 text-center" />
                        <input type="text" value={item.text} onChange={(e) => { const n = [...items]; n[i] = { ...n[i], text: e.target.value }; updateProgram(n); }} className="input-field flex-1" placeholder="Tadbir nomi" />
                        {items.length > 1 && (<button type="button" onClick={() => updateProgram(items.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-300 text-sm px-2 py-1 shrink-0">✕</button>)}
                      </div>
                    ))}
                    <button type="button" onClick={() => updateProgram([...items, { time: '', text: '' }])} className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1 mt-1">+ Punkt qo'shish</button>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* QQ fields */}
        {data.customFields?.langQq && (
          <div className="space-y-4 border-t border-white/5 pt-6 mt-6">
            <h4 className="text-[11px] font-bold text-amber-400 bg-amber-500/10 inline-block px-2.5 py-1 rounded-md border border-amber-500/20 shadow-sm">🇰🇦 {trLocal.qqFields}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="label">👤 {trLocal.qqHostName}</label>
                <input type="text" placeholder="Aliyev Jasur"
                  value={data.customFields?.hostNameQq || ''}
                  onChange={(e) => handleCustomFieldChange('hostNameQq', e.target.value)}
                  className="input-field" />
              </div>
              <div>
                <label className="label">👥 {trLocal.qqGuestName}</label>
                <input type="text" placeholder="Húrmetli mexmanlar"
                  value={data.customFields?.guestNameQq || ''}
                  onChange={(e) => handleCustomFieldChange('guestNameQq', e.target.value)}
                  className="input-field" />
              </div>
            </div>
            <div>
              <label className="label">✏️ {trLocal.qqEventTitle}</label>
              <input type="text" placeholder="Nikax márásimi"
                value={data.customFields?.eventTitleQq || ''}
                onChange={(e) => handleCustomFieldChange('eventTitleQq', e.target.value)}
                className="input-field" />
            </div>
            
            <div className="space-y-3 mt-3">
              <label className="label flex items-center gap-1.5">💬 {trLocal.msg}</label>
              <textarea rows={3} placeholder="Sizdi márásimimizge shaqıramız..."
                value={data.customFields?.messageQq || ''}
                onChange={(e) => handleCustomFieldChange('messageQq', e.target.value)}
                className="input-field resize-none" />
            </div>

            <div className="mt-4 border-t border-white/5 pt-4">
              <div className="flex items-center justify-between mb-2">
                <label className="label flex items-center gap-2 mb-0">📅 Bag'darlanma (QQ)</label>
                <input type="text" placeholder="Sarlavha (QQ)" value={data.customFields?.programCustomTitleQq || ''}
                  onChange={(e) => handleCustomFieldChange('programCustomTitleQq', e.target.value)}
                  className="input-field text-xs py-1 px-3 w-[150px] shadow-sm bg-surface-50 border-surface-200" />
              </div>
              {(() => {
                let items = [];
                try { items = data.customFields?.programQq ? JSON.parse(data.customFields.programQq) : []; } catch { items = []; }
                if (items.length === 0) {
                  items = [
                    { time: data.eventTime || '18:00', text: 'Mexmanlar kútip alıw' },
                    { time: '18:30', text: 'Rásimiy bólim' },
                    { time: '19:00', text: 'Ziyapat dástúrxanı' },
                    { time: '21:00', text: 'Muzıkalı waqıtlar' },
                  ];
                }
                const updateProgramQq = (newItems) => { handleCustomFieldChange('programQq', JSON.stringify(newItems)); };
                return (
                  <div className="space-y-2">
                    {items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input type="time" value={item.time} onChange={(e) => { const n = [...items]; n[i] = { ...n[i], time: e.target.value }; updateProgramQq(n); }} className="input-field w-28 text-center" />
                        <input type="text" value={item.text} onChange={(e) => { const n = [...items]; n[i] = { ...n[i], text: e.target.value }; updateProgramQq(n); }} className="input-field flex-1" placeholder="Ilaje atı" />
                        {items.length > 1 && (<button type="button" onClick={() => updateProgramQq(items.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-300 text-sm px-2 py-1 shrink-0">✕</button>)}
                      </div>
                    ))}
                    <button type="button" onClick={() => updateProgramQq([...items, { time: '', text: '' }])} className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1 mt-1">+ Punkt qosıw</button>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* RU fields */}
        {data.customFields?.langRu && (
          <div className="space-y-4 border-t border-white/5 pt-6 mt-6">
            <h4 className="text-[11px] font-bold text-indigo-400 bg-indigo-500/10 inline-block px-2.5 py-1 rounded-md border border-indigo-500/20 shadow-sm">🇷🇺 {trLocal.ruFields}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="label">👤 {trLocal.ruHostName}</label>
                <input type="text" placeholder="Абдуллаев Юнус"
                  value={data.customFields?.hostNameRu || ''}
                  onChange={(e) => handleCustomFieldChange('hostNameRu', e.target.value)}
                  className="input-field" />
              </div>
              <div>
                <label className="label">👥 {trLocal.ruGuestName}</label>
                <input type="text" placeholder="Уважаемые гости"
                  value={data.customFields?.guestNameRu || ''}
                  onChange={(e) => handleCustomFieldChange('guestNameRu', e.target.value)}
                  className="input-field" />
              </div>
            </div>
            <div>
              <label className="label">✏️ {trLocal.ruEventTitle}</label>
              <input type="text" placeholder="Свадебное торжество"
                value={data.customFields?.eventTitleRu || ''}
                onChange={(e) => handleCustomFieldChange('eventTitleRu', e.target.value)}
                className="input-field" />
            </div>
            
            <div className="space-y-3 mt-3">
              <label className="label flex items-center gap-1.5">💬 {trLocal.msg}</label>
              <textarea rows={3} placeholder="Приглашаем вас на наше торжество..."
                value={data.customFields?.messageRu || ''}
                onChange={(e) => handleCustomFieldChange('messageRu', e.target.value)}
                className="input-field resize-none" />
            </div>

            <div className="mt-4 border-t border-white/5 pt-4">
              <div className="flex items-center justify-between mb-2">
                <label className="label flex items-center gap-2 mb-0">📅 Программа (RU)</label>
                <input type="text" placeholder="Заголовок (RU)" value={data.customFields?.programCustomTitleRu || ''}
                  onChange={(e) => handleCustomFieldChange('programCustomTitleRu', e.target.value)}
                  className="input-field text-xs py-1 px-3 w-[150px] shadow-sm bg-surface-50 border-surface-200" />
              </div>
              {(() => {
                let items = [];
                try { items = data.customFields?.programRu ? JSON.parse(data.customFields.programRu) : []; } catch { items = []; }
                if (items.length === 0) {
                  items = [
                    { time: data.eventTime || '18:00', text: 'Встреча гостей' },
                    { time: '18:30', text: 'Торжественная часть' },
                    { time: '19:00', text: 'Праздничный банкет' },
                    { time: '21:00', text: 'Музыкальная программа' },
                  ];
                }
                const updateProgramRu = (newItems) => { handleCustomFieldChange('programRu', JSON.stringify(newItems)); };
                return (
                  <div className="space-y-2">
                    {items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input type="time" value={item.time} onChange={(e) => { const n = [...items]; n[i] = { ...n[i], time: e.target.value }; updateProgramRu(n); }} className="input-field w-28 text-center" />
                        <input type="text" value={item.text} onChange={(e) => { const n = [...items]; n[i] = { ...n[i], text: e.target.value }; updateProgramRu(n); }} className="input-field flex-1" placeholder="Событие" />
                        {items.length > 1 && (<button type="button" onClick={() => updateProgramRu(items.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-300 text-sm px-2 py-1 shrink-0">✕</button>)}
                      </div>
                    ))}
                    <button type="button" onClick={() => updateProgramRu([...items, { time: '', text: '' }])} className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1 mt-1">+ Добавить пункт</button>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      """

text = text[:idx_start] + new_block + text[idx_end:]

with open('client/src/components/Step3Content.jsx', 'w') as f:
    f.write(text)

print("SUCCESS")
