import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Crown, Sparkles, Check, Eye, X } from 'lucide-react';
import { getTemplates } from '../api';
import { useLang } from '../i18n';

// Russian translations for template names/descriptions (keyed by slug suffix)
const templateNameRu = {
  // Original 10 themes
  'dark-gold':     { name: 'Классика Тёмное Золото', desc: 'Классический тёмный фон с золотыми акцентами' },
  'pushti':        { name: 'Романтик Розовый', desc: 'Романтические розовые и цветочные тона' },
  'minimalist-oq': { name: 'Минималист Белый', desc: 'Чистый белый минималистичный дизайн' },
  'binafsha':      { name: 'Королевский Фиолет', desc: 'Королевский фиолетовый и серебряные тона' },
  'yashil':        { name: 'Природный Зелёный', desc: 'Натуральный зелёный и лесные оттенки' },
  'sharqona':      { name: 'Восточный Золотой', desc: 'Восточные красные и золотые акценты' },
  'qora':          { name: 'Современный Чёрный', desc: 'Современный чёрно-белый контраст' },
  'sepia':         { name: 'Винтаж Сепия', desc: 'Винтажные тёплые тона сепии' },
  'kok':           { name: 'Океан Синий', desc: 'Океанические синие и голубые тона' },
  'oltin':         { name: 'Солнечный Золотой', desc: 'Солнечные тёплые золотые тона' },
  // Neon — 10 цветов
  'neon-cyan':     { name: 'Неон Голубой', desc: 'Неоновые сине-зелёные линии' },
  'neon-pink':     { name: 'Неон Розовый', desc: 'Неоновый розовый и жёлтый' },
  'neon-green':    { name: 'Неон Зелёный', desc: 'Неоновый зелёный и синий' },
  'neon-purple':   { name: 'Неон Фиолет', desc: 'Неоновый фиолетовый и розовый' },
  'neon-orange':   { name: 'Неон Оранж', desc: 'Неоновый оранжевый и красный' },
  'neon-yellow':   { name: 'Неон Жёлтый', desc: 'Неоновый жёлтый и зелёный' },
  'neon-red':      { name: 'Неон Красный', desc: 'Неоновый красный и жёлтый' },
  'neon-ice':      { name: 'Неон Лёд', desc: 'Неоновый бело-голубой ледяной' },
  'neon-gold':     { name: 'Неон Золото', desc: 'Неоновый золотой и бронза' },
  'neon-mint':     { name: 'Неон Мята', desc: 'Неоновый мятный и лавандовый' },
  // Marble — 10 цветов
  'marble-gold':     { name: 'Мрамор Золото', desc: 'Белый мрамор с золотом' },
  'marble-rose':     { name: 'Мрамор Роза', desc: 'Мрамор с розовым акцентом' },
  'marble-navy':     { name: 'Мрамор Синий', desc: 'Мрамор с тёмно-синим' },
  'marble-emerald':  { name: 'Мрамор Изумруд', desc: 'Мрамор с изумрудным' },
  'marble-plum':     { name: 'Мрамор Слива', desc: 'Мрамор со сливовым акцентом' },
  'marble-copper':   { name: 'Мрамор Медь', desc: 'Мрамор с медным акцентом' },
  'marble-silver':   { name: 'Мрамор Серебро', desc: 'Мрамор с серебряным акцентом' },
  'marble-burgundy': { name: 'Мрамор Бордо', desc: 'Мрамор с бордовым акцентом' },
  'marble-teal':     { name: 'Мрамор Бирюза', desc: 'Мрамор с бирюзовым акцентом' },
  'marble-charcoal': { name: 'Мрамор Уголь', desc: 'Тёмный мрамор с золотом' },
  // Boho — 10 цветов
  'boho-sage':      { name: 'Бохо Шалфей', desc: 'Зелёный шалфей и терракота' },
  'boho-terracota': { name: 'Бохо Терракота', desc: 'Терракота и оливковый' },
  'boho-lavender':  { name: 'Бохо Лаванда', desc: 'Лаванда и розовый' },
  'boho-dusty':     { name: 'Бохо Пыльный', desc: 'Пыльный розовый и зелёный' },
  'boho-ocean':     { name: 'Бохо Океан', desc: 'Океанский синий и песок' },
  'boho-sunset':    { name: 'Бохо Закат', desc: 'Цвета заката' },
  'boho-forest':    { name: 'Бохо Лес', desc: 'Лесной зелёный и коричневый' },
  'boho-blush':     { name: 'Бохо Румянец', desc: 'Розовый и золотой' },
  'boho-mustard':   { name: 'Бохо Горчица', desc: 'Горчичный и зелёный' },
  'boho-dark':      { name: 'Бохо Ночь', desc: 'Тёмный стиль бохо' },
  // Cinema — 10 цветов
  'cinema-gold':    { name: 'Кино Золото', desc: 'Классическая золотая афиша' },
  'cinema-red':     { name: 'Кино Красный', desc: 'Красная ковровая дорожка' },
  'cinema-teal':    { name: 'Кино Бирюза', desc: 'Бирюзовый кинематограф' },
  'cinema-silver':  { name: 'Кино Серебро', desc: 'Серебряный нуар' },
  'cinema-amber':   { name: 'Кино Янтарь', desc: 'Янтарный винтаж' },
  'cinema-purple':  { name: 'Кино Фиолет', desc: 'Фиолетовый фантастика' },
  'cinema-emerald': { name: 'Кино Изумруд', desc: 'Изумрудный тёмный стиль' },
  'cinema-coral':   { name: 'Кино Коралл', desc: 'Коралловый розовый стиль' },
  'cinema-ice':     { name: 'Кино Лёд', desc: 'Ледяной голубой стиль' },
  'cinema-white':   { name: 'Кино Белый', desc: 'Минималистичное белое кино' },
};

