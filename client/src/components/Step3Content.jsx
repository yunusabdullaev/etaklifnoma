import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Calendar, User, MessageSquare, Link2, Type, Eye, EyeOff, Loader2, Zap, CheckCircle2, XCircle } from 'lucide-react';
import LivePreview from './LivePreview';
import { useLang } from '../i18n';
import { uploadImage, uploadAudio } from '../utils/cloudinary';
import TelegramConnector from './TelegramConnector';

/**
 * Sends a real test message to the configured Telegram bot.
 * Shows success/error with human-readable Uzbek messages.
 */
function BotTestButton({ bot, apiBase, t }) {
  const [status, setStatus] = useState(null);
  const [msg, setMsg] = useState('');

  const test = async () => {
    if (!bot || !/^-?\d+$/.test(bot.trim())) {
      setStatus('err');
      setMsg(t('step3.botTestWait') || 'Chat ID raqamini kiriting');
      return;
    }
    setStatus('loading');
    setMsg('');
    try {
      const res = await fetch(`${apiBase}/api/bot/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: bot.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('ok');
        setMsg(data.message);
      } else {
        setStatus('err');
        setMsg(data.message); // This might be from backend, keep as is
      }
    } catch (e) {
      setStatus('err');
      setMsg(t('common.error') || 'Server bilan bog\'lanib bo\'lmadi');
    }
    setTimeout(() => { setStatus(null); setMsg(''); }, 8000);
  };

  return (
    <div className="flex flex-col gap-1 shrink-0">
      <button
        type="button"
        onClick={test}
        disabled={status === 'loading'}
        title="Bot ulanishini tekshirish"
        className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
          status === 'ok'  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
          status === 'err' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
          'bg-sky-500/10 text-sky-400 border border-sky-500/20 hover:bg-sky-500/20'
        }`}
      >
        {status === 'loading' ? <Loader2 size={12} className="animate-spin" /> :
         status === 'ok'      ? <CheckCircle2 size={12} /> :
         status === 'err'     ? <XCircle size={12} /> :
                                <Zap size={12} />}
        {t('step3.botTest') || "Sinab ko'r"}
      </button>
      {msg && (
        <p className={`text-[10px] leading-tight max-w-[200px] ${status === 'ok' ? 'text-emerald-400' : 'text-rose-400'}`}>
          {msg}
        </p>
      )}
    </div>
  );
}

export default function Step3Content({ data, onUpdate, onNext, onBack }) {
  const [showPreview, setShowPreview] = useState(true);
  const [uploading, setUploading] = useState(null); // 'photo' | 'music' | null
  const [draftSaved, setDraftSaved] = useState(false);
  const [hasDraftRestored, setHasDraftRestored] = useState(false);
  const saveTimerRef = useRef(null);
  const { t } = useLang();

  const DRAFT_KEY = `etaklifnoma_draft_${data.eventTypeId || 'default'}`;

  // Auto-Save: write to localStorage with 1.5s debounce
  useEffect(() => {
    if (!data.eventTypeId) return; // skip if no meaningful data
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
        setDraftSaved(true);
        setTimeout(() => setDraftSaved(false), 2000);
      } catch {}
    }, 1500);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [data]);

  const discardDraft = () => {
    try { localStorage.removeItem(DRAFT_KEY); } catch {}
    setHasDraftRestored(false);
  };


  const handleChange = (field, value) => {
    onUpdate({ [field]: value });
  };

  const handleCustomFieldChange = (key, value) => {
    onUpdate({
      customFields: { ...data.customFields, [key]: value },
    });
  };

  const templateFields = data.template?.structure?.fields || [];

  const isUzOn = data.customFields?.langUz !== false && (data.customFields?.langUz ?? true);
  const isQqOn = !!data.customFields?.langQq;
  const isRuOn = !!data.customFields?.langRu;
  const activeHostName = isUzOn ? data.hostName : (isRuOn ? data.customFields?.hostNameRu : (isQqOn ? data.customFields?.hostNameQq : null));

  const formContent = (
    <div className="space-y-5">
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

      {/* Core fields */}
      {isUzOn && (
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
      )}

      {/* Date & location */}
      <div className="glass p-5 space-y-4">
        <h3 className="text-xs font-semibold text-surface-300 uppercase tracking-wider flex items-center gap-2">
          <Calendar size={13} /> {t('step3.dateLocation')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="label">{t('step3.date')} *</label>
            <input type="date" value={data.eventDate || ''}
              min={new Date().toISOString().split('T')[0]}
              max={new Date(Date.now() + 89 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
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
          <input type="url" placeholder="https://yandex.uz/maps/..."
            value={data.locationUrl || ''} onChange={(e) => handleChange('locationUrl', e.target.value)}
            className="input-field" />
          <div className="flex gap-2 mt-1.5">
            <a
              href={`https://yandex.uz/maps/?text=${encodeURIComponent(data.location || '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium
                bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all"
            >
              📍 Yandex Maps'da qidirish
            </a>
            <a
              href={`https://www.google.com/maps/search/${encodeURIComponent(data.location || '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium
                bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-all"
            >
              📍 Google Maps
            </a>
          </div>
        </div>
      </div>

      {/* Message */}
      {isUzOn && (
      <div className="glass p-5 space-y-3">
        <h3 className="text-xs font-semibold text-surface-300 uppercase tracking-wider flex items-center gap-2">
          <MessageSquare size={13} /> {t('step3.message')}
        </h3>
        <textarea rows={3} placeholder={t('step3.messagePlaceholder')}
          value={data.message || ''} onChange={(e) => handleChange('message', e.target.value)}
          className="input-field resize-none" />
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
              <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
                uploading === 'music' ? 'border-primary-500/50 bg-primary-500/5' : 'border-white/10 hover:border-primary-500/30 bg-white/[0.02] hover:bg-white/[0.04]'
              }`}>
                <input type="file" accept="audio/mp3,audio/mpeg,audio/*" className="hidden" disabled={uploading === 'music'}
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    
                    if (file.size > 10 * 1024 * 1024) {
                      alert('Fayl hajmi 10MB dan oshmasligi kerak');
                      return;
                    }
                    
                    setUploading('music');
                    try {
                      const url = await uploadAudio(file);
                      handleCustomFieldChange('musicUrl', url);
                    } catch (err) {
                      alert('Musiqa yuklashda xatolik: ' + err.message);
                    }
                    setUploading(null);
                    e.target.value = '';
                  }} />
                {uploading === 'music' ? (
                  <><Loader2 size={18} className="animate-spin text-primary-400" /><span className="text-sm text-primary-400">Yuklanmoqda...</span></>
                ) : (
                  <><span className="text-xl">📁</span><span className="text-sm text-surface-400">{t('step3.musicUpload')}</span></>
                )}
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
        {isUzOn && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="label flex items-center gap-2 mb-0">📅 {t('step3.program')}</label>
            <input
              type="text"
              placeholder="Sarlavha (ixtiyoriy)"
              value={data.customFields?.programCustomTitle || ''}
              onChange={(e) => handleCustomFieldChange('programCustomTitle', e.target.value)}
              className="input-field text-xs py-1 px-3 w-[150px] shadow-sm bg-surface-50 border-surface-200"
              title="Dastur sarlavhasini o'zgartirish (masalan: Bizning rejamiz)"
            />
          </div>
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
        )}

        {/* Karakalpak Program editor — when QQ is ON */}
        {data.customFields?.langQq && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label flex items-center gap-2 mb-0">📅 Bag'darlanma (QQ)</label>
              <input
                type="text"
                placeholder="Sarlavha (QQ)"
                value={data.customFields?.programCustomTitleQq || ''}
                onChange={(e) => handleCustomFieldChange('programCustomTitleQq', e.target.value)}
                className="input-field text-xs py-1 px-3 w-[150px] shadow-sm bg-surface-50 border-surface-200"
              />
            </div>
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
            <div className="flex items-center justify-between mb-2">
              <label className="label flex items-center gap-2 mb-0">📅 Программа (RU)</label>
              <input
                type="text"
                placeholder="Название (RU)"
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
            <label className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
              uploading === 'photo' ? 'border-primary-500/50 bg-primary-500/5' : 'border-white/10 hover:border-primary-500/30 bg-white/[0.02] hover:bg-white/[0.04]'
            }`}>
              <input type="file" accept="image/*" multiple className="hidden" disabled={uploading === 'photo'}
                onChange={async (e) => {
                  const files = Array.from(e.target.files);
                  const existing = data.customFields?.photos || [];
                  const remaining = 6 - existing.length;
                  const toProcess = files.slice(0, remaining);
                  
                  setUploading('photo');
                  try {
                    const urls = await Promise.all(toProcess.map(f => uploadImage(f)));
                    handleCustomFieldChange('photos', [...existing, ...urls]);
                  } catch (err) {
                    alert('Rasm yuklashda xatolik: ' + err.message);
                  }
                  setUploading(null);
                  e.target.value = '';
                }} />
              {uploading === 'photo' ? (
                <><Loader2 size={20} className="animate-spin text-primary-400" /><span className="text-sm text-primary-400">Yuklanmoqda...</span></>
              ) : (
                <><span className="text-2xl">📷</span><span className="text-sm text-surface-400">{t('step3.photoUpload')}</span></>
              )}
            </label>
          )}
        </div>

        {/* Custom Slug */}
        <div>
          <label className="label flex items-center gap-1.5">🔗 Maxsus URL manzil (ixtiyoriy)</label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-surface-500 shrink-0">etaklifnoma.uz/invite/</span>
            <input
              type="text"
              placeholder="jasur-malika"
              value={data.customFields?.customSlug || ''}
              onChange={(e) => {
                const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,'');
                handleCustomFieldChange('customSlug', val);
              }}
              maxLength={30}
              className="input-field flex-1 font-mono text-sm"
            />
          </div>
          <p className="text-[11px] text-surface-500 mt-1">Faqat lotin harflari, raqamlar va defis (-). Masalan: jasur-malika</p>
        </div>

        {/* Color Palette */}
        <div>
          <label className="label flex items-center gap-1.5">🎨 Rang palitasi</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'gold',     label: 'Oltin',    color: '#d4a853', dark: '#0b0d17' },
              { id: 'silver',   label: 'Kumush',   color: '#9da8b8', dark: '#0d1018' },
              { id: 'ocean',    label: 'Okean',    color: '#4a9fe8', dark: '#060e1a' },
              { id: 'rose',     label: 'Gul',      color: '#e8749a', dark: '#150810' },
              { id: 'lavender', label: 'Lavanda',  color: '#a07ee8', dark: '#0e0a18' },
              { id: 'teal',     label: 'Yashil',   color: '#3bbdaa', dark: '#060f0d' },
              { id: 'amber',    label: 'Sariq',    color: '#e8a84a', dark: '#110c02' },
              { id: 'emerald',  label: 'Zumrad',   color: '#4ae898', dark: '#040f08' },
            ].map((p) => {
              const isSelected = (data.customFields?.colorPalette || 'gold') === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleCustomFieldChange('colorPalette', p.id)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${
                    isSelected ? 'border-white/40 bg-white/10 scale-105' : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="relative">
                    <div
                      className="w-8 h-8 rounded-full border-2 shadow-lg"
                      style={{ background: p.dark, borderColor: p.color, boxShadow: isSelected ? `0 0 10px ${p.color}60` : 'none' }}
                    />
                    <div
                      className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border border-surface-900"
                      style={{ background: p.color }}
                    />
                  </div>
                  <span className="text-[9px] text-surface-400">{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-2">
          <TelegramConnector 
            value={data.customFields?.telegramChatId} 
            onChange={(val) => handleCustomFieldChange('telegramChatId', val)} 
          />
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

        {/* RSVP language selector */}
        {data.customFields?.enableRsvp && (
          <div className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <label className="label flex items-center gap-1.5 !mb-2">🌐 RSVP tili</label>
            <div className="flex gap-2">
              {[
                { code: 'uz', label: "O'zbekcha" },
                { code: 'ru', label: 'Русский' },
                { code: 'en', label: 'English' },
              ].map(l => (
                <button key={l.code} type="button"
                  onClick={() => handleCustomFieldChange('rsvpLang', l.code)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                    (data.customFields?.rsvpLang || 'uz') === l.code
                      ? 'bg-primary-500/20 border-primary-500/40 text-primary-300'
                      : 'bg-white/[0.03] border-white/[0.08] text-surface-400 hover:bg-white/[0.06]'
                  }`}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        )}

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

        {/* ─── Floating Elements Toggles ─── */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="px-3 py-2.5 border-b border-white/[0.04]">
            <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">⚙️ {t('step3.floatingTitle')}</p>
          </div>
          {[
            { key: 'envelopeAnim',  label: `🎭 ${t('step3.envelopeAnim')}`,     hint: t('step3.envelopeHint'), defaultOn: true },
            { key: 'showShareWa',   label: `💬 ${t('step3.showShareWa')}`, hint: t('step3.showShareWaHint'), defaultOn: true },
            { key: 'showShareTg',   label: `✈️ ${t('step3.showShareTg')}`, hint: t('step3.showShareTgHint'), defaultOn: true },
            { key: 'showCalendarBtn', label: `📅 ${t('step3.showCalendar')}`,        hint: t('step3.showCalendarHint'), defaultOn: true },
            { key: 'showPrintBtn',  label: `🖨️ ${t('step3.showPrint')}`,       hint: t('step3.showPrintHint'), defaultOn: true },
          ].map(({ key, label, hint, defaultOn }) => {
            const isOn = data.customFields?.[key] === undefined ? defaultOn : !!data.customFields[key];
            return (
              <div key={key} className="flex items-center justify-between px-3 py-2.5 border-b border-white/[0.03] last:border-0">
                <div>
                  <p className="text-xs text-surface-300 font-medium">{label}</p>
                  <p className="text-[10px] text-surface-500">{hint}</p>
                </div>
                <button type="button"
                  onClick={() => handleCustomFieldChange(key, !isOn)}
                  className={`w-10 h-5 rounded-full transition-all duration-300 relative flex-shrink-0 ${isOn ? 'bg-primary-500' : 'bg-surface-700'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${isOn ? 'left-[22px]' : 'left-0.5'}`} />
                </button>
              </div>
            );
          })}
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
            disabled={!activeHostName || !data.eventDate || !data.location}
            className="btn-primary flex-1 sm:flex-none min-w-[160px] text-center py-3.5">
            {t('step3.next')}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
