import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Calendar, User, MessageSquare, Link2, Type, Eye, EyeOff } from 'lucide-react';
import LivePreview from './LivePreview';
import { useLang } from '../i18n';

export default function Step3Content({ data, onUpdate, onNext, onBack }) {
  const [showPreview, setShowPreview] = useState(true);
  const { t } = useLang();

  const handleChange = (field, value) => {
    onUpdate({ [field]: value });
  };

  const handleCustomFieldChange = (key, value) => {
    onUpdate({
      customFields: { ...data.customFields, [key]: value },
    });
  };

  const templateFields = data.template?.structure?.fields || [];

  const formContent = (
    <div className="space-y-5">
      {/* Core fields */}
      <div className="glass p-5 space-y-4">
        <h3 className="text-xs font-semibold text-surface-300 uppercase tracking-wider flex items-center gap-2">
          <User size={13} /> {t('step3.basicInfo')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="label">{t('step3.host')} *</label>
            <input type="text" placeholder="Aliyev Jasur"
              value={data.hostName || ''} onChange={(e) => handleChange('hostName', e.target.value)}
              className="input-field" />
          </div>
          <div>
            <label className="label">{t('step3.guest')}</label>
            <input type="text" placeholder="Hurmatli mehmon"
              value={data.guestName || ''} onChange={(e) => handleChange('guestName', e.target.value)}
              className="input-field" />
          </div>
        </div>
        <div>
          <label className="label flex items-center gap-1.5"><Type size={13} /> {t('step3.eventTitle')}</label>
          <input type="text" placeholder="Nikoh marosimi"
            value={data.eventTitle || ''} onChange={(e) => handleChange('eventTitle', e.target.value)}
            className="input-field" />
        </div>
      </div>

      {/* Date & location */}
      <div className="glass p-5 space-y-4">
        <h3 className="text-xs font-semibold text-surface-300 uppercase tracking-wider flex items-center gap-2">
          <Calendar size={13} /> {t('step3.dateLocation')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="label">{t('step3.date')} *</label>
            <input type="date" value={data.eventDate || ''}
              onChange={(e) => handleChange('eventDate', e.target.value)}
              className="input-field" />
          </div>
          <div>
            <label className="label flex items-center gap-1.5"><Clock size={13} /> {t('step3.time')}</label>
            <input type="time" value={data.eventTime || ''}
              onChange={(e) => handleChange('eventTime', e.target.value)}
              className="input-field" />
          </div>
        </div>
        <div>
          <label className="label flex items-center gap-1.5"><MapPin size={13} /> {t('step3.location')} *</label>
          <input type="text" placeholder="Navruz to'yxonasi, Toshkent"
            value={data.location || ''} onChange={(e) => handleChange('location', e.target.value)}
            className="input-field" />
        </div>
        <div>
          <label className="label flex items-center gap-1.5"><Link2 size={13} /> {t('step3.mapLink')}</label>
          <input type="url" placeholder="https://maps.google.com/..."
            value={data.locationUrl || ''} onChange={(e) => handleChange('locationUrl', e.target.value)}
            className="input-field" />
        </div>
      </div>

      {/* Message */}
      <div className="glass p-5 space-y-3">
        <h3 className="text-xs font-semibold text-surface-300 uppercase tracking-wider flex items-center gap-2">
          <MessageSquare size={13} /> {t('step3.message')}
        </h3>
        <textarea rows={3} placeholder={t('step3.messagePlaceholder')}
          value={data.message || ''} onChange={(e) => handleChange('message', e.target.value)}
          className="input-field resize-none" />
      </div>

      {/* Language Toggle settings */}
      <div className="glass p-5 space-y-4">
        <h3 className="text-xs font-semibold text-surface-300 uppercase tracking-wider flex items-center gap-2">
          🌐 {t('step3.langSettings')}
        </h3>
        <p className="text-[11px] text-surface-500">{t('step3.langDesc')}</p>

        {/* Three individual toggles */}
        <div className="space-y-2">
          {[
            { key: 'langUz', label: "O'zbek tili", code: 'UZ' },
            { key: 'langQq', label: 'Qaraqalpoq tili', code: 'QQ' },
            { key: 'langRu', label: 'Rus tili', code: 'RU' },
          ].map((opt) => {
            const isOn = data.customFields?.[opt.key] !== false && (opt.key === 'langUz' ? (data.customFields?.[opt.key] ?? true) : !!data.customFields?.[opt.key]);
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => handleCustomFieldChange(opt.key, !isOn)}
                className={`w-full flex items-center justify-between py-3 px-4 rounded-xl text-sm font-medium border transition-all ${
                  isOn
                    ? 'bg-primary-500/20 border-primary-500/50 text-primary-300'
                    : 'bg-white/[0.03] border-white/10 text-surface-500 hover:border-white/20'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isOn ? 'bg-primary-500/30' : 'bg-white/10'}`}>{opt.code}</span>
                  {opt.label}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${isOn ? 'bg-primary-500/30 text-primary-200' : 'bg-white/5 text-surface-500'}`}>
                  {isOn ? 'ON' : 'OFF'}
                </span>
              </button>
            );
          })}
        </div>

        {/* QQ fields — when Karakalpak is ON */}
        {data.customFields?.langQq && (
          <div className="space-y-3 border-t border-white/5 pt-4">
            <p className="text-[11px] text-surface-500 flex items-center gap-1">
              <span className="text-[9px] font-bold bg-white/10 px-1 py-0.5 rounded">QQ</span> Qaraqalpoqsha matnlar
            </p>
            <div>
              <label className="label">👤 Mezban atı</label>
              <input type="text" placeholder="Aliyev Jasur"
                value={data.customFields?.hostNameQq || ''}
                onChange={(e) => handleCustomFieldChange('hostNameQq', e.target.value)}
                className="input-field" />
            </div>
            <div>
              <label className="label">👥 Mehman atı</label>
              <input type="text" placeholder="Húrmetli mexmanlar"
                value={data.customFields?.guestNameQq || ''}
                onChange={(e) => handleCustomFieldChange('guestNameQq', e.target.value)}
                className="input-field" />
            </div>
            <div>
              <label className="label">✏️ Ilaje atı</label>
              <input type="text" placeholder="Nikax márásimi"
                value={data.customFields?.eventTitleQq || ''}
                onChange={(e) => handleCustomFieldChange('eventTitleQq', e.target.value)}
                className="input-field" />
            </div>
            <div>
              <label className="label">💬 Xabar</label>
              <textarea rows={3} placeholder="Sizdi márásimimizge shaqıramız..."
                value={data.customFields?.messageQq || ''}
                onChange={(e) => handleCustomFieldChange('messageQq', e.target.value)}
                className="input-field resize-none" />
            </div>
          </div>
        )}

        {/* RU fields — when Russian is ON */}
        {data.customFields?.langRu && (
          <div className="space-y-3 border-t border-white/5 pt-4">
            <p className="text-[11px] text-surface-500 flex items-center gap-1">
              <span className="text-[9px] font-bold bg-white/10 px-1 py-0.5 rounded">RU</span> Тексты на русском
            </p>
            <div>
              <label className="label">👤 Имя хозяина</label>
              <input type="text" placeholder="Абдуллаев Юнус"
                value={data.customFields?.hostNameRu || ''}
                onChange={(e) => handleCustomFieldChange('hostNameRu', e.target.value)}
                className="input-field" />
            </div>
            <div>
              <label className="label">👥 Имя гостя</label>
              <input type="text" placeholder="Уважаемые гости"
                value={data.customFields?.guestNameRu || ''}
                onChange={(e) => handleCustomFieldChange('guestNameRu', e.target.value)}
                className="input-field" />
            </div>
            <div>
              <label className="label">✏️ Название мероприятия</label>
              <input type="text" placeholder="Свадебное торжество"
                value={data.customFields?.eventTitleRu || ''}
                onChange={(e) => handleCustomFieldChange('eventTitleRu', e.target.value)}
                className="input-field" />
            </div>
            <div>
              <label className="label">💬 Сообщение</label>
              <textarea rows={3} placeholder="Приглашаем вас на наше торжество..."
                value={data.customFields?.messageRu || ''}
                onChange={(e) => handleCustomFieldChange('messageRu', e.target.value)}
                className="input-field resize-none" />
            </div>
          </div>
        )}
      </div>

      {/* Template custom fields */}
      {templateFields.length > 0 && (
        <div className="glass p-5 space-y-4">
          <h3 className="text-xs font-semibold text-surface-300 uppercase tracking-wider flex items-center gap-2">
            <span className="text-base">{data.eventType?.icon}</span> {t('step3.templateFields')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {templateFields.map((field) => (
              <div key={field.key} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                <label className="label">
                  {field.label} {field.required && <span className="text-rose-400">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea rows={3} placeholder={field.label}
                    value={data.customFields?.[field.key] || ''}
                    onChange={(e) => handleCustomFieldChange(field.key, e.target.value)}
                    className="input-field resize-none" />
                ) : (
                  <input type={field.type === 'number' ? 'number' : 'text'}
                    placeholder={field.label}
                    value={data.customFields?.[field.key] || ''}
                    onChange={(e) => handleCustomFieldChange(field.key, e.target.value)}
                    className="input-field" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Extra features: music + telegram */}
      <div className="glass p-5 space-y-4">
        <h3 className="text-xs font-semibold text-surface-300 uppercase tracking-wider flex items-center gap-2">
          ⚙️ {t('step3.extras')}
        </h3>
        <div>
          <label className="label flex items-center gap-1.5">🎵 {t('step3.music')}</label>
          
          {/* Current music indicator */}
          {data.customFields?.musicUrl && (
            <div className="flex items-center gap-2 mb-2 p-2 rounded-lg bg-primary-500/10 border border-primary-500/20">
              <span className="text-xs text-primary-300 truncate flex-1">
                🎶 {data.customFields.musicUrl.startsWith('data:') ? 'Yuklangan musiqa' : data.customFields.musicUrl}
              </span>
              <button type="button" onClick={() => handleCustomFieldChange('musicUrl', '')}
                className="text-rose-400 text-xs hover:text-rose-300">✕</button>
            </div>
          )}

          {!data.customFields?.musicUrl && (
            <div className="space-y-2">
              {/* File upload */}
              <label className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-white/10 hover:border-primary-500/30 cursor-pointer transition-all bg-white/[0.02] hover:bg-white/[0.04]">
                <input type="file" accept="audio/mp3,audio/mpeg,audio/*" className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    
                    // Compress: read as base64 (limit ~2MB)
                    if (file.size > 5 * 1024 * 1024) {
                      alert('Fayl hajmi 5MB dan oshmasligi kerak');
                      return;
                    }
                    
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      handleCustomFieldChange('musicUrl', ev.target.result);
                    };
                    reader.readAsDataURL(file);
                    e.target.value = '';
                  }} />
                <span className="text-xl">📁</span>
                <span className="text-sm text-surface-400">{t('step3.musicUpload')}</span>
              </label>

              {/* URL option */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-white/10"></div>
                <span className="text-[10px] text-surface-600">{t('step3.or')}</span>
                <div className="flex-1 h-px bg-white/10"></div>
              </div>
              <input type="url" placeholder="https://example.com/music.mp3"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (e.target.value.trim()) {
                      handleCustomFieldChange('musicUrl', e.target.value.trim());
                      e.target.value = '';
                    }
                  }
                }}
                className="input-field w-full text-sm" />
            </div>
          )}
          <p className="text-[11px] text-surface-500 mt-1">{t('step3.musicHint')}</p>
        </div>

        {/* Program / Timeline editor */}
        <div>
          <label className="label flex items-center gap-2 mb-2">📅 {t('step3.program')}</label>
          {(() => {
            // Parse existing program or use defaults
            let items = [];
            try {
              items = data.customFields?.program ? JSON.parse(data.customFields.program) : [];
            } catch { items = []; }
            if (items.length === 0) {
              items = [
                { time: data.eventTime || '18:00', text: 'Mehmonlarni kutib olish' },
                { time: '18:30', text: 'Rasmiy qism' },
                { time: '19:00', text: 'Ziyofat dasturxoni' },
                { time: '21:00', text: 'Musiqali lahzalar' },
              ];
            }

            const updateProgram = (newItems) => {
              handleCustomFieldChange('program', JSON.stringify(newItems));
            };

            return (
              <div className="space-y-2">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="time"
                      value={item.time}
                      onChange={(e) => {
                        const next = [...items];
                        next[i] = { ...next[i], time: e.target.value };
                        updateProgram(next);
                      }}
                      className="input-field w-28 text-center"
                    />
                    <input
                      type="text"
                      value={item.text}
                      onChange={(e) => {
                        const next = [...items];
                        next[i] = { ...next[i], text: e.target.value };
                        updateProgram(next);
                      }}
                      className="input-field flex-1"
                      placeholder="Tadbir nomi"
                    />
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const next = items.filter((_, j) => j !== i);
                          updateProgram(next);
                        }}
                        className="text-red-400 hover:text-red-300 text-sm px-2 py-1 shrink-0"
                      >✕</button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => updateProgram([...items, { time: '', text: '' }])}
                  className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1 mt-1"
                >
                  + {t('step3.addItem')}
                </button>
              </div>
            );
          })()}
        </div>

        {/* Karakalpak Program editor — when QQ is ON */}
        {data.customFields?.langQq && (
          <div>
            <label className="label flex items-center gap-2 mb-2">📅 Bag'darlanma (QQ)</label>
            {(() => {
              let items = [];
              try {
                items = data.customFields?.programQq ? JSON.parse(data.customFields.programQq) : [];
              } catch { items = []; }
              if (items.length === 0) {
                items = [
                  { time: data.eventTime || '18:00', text: 'Mexmanlar kútip alıw' },
                  { time: '18:30', text: 'Rásimiy bólim' },
                  { time: '19:00', text: 'Ziyapat dástúrxanı' },
                  { time: '21:00', text: 'Muzıkalı waqıtlar' },
                ];
              }
              const updateProgramQq = (newItems) => {
                handleCustomFieldChange('programQq', JSON.stringify(newItems));
              };
              return (
                <div className="space-y-2">
                  {items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input type="time" value={item.time}
                        onChange={(e) => { const n = [...items]; n[i] = { ...n[i], time: e.target.value }; updateProgramQq(n); }}
                        className="input-field w-28 text-center" />
                      <input type="text" value={item.text}
                        onChange={(e) => { const n = [...items]; n[i] = { ...n[i], text: e.target.value }; updateProgramQq(n); }}
                        className="input-field flex-1" placeholder="Ilaje atı" />
                      {items.length > 1 && (
                        <button type="button" onClick={() => updateProgramQq(items.filter((_, j) => j !== i))}
                          className="text-red-400 hover:text-red-300 text-sm px-2 py-1 shrink-0">✕</button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => updateProgramQq([...items, { time: '', text: '' }])}
                    className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1 mt-1">
                    + Punkt qosıw
                  </button>
                </div>
              );
            })()}
          </div>
        )}

        {/* Russian Program editor — when RU is ON */}
        {data.customFields?.langRu && (
          <div>
            <label className="label flex items-center gap-2 mb-2">📅 Программа (RU)</label>
            {(() => {
              let items = [];
              try {
                items = data.customFields?.programRu ? JSON.parse(data.customFields.programRu) : [];
              } catch { items = []; }
              if (items.length === 0) {
                items = [
                  { time: data.eventTime || '18:00', text: 'Встреча гостей' },
                  { time: '18:30', text: 'Официальная часть' },
                  { time: '19:00', text: 'Праздничный ужин' },
                  { time: '21:00', text: 'Музыка и развлечения' },
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
                        className="input-field flex-1" placeholder="Название" />
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

        {/* Photo Gallery */}
        <div>
          <label className="label flex items-center gap-1.5">🖼 {t('step3.photos')}</label>
          <p className="text-[11px] text-surface-500 mb-2">{t('step3.photosHint')}</p>
          
          <div className="grid grid-cols-3 gap-2 mb-2">
            {(data.customFields?.photos || []).map((url, i) => (
              <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-white/10">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button type="button"
                  onClick={() => {
                    const photos = [...(data.customFields?.photos || [])];
                    photos.splice(i, 1);
                    handleCustomFieldChange('photos', photos);
                  }}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-rose-500/80 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
              </div>
            ))}
          </div>
          
          {(data.customFields?.photos || []).length < 6 && (
            <label className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-white/10 hover:border-primary-500/30 cursor-pointer transition-all bg-white/[0.02] hover:bg-white/[0.04]">
              <input type="file" accept="image/*" multiple className="hidden"
                onChange={async (e) => {
                  const files = Array.from(e.target.files);
                  const existing = data.customFields?.photos || [];
                  const remaining = 6 - existing.length;
                  const toProcess = files.slice(0, remaining);
                  
                  const compress = (file) => new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      const img = new Image();
                      img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const MAX = 800;
                        let w = img.width, h = img.height;
                        if (w > h) { if (w > MAX) { h = h * MAX / w; w = MAX; } }
                        else { if (h > MAX) { w = w * MAX / h; h = MAX; } }
                        canvas.width = w; canvas.height = h;
                        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                        resolve(canvas.toDataURL('image/jpeg', 0.7));
                      };
                      img.src = ev.target.result;
                    };
                    reader.readAsDataURL(file);
                  });
                  
                  const results = await Promise.all(toProcess.map(compress));
                  handleCustomFieldChange('photos', [...existing, ...results]);
                  e.target.value = '';
                }} />
              <span className="text-2xl">📷</span>
              <span className="text-sm text-surface-400">{t('step3.photoUpload')}</span>
            </label>
          )}
        </div>

        <div>
          <label className="label flex items-center gap-1.5">📱 {t('step3.telegram')}</label>
          <input type="text" placeholder="BOT_TOKEN:CHAT_ID"
            value={data.customFields?.telegramBot || ''}
            onChange={(e) => handleCustomFieldChange('telegramBot', e.target.value)}
            className="input-field" />
          <p className="text-[11px] text-surface-500 mt-1">{t('step3.telegramHint')}</p>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
          <div>
            <label className="label flex items-center gap-1.5 !mb-0">✅ {t('step3.rsvp')}</label>
            <p className="text-[11px] text-surface-500 mt-0.5">{t('step3.rsvpHint')}</p>
          </div>
          <button type="button"
            onClick={() => handleCustomFieldChange('enableRsvp', !data.customFields?.enableRsvp)}
            className={`w-11 h-6 rounded-full transition-all duration-300 relative flex-shrink-0 ${
              data.customFields?.enableRsvp ? 'bg-primary-500' : 'bg-surface-700'
            }`}>
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${
              data.customFields?.enableRsvp ? 'left-[22px]' : 'left-0.5'
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
          <div>
            <label className="label flex items-center gap-1.5 !mb-0">💌 {t('step3.wishes')}</label>
            <p className="text-[11px] text-surface-500 mt-0.5">{t('step3.wishesHint')}</p>
          </div>
          <button type="button"
            onClick={() => handleCustomFieldChange('enableWishes', data.customFields?.enableWishes === false ? true : false)}
            className={`w-11 h-6 rounded-full transition-all duration-300 relative flex-shrink-0 ${
              data.customFields?.enableWishes !== false ? 'bg-primary-500' : 'bg-surface-700'
            }`}>
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${
              data.customFields?.enableWishes !== false ? 'left-[22px]' : 'left-0.5'
            }`} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-bold">
            {t('step3.title')}
          </h2>
          <p className="text-surface-400 text-sm mt-1">{t('step3.desc')}</p>
        </div>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="hidden lg:flex items-center gap-2 text-sm text-surface-400 hover:text-white 
            transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/10"
        >
          {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
          {showPreview ? t('step3.hide') : t('step3.show')}
        </button>
      </div>

      <div className={`flex gap-6 ${showPreview ? 'lg:flex-row' : ''} flex-col`}>
        {/* Form column */}
        <div className={`${showPreview ? 'lg:w-1/2' : 'max-w-2xl mx-auto w-full'}`}>
          {formContent}
        </div>

        {/* Live preview column */}
        {showPreview && (
          <div className="hidden lg:block lg:w-1/2">
            <div className="sticky top-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-surface-400 uppercase tracking-wider font-medium">
                  {t('step3.preview')}
                </span>
              </div>
              <LivePreview
                data={data}
                className="h-[600px] rounded-2xl border border-white/10 overflow-hidden"
              />
            </div>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 z-20 bg-surface-950/90 backdrop-blur-lg border-t border-white/5 
        -mx-4 px-4 py-4 mt-6 sm:static sm:bg-transparent sm:backdrop-blur-none sm:border-0 sm:mx-0 sm:px-0 sm:py-0 sm:mt-0">
        <div className="flex justify-between items-center gap-3">
          <button onClick={onBack} className="btn-secondary flex-1 sm:flex-none py-3.5">{t('step3.back')}</button>
          <button onClick={onNext}
            disabled={!data.hostName || !data.eventDate || !data.location}
            className="btn-primary flex-1 sm:flex-none min-w-[160px] text-center py-3.5">
            {t('step3.next')}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
