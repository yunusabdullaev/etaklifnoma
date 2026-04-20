import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Calendar, User, MessageSquare, Link2, Type, Eye, EyeOff, Loader2, Zap, CheckCircle2, XCircle } from 'lucide-react';
import LivePreview from './LivePreview';
import { useLang } from '../i18n';
import { uploadImage, uploadAudio } from '../utils/cloudinary';
import TelegramConnector from './TelegramConnector';

const trStep3 = {
  uz: {
    qqFields: 'Qaraqalpoqcha matnlar', ruFields: 'Ruscha matnlar', uzFields: "O'zbekcha matnlar",
    uzHostName: 'Mezbon ismi', uzGuestName: 'Mehmon ismi', uzEventTitle: 'Tadbir nomi',
    qqHostName: 'Mezbon ismi (QQ)', qqGuestName: 'Mehmon ismi (QQ)', qqEventTitle: 'Tadbir nomi (QQ)',
    ruHostName: 'Mezbon ismi (RU)', ruGuestName: 'Mehmon ismi (RU)', ruEventTitle: 'Tadbir nomi (RU)',
    msg: 'Xabar',
    
    age: 'Yoshi', theme: 'Bayram mavzusi', years: 'Yillar (Masalan: 50)', school: "Ta'lim muassasasi", graduationYear: 'Bitiruv yili', brideName: 'Kelinning ismi', groomName: 'Kuyovning ismi',
    palette: '🎨 Rang palitrasi',
    gold: 'Oltin', silver: 'Kumush', ocean: 'Okean', rose: 'Gul', lavender: 'Lavanda', teal: 'Yashil', amber: 'Sariq', emerald: 'Zumrad',
    yandexSearch: "📍 Yandex Maps'da qidirish", googleSearch: "📍 Google Maps",
    invalidUrl: "Noto'g'ri URL formati. Iltimos xarita linkini to'g'ri kiriting.",
    mapConfirm: "Tanlangan joy ushbu xaritaga mosmi?", confirm: "Tasdiqlash", confirmTip: "Lokal xaritani tasdiqlang!",
    musicUploaded: "Yuklangan musiqa", sizeErr: "Fayl hajmi 10MB dan oshmasligi kerak", uploadErr: "Yuklashda xatolik: ",
    uploadingMusic: "Musiqa yuklanmoqda...", uploadingPhoto: "Rasm yuklanmoqda...",
    customUrl: "🔗 Maxsus URL manzil (ixtiyoriy)", slugHint: "Faqat lotin harflari, raqamlar va defis (-). Masalan: jasur-malika",
    rsvpLang: "🌐 RSVP tili", alphabetSwitcher: "🔤 Alifbo tugmasi", alphabetHint: "Mehmonlarga (Lot / Kir) imkonini berish",
    connectTgFirst: "Avval Telegram botga ulaning!"
  },
  ru: {
    qqFields: 'Тексты на каракалпакском', ruFields: 'Тексты на русском', uzFields: 'Тексты на узбекском',
    uzHostName: 'Имя хозяина (UZ)', uzGuestName: 'Имя гостя (UZ)', uzEventTitle: 'Название мероприятия (UZ)',
    qqHostName: 'Имя хозяина (QQ)', qqGuestName: 'Имя гостя (QQ)', qqEventTitle: 'Название мероприятия (QQ)',
    ruHostName: 'Имя хозяина', ruGuestName: 'Имя гостя', ruEventTitle: 'Название мероприятия',
    msg: 'Сообщение',

    age: 'Возраст', theme: 'Тема праздника', years: 'Лет (Например: 50)', school: "Учебное заведение", graduationYear: 'Год выпуска', brideName: 'Имя невесты', groomName: 'Имя жениха',
    palette: '🎨 Цветовая палитра',
    gold: 'Золото', silver: 'Серебро', ocean: 'Океан', rose: 'Роза', lavender: 'Лаванда', teal: 'Бирюза', amber: 'Янтарь', emerald: 'Изумруд',
    yandexSearch: "📍 Искать в Yandex Maps", googleSearch: "📍 Google Maps",
    invalidUrl: "Неверный формат URL. Пожалуйста, введите правильную ссылку на карту.",
    mapConfirm: "Соответствует ли выбранное место этой карте?", confirm: "Подтвердить", confirmTip: "Подтвердите локальную карту!",
    musicUploaded: "Загруженная музыка", sizeErr: "Размер файла не должен превышать 10МБ", uploadErr: "Ошибка загрузки: ",
    uploadingMusic: "Загрузка музыки...", uploadingPhoto: "Загрузка фото...",
    customUrl: "🔗 Пользовательский URL (необязательно)", slugHint: "Только латинские буквы, цифры и дефис (-). Например: jasur-malika",
    rsvpLang: "🌐 Язык RSVP", alphabetSwitcher: "🔤 Кнопка алфавита", alphabetHint: "Разрешить гостям переключать (Лат / Кир)",
    connectTgFirst: "Сначала подключите Telegram бота!"
  },
  qq: {
    qqFields: 'Qaraqalpaqsha tekstler', ruFields: 'Russha tekstler', uzFields: 'Ózbekshe tekstler',
    uzHostName: 'Mezban atı (UZ)', uzGuestName: 'Mehman atı (UZ)', uzEventTitle: 'Ilaje atı (UZ)',
    qqHostName: 'Mezban atı', qqGuestName: 'Mehman atı', qqEventTitle: 'Ilaje atı',
    ruHostName: 'Mezban atı (RU)', ruGuestName: 'Mehman atı (RU)', ruEventTitle: 'Ilaje atı (RU)',
    msg: 'Xabar',

    age: 'Jası', theme: 'Bayram temasi', years: 'Jıllar (Mısalı: 50)', school: "Oqıw ornı", graduationYear: 'Pitkeriw jılı', brideName: 'Kelinniń atı', groomName: 'Kúyewdiń atı',
    palette: '🎨 Reńler palitrası',
    gold: 'Altın', silver: 'Gúmis', ocean: 'Okean', rose: 'Gúl', lavender: 'Lavanda', teal: 'Máviy', amber: 'Sarı', emerald: 'Zúmret',
    yandexSearch: "📍 Yandex Maps'tan izlew", googleSearch: "📍 Google Maps",
    invalidUrl: "Natuwrı URL formatı. Karta siltemesin tura kiritin'.",
    mapConfirm: "Suraqlı orın usi kartaǵa sáykes pe?", confirm: "Tastıyqlaw", confirmTip: "Lokal kartani tastıyqlan'!",
    musicUploaded: "Júklengen muzıka", sizeErr: "Fayl ólshemi 10MB dan aspawı kerek", uploadErr: "Júklewde qátelik: ",
    uploadingMusic: "Muzıka júklenbekte...", uploadingPhoto: "Súvret júklenbekte...",
    customUrl: "🔗 Arnawlı URL mánzil (ıqtıyarıy)", slugHint: "Tek latın háripleri, sanlar hám defis (-). Mısalı: jasur-malika",
    rsvpLang: "🌐 RSVP tili", alphabetSwitcher: "🔤 Alfavit túymesi", alphabetHint: "Miymanlarǵa (Lot / Kir) imkanın beriw",
    connectTgFirst: "Dáslep Telegram botqa jalǵań!"
  },
  en: {
    qqFields: 'Karakalpak Texts', ruFields: 'Russian Texts', uzFields: 'Uzbek Texts',
    uzHostName: 'Host Name (UZ)', uzGuestName: 'Guest Name (UZ)', uzEventTitle: 'Event Title (UZ)',
    qqHostName: 'Host Name (QQ)', qqGuestName: 'Guest Name (QQ)', qqEventTitle: 'Event Title (QQ)',
    ruHostName: 'Host Name (RU)', ruGuestName: 'Guest Name (RU)', ruEventTitle: 'Event Title (RU)',
    msg: 'Message',

    age: 'Age', theme: 'Theme', years: 'Years (e.g. 50)', school: "School", graduationYear: 'Graduation Year', brideName: 'Bride Name', groomName: 'Groom Name',
    palette: '🎨 Color palette',
    gold: 'Gold', silver: 'Silver', ocean: 'Ocean', rose: 'Rose', lavender: 'Lavender', teal: 'Teal', amber: 'Amber', emerald: 'Emerald',
    yandexSearch: "📍 Search in Yandex Maps", googleSearch: "📍 Google Maps",
    invalidUrl: "Invalid URL format. Please enter a correct map link.",
    mapConfirm: "Does the selected location match this map?", confirm: "Confirm", confirmTip: "Confirm local map!",
    musicUploaded: "Uploaded music", sizeErr: "File size must not exceed 10MB", uploadErr: "Upload error: ",
    uploadingMusic: "Music uploading...", uploadingPhoto: "Photo uploading...",
    customUrl: "🔗 Custom URL (optional)", slugHint: "Only latin letters, numbers and hyphen (-). Example: jasur-malika",
    rsvpLang: "🌐 RSVP Language", alphabetSwitcher: "🔤 Alphabet Switcher", alphabetHint: "Allow guests to switch (Lat / Cyr)",
    connectTgFirst: "Please connect Telegram bot first!"
  }
};

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