// Karakalpak translations for template names/descriptions (keyed by slug suffix)
const templateNameQq = {
  // Original 10 themes
  'dark-gold':     { name: 'Klassik Qara Altın', desc: 'Klassik qara fon altın aksentler menen' },
  'pushti':        { name: 'Romantik Gúlgún', desc: 'Romantik gúlgún hám gúl reńleri' },
  'minimalist-oq': { name: 'Minimalist Aq', desc: 'Taza aq minimalist dizayn' },
  'binafsha':      { name: 'Korollik Banavshe', desc: 'Korollik banavshe hám kúmis reńleri' },
  'yashil':        { name: 'Tábiyiy Jasıl', desc: 'Tábiyiy jasıl hám toǵay reńleri' },
  'sharqona':      { name: 'Shıǵıs Altın', desc: 'Shıǵıs qızıl hám altın aksentler' },
  'qora':          { name: 'Zámanagóy Qara', desc: 'Zámanagóy qara-aq kontrast' },
  'sepia':         { name: 'Vintage Sepiya', desc: 'Vintage jılı sepiya reńleri' },
  'kok':           { name: 'Okean Kók', desc: 'Okean kók hám gólúbiy reńleri' },
  'oltin':         { name: 'Quyash Altın', desc: 'Quyash jılı altın reńleri' },
  // Neon — 10
  'neon-cyan':     { name: 'Neon Kók', desc: 'Neon kók-jasıl shızıqlar' },
  'neon-pink':     { name: 'Neon Gúlgún', desc: 'Neon gúlgún hám sarı' },
  'neon-green':    { name: 'Neon Jasıl', desc: 'Neon jasıl hám kók' },
  'neon-purple':   { name: 'Neon Banavshe', desc: 'Neon banavshe hám gúlgún' },
  'neon-orange':   { name: 'Neon Apelsin', desc: 'Neon apelsin hám qızıl' },
  'neon-yellow':   { name: 'Neon Sarı', desc: 'Neon sarı hám jasıl' },
  'neon-red':      { name: 'Neon Qızıl', desc: 'Neon qızıl hám sarı' },
  'neon-ice':      { name: 'Neon Muz', desc: 'Neon aq-kók muzday' },
  'neon-gold':     { name: 'Neon Altın', desc: 'Neon altın hám bronza' },
  'neon-mint':     { name: 'Neon Jalpız', desc: 'Neon jalpız hám lavanda' },
  // Marble — 10
  'marble-gold':     { name: 'Mármár Altın', desc: 'Aq mármár altın menen' },
  'marble-rose':     { name: 'Mármár Gúl', desc: 'Mármár gúlgún aksent menen' },
  'marble-navy':     { name: 'Mármár Kók', desc: 'Mármár toq kók menen' },
  'marble-emerald':  { name: 'Mármár Zúmret', desc: 'Mármár zúmret menen' },
  'marble-plum':     { name: 'Mármár Álúshe', desc: 'Mármár álúshe aksent menen' },
  'marble-copper':   { name: 'Mármár Mis', desc: 'Mármár mis aksent menen' },
  'marble-silver':   { name: 'Mármár Kúmis', desc: 'Mármár kúmis aksent menen' },
  'marble-burgundy': { name: 'Mármár Sharab', desc: 'Mármár sharab qızıl aksent menen' },
  'marble-teal':     { name: 'Mármár Máviy', desc: 'Mármár máviy aksent menen' },
  'marble-charcoal': { name: 'Mármár Kómir', desc: 'Qaranǵı mármár altın menen' },
  // Boho — 10
  'boho-sage':      { name: 'Boho Ót', desc: 'Jasıl ót hám terrakota' },
  'boho-terracota': { name: 'Boho Terrakota', desc: 'Terrakota hám zaytun' },
  'boho-lavender':  { name: 'Boho Lavanda', desc: 'Lavanda hám gúlgún' },
  'boho-dusty':     { name: 'Boho Shaǹlı', desc: 'Shaǹlı gúlgún hám jasıl' },
  'boho-ocean':     { name: 'Boho Okean', desc: 'Okean kók hám qum' },
  'boho-sunset':    { name: 'Boho Quyash', desc: 'Quyash batıw reńleri' },
  'boho-forest':    { name: 'Boho Toǵay', desc: 'Toǵay jasıl hám qońır' },
  'boho-blush':     { name: 'Boho Qızarıw', desc: 'Gúlgún hám altın' },
  'boho-mustard':   { name: 'Boho Gorchitsa', desc: 'Gorchitsa sarı hám jasıl' },
  'boho-dark':      { name: 'Boho Tún', desc: 'Qaranǵı boho stil' },
  // Cinema — 10
  'cinema-gold':    { name: 'Kino Altın', desc: 'Klassik altın afisha' },
  'cinema-red':     { name: 'Kino Qızıl', desc: 'Qızıl kino gilam stili' },
  'cinema-teal':    { name: 'Kino Máviy', desc: 'Máviy kino dramatik' },
  'cinema-silver':  { name: 'Kino Kúmis', desc: 'Kúmis noir stili' },
  'cinema-amber':   { name: 'Kino Qahraba', desc: 'Qahraba reńli vintage' },
  'cinema-purple':  { name: 'Kino Banavshe', desc: 'Banavshe sci-fi stili' },
  'cinema-emerald': { name: 'Kino Zúmret', desc: 'Zúmret qaranǵı stili' },
  'cinema-coral':   { name: 'Kino Marjan', desc: 'Marjan gúlgún stili' },
  'cinema-ice':     { name: 'Kino Muz', desc: 'Muz kók stili' },
  'cinema-white':   { name: 'Kino Aq', desc: 'Minimalist aq kino stili' },
};

