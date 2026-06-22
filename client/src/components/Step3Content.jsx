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
    connectTgFirst: "Avval Telegram botga ulaning!",
    musicLibrary: "Musiqa kutubxonasi", musicSelect: "Tanlash"
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
    connectTgFirst: "Сначала подключите Telegram бота!",
    musicLibrary: "Библиотека музыки", musicSelect: "Выбрать"
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
    connectTgFirst: "Dáslep Telegram botqa jalǵań!",
    musicLibrary: "Muzıka kitalapxanasi", musicSelect: "Tan'law"
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
    connectTgFirst: "Please connect Telegram bot first!",
    musicLibrary: "Music Library", musicSelect: "Select"
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
  const fallback = `https://yandex.uz/map-widget/v1/?mode=search&text=${encodeURIComponent(locationName || 'Tashkent')}&z=15`;
  if (!urlStr) return fallback;
  try {
    const url = new URL(urlStr);

    // ── Yandex Maps ──
    if (url.hostname.includes('yandex')) {
      // Already a widget URL — use as-is
      if (url.pathname.includes('map-widget')) return urlStr;

      // Yandex short link (/-/XXXX): can't extract coordinates without redirect.
      // Use location name search for proper centering.
      const shortMatch = url.pathname.match(/\/-\/([A-Za-z0-9_-]+)/);
      if (shortMatch) {
        // Prefer location name search (centers perfectly on the place)
        return fallback;
      }

      // Full Yandex URL — try to extract pt (placemark) for precise centering
      const ptParam = url.searchParams.get('pt');
      if (ptParam) {
        // pt=lon,lat,style — use those coords as ll too
        const coords = ptParam.split(',');
        if (coords.length >= 2) {
          const lon = coords[0], lat = coords[1];
          return `https://yandex.uz/map-widget/v1/?ll=${lon},${lat}&pt=${ptParam}&z=16`;
        }
      }
      // poi[point] param
      const poiPoint = url.searchParams.get('poi[point]') || url.searchParams.get('poi%5Bpoint%5D');
      if (poiPoint) {
        const coords = poiPoint.split(',');
        if (coords.length >= 2) {
          const lon = coords[0], lat = coords[1];
          return `https://yandex.uz/map-widget/v1/?ll=${lon},${lat}&pt=${lon},${lat},pm2rdm&z=16`;
        }
      }
      // ll param only
      const ll = url.searchParams.get('ll');
      if (ll) {
        const z = url.searchParams.get('z') || '15';
        return `https://yandex.uz/map-widget/v1/?ll=${ll}&z=${z}`;
      }

      // Generic /maps/... → /map-widget/v1/...
      url.pathname = url.pathname.replace(/^\/maps/, '/map-widget/v1');
      if (!url.pathname.includes('map-widget')) url.pathname = '/map-widget/v1/';
      if (!url.searchParams.has('z')) url.searchParams.set('z', '15');
      return url.toString();
    }

    // ── Google Maps (full URL with coordinates) ──
    if (url.hostname.includes('google.com')) {
      const coordMatch = urlStr.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (coordMatch) {
        const lat = coordMatch[1], lng = coordMatch[2];
        return `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
      }
      const q = url.searchParams.get('q') || locationName || '';
      return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=15&output=embed`;
    }

    // ── Google Maps short URL (maps.app.goo.gl, goo.gl) ──
    // Can't resolve server-side; use location name on Yandex
    if (url.hostname.includes('goo.gl') || url.hostname.includes('maps.app')) {
      if (locationName) return fallback;
    }

    // ── 2GIS ──
    if (url.hostname.includes('2gis')) {
      // 2GIS doesn't support iframe; fallback to Yandex search
      return fallback;
    }

  } catch(e) {}
  return fallback;
};