const getMapEmbedUrl = (urlStr, locationName) => {
  if (!urlStr) return `https://yandex.uz/map-widget/v1/?mode=search&text=${encodeURIComponent(locationName || 'Tashkent')}&z=15`;
  try {
    const url = new URL(urlStr);
    if (url.hostname.includes('yandex')) {
      url.pathname = url.pathname.replace(/^\/maps/, '/map-widget/v1');
      if (!url.searchParams.has('z')) {
        url.searchParams.set('z', '15');
      }
      return url.toString();
    }
  } catch(e) {}
  return `https://yandex.uz/map-widget/v1/?mode=search&text=${encodeURIComponent(locationName || 'Tashkent')}&z=15`;
};

export default function Step3Content({ data, onUpdate, onNext, onBack }) {
  const [showPreview, setShowPreview] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);
  const [uploading, setUploading] = useState(null); // 'photo' | 'music' | null
  const [draftSaved, setDraftSaved] = useState(false);
  const [hasDraftRestored, setHasDraftRestored] = useState(false);
  const [slugState, setSlugState] = useState({ status: 'idle', message: '' });
  const [locConfirmed, setLocConfirmed] = useState(false);
  const saveTimerRef = useRef(null);
  const { t, lang } = useLang();
  const trLocal = trStep3[lang] || trStep3['uz'];
  const orderArr = (data.customFields?.langOrder || 'uz,ru,qq').split(',');

  const DRAFT_KEY = `etaklifnoma_draft_${data.eventTypeId || 'default'}`;

  // Custom slug validation
  useEffect(() => {
    const slug = (data.customFields?.customSlug || '').trim();
    if (!slug) {
      setSlugState({ status: 'idle', message: '' });
      return;
    }
    if (slug.length < 3) {
      setSlugState({ status: 'idle', message: '' }); 
      return;
    }
    setSlugState({ status: 'loading', message: '' });
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/invitations/check-slug?slug=${encodeURIComponent(slug)}`);
        const json = await res.json();
        if (json.available) {
          setSlugState({ status: 'success', message: "Manzil bo'sh!" });
        } else {
          setSlugState({ status: 'error', message: json.error || 'Bu manzil band!' });
        }
      } catch (err) {
        setSlugState({ status: 'idle', message: '' });
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [data.customFields?.customSlug]);

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
            { key: 'langUz', label: "O'zbek tili", code: 'UZ', scriptKey: 'baseAlphabetUz' },
            { key: 'langQq', label: 'Qaraqalpoq tili', code: 'QQ', scriptKey: 'baseAlphabetQq' },
            { key: 'langRu', label: 'Rus tili', code: 'RU' },
          ].map((opt) => {
            const isOn = data.customFields?.[opt.key] !== false && (opt.key === 'langUz' ? (data.customFields?.[opt.key] ?? true) : !!data.customFields?.[opt.key]);
            const currentScript = data.customFields?.[opt.scriptKey] || 'latin';
            
            return (
              <div
                key={opt.key}
                className={`w-full flex items-center justify-between py-2 px-3 rounded-xl text-sm font-medium border transition-all ${
                  isOn
                    ? 'bg-primary-500/20 border-primary-500/50 text-primary-300'
                    : 'bg-white/[0.03] border-white/10 text-surface-500 hover:border-white/20'
                }`}
              >
                <div 
                  className="flex items-center gap-2 flex-1 cursor-pointer py-1"
                  onClick={() => handleCustomFieldChange(opt.key, !isOn)}
                >
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isOn ? 'bg-primary-500/30' : 'bg-white/10'}`}>{opt.code}</span>
                  {opt.label}
                </div>

                {opt.scriptKey && isOn && (
                  <div className="flex bg-surface-900/40 rounded-lg p-0.5 mr-3 border border-white/5">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleCustomFieldChange(opt.scriptKey, 'latin'); }}
                      className={`px-3 py-1 text-[10px] uppercase tracking-wide font-bold rounded-md transition-all ${currentScript === 'cyrillic' ? 'text-surface-500 hover:text-white' : 'bg-surface-700 text-white shadow-sm'}`}
                    >
                      Lot
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleCustomFieldChange(opt.scriptKey, 'cyrillic'); }}
                      className={`px-3 py-1 text-[10px] uppercase tracking-wide font-bold rounded-md transition-all ${currentScript === 'cyrillic' ? 'bg-surface-700 text-white shadow-sm' : 'text-surface-500 hover:text-white'}`}
                    >
                      Кир
                    </button>
                  </div>
                )}

                <button
                   type="button"
                   onClick={() => handleCustomFieldChange(opt.key, !isOn)}
                   className={`text-xs px-2 py-0.5 rounded-full z-10 transition-colors ${isOn ? 'bg-primary-500/30 text-primary-200' : 'bg-white/5 text-surface-500'}`}
                >
                  {isOn ? 'ON' : 'OFF'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Language visual Order */}
        <div className="pt-3 border-t border-white/5 space-y-2">
          <label className="label mb-1 block">Tillarning ekrandagi tartibi (Birinchisi asosiy bo'ladi)</label>
          <select 
            value={data.customFields?.langOrder || 'uz,ru,qq'} 
            onChange={(e) => handleCustomFieldChange('langOrder', e.target.value)}
            className="input-field py-2 text-sm w-full"
          >
            <option value="uz,ru,qq">UZ ➔ RU ➔ QQ</option>
            <option value="uz,qq,ru">UZ ➔ QQ ➔ RU</option>
            <option value="ru,uz,qq">RU ➔ UZ ➔ QQ</option>
            <option value="ru,qq,uz">RU ➔ QQ ➔ UZ</option>
            <option value="qq,uz,ru">QQ ➔ UZ ➔ RU</option>
            <option value="qq,ru,uz">QQ ➔ RU ➔ UZ</option>
          </select>
        </div>

      </div>

      {/* TEXT FIELDS COMPONENT */}
      <div className="glass p-5 flex flex-col gap-8">
        <h3 className="text-[13px] font-bold text-primary-300 uppercase tracking-wider flex items-center gap-2 mb-2 border-b border-primary-500/20 pb-4">
          ✍️ {t('step3.textGroupTitle')}
        </h3>

        {/* UZ fields */}
        {isUzOn && (
          <div className={`space-y-4 ${orderArr.indexOf('uz') !== 0 ? 'pt-6 border-t border-white/5' : ''}`} style={{ order: orderArr.indexOf('uz') }}>
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
          <div className={`space-y-4 ${orderArr.indexOf('qq') !== 0 ? 'pt-6 border-t border-white/5' : ''}`} style={{ order: orderArr.indexOf('qq') }}>
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
          <div className={`space-y-4 ${orderArr.indexOf('ru') !== 0 ? 'pt-6 border-t border-white/5' : ''}`} style={{ order: orderArr.indexOf('ru') }}>
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

      {/* GLOBAL SETTINGS COMPONENT */}
      <div className="glass p-5 space-y-6">
        <h3 className="text-[13px] font-bold text-primary-300 uppercase tracking-wider flex items-center gap-2 mb-2 border-b border-primary-500/20 pb-4">
          ⚙️ {t('step3.settingsGroupTitle')}
        </h3>
        
        {/* Template custom fields */}
      {templateFields.length > 0 && (
        <div className="space-y-4 mb-4">
          <h3 className="text-xs font-semibold text-surface-300 uppercase tracking-wider flex items-center gap-2">
            <span className="text-base">{data.eventType?.icon}</span> {t('step3.templateFields')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {templateFields.map((field) => (
              <div key={field.key} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                <label className="label">
                  {trLocal[field.key] || field.label} {field.required && <span className="text-rose-400">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea rows={3} placeholder={trLocal[field.key] || field.label}
                    value={data.customFields?.[field.key] || ''}
                    onChange={(e) => handleCustomFieldChange(field.key, e.target.value)}
                    className="input-field resize-none" />
                ) : (
                  <input type={field.type === 'number' ? 'number' : 'text'}
                    placeholder={trLocal[field.key] || field.label}
                    value={data.customFields?.[field.key] || ''}
                    min={field.key === 'age' ? '1' : undefined}
                    max={field.key === 'age' ? '150' : undefined}
                    onChange={(e) => {
                      let val = e.target.value;
                      if (field.type === 'number' && field.key === 'age' && val !== '') {
                        let num = parseInt(val, 10);
                        if (!isNaN(num)) {
                          if (num <= 0) val = '';
                          else if (num > 150) val = '150';
                          else val = num.toString();
                        }
                      }
                      handleCustomFieldChange(field.key, val);
                    }}
                    className="input-field" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

            {/* Date & location */}
      <div className="space-y-4">
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
          <input type="text" placeholder="https://yandex.uz/maps/..."
            value={data.locationUrl || ''} 
            onChange={(e) => {
              let val = e.target.value;
              const urlMatch = val.match(/(https?:\/\/[^\s]+)/i);
              if (urlMatch) val = urlMatch[0];
              handleChange('locationUrl', val.trim());
              setLocConfirmed(false);
            }}
            className={`input-field ${data.locationUrl && !/^(https?:\/\/)?([a-z0-9-]+\.)+[a-z0-9]{2,}(\/.*)?$/i.test(data.locationUrl) ? 'border-red-500/50 focus:border-red-500 bg-red-500/5 shadow-[0_0_10px_rgba(239,68,68,0.1)]' : ''}`} />
          {data.locationUrl && !/^(https?:\/\/)?([a-z0-9-]+\.)+[a-z0-9]{2,}(\/.*)?$/i.test(data.locationUrl) && (
             <p className="text-[10px] text-red-400 mt-1.5 font-medium">{trLocal.invalidUrl}</p>
          )}

          {data.locationUrl && /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z0-9]{2,}(\/.*)?$/i.test(data.locationUrl) && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-3 mb-2 bg-surface-900 border border-white/10 rounded-xl overflow-hidden shadow-lg">
               <iframe src={getMapEmbedUrl(data.locationUrl, data.location)} width="100%" height="160" frameBorder="0" />
               <div onClick={() => setLocConfirmed(!locConfirmed)} className="p-3 bg-surface-800 flex items-center justify-between cursor-pointer hover:bg-surface-800/80 transition-colors">
                 <p className="text-[11px] sm:text-xs text-white font-medium">{trLocal.mapConfirm}</p>
                 <label className="flex items-center gap-2 pointer-events-none">
                   <input type="checkbox" checked={locConfirmed} readOnly className="w-4 h-4 rounded bg-surface-900 border-white/20" />
                   <span className={`text-[10px] sm:text-[11px] uppercase tracking-wider font-bold transition-colors ${locConfirmed ? 'text-primary-400' : 'text-surface-500'}`}>{trLocal.confirm}</span>
                 </label>
               </div>
            </motion.div>
          )}

          <div className="flex gap-2 mt-1.5">
            <a
              href={`https://yandex.uz/maps/?text=${encodeURIComponent(data.location || '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium
                bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all"
            >
              {trLocal.yandexSearch}
            </a>
            <a
              href={`https://www.google.com/maps/search/${encodeURIComponent(data.location || '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium
                bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-all"
            >
              {trLocal.googleSearch}
            </a>
          </div>
        </div>
      </div>

            {/* Extra features: music + telegram */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-surface-300 uppercase tracking-wider flex items-center gap-2">
          ⚙️ {t('step3.extras')}
        </h3>
        <div>
          <label className="label flex items-center gap-1.5">🎵 {t('step3.music')}</label>
          
          {/* Current music indicator */}
          {data.customFields?.musicUrl && (
            <div className="flex items-center gap-2 mb-2 p-2 rounded-lg bg-primary-500/10 border border-primary-500/20">
              <span className="text-xs text-primary-300 truncate flex-1">
                🎶 {data.customFields.musicUrl.startsWith('data:') ? trLocal.musicUploaded : data.customFields.musicUrl}
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
                      alert(trLocal.sizeErr);
                      return;
                    }
                    
                    setUploading('music');
                    try {
                      const url = await uploadAudio(file);
                      handleCustomFieldChange('musicUrl', url);
                    } catch (err) {
                      alert(trLocal.uploadErr + err.message);
                    }
                    setUploading(null);
                    e.target.value = '';
                  }} />
                {uploading === 'music' ? (
                  <><Loader2 size={18} className="animate-spin text-primary-400" /><span className="text-sm text-primary-400">{trLocal.uploadingMusic}</span></>
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
                    alert(trLocal.uploadErr + err.message);
                  }
                  setUploading(null);
                  e.target.value = '';
                }} />
              {uploading === 'photo' ? (
                <><Loader2 size={20} className="animate-spin text-primary-400" /><span className="text-sm text-primary-400">{trLocal.uploadingPhoto}</span></>
              ) : (
                <><span className="text-2xl">📷</span><span className="text-sm text-surface-400">{t('step3.photoUpload')}</span></>
              )}
            </label>
          )}
        </div>

        {/* Custom Slug */}
        <div>
          <label className="label flex items-center gap-1.5">{trLocal.customUrl}</label>
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
              className={`input-field flex-1 font-mono text-sm ${slugState.status === 'error' ? 'border-red-500/50 focus:border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.1)]' : slugState.status === 'success' ? 'border-emerald-500/50 focus:border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : ''}`}
            />
            {slugState.status === 'loading' && <Loader2 className="w-4 h-4 animate-spin text-surface-400" />}
            {slugState.status === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            {slugState.status === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
          </div>
          <div className="flex items-start justify-between mt-1">
             <p className="text-[11px] text-surface-500">{trLocal.slugHint}</p>
             {slugState.message && (
               <p className={`text-[11px] font-medium ${slugState.status === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
                 {slugState.message}
               </p>
             )}
          </div>
        </div>

        {/* Color Palette */}
        <div>
          <label className="label flex items-center gap-1.5">{trLocal.palette}</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'gold',     label: trLocal.gold,    color: '#d4a853', dark: '#0b0d17' },
              { id: 'silver',   label: trLocal.silver,   color: '#9da8b8', dark: '#0d1018' },
              { id: 'ocean',    label: trLocal.ocean,    color: '#4a9fe8', dark: '#060e1a' },
              { id: 'rose',     label: trLocal.rose,      color: '#e8749a', dark: '#150810' },
              { id: 'lavender', label: trLocal.lavender,  color: '#a07ee8', dark: '#0e0a18' },
              { id: 'teal',     label: trLocal.teal,     color: '#3bbdaa', dark: '#060f0d' },
              { id: 'amber',    label: trLocal.amber,    color: '#e8a84a', dark: '#110c02' },
              { id: 'emerald',  label: trLocal.emerald,  color: '#4ae898', dark: '#040f08' },
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
            <label className="label flex items-center gap-1.5 !mb-2">{trLocal.rsvpLang}</label>
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
            onClick={() => {
              const isEnabled = data.customFields?.enableWishes === undefined ? !!data.customFields?.telegramChatId : data.customFields?.enableWishes;
              if (isEnabled) {
                 handleCustomFieldChange('enableWishes', false);
              } else {
                 if (!data.customFields?.telegramChatId) {
                    alert(lang === 'ru' ? 'Сначала подключите Telegram бота!' : (lang === 'qq' ? 'Dáslep Telegram botqa jalǵań!' : 'Avval Telegram botga ulaning!'));
                    return;
                 }
                 handleCustomFieldChange('enableWishes', true);
              }
            }}
            className={`w-11 h-6 rounded-full transition-all duration-300 relative flex-shrink-0 ${
              (data.customFields?.enableWishes === undefined ? !!data.customFields?.telegramChatId : data.customFields?.enableWishes) ? 'bg-primary-500' : 'bg-surface-700'
            }`}>
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${
              (data.customFields?.enableWishes === undefined ? !!data.customFields?.telegramChatId : data.customFields?.enableWishes) ? 'left-[22px]' : 'left-0.5'
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
            { key: 'showShareWa',   label: `💬 ${t('step3.showShareWa')}`, hint: t('step3.showShareWaHint'), defaultOn: false },
            { key: 'showShareTg',   label: `✈️ ${t('step3.showShareTg')}`, hint: t('step3.showShareTgHint'), defaultOn: false },
            { key: 'showCalendarBtn', label: `📅 ${t('step3.showCalendar')}`,        hint: t('step3.showCalendarHint'), defaultOn: false },
            { key: 'showPrintBtn',  label: `🖨️ ${t('step3.showPrint')}`,       hint: t('step3.showPrintHint'), defaultOn: false },
            { key: 'enableAlphabetSwitcher', label: trLocal.alphabetSwitcher, hint: trLocal.alphabetHint, defaultOn: false },
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

      </div>    </div>
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
          className="flex items-center gap-2 text-sm text-surface-400 hover:text-white 
            transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/10"
        >
          {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
          {showPreview ? t('step3.hide') : t('step3.show')}
        </button>
      </div>

      <div className={`flex gap-6 ${showPreview ? 'flex-col lg:flex-row' : 'flex-col'}`}>
        {/* Form column */}
        <div className={`w-full ${showPreview ? 'hidden lg:block lg:w-1/2' : 'max-w-2xl mx-auto'}`}>
          {formContent}
        </div>

        {/* Live preview column */}
        {showPreview && (
          <div className="w-full lg:w-1/2">
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
          <div className="flex flex-col sm:flex-row items-center justify-end w-full sm:w-auto relative group">
            <button onClick={onNext}
              disabled={
                !activeHostName || 
                !data.eventDate || 
                !data.location || 
                (data.locationUrl && /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z0-9]{2,}(\/.*)?$/i.test(data.locationUrl) && !locConfirmed)
              }
              className={`btn-primary flex-1 sm:flex-none w-full min-w-[160px] text-center py-3.5 ${(data.locationUrl && /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z0-9]{2,}(\/.*)?$/i.test(data.locationUrl) && !locConfirmed) ? 'bg-surface-700 text-surface-400 hover:scale-100 cursor-not-allowed' : ''}`}>
              {t('step3.next')}
            </button>
            {(data.locationUrl && /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z0-9]{2,}(\/.*)?$/i.test(data.locationUrl) && !locConfirmed) && (
              <span className="absolute -top-10 right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 bg-black/80 backdrop-blur-md text-white text-[10px] whitespace-nowrap px-3 py-1.5 rounded-lg opacity-0 transition-opacity drop-shadow-xl pointer-events-none w-auto delay-200">
                {trLocal.confirmTip}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