// Client-side translations for event types
const eventTypeTranslations = {
  qq: { wedding: 'Toy', birthday: 'Tuwılǵan kún', jubilee: 'Yubilej', graduation: 'Pitkeriwshiler' },
  ru: { wedding: 'Свадьба', birthday: 'День рождения', jubilee: 'Юбилей', graduation: 'Выпускной' },
  en: { wedding: 'Wedding', birthday: 'Birthday', jubilee: 'Anniversary', graduation: 'Graduation' },
};
function getTemplateSuffix(slug) {
  if (!slug) return '';
  // Remove event prefix: toy-dark-gold → dark-gold, tgk-pushti → pushti
  return slug.replace(/^(toy|tgk|grad|jub)-/, '');
}

/**
 * Shared template renderer — mirrors server-side renderString logic.
 * Replaces {{key}}, {{key|default}}, {{#if key}}...{{/if}}, {{#unless}}
 */
function renderTemplatePreview(template, eventTypeName = '', lang = 'uz') {
  // Detect event type from slug prefix or explicit name
  const detectedType = eventTypeName ||
    (template.slug?.startsWith('toy-') ? 'wedding' :
     template.slug?.startsWith('tgk-') ? 'birthday' :
     template.slug?.startsWith('grad-') ? 'graduation' :
     template.slug?.startsWith('jub-') ? 'jubilee' : 'wedding');

  // Type-specific sample data translated into all languages
  const typeData = {
    uz: {
      wedding: {
        brideName: 'Madina', groomName: 'Sardor',
        eventTitle: "Nikoh to'yi", eventTypeLabel: 'Nikoh taklifi',
        message: "Sizni farzandlarimiz nikoh to'yiga taklif qilamiz. Kelishingizni kutib qolamiz!",
        hostName: 'Karimov va Rahimov oilasi',
        guestName: 'Hurmatli mehmonlar!',
      },
      birthday: {
        age: '25', eventTitle: "Tug'ilgan kun bayrami",
        eventTypeLabel: "Tug'ilgan kun",
        message: "Sizni bayramimizga taklif qilamiz. Birga shodlanaylik!",
        hostName: 'Karimov oilasi',
        guestName: 'Hurmatli mehmonlar!',
      },
      graduation: {
        graduationYear: '2026', school: 'Toshkent Davlat Universiteti',
        eventTitle: 'Bitiruvchilar kechasi', eventTypeLabel: 'Bitiruvchilar',
        message: "Bitiruvchilar kechasiga taklif qilamiz. Muvaffaqiyatni birga nishonlaymiz!",
        hostName: "2026-yil bitiruvchilari",
        guestName: 'Hurmatli mehmonlar!',
      },
      jubilee: {
        years: '50', eventTitle: 'Oltin yubiley',
        eventTypeLabel: 'Yubiley',
        message: "Sizni yubiley tantanamizga taklif qilamiz. Kelishingiz sharaf!",
        hostName: 'Karimov oilasi',
        guestName: 'Hurmatli mehmonlar!',
      },
    },
    ru: {
      wedding: {
        brideName: 'Мадина', groomName: 'Сардор',
        eventTitle: 'Свадьба', eventTypeLabel: 'Свадебное приглашение',
        message: "Приглашаем вас на свадьбу наших детей. Будем рады видеть вас!",
        hostName: 'Семьи Каримовых и Рахимовых',
        guestName: 'Уважаемые гости!',
      },
      birthday: {
        age: '25', eventTitle: 'День рождения',
        eventTypeLabel: 'День рождения',
        message: "Приглашаем на наш праздник. Давайте веселиться вместе!",
        hostName: 'Семья Каримовых',
        guestName: 'Уважаемые гости!',
      },
      graduation: {
        graduationYear: '2026', school: 'Ташкентский Гос. Университет',
        eventTitle: 'Выпускной вечер', eventTypeLabel: 'Выпускной',
        message: "Приглашаем вас отпраздновать наш выпускной. Отметим успех вместе!",
        hostName: 'Выпускники 2026 года',
        guestName: 'Уважаемые гости!',
      },
      jubilee: {
        years: '50', eventTitle: 'Золотой юбилей',
        eventTypeLabel: 'Юбилей',
        message: "Приглашаем вас на торжественный юбилей. Ваше присутствие — честь для нас!",
        hostName: 'Семья Каримовых',
        guestName: 'Уважаемые гости!',
      },
    },
    qq: {
      wedding: {
        brideName: 'Madina', groomName: 'Sardor',
        eventTitle: 'Toy', eventTypeLabel: 'Nikax shaqırıwı',
        message: "Sizdi perzentlerimizdiń nikax toyına shaqıramız. Keliwińizdi kútip qalamız!",
        hostName: 'Karimovlar hám Rahimovlar',
        guestName: 'Húrmetli miymanlar!',
      },
      birthday: {
        age: '25', eventTitle: 'Tuwılǵan kún',
        eventTypeLabel: 'Tuwılǵan kún',
        message: "Sizdi bayramımızǵa shaqıramız. Birlik ishindemiz!",
        hostName: 'Karimovlar shańaraǵı',
        guestName: 'Húrmetli miymanlar!',
      },
      graduation: {
        graduationYear: '2026', school: 'Tashkent Mámleketlik Universiteti',
        eventTitle: 'Pitkeriwshiler keshesi', eventTypeLabel: 'Pitkeriwshiler',
        message: "Pitkeriwshiler keshesine shaqıramız. Úlken unamlılıqtı birge atap ótemiz!",
        hostName: '2026-jıl pitkeriwshileri',
        guestName: 'Húrmetli miymanlar!',
      },
      jubilee: {
        years: '50', eventTitle: 'Altın yubilej',
        eventTypeLabel: 'Yubilej',
        message: "Sizdi yubilej saltanatına shaqıramız. Keliwińiz sharaf!",
        hostName: 'Karimovlar shańaraǵı',
        guestName: 'Húrmetli miymanlar!',
      },
    }
  };

  const specific = (typeData[lang] && typeData[lang][detectedType]) ? typeData[lang][detectedType] : typeData['uz'][detectedType];

  const ctx = {
    ...specific,
    brideName: specific.brideName || '', groomName: specific.groomName || '',
    age: specific.age || '', graduationYear: specific.graduationYear || '',
    years: specific.years || '', school: specific.school || '',
    host_name: specific.hostName, name: specific.hostName,
    guestName: specific.guestName, guest_name: specific.guestName,
    event_title: specific.eventTitle, event_type: specific.eventTypeLabel,
    eventDate: '2026-08-15', event_date: '2026-08-15',
    eventDateFormatted: '15 Avgust, 2026', event_date_formatted: '15 Avgust, 2026',
    date: '15 Avgust, 2026',
    eventTime: '18:00', event_time: '18:00', time: '18:00',
    location: 'Grand Palace', locationUrl: '',
    slug: 'preview', templateName: template.name || '',
  };

  function render(str) {
    if (!str) return '';
    str = str.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/gi,
      (_, k, c) => { const v = ctx[k]; return v && v.toString().trim() ? c : ''; });
    str = str.replace(/\{\{#unless\s+(\w+)\}\}([\s\S]*?)\{\{\/unless\}\}/gi,
      (_, k, c) => { const v = ctx[k]; return !v || !v.toString().trim() ? c : ''; });
    str = str.replace(/\{\{\s*(\w+)(?:\|([^}]*))?\s*\}\}/g,
      (_, k, d) => { let v = ctx[k]; if (v === undefined || v === null || v === '') v = d ?? ''; return v; });
    return str;
  }

  return { html: render(template.htmlContent), css: render(template.cssContent) };
}