const PRESET_SONGS = [
  // ESLATMA: Bu yerga o'zingizning haqiqiy .mp3 fayl linklaringizni qo'ying (Cloudinary yoki boshqa xostingdan)
  { id: 'yiruma-river', title: 'River Flows in You', artist: 'Yiruma', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 'einaudi-nuvole', title: 'Nuvole Bianche', artist: 'Ludovico Einaudi', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 'pachelbel-canon', title: 'Canon in D', artist: 'Pachelbel', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: 'alcocer-idea10', title: 'Idea 10', artist: 'Gibran Alcocer', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
  { id: 'alcocer-idea15', title: 'Idea 15', artist: 'Gibran Alcocer', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
];

export default function Step3Content({ data, onUpdate, onNext, onBack, editingInvitationId, token }) {
  const [showPreview, setShowPreview] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);
  const [uploading, setUploading] = useState(null); // 'photo' | 'music' | null
  const [draftSaved, setDraftSaved] = useState(false);
  const [hasDraftRestored, setHasDraftRestored] = useState(false);
  const [slugState, setSlugState] = useState({ status: 'idle', message: '' });
  const [locConfirmed, setLocConfirmed] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editSaved, setEditSaved] = useState(false);
  const saveTimerRef = useRef(null);
  const { t, lang } = useLang();
  const API = import.meta.env.VITE_API_URL || '';
  const trLocal = trStep3[lang] || trStep3['uz'];
  const orderArr = (data.customFields?.langOrder || 'uz,ru,qq').split(',');

  const [playingId, setPlayingId] = useState(null);
  const [subStep, setSubStep] = useState(1); // 1: Tillar, 2: Matnlar, 3: Vaqt & Joy, 4: Sozlamalar
  const [activeSection, setActiveSection] = useState(null);

  const subSteps = [
    { id: 1, label: "Tillar", labelRu: "Языки", labelQq: "Tiller", labelEn: "Languages", icon: "🌐" },
    { id: 2, label: "Matnlar", labelRu: "Тексты", labelQq: "Tekstler", labelEn: "Texts", icon: "✍️" },
    { id: 3, label: "Vaqt & Joy", labelRu: "Время & Место", labelQq: "Waqıt & Orın", labelEn: "Date & Place", icon: "📅" },
    { id: 4, label: "Sozlamalar", labelRu: "Настройки", labelQq: "Sazlawlar", labelEn: "Settings", icon: "⚙️" },
  ];
  const getSubStepLabel = (s) => {
    return lang === 'en' ? s.labelEn : lang === 'ru' ? s.labelRu : lang === 'qq' ? s.labelQq : s.label;
  };
  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleTogglePreview = (song) => {
    if (playingId === song.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
         audioRef.current.pause();
      }
      audioRef.current = new Audio(song.url);
      audioRef.current.play().catch(e => console.error("Playback failed", e));
      audioRef.current.onended = () => setPlayingId(null);
      setPlayingId(song.id);
    }
  };

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

  // Automatically initialize timeline program fields based on the selected event type
  const hasProgramUz = !!data.customFields?.program;
  const hasProgramQq = !!data.customFields?.programQq;
  const hasProgramRu = !!data.customFields?.programRu;

  useEffect(() => {
    if (!data.template) return;

    const updates = {};
    let changed = false;
    const evType = data.eventType?.name || 'wedding';
    const evTime = data.eventTime || '18:00';

    const getDefaultProgram = (lang) => {
      if (lang === 'qq') {
        if (evType === 'birthday') {
          return [
            { time: evTime, text: 'Mexmanlar kútip alıw' },
            { time: '18:30', text: 'Tort márásimi 🎂' },
            { time: '19:00', text: 'Ziyapat dástúrxanı' },
            { time: '21:00', text: 'Muzıkalı waqıtlar hám oyınlar 🎶' },
          ];
        }
        if (evType === 'graduation') {
          return [
            { time: evTime, text: 'Dizimnen ótiw' },
            { time: '18:30', text: 'Rásimiy saltanat 🎓' },
            { time: '19:30', text: 'Ziyapat dástúrxanı' },
            { time: '21:00', text: 'Diskoteka hám estelik waqıtlar 🎶' },
          ];
        }
        if (evType === 'jubilee') {
          return [
            { time: evTime, text: 'Mexmanlar kútip alıw' },
            { time: '18:30', text: 'Saltanatlı qutlıqlawlar 🎉' },
            { time: '19:00', text: 'Ziyapat dástúrxanı' },
            { time: '21:00', text: 'Muzıkalı keshe hám oyınlar 🎶' },
          ];
        }
        return [
          { time: evTime, text: 'Mexmanlar kútip alıw' },
          { time: '18:30', text: 'Rásimiy nikax márásimi' },
          { time: '19:00', text: 'Ziyapat dástúrxanı' },
          { time: '21:00', text: 'Muzıkalı waqıtlar hám keshe' },
        ];
      }

      if (lang === 'ru') {
        if (evType === 'birthday') {
          return [
            { time: evTime, text: 'Встреча гостей' },
            { time: '18:30', text: 'Церемония с тортом 🎂' },
            { time: '19:00', text: 'Праздничный банкет' },
            { time: '21:00', text: 'Музыкальная программа и игры 🎶' },
          ];
        }
        if (evType === 'graduation') {
          return [
            { time: evTime, text: 'Регистрация гостей' },
            { time: '18:30', text: 'Торжественная часть 🎓' },
            { time: '19:30', text: 'Праздничный банкет' },
            { time: '21:00', text: 'Дискотека и памятная фотосессия 🎶' },
          ];
        }
        if (evType === 'jubilee') {
          return [
            { time: evTime, text: 'Встреча гостей' },
            { time: '18:30', text: 'Торжественные поздравления 🎉' },
            { time: '19:00', text: 'Праздничный банкет' },
            { time: '21:00', text: 'Музыкальный вечер и танцы 🎶' },
          ];
        }
        return [
          { time: evTime, text: 'Встреча гостей' },
          { time: '18:30', text: 'Официальная церемония бракосочетания' },
          { time: '19:00', text: 'Праздничный банкет' },
          { time: '21:00', text: 'Музыкальная программа и танцы' },
        ];
      }

      // UZ
      if (evType === 'birthday') {
        return [
          { time: evTime, text: 'Mehmonlarni kutib olish' },
          { time: '18:30', text: 'Tort marosimi 🎂' },
          { time: '19:00', text: 'Ziyofat dasturxoni' },
          { time: '21:00', text: 'Musiqali lahzalar va o\'yinlar 🎶' },
        ];
      }
      if (evType === 'graduation') {
        return [
          { time: evTime, text: 'Ro\'yxatdan o\'tish' },
          { time: '18:30', text: 'Rasmiy tantana 🎓' },
          { time: '19:30', text: 'Ziyofat dasturxoni' },
          { time: '21:00', text: 'Diskoteka va esdalik lahzalar 🎶' },
        ];
      }
      if (evType === 'jubilee') {
        return [
          { time: evTime, text: 'Mehmonlarni kutib olish' },
          { time: '18:30', text: 'Tantanali tabriklar 🎉' },
          { time: '19:00', text: 'Ziyofat dasturxoni' },
          { time: '21:00', text: 'Musiqali kecha va raqs 🎶' },
        ];
      }
      return [
        { time: evTime, text: 'Mehmonlarni kutib olish' },
        { time: '18:30', text: 'Rasmiy nikoh marosimi' },
        { time: '19:00', text: 'Ziyofat dasturxoni' },
        { time: '21:00', text: 'Musiqa va ko\'ngil ochar lahzalar' },
      ];
    };

    if (!hasProgramUz) {
      updates.program = JSON.stringify(getDefaultProgram('uz'));
      changed = true;
    }
    if (!hasProgramQq) {
      updates.programQq = JSON.stringify(getDefaultProgram('qq'));
      changed = true;
    }
    if (!hasProgramRu) {
      updates.programRu = JSON.stringify(getDefaultProgram('ru'));
      changed = true;
    }

    if (changed) {
      onUpdate({
        customFields: {
          ...data.customFields,
          ...updates
        }
      });
    }
  }, [data.template?.id, data.eventTime, data.eventType?.name, hasProgramUz, hasProgramQq, hasProgramRu, onUpdate]);

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

  // Tahrirlash rejimida o'zgarishlarni API'ga saqlash
  const handleSaveEdit = async () => {
    if (!editingInvitationId || !token) return;
    setEditSaving(true);
    try {
      const { enableRsvp, ...customFieldsRest } = data.customFields || {};
      const res = await fetch(`${API}/api/invitations/${editingInvitationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          hostName: data.hostName,
          guestName: data.guestName,
          eventTitle: data.eventTitle,
          eventTime: data.eventTime,
          location: data.location,
          locationUrl: data.locationUrl,
          message: data.message,
          customFields: data.customFields,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setEditSaved(true);
        setTimeout(() => {
          setEditSaved(false);
          onBack(); // Dashboardga qaytish
        }, 1500);
      }
    } catch (err) {
      console.error('Saqlashda xatolik:', err);
    } finally {
      setEditSaving(false);
    }
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

        {/* ── Hero Emoji / Shapka ── */}
        {data.eventType && (() => {
          const ev = data.eventType?.name || 'custom';
          const defaults = { wedding: '💍', birthday: '🎂', graduation: '🎓', jubilee: '🎉', custom: '✨' };
          const suggestions = {
            wedding:    ['💍','💒','🌹','💐','🕊️','🥂','✨','🎊'],
            birthday:   ['🎂','🎈','🎉','🎁','🎀','🥳','⭐','🌟'],
            graduation: ['🎓','📚','🏆','📜','⭐','🌟','✨','🎊'],
            jubilee:    ['🎉','🥂','🏆','👑','🌟','💫','✨','🎊'],
            custom:     ['✨','🌟','💫','🎊','🎈','🌸','🕊️','🔑'],
          };
          const def = defaults[ev] || '✨';
          const sugg = suggestions[ev] || suggestions.custom;
          const current = data.customFields?.heroEmoji || '';
          const isHidden = current === 'none';
          return (
            <div className={`glass p-4 border rounded-2xl mb-2 space-y-3 transition-all duration-200 ${activeSection==='heroEmoji' ? 'border-indigo-500/60 bg-indigo-500/8 ring-1 ring-indigo-500/30' : 'border-yellow-500/20 bg-yellow-500/5'}`} onFocusCapture={() => setActiveSection('heroEmoji')} onBlurCapture={() => setActiveSection(null)}>
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-bold text-yellow-300 uppercase tracking-wider flex items-center gap-2">
                  {t('step3.heroSection')}
                </h3>
                <button
                  type="button"
                  onClick={() => handleCustomFieldChange('heroEmoji', isHidden ? '' : 'none')}
                  className={`text-xs px-3 py-1 rounded-full border transition-all duration-200 flex items-center gap-1
                    ${isHidden
                      ? 'bg-red-500/20 border-red-400/50 text-red-300 hover:bg-red-500/30'
                      : 'bg-white/5 border-white/15 text-surface-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400'}`}
                >
                  {isHidden ? t('step3.heroShow') : t('step3.heroHide')}
                </button>
              </div>

              {isHidden ? (
                <div className="flex items-center gap-2 py-2 px-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <span className="text-2xl opacity-30 line-through">{def}</span>
                  <p className="text-[11px] text-red-400">Shapka yashirilgan — taklifnomada ko'rinmaydi</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-4xl leading-none bg-white/5 rounded-xl p-2 border border-white/10 min-w-[52px] text-center">
                      {current || def}
                    </span>
                    <div className="flex-1 min-w-0">
                      <label className="label mb-1">{t('step3.emojiInputLabel')}</label>
                      <input
                        type="text"
                        placeholder={def}
                        className="input-field"
                        maxLength={8}
                        value={current}
                        onChange={(e) => handleCustomFieldChange('heroEmoji', e.target.value)}
                      />
                    </div>
                    {current && current !== 'none' && (
                      <button type="button"
                        onClick={() => handleCustomFieldChange('heroEmoji', '')}
                        className="text-xs text-surface-400 hover:text-yellow-400 shrink-0 px-2 py-1 rounded border border-surface-600 hover:border-yellow-500/40 transition-colors"
                      >
                        Standart
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {sugg.map(em => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => handleCustomFieldChange('heroEmoji', em)}
                        className={`text-xl w-10 h-10 rounded-lg border transition-all duration-150 flex items-center justify-center
                          ${(current || def) === em
                            ? 'bg-yellow-500/20 border-yellow-400/60 scale-110'
                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:scale-105'}`}
                        title={em}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })()}

        {/* ── Yuqori yozuv matni (ПИТКЭРИЎШИЛЭР КЭШЭСИ kabi) ── */}
        {data.eventType && (
          <div className={`glass p-4 border rounded-2xl mb-2 space-y-3 transition-all duration-200 ${activeSection==='heroText' ? 'border-indigo-500/60 bg-indigo-500/8 ring-1 ring-indigo-500/30' : 'border-sky-500/20 bg-sky-500/5'}`} onFocusCapture={() => setActiveSection('heroText')} onBlurCapture={() => setActiveSection(null)}>
            <h3 className="text-[13px] font-bold text-sky-300 uppercase tracking-wider flex items-center gap-2">
              {t('step3.heroTextSection')}
              <span className="text-[9px] normal-case font-normal text-surface-500 ml-1 border border-sky-700/30 px-1.5 py-0.5 rounded">
                masalan: ПИТКЭРИЎШИЛЭР КЭШЭСИ
              </span>
            </h3>
            <div className="space-y-2">
              {isUzOn && (
                <div>
                  <label className="label mb-1 flex items-center gap-1">🇺🇿 O'zbekcha yozuv</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="masalan: Bitiruvchilar kechasi"
                    value={data.customFields?.customEventLabel || ''}
                    onChange={(e) => handleCustomFieldChange('customEventLabel', e.target.value)}
                  />
                </div>
              )}
              {isQqOn && (
                <div>
                  <label className="label mb-1 flex items-center gap-1">{t('step3.qqTextLabel')}</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="masalan: Pitkeriwshiler keshesi"
                    value={data.customFields?.customEventLabelQq || ''}
                    onChange={(e) => handleCustomFieldChange('customEventLabelQq', e.target.value)}
                  />
                </div>
              )}
              {isRuOn && (
                <div>
                  <label className="label mb-1 flex items-center gap-1">🇷🇺 Ruscha yozuv</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="masalan: Выпускной вечер"
                    value={data.customFields?.customEventLabelRu || ''}
                    onChange={(e) => handleCustomFieldChange('customEventLabelRu', e.target.value)}
                  />
                </div>
              )}
              {!isUzOn && !isQqOn && !isRuOn && (
                <p className="text-[11px] text-surface-500">Til sazlamalarini yoqing</p>
              )}
            </div>
          </div>
        )}

        {/* ── Language Specific Fields Wrapper ── */}
        <div className="flex flex-col gap-8">
          {isUzOn && (
          <div className={`space-y-4 ${orderArr.indexOf('uz') !== 0 ? 'pt-6 border-t border-white/5' : ''}`} style={{ order: orderArr.indexOf('uz') }}>
            <h4 className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 inline-block px-2.5 py-1 rounded-md border border-emerald-500/20 shadow-sm">🇺🇿 {trLocal.uzFields}</h4>
            <div>
              <label className="label flex items-center gap-1.5">✏️ {trLocal.uzEventTitle}</label>
              <input type="text" placeholder="Nikoh marosimi"
                value={data.eventTitle || ''} onChange={(e) => handleChange('eventTitle', e.target.value)}
                onFocus={() => setActiveSection('eventTitle')} onBlur={() => setActiveSection(null)}
                className="input-field" />
            </div>
            {/* Age field — only for birthday */}
            {data.eventType?.name === 'birthday' && (
              <div>
                <label className="label flex items-center gap-1.5">🎂 {trLocal.age || 'Yosh'}</label>
                <input type="number" placeholder="7"
                  min="1" max="150"
                  value={data.customFields?.age || ''}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (val !== '') {
                      let num = parseInt(val, 10);
                      if (!isNaN(num)) {
                        if (num <= 0) val = '';
                        else if (num > 150) val = '150';
                        else val = num.toString();
                      }
                    }
                    handleCustomFieldChange('age', val);
                  }}
                  onFocus={() => setActiveSection('age')} onBlur={() => setActiveSection(null)}
                  className="input-field" />
              </div>
            )}
            <div>
              <label className="label">👥 {trLocal.uzGuestName}</label>
              <input type="text" placeholder="Hurmatli mehmon"
                value={data.guestName || ''} onChange={(e) => handleChange('guestName', e.target.value)}
                onFocus={() => setActiveSection('guestName')} onBlur={() => setActiveSection(null)}
                className="input-field" />
            </div>

            <div className="space-y-3 mt-3">
              <label className="label flex items-center gap-1.5">💬 {trLocal.msg}</label>
              <textarea rows={3} placeholder="Hurmatli mehmonlar, sizni..."
                value={data.message || ''} onChange={(e) => handleChange('message', e.target.value)}
                onFocus={() => setActiveSection('message')} onBlur={() => setActiveSection(null)}
                className="input-field resize-none" />
            </div>

            <div className="mt-3">
              <label className="label">👤 {trLocal.uzHostName} *</label>
              <input type="text" placeholder="Aliyev Jasur"
                value={data.hostName || ''} onChange={(e) => handleChange('hostName', e.target.value)}
                onFocus={() => setActiveSection('hostName')} onBlur={() => setActiveSection(null)}
                className="input-field" />
            </div>

            <div className="mt-4 border-t border-white/5 pt-4">
              <div className="flex items-center justify-between mb-3">
                <label className="label flex items-center gap-2 mb-0">📅 Dastur (UZ)</label>
                <input type="text" placeholder="Kecha dasturi" value={data.customFields?.programCustomTitle || ''}
                  onChange={(e) => handleCustomFieldChange('programCustomTitle', e.target.value)}
                  onFocus={() => setActiveSection('schedule')} onBlur={() => setActiveSection(null)}
                  className="input-field text-xs py-1 px-3 w-[140px]" />
              </div>
              {(() => {
                const DEFAULT_UZ = [
                  { time: data.eventTime || '10:00', text: 'Mehmonlarni kutib olish' },
                  { time: '11:00', text: 'Rasmiy qism' },
                  { time: '12:00', text: 'Bayram dasturxoni' },
                  { time: '14:00', text: 'Musiqiy tanaffus' },
                ];
                let items = [];
                try { items = data.customFields?.program ? JSON.parse(data.customFields.program) : []; } catch { items = []; }
                if (items.length === 0) items = DEFAULT_UZ;
                const updateProgram = (newItems) => handleCustomFieldChange('program', JSON.stringify(newItems));
                const moveItem = (idx, dir) => {
                  const n = [...items];
                  const to = idx + dir;
                  if (to < 0 || to >= n.length) return;
                  [n[idx], n[to]] = [n[to], n[idx]];
                  updateProgram(n);
                };
                return (
                  <div className="space-y-2">
                    {items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 group bg-white/[0.02] rounded-xl px-3 py-2 border border-white/[0.06] hover:border-white/10 transition-all">
                        <div className="flex flex-col gap-0.5">
                          <button type="button" onClick={() => moveItem(i, -1)} disabled={i === 0}
                            className="text-surface-500 hover:text-white disabled:opacity-20 text-[10px] leading-none">▲</button>
                          <button type="button" onClick={() => moveItem(i, 1)} disabled={i === items.length - 1}
                            className="text-surface-500 hover:text-white disabled:opacity-20 text-[10px] leading-none">▼</button>
                        </div>
                        <input type="time" value={item.time}
                          onChange={(e) => { const n = [...items]; n[i] = { ...n[i], time: e.target.value }; updateProgram(n); }}
                          onFocus={() => setActiveSection('schedule')} onBlur={() => setActiveSection(null)}
                          className="input-field w-[100px] text-center text-sm flex-shrink-0" />
                        <input type="text" value={item.text}
                          onChange={(e) => { const n = [...items]; n[i] = { ...n[i], text: e.target.value }; updateProgram(n); }}
                          onFocus={() => setActiveSection('schedule')} onBlur={() => setActiveSection(null)}
                          className="input-field flex-1 text-sm" placeholder="Tadbir nomi" />
                        <button type="button" onClick={() => updateProgram(items.filter((_, j) => j !== i))}
                          className="text-surface-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all text-sm w-7 h-7 flex items-center justify-center rounded-lg hover:bg-rose-400/10 flex-shrink-0">✕</button>
                      </div>
                    ))}
                    <button type="button"
                      onClick={() => updateProgram([...items, { time: '', text: '' }])}
                      className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1.5 mt-1 px-3 py-2 rounded-lg border border-dashed border-white/10 hover:border-primary-400/40 w-full justify-center transition-all">
                      {t('step3.addScheduleItem')}
                    </button>
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
            <div>
              <label className="label">✏️ {trLocal.qqEventTitle}</label>
              <input type="text" placeholder="Nikax márásimi"
                value={data.customFields?.eventTitleQq || ''}
                onChange={(e) => handleCustomFieldChange('eventTitleQq', e.target.value)}
                onFocus={() => setActiveSection('eventTitle')} onBlur={() => setActiveSection(null)}
                className="input-field" />
            </div>
            <div>
              <label className="label">👥 {trLocal.qqGuestName}</label>
              <input type="text" placeholder="Húrmetli mexmanlar"
                value={data.customFields?.guestNameQq || ''}
                onChange={(e) => handleCustomFieldChange('guestNameQq', e.target.value)}
                onFocus={() => setActiveSection('guestName')} onBlur={() => setActiveSection(null)}
                className="input-field" />
            </div>

            <div className="space-y-3 mt-3">
              <label className="label flex items-center gap-1.5">💬 {trLocal.msg}</label>
              <textarea rows={3} placeholder="Sizdi márásimimizge shaqıramız..."
                value={data.customFields?.messageQq || ''}
                onChange={(e) => handleCustomFieldChange('messageQq', e.target.value)}
                onFocus={() => setActiveSection('message')} onBlur={() => setActiveSection(null)}
                className="input-field resize-none" />
            </div>

            <div className="mt-3">
              <label className="label">👤 {trLocal.qqHostName}</label>
              <input type="text" placeholder="Aliyev Jasur"
                value={data.customFields?.hostNameQq || ''}
                onChange={(e) => handleCustomFieldChange('hostNameQq', e.target.value)}
                onFocus={() => setActiveSection('hostName')} onBlur={() => setActiveSection(null)}
                className="input-field" />
            </div>

            <div className="mt-4 border-t border-white/5 pt-4">
              <div className="flex items-center justify-between mb-3">
                <label className="label flex items-center gap-2 mb-0">📅 Bag'darlanma (QQ)</label>
                <input type="text" placeholder="Ilaje bag'darlanması" value={data.customFields?.programCustomTitleQq || ''}
                  onChange={(e) => handleCustomFieldChange('programCustomTitleQq', e.target.value)}
                  onFocus={() => setActiveSection('schedule')} onBlur={() => setActiveSection(null)}
                  className="input-field text-xs py-1 px-3 w-[140px]" />
              </div>
              {(() => {
                const DEFAULT_QQ = [
                  { time: data.eventTime || '10:00', text: 'Mexmanlar kútip alıw' },
                  { time: '11:00', text: 'Rásimiy bólim' },
                  { time: '12:00', text: 'Ziyapat dástúrxanı' },
                  { time: '14:00', text: 'Muzıkalı waqıtlar' },
                ];
                let items = [];
                try { items = data.customFields?.programQq ? JSON.parse(data.customFields.programQq) : []; } catch { items = []; }
                if (items.length === 0) items = DEFAULT_QQ;
                const updateProgramQq = (newItems) => handleCustomFieldChange('programQq', JSON.stringify(newItems));
                const moveItemQq = (idx, dir) => {
                  const n = [...items];
                  const to = idx + dir;
                  if (to < 0 || to >= n.length) return;
                  [n[idx], n[to]] = [n[to], n[idx]];
                  updateProgramQq(n);
                };
                return (
                  <div className="space-y-2">
                    {items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 group bg-white/[0.02] rounded-xl px-3 py-2 border border-white/[0.06] hover:border-white/10 transition-all">
                        <div className="flex flex-col gap-0.5">
                          <button type="button" onClick={() => moveItemQq(i, -1)} disabled={i === 0}
                            className="text-surface-500 hover:text-white disabled:opacity-20 text-[10px] leading-none">▲</button>
                          <button type="button" onClick={() => moveItemQq(i, 1)} disabled={i === items.length - 1}
                            className="text-surface-500 hover:text-white disabled:opacity-20 text-[10px] leading-none">▼</button>
                        </div>
                        <input type="time" value={item.time}
                          onChange={(e) => { const n = [...items]; n[i] = { ...n[i], time: e.target.value }; updateProgramQq(n); }}
                          onFocus={() => setActiveSection('schedule')} onBlur={() => setActiveSection(null)}
                          className="input-field w-[100px] text-center text-sm flex-shrink-0" />
                        <input type="text" value={item.text}
                          onChange={(e) => { const n = [...items]; n[i] = { ...n[i], text: e.target.value }; updateProgramQq(n); }}
                          onFocus={() => setActiveSection('schedule')} onBlur={() => setActiveSection(null)}
                          className="input-field flex-1 text-sm" placeholder="Ilaje atı" />
                        <button type="button" onClick={() => updateProgramQq(items.filter((_, j) => j !== i))}
                          className="text-surface-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all text-sm w-7 h-7 flex items-center justify-center rounded-lg hover:bg-rose-400/10 flex-shrink-0">✕</button>
                      </div>
                    ))}
                    <button type="button"
                      onClick={() => updateProgramQq([...items, { time: '', text: '' }])}
                      className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1.5 mt-1 px-3 py-2 rounded-lg border border-dashed border-white/10 hover:border-primary-400/40 w-full justify-center transition-all">
                      + Band qosıw
                    </button>
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
            <div>
              <label className="label">✏️ {trLocal.ruEventTitle}</label>
              <input type="text" placeholder="Свадебное торжество"
                value={data.customFields?.eventTitleRu || ''}
                onChange={(e) => handleCustomFieldChange('eventTitleRu', e.target.value)}
                onFocus={() => setActiveSection('eventTitle')} onBlur={() => setActiveSection(null)}
                className="input-field" />
            </div>
            <div>
              <label className="label">👥 {trLocal.ruGuestName}</label>
              <input type="text" placeholder="Уважаемые гости"
                value={data.customFields?.guestNameRu || ''}
                onChange={(e) => handleCustomFieldChange('guestNameRu', e.target.value)}
                onFocus={() => setActiveSection('guestName')} onBlur={() => setActiveSection(null)}
                className="input-field" />
            </div>

            <div className="space-y-3 mt-3">
              <label className="label flex items-center gap-1.5">💬 {trLocal.msg}</label>
              <textarea rows={3} placeholder="Приглашаем вас на наше торжество..."
                value={data.customFields?.messageRu || ''}
                onChange={(e) => handleCustomFieldChange('messageRu', e.target.value)}
                onFocus={() => setActiveSection('message')} onBlur={() => setActiveSection(null)}
                className="input-field resize-none" />
            </div>

            <div className="mt-3">
              <label className="label">👤 {trLocal.ruHostName}</label>
              <input type="text" placeholder="Абдуллаев Юнус"
                value={data.customFields?.hostNameRu || ''}
                onChange={(e) => handleCustomFieldChange('hostNameRu', e.target.value)}
                onFocus={() => setActiveSection('hostName')} onBlur={() => setActiveSection(null)}
                className="input-field" />
            </div>

            <div className="mt-4 border-t border-white/5 pt-4">
              <div className="flex items-center justify-between mb-3">
                <label className="label flex items-center gap-2 mb-0">📅 Программа (RU)</label>
                <input type="text" placeholder="Программа вечера" value={data.customFields?.programCustomTitleRu || ''}
                  onChange={(e) => handleCustomFieldChange('programCustomTitleRu', e.target.value)}
                  onFocus={() => setActiveSection('schedule')} onBlur={() => setActiveSection(null)}
                  className="input-field text-xs py-1 px-3 w-[140px]" />
              </div>
              {(() => {
                const DEFAULT_RU = [
                  { time: data.eventTime || '10:00', text: 'Встреча гостей' },
                  { time: '11:00', text: 'Торжественная часть' },
                  { time: '12:00', text: 'Праздничный банкет' },
                  { time: '14:00', text: 'Музыкальная программа' },
                ];
                let items = [];
                try { items = data.customFields?.programRu ? JSON.parse(data.customFields.programRu) : []; } catch { items = []; }
                if (items.length === 0) items = DEFAULT_RU;
                const updateProgramRu = (newItems) => handleCustomFieldChange('programRu', JSON.stringify(newItems));
                const moveItemRu = (idx, dir) => {
                  const n = [...items];
                  const to = idx + dir;
                  if (to < 0 || to >= n.length) return;
                  [n[idx], n[to]] = [n[to], n[idx]];
                  updateProgramRu(n);
                };
                return (
                  <div className="space-y-2">
                    {items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 group bg-white/[0.02] rounded-xl px-3 py-2 border border-white/[0.06] hover:border-white/10 transition-all">
                        <div className="flex flex-col gap-0.5">
                          <button type="button" onClick={() => moveItemRu(i, -1)} disabled={i === 0}
                            className="text-surface-500 hover:text-white disabled:opacity-20 text-[10px] leading-none">▲</button>
                          <button type="button" onClick={() => moveItemRu(i, 1)} disabled={i === items.length - 1}
                            className="text-surface-500 hover:text-white disabled:opacity-20 text-[10px] leading-none">▼</button>
                        </div>
                        <input type="time" value={item.time}
                          onChange={(e) => { const n = [...items]; n[i] = { ...n[i], time: e.target.value }; updateProgramRu(n); }}
                          onFocus={() => setActiveSection('schedule')} onBlur={() => setActiveSection(null)}
                          className="input-field w-[100px] text-center text-sm flex-shrink-0" />
                        <input type="text" value={item.text}
                          onChange={(e) => { const n = [...items]; n[i] = { ...n[i], text: e.target.value }; updateProgramRu(n); }}
                          onFocus={() => setActiveSection('schedule')} onBlur={() => setActiveSection(null)}
                          className="input-field flex-1 text-sm" placeholder="Событие" />
                        <button type="button" onClick={() => updateProgramRu(items.filter((_, j) => j !== i))}
                          className="text-surface-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all text-sm w-7 h-7 flex items-center justify-center rounded-lg hover:bg-rose-400/10 flex-shrink-0">✕</button>
                      </div>
                    ))}
                    <button type="button"
                      onClick={() => updateProgramRu([...items, { time: '', text: '' }])}
                      className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1.5 mt-1 px-3 py-2 rounded-lg border border-dashed border-white/10 hover:border-primary-400/40 w-full justify-center transition-all">
                      + Добавить пункт
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
        </div>

        {/* ── Footer kutish xabari — "Sizni kutib qolamiz!" kabi ── */}
        {data.eventType && (
          <div className={`pt-6 border-t border-white/10 space-y-3 transition-all duration-200 ${activeSection==='waitingMsg' ? '' : ''}`} onFocusCapture={() => setActiveSection('waitingMsg')} onBlurCapture={() => setActiveSection(null)}>
            <h3 className="text-[13px] font-bold text-rose-300 uppercase tracking-wider flex items-center gap-2">
              {t('step3.waitingSection')}
              <span className="text-[9px] normal-case font-normal text-surface-500 ml-1 border border-rose-700/30 px-1.5 py-0.5 rounded">
                pastki — "Сизлерди күтип қаламыз!" kabi
              </span>
            </h3>
            <div className="space-y-2">
              {isUzOn && (
                <div>
                  <label className="label mb-1 flex items-center gap-1">🇺🇿 O'zbekcha</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Sizni kutib qolamiz! ✨"
                    value={data.customFields?.customWaitingMsg || ''}
                    onChange={(e) => handleCustomFieldChange('customWaitingMsg', e.target.value)}
                  />
                </div>
              )}
              {isQqOn && (
                <div>
                  <label className="label mb-1 flex items-center gap-1">🇰🇦 Qaraqalpaqcha</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Sizdi kútip qalamız! ✨"
                    value={data.customFields?.customWaitingMsgQq || ''}
                    onChange={(e) => handleCustomFieldChange('customWaitingMsgQq', e.target.value)}
                  />
                </div>
              )}
              {isRuOn && (
                <div>
                  <label className="label mb-1 flex items-center gap-1">🇷🇺 Ruscha</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Ждём вас! ✨"
                    value={data.customFields?.customWaitingMsgRu || ''}
                    onChange={(e) => handleCustomFieldChange('customWaitingMsgRu', e.target.value)}
                  />
                </div>
              )}
              {!isUzOn && !isQqOn && !isRuOn && (
                <div>
                  <label className="label mb-1">{t('step3.waitingLabel')}</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Sizni kutib qolamiz! ✨"
                    value={data.customFields?.customWaitingMsg || ''}
                    onChange={(e) => handleCustomFieldChange('customWaitingMsg', e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Ichki matnlarni o'zgartirish — barcha event turlari uchun ── */}
        {data.eventType && (
          <div className={`pt-6 border-t border-white/10 space-y-4 transition-all duration-200`} onFocusCapture={() => setActiveSection('labels')} onBlurCapture={() => setActiveSection(null)}>
            <h3 className="text-[13px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2 border-b border-cyan-500/20 pb-3">
              {t('step3.labelsSection')}
            </h3>
            <p className="text-[11px] text-surface-400">
              {t('step3.labelsDesc')}
            </p>

            {/* UZ labels */}
            {isUzOn && (
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 inline-block px-2.5 py-1 rounded-md border border-emerald-500/20">
                  🇺🇿 O‘zbekcha matnlar
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="label">Tadbir nomi (UZ)</label>
                    <input type="text" placeholder="Sunnat to’yi" className="input-field"
                      value={data.customFields?.customEventLabel || ''}
                      onChange={(e) => handleCustomFieldChange('customEventLabel', e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Hisob-kitob sarlavhasi (UZ)</label>
                    <input type="text" placeholder="Tadbirgacha qolgan vaqt" className="input-field"
                      value={data.customFields?.customCountdownTitle || ''}
                      onChange={(e) => handleCustomFieldChange('customCountdownTitle', e.target.value)} />
                  </div>
                  <div>
                    <label className="label">{t('step3.waitingLabelUz')}</label>
                    <input type="text" placeholder="Sizni kutib qolamiz! ✨" className="input-field"
                      value={data.customFields?.customWaitingMsg || ''}
                      onChange={(e) => handleCustomFieldChange('customWaitingMsg', e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Tafsilotlar bo‘limi (UZ)</label>
                    <input type="text" placeholder="Tadbir tafsilotlari" className="input-field"
                      value={data.customFields?.customDetailsTitle || ''}
                      onChange={(e) => handleCustomFieldChange('customDetailsTitle', e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label">Dastur bo‘limi sarlavhasi (UZ)</label>
                    <input type="text" placeholder="Tadbir dasturi" className="input-field"
                      value={data.customFields?.customProgramTitle || ''}
                      onChange={(e) => handleCustomFieldChange('customProgramTitle', e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {/* QQ labels */}
            {isQqOn && (
              <div className="space-y-3 pt-3 border-t border-white/5">
                <h4 className="text-[11px] font-bold text-amber-400 bg-amber-500/10 inline-block px-2.5 py-1 rounded-md border border-amber-500/20">
                  🇰🇦 Qaraqalpaqsha matnlar
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="label">Ilaje atı (QQ)</label>
                    <input type="text" placeholder="Sünnet toyi" className="input-field"
                      value={data.customFields?.customEventLabelQq || ''}
                      onChange={(e) => handleCustomFieldChange('customEventLabelQq', e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Hisap-esap sarlavhası (QQ)</label>
                    <input type="text" placeholder="Ilajege qalǵan waqıt" className="input-field"
                      value={data.customFields?.customCountdownTitleQq || ''}
                      onChange={(e) => handleCustomFieldChange('customCountdownTitleQq', e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Kütiw xabari (QQ)</label>
                    <input type="text" placeholder="Sizdi kútip qalamız! ✨" className="input-field"
                      value={data.customFields?.customWaitingMsgQq || ''}
                      onChange={(e) => handleCustomFieldChange('customWaitingMsgQq', e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Táfsiyler bólimi (QQ)</label>
                    <input type="text" placeholder="Ilaje tafsilatları" className="input-field"
                      value={data.customFields?.customDetailsTitleQq || ''}
                      onChange={(e) => handleCustomFieldChange('customDetailsTitleQq', e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {/* RU labels */}
            {isRuOn && (
              <div className="space-y-3 pt-3 border-t border-white/5">
                <h4 className="text-[11px] font-bold text-indigo-400 bg-indigo-500/10 inline-block px-2.5 py-1 rounded-md border border-indigo-500/20">
                  🇷🇺 Русские тексты
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="label">Название мероприятия (RU)</label>
                    <input type="text" placeholder="Обрезание" className="input-field"
                      value={data.customFields?.customEventLabelRu || ''}
                      onChange={(e) => handleCustomFieldChange('customEventLabelRu', e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Счётчик (заголовок) (RU)</label>
                    <input type="text" placeholder="До мероприятия осталось" className="input-field"
                      value={data.customFields?.customCountdownTitleRu || ''}
                      onChange={(e) => handleCustomFieldChange('customCountdownTitleRu', e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Сообщение ожидания (RU)</label>
                    <input type="text" placeholder="Ждём вас! ✨" className="input-field"
                      value={data.customFields?.customWaitingMsgRu || ''}
                      onChange={(e) => handleCustomFieldChange('customWaitingMsgRu', e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Заголовок деталей (RU)</label>
                    <input type="text" placeholder="Детали мероприятия" className="input-field"
                      value={data.customFields?.customDetailsTitleRu || ''}
                      onChange={(e) => handleCustomFieldChange('customDetailsTitleRu', e.target.value)} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Template custom fields */}
        {templateFields.filter((f) => f.key !== 'age').length > 0 && (
          <div className="pt-6 border-t border-white/10 space-y-4">
          <h3 className="text-xs font-semibold text-surface-300 uppercase tracking-wider flex items-center gap-2">
            <span className="text-base">{data.eventType?.icon}</span> {t('step3.templateFields')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {templateFields.filter((field) => field.key !== 'age').map((field) => (
              <div key={field.key} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                <label className="label">
                  {trLocal[field.key] || field.label} {field.required && <span className="text-rose-400">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea rows={3} placeholder={trLocal[field.key] || field.label}
                    value={data.customFields?.[field.key] || ''}
                    onFocus={() => setActiveSection(field.key)}
                    onBlur={() => setActiveSection(null)}
                    onChange={(e) => handleCustomFieldChange(field.key, e.target.value)}
                    className="input-field resize-none" />
                ) : (
                  <input type={field.type === 'number' ? 'number' : 'text'}
                    placeholder={trLocal[field.key] || field.label}
                    value={data.customFields?.[field.key] || ''}
                    onFocus={() => setActiveSection(field.key)}
                    onBlur={() => setActiveSection(null)}
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

        </div>

      {/* Date & location */}
        <div className="glass p-5 space-y-6">
          <div className={`space-y-4 transition-all duration-200 rounded-xl p-0 ${activeSection==='dateLocation' ? 'ring-1 ring-indigo-500/30' : ''}`} onFocusCapture={() => setActiveSection('dateLocation')} onBlurCapture={() => setActiveSection(null)}>
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
              onFocus={() => setActiveSection('dateLocation')} onBlur={() => setActiveSection(null)}
              className="input-field" />
          </div>
          <div>
            <label className="label flex items-center gap-1.5"><Clock size={13} /> {t('step3.time')}</label>
            <input type="time" value={data.eventTime || ''}
              onChange={(e) => handleChange('eventTime', e.target.value)}
              onFocus={() => setActiveSection('dateLocation')} onBlur={() => setActiveSection(null)}
              className="input-field" />
          </div>
        </div>
        <div>
          <label className="label flex items-center gap-1.5"><MapPin size={13} /> {t('step3.location')} *</label>
          <input type="text" placeholder="Navruz to'yxonasi, Toshkent"
            value={data.location || ''} onChange={(e) => handleChange('location', e.target.value)}
            onFocus={() => setActiveSection('location')} onBlur={() => setActiveSection(null)}
            className="input-field" />
        </div>
        <div>
          <label className="label flex items-center gap-1.5"><Link2 size={13} /> {t('step3.mapLink')}</label>
          <input type="text" placeholder="https://yandex.uz/maps/..."
            value={data.locationUrl || ''} 
            onFocus={() => setActiveSection('location')} onBlur={() => setActiveSection(null)}
            onChange={(e) => {
              let val = e.target.value;
              const urlMatch = val.match(/(https?:\/\/[^\s]+)/i);
              if (urlMatch) val = urlMatch[0];
              const trimmed = val.trim();
              handleChange('locationUrl', trimmed);
              setLocConfirmed(false);

              // Auto-resolve Yandex/Google short URLs
              const isShortYandex = /yandex\.[^/]+\/maps\/-\//.test(trimmed);
              const isShortGoogle = /maps\.app\.goo\.gl|goo\.gl\/maps/.test(trimmed);
              if ((isShortYandex || isShortGoogle) && trimmed.length > 10) {
                fetch(`${API}/api/resolve-map?url=${encodeURIComponent(trimmed)}`)
                  .then(r => r.json())
                  .then(d => {
                    if (d.success && d.resolved && d.resolved !== trimmed) {
                      handleChange('locationUrl', d.resolved);
                    }
                  })
                  .catch(() => {}); // silently fail
              }
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
      </div>

      {/* Extra settings */}
        <div className="glass p-5 space-y-6">
          <div className={`space-y-4 transition-all duration-200 rounded-xl ${activeSection==='music' ? 'ring-1 ring-indigo-500/30' : ''}`} onFocusCapture={() => setActiveSection('music')} onBlurCapture={() => setActiveSection(null)}>
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
            <div className="space-y-4">
              {/* Library Selection */}
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
                <p className="text-[10px] text-surface-500 uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                   {trLocal.musicLibrary}
                </p>
                <div className="flex gap-3 overflow-x-auto pb-4 -mx-1 px-1 scrollbar-hide">
                  {PRESET_SONGS.map(song => (
                    <div key={song.id} className="flex-shrink-0 group">
                      <div className="relative w-40 aspect-video rounded-2xl overflow-hidden border border-white/10 hover:border-primary-500/30 transition-all bg-surface-900 mb-2">
                        {/* Artwork Mock / Decor */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent flex items-center justify-center">
                           <div className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10">
                              <span className="text-xl">🎵</span>
                           </div>
                        </div>

                        {/* Controls Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                           <button
                             type="button"
                             onClick={() => handleTogglePreview(song)}
                             className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl"
                           >
                              {playingId === song.id ? (
                                <div className="flex gap-0.5 items-center">
                                   <div className="w-1 h-3 bg-black animate-pulse" />
                                   <div className="w-1 h-4 bg-black animate-pulse delay-75" />
                                   <div className="w-1 h-3 bg-black animate-pulse delay-150" />
                                </div>
                              ) : (
                                <div className="translate-x-0.5">▶</div>
                              )}
                           </button>
                        </div>
                        
                        {/* Title Bar */}
                        <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-md p-2 text-left">
                           <p className="text-[10px] font-bold text-white truncate">{song.title}</p>
                           <p className="text-[8px] text-surface-400 truncate uppercase mt-0.5 tracking-tighter">{song.artist}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          handleCustomFieldChange('musicUrl', song.url);
                          if (audioRef.current) audioRef.current.pause();
                          setPlayingId(null);
                        }}
                        className="w-full py-1.5 rounded-lg bg-surface-800 hover:bg-primary-500 hover:text-black text-[10px] uppercase font-black tracking-widest transition-all"
                      >
                        {trLocal.confirm}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* URL or Upload separator */}
              <div className="flex items-center gap-2 opacity-50">
                <div className="flex-1 h-px bg-white/10"></div>
                <span className="text-[10px] text-surface-600 italic">yoki oʻzingiznikini yuklang</span>
                <div className="flex-1 h-px bg-white/10"></div>
              </div>

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
        <div className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${activeSection==='rsvp' ? 'border-indigo-500/50 bg-indigo-500/8' : 'border-white/[0.06] bg-white/[0.02]'}`} onClick={() => setActiveSection('rsvp')}>
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

        <div className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${activeSection==='wishes' ? 'border-indigo-500/50 bg-indigo-500/8' : 'border-white/[0.06] bg-white/[0.02]'}`} onClick={() => setActiveSection('wishes')}>
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
          {editingInvitationId ? (
            <>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  ✏️ Tahrirlash rejimi
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-amber-300">
                Taklifnomani tahrirlash
              </h2>
              <p className="text-surface-400 text-sm mt-1">O'zgarishlarni kiritib, "Saqlash" tugmasini bosing</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl md:text-3xl font-display font-bold">
                {t('step3.title')}
              </h2>
              <p className="text-surface-400 text-sm mt-1">{t('step3.desc')}</p>
            </>
          )}
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
        <div className={`w-full ${showPreview ? 'lg:block lg:w-1/2' : 'max-w-2xl mx-auto'}`}>
          {formContent}
        </div>

        {/* Live preview column */}
        {showPreview && (
          <div className="w-full lg:w-1/2">
            <div className="sticky top-4 self-start">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-surface-400 uppercase tracking-wider font-medium">
                  {t('step3.preview')}
                </span>
              </div>
              <LivePreview
                data={data}
                activeSection={activeSection}
                className="h-[calc(100vh-110px)] rounded-2xl border border-white/10 overflow-hidden"
              />
            </div>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 z-20 bg-surface-950/90 backdrop-blur-lg border-t border-white/5 
        -mx-4 px-4 py-4 mt-6 sm:static sm:bg-transparent sm:backdrop-blur-none sm:border-0 sm:mx-0 sm:px-0 sm:py-0 sm:mt-0">
        {/* Tahrirlash rejimi: Saqlash tugmasi */}
        {editingInvitationId ? (
          <div className="flex justify-between items-center gap-3">
            <button
              onClick={() => onBack()}
              className="btn-secondary flex-1 sm:flex-none py-3.5"
            >
              ← {t('step3.back') || 'Orqaga'}
            </button>
            <div className="flex items-center gap-2 flex-1 sm:flex-none justify-end">
              {editSaved && (
                <span className="text-emerald-400 text-sm flex items-center gap-1 animate-fade-in">
                  ✅ Saqlandi!
                </span>
              )}
              <button
                onClick={handleSaveEdit}
                disabled={editSaving || !data.eventDate || !data.location || (data.locationUrl && /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z0-9]{2,}(\/.*)?$/i.test(data.locationUrl) && !locConfirmed)}
                className="btn-primary flex items-center justify-center gap-2 min-w-[160px] py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editSaving ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saqlanmoqda...</>
                ) : (
                  <>💾 O'zgarishlarni saqlash</>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center gap-3">
            <button
              onClick={() => onBack()}
              className="btn-secondary flex-1 sm:flex-none py-3.5"
            >
              {t('step3.back')}
            </button>
            <div className="flex flex-col sm:flex-row items-center justify-end w-full sm:w-auto relative group">
              <button
                onClick={() => onNext()}
                disabled={
                  !data.eventDate || 
                  !data.location || 
                  (data.locationUrl && /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z0-9]{2,}(\/.*)?$/i.test(data.locationUrl) && !locConfirmed)
                }
                className={`btn-primary flex-1 sm:flex-none w-full min-w-[160px] text-center py-3.5 ${(data.locationUrl && /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z0-9]{2,}(\/.*)?$/i.test(data.locationUrl) && !locConfirmed) ? 'bg-surface-700 text-surface-400 hover:scale-100 cursor-not-allowed' : ''}`}
              >
                {t('step3.next')}
              </button>
              {(data.locationUrl && /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z0-9]{2,}(\/.*)?$/i.test(data.locationUrl) && !locConfirmed) && (
                <span className="absolute -top-10 right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 bg-black/80 backdrop-blur-md text-white text-[10px] whitespace-nowrap px-3 py-1.5 rounded-lg opacity-0 transition-opacity drop-shadow-xl pointer-events-none w-auto delay-200">
                  {trLocal.confirmTip}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
