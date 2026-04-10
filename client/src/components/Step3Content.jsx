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
            <input type="text" placeholder="Abdullayev Yunus"
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
          ⚙️ Qo'shimcha sozlamalar
        </h3>
        <div>
          <label className="label flex items-center gap-1.5">🎵 {t('step3.music')}</label>
          {data.customFields?.musicUrl ? (
            <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
              <span className="text-green-400 text-sm">✅</span>
              <span className="text-sm text-green-300 flex-1 truncate">
                {data.customFields?.musicName || 'Musiqa yuklandi'}
              </span>
              <button
                type="button"
                onClick={() => { handleCustomFieldChange('musicUrl', ''); handleCustomFieldChange('musicName', ''); }}
                className="text-xs text-red-400 hover:text-red-300"
              >✕ O'chirish</button>
            </div>
          ) : (
            <div className="relative">
              <input
                type="file"
                accept="audio/*,.mp3,.wav,.ogg,.aac,.m4a"
                id="music-upload"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  if (file.size > 10 * 1024 * 1024) {
                    alert('Fayl hajmi 10MB dan oshmasligi kerak');
                    return;
                  }
                  handleCustomFieldChange('musicName', '⏳ Yuklanmoqda...');
                  const formData = new FormData();
                  formData.append('music', file);
                  try {
                    const API = import.meta.env.VITE_API_URL || '';
                    const res = await fetch(`${API}/api/upload/music`, {
                      method: 'POST',
                      body: formData,
                    });
                    const result = await res.json();
                    if (result.success) {
                      handleCustomFieldChange('musicUrl', result.data.url);
                      handleCustomFieldChange('musicName', file.name);
                    } else {
                      handleCustomFieldChange('musicName', '');
                      alert(result.error?.message || 'Yuklashda xatolik');
                    }
                  } catch {
                    handleCustomFieldChange('musicName', '');
                    alert('Yuklashda xatolik');
                  }
                  e.target.value = '';
                }}
              />
              <label
                htmlFor="music-upload"
                className="flex items-center justify-center gap-2 p-3 border-2 border-dashed 
                  border-white/15 rounded-xl cursor-pointer hover:border-primary-500/40 
                  hover:bg-primary-500/5 transition-all"
              >
                {data.customFields?.musicName === '⏳ Yuklanmoqda...' ? (
                  <span className="text-sm text-surface-400">⏳ Yuklanmoqda...</span>
                ) : (
                  <>
                    <span className="text-lg">📁</span>
                    <span className="text-sm text-surface-400">MP3 fayl tanlang (max 10MB)</span>
                  </>
                )}
              </label>
            </div>
          )}
        </div>
        <div>
          <label className="label flex items-center gap-1.5">📱 {t('step3.telegram')}</label>
          <input type="text" placeholder="BOT_TOKEN:CHAT_ID"
            value={data.customFields?.telegramBot || ''}
            onChange={(e) => handleCustomFieldChange('telegramBot', e.target.value)}
            className="input-field" />
          <p className="text-[11px] text-surface-500 mt-1">Format: BOT_TOKEN:CHAT_ID — @BotFather dan oling</p>
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
            Taklif mazmunini kiriting
          </h2>
          <p className="text-surface-400 text-sm mt-1">Taklifnoma tafsilotlarini to'ldiring</p>
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