/**
 * Mini iframe preview — renders scaled-down template HTML/CSS inside an iframe
 * Shows the hero (first visible section) of the invitation.
 */
function TemplateThumbnail({ template, lang }) {
  const iframeRef = useRef(null);
  const containerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [scale, setScale] = useState(0.4);

  // Calculate scale based on actual container width
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const iframeNativeWidth = 420;
        setScale(containerWidth / iframeNativeWidth);
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const writePreview = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe || !template.htmlContent || !template.cssContent) return;

    const { html, css } = renderTemplatePreview(template, '', lang);

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Great+Vibes&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    ${css}
    /* Thumbnail overrides */
    html, body { overflow: hidden !important; pointer-events: none !important; }
    body { margin: 0 !important; padding: 0 !important; }
    .scroll-cue { display: none !important; }
    * { animation-duration: 0s !important; transition-duration: 0s !important; }
  </style>
</head>
<body>${html}</body>
</html>`);
    doc.close();
    setLoaded(true);
  }, [template.htmlContent, template.cssContent]);

  useEffect(() => {
    // Small delay to let iframe mount
    const timer = setTimeout(writePreview, 100);
    return () => clearTimeout(timer);
  }, [writePreview]);

  return (
    <div ref={containerRef} className="w-full aspect-[3/4] rounded-xl overflow-hidden relative bg-[#0a0a12]">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Loader2 className="w-5 h-5 text-surface-500 animate-spin" />
        </div>
      )}
      <iframe
        ref={iframeRef}
        title={`Preview: ${template.name}`}
        className="border-0 pointer-events-none absolute top-0 left-0"
        style={{
          width: '420px',
          height: '700px',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
        sandbox="allow-same-origin"
        tabIndex={-1}
      />
    </div>
  );
}

export default function Step2Template({ data, onUpdate, onNext, onBack }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const { t, lang } = useLang();

  useEffect(() => {
    if (!data.eventTypeId) return;
    setLoading(true);
    getTemplates({ eventTypeId: data.eventTypeId })
      .then((res) => { setTemplates(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [data.eventTypeId]);

  const handleSelect = (template) => {
    onUpdate({ template, templateId: template.id });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
      </div>
    );
  }

  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-display font-bold">
          {t('step2.title')}
        </h2>
        <p className="text-surface-400">
          {eventTypeTranslations[lang]?.[data.eventType?.name] || data.eventType?.label} — {templates.length} {t('step2.count')}
        </p>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-10">
          <Sparkles className="w-12 h-12 text-surface-500 mx-auto mb-3" />
          <p className="text-surface-400">{t('step2.empty')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {templates.map((tmpl, i) => {
            const isSelected = data.templateId === tmpl.id;
            return (
              <motion.button
                key={tmpl.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                onClick={() => {
                  if (isSelected) onNext();
                  else handleSelect(tmpl);
                }}
                className={`group relative rounded-2xl border backdrop-blur-xl text-left
                  transition-all duration-300 cursor-pointer overflow-hidden
                  ${isSelected
                    ? 'border-primary-500/60 ring-2 ring-primary-500/40 shadow-xl shadow-primary-500/15 scale-[1.02]'
                    : 'border-white/10 hover:border-white/25 hover:scale-[1.03] hover:shadow-lg hover:shadow-black/20'
                  }`}
              >
                {/* Selection check */}
                {isSelected && (
                  <div className="absolute bottom-14 right-2 z-20 w-6 h-6 bg-primary-500 rounded-full 
                    flex items-center justify-center shadow-lg">
                    <Check size={14} className="text-white" />
                  </div>
                )}

                {tmpl.isPremium && (
                  <div className="absolute top-2 left-2 z-20 flex items-center gap-1 bg-accent-500/20 text-accent-400 
                    text-[10px] font-semibold px-2 py-0.5 rounded-full border border-accent-500/30 backdrop-blur-md">
                    <Crown size={10} />
                    Premium
                  </div>
                )}

                {/* Preview eye button */}
                <button
                  onClick={(e) => { e.stopPropagation(); setPreviewTemplate(tmpl); }}
                  className="absolute top-2 right-2 z-20 w-7 h-7 rounded-full flex items-center justify-center
                    bg-black/50 backdrop-blur-md border border-white/20 text-white/70
                    hover:bg-black/70 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                  title="Ko'rish"
                >
                  <Eye size={13} />
                </button>

                {/* Live template preview thumbnail */}
                <TemplateThumbnail template={tmpl} lang={lang} />

                {/* Template name & description */}
                <div className="p-3 pt-2">
                  <h3 className="text-sm font-semibold text-white mb-0.5 truncate">
                    {lang === 'ru' ? (templateNameRu[getTemplateSuffix(tmpl.slug)]?.name || tmpl.name)
                     : lang === 'qq' ? (templateNameQq[getTemplateSuffix(tmpl.slug)]?.name || tmpl.name)
                     : tmpl.name}
                  </h3>
                  <p className="text-[11px] text-surface-400 line-clamp-1">
                    {lang === 'ru' ? (templateNameRu[getTemplateSuffix(tmpl.slug)]?.desc || tmpl.description)
                     : lang === 'qq' ? (templateNameQq[getTemplateSuffix(tmpl.slug)]?.desc || tmpl.description)
                     : tmpl.description}
                  </p>
                  
                  {isSelected && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                      className="pt-2 border-t border-white/10 flex justify-between items-center"
                    >
                      <span className="text-primary-400 text-[10px] font-medium">{t('common.selected') || 'Tanlandi'}</span>
                      <span className="bg-primary-500 text-white text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-lg shadow-primary-500/30">
                        {t('step1.next') || 'Davom etish'} &rarr;
                      </span>
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      )}

      <div className="sticky bottom-0 z-20 bg-surface-950/90 backdrop-blur-lg border-t border-white/5 
        -mx-4 px-4 py-4 mt-6 sm:static sm:bg-transparent sm:backdrop-blur-none sm:border-0 sm:mx-0 sm:px-0 sm:py-0 sm:mt-0">
        <div className="flex justify-between items-center gap-3 max-w-6xl mx-auto">
          <button onClick={onBack} className="btn-secondary flex-1 sm:flex-none py-3.5">
            {t('step2.back')}
          </button>
          <button
            onClick={onNext}
            disabled={!data.templateId}
            className="btn-primary flex-1 sm:flex-none min-w-[160px] text-center py-3.5"
          >
            {t('step2.next')}
          </button>
        </div>
      </div>
    </motion.div>

    {/* Fullscreen Preview Modal */}
    {previewTemplate && (
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 16,
        }}
        onClick={() => setPreviewTemplate(null)}
      >
        {/* Close button */}
        <button
          onClick={() => setPreviewTemplate(null)}
          style={{
            position: 'absolute', top: 16, right: 16, zIndex: 10,
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', backdropFilter: 'blur(8px)',
          }}
        >
          <X size={18} />
        </button>

        {/* Template name */}
        <div style={{
          position: 'absolute', top: 16, left: 16, zIndex: 10,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>{previewTemplate.name}</span>
          <button
            onClick={(e) => { e.stopPropagation(); handleSelect(previewTemplate); setPreviewTemplate(null); }}
            style={{
              padding: '6px 16px', borderRadius: 20,
              background: 'linear-gradient(135deg, #5c7cfa, #4263eb)',
              color: '#fff', fontSize: 12, fontWeight: 600,
              border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(92,124,250,0.3)',
            }}
          >
            Tanlash ✓
          </button>
        </div>

        {/* Preview iframe */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: 420, height: '85vh',
            borderRadius: 16, overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <FullPreview template={previewTemplate} lang={lang} />
        </div>
      </div>
    )}
    </>
  );
}

/**
 * Full-height scrollable preview inside modal
 */
function FullPreview({ template, lang }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !template.htmlContent || !template.cssContent) return;

    const { html, css } = renderTemplatePreview(template, '', lang);

    const timer = setTimeout(() => {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;
      doc.open();
      doc.write(`<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Great+Vibes&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    ${css}
    body { margin: 0 !important; }
    .scroll-cue { display: none !important; }
  </style>
</head>
<body>${html}</body>
</html>`);
      doc.close();
    }, 100);

    return () => clearTimeout(timer);
  }, [template]);

  return (
    <iframe
      ref={iframeRef}
      title={`Preview: ${template.name}`}
      style={{ width: '100%', height: '100%', border: 'none' }}
      sandbox="allow-same-origin allow-scripts"
    />
  );
}
