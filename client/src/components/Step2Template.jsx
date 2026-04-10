import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Crown, Sparkles, Check, Eye, X } from 'lucide-react';
import { getTemplates } from '../api';
import { useLang } from '../i18n';

// Russian translations for template names/descriptions (keyed by slug suffix)
const templateNameRu = {
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
  // New unique designs
  'neon-glow':     { name: 'Неон', desc: 'Футуристический неоновый дизайн' },
  'marble':        { name: 'Элегант Мрамор', desc: 'Белый мрамор с золотыми рамками' },
  'boho-garden':   { name: 'Бохо Сад', desc: 'Ботанический цветочный природный дизайн' },
  'cinema':        { name: 'Кино Постер', desc: 'Стиль киноафиши, крупная типографика' },
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
function renderTemplatePreview(template, eventTypeName = '') {
  // Detect event type from slug prefix or explicit name
  const detectedType = eventTypeName ||
    (template.slug?.startsWith('toy-') ? 'wedding' :
     template.slug?.startsWith('tgk-') ? 'birthday' :
     template.slug?.startsWith('grad-') ? 'graduation' :
     template.slug?.startsWith('jub-') ? 'jubilee' : 'wedding');

  // Type-specific sample data
  const typeData = {
    wedding: {
      brideName: 'Madina', groomName: 'Sardor',
      eventTitle: 'Nikoh to\'yi', eventTypeLabel: 'Nikoh taklifi',
      eventTypeIcon: '💍', icon: '💍', eventTypeName: 'wedding',
      message: "Sizni farzandlarimiz nikoh to'yiga taklif qilamiz. Kelishingizni kutib qolamiz!",
      hostName: 'Karimov va Rahimov oilasi',
    },
    birthday: {
      age: '25', eventTitle: "Tug'ilgan kun bayrami",
      eventTypeLabel: "Tug'ilgan kun", eventTypeIcon: '🎂', icon: '🎂',
      eventTypeName: 'birthday',
      message: "Sizni bayramimizga taklif qilamiz. Birga shodlanaylik!",
      hostName: 'Karimov oilasi',
    },
    graduation: {
      graduationYear: '2026', school: 'Toshkent Davlat Universiteti',
      eventTitle: 'Bitiruvchilar kechasi', eventTypeLabel: 'Bitiruvchilar',
      eventTypeIcon: '🎓', icon: '🎓', eventTypeName: 'graduation',
      message: "Bitiruvchilar kechasiga taklif qilamiz. Muvaffaqiyatni birga nishonlaymiz!",
      hostName: "2026-yil bitiruvchilari",
    },
    jubilee: {
      years: '50', eventTitle: 'Oltin yubiley',
      eventTypeLabel: 'Yubiley', eventTypeIcon: '🎉', icon: '🎉',
      eventTypeName: 'jubilee',
      message: "Sizni yubiley tantanamizga taklif qilamiz. Kelishingiz sharaf!",
      hostName: 'Karimov oilasi',
    },
  };

  const specific = typeData[detectedType] || typeData.wedding;

  const ctx = {
    ...specific,
    brideName: specific.brideName || '', groomName: specific.groomName || '',
    age: specific.age || '', graduationYear: specific.graduationYear || '',
    years: specific.years || '', school: specific.school || '',
    host_name: specific.hostName, name: specific.hostName,
    guestName: 'Hurmatli mehmonlar!', guest_name: 'Hurmatli mehmonlar!',
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
function TemplateThumbnail({ template }) {
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

    const { html, css } = renderTemplatePreview(template);

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
        sandbox="allow-same-origin allow-scripts"
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
          {data.eventType?.label} — {templates.length} {t('step2.count')}
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
                onClick={() => handleSelect(tmpl)}
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
                <TemplateThumbnail template={tmpl} />

                {/* Template name & description */}
                <div className="p-3 pt-2">
                  <h3 className="text-sm font-semibold text-white mb-0.5 truncate">
                    {lang === 'ru' ? (templateNameRu[getTemplateSuffix(tmpl.slug)]?.name || tmpl.name) : tmpl.name}
                  </h3>
                  <p className="text-[11px] text-surface-400 line-clamp-1">
                    {lang === 'ru' ? (templateNameRu[getTemplateSuffix(tmpl.slug)]?.desc || tmpl.description) : tmpl.description}
                  </p>
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
          <FullPreview template={previewTemplate} />
        </div>
      </div>
    )}
    </>
  );
}

/**
 * Full-height scrollable preview inside modal
 */
function FullPreview({ template }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !template.htmlContent || !template.cssContent) return;

    const { html, css } = renderTemplatePreview(template);

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
