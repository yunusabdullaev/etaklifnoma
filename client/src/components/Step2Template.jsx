import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Crown, Sparkles, Check } from 'lucide-react';
import { getTemplates } from '../api';

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

    // Build sample data to replace placeholders for a realistic preview
    const sampleReplacements = {
      // Wedding
      '{{brideName|Kelin}}': 'Madina',
      '{{groomName|Kuyov}}': 'Sardor',
      '{{eventTypeLabel|Nikoh taklifi}}': 'Nikoh taklifi',
      // Birthday
      '{{eventTypeLabel|Tug\'ilgan kun}}': "Tug'ilgan kun",
      '{{eventTitle|Tug\'ilgan kun bayrami}}': "Tug'ilgan kun bayrami",
      '{{age}}': '25',
      // Graduation
      '{{eventTypeLabel|Bitiruv kechasi}}': 'Bitiruv kechasi',
      '{{eventTitle|Bitiruv kechasi}}': 'Bitiruv kechasi',
      '{{graduationYear}}': '2026',
      // Jubilee
      '{{eventTypeLabel|Yubiley}}': 'Yubiley',
      '{{eventTitle|Yubiley bayramiga taklif}}': 'Yubiley bayramiga taklif',
      '{{years}}': '50',
      // Common
      '{{eventDateFormatted}}': '15 Avgust, 2026',
      '{{hostName}}': 'Karimov oilasi',
      '{{guestName|Hurmatli mehmonlar!}}': 'Hurmatli mehmonlar!',
      '{{message|Sizni farzandlarimiz nikoh to\'yiga tashrif buyurishingizni so\'rab qolamiz.}}': 
        'Sizni farzandlarimiz nikoh to\'yiga tashrif buyurishingizni so\'rab qolamiz.',
      '{{message|Sizni bayramimizga taklif qilamiz. Birga shodlanaylik!}}':
        'Sizni bayramimizga taklif qilamiz. Birga shodlanaylik!',
      '{{message|Bizning bitiruv kechamizga marhamat qiling!}}':
        'Bizning bitiruv kechamizga marhamat qiling!',
      '{{message|Yubiley bayramimizga marhamat qiling!}}':
        'Yubiley bayramimizga marhamat qiling!',
      '{{eventTime|18:00}}': '18:00',
      '{{location}}': 'Grand Palace',
      '{{eventDate}}': '2026-08-15',
    };

    let html = template.htmlContent;
    for (const [key, val] of Object.entries(sampleReplacements)) {
      html = html.replaceAll(key, val);
    }
    // Clean remaining {{...}} placeholders
    html = html.replace(/\{\{[^}]+\}\}/g, '');
    // Remove conditional blocks for cleaner preview
    html = html.replace(/\{\{#if\s+\w+\}\}[\s\S]*?\{\{\/if\}\}/g, '');
    html = html.replace(/\{\{#unless\s+\w+\}\}([\s\S]*?)\{\{\/unless\}\}/g, '$1');

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
    ${template.cssContent}
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-display font-bold">
          Shablon tanlang
        </h2>
        <p className="text-surface-400">
          {data.eventType?.label} uchun {templates.length} ta shablon mavjud
        </p>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-10">
          <Sparkles className="w-12 h-12 text-surface-500 mx-auto mb-3" />
          <p className="text-surface-400">Bu tur uchun shablon topilmadi</p>
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
                  <div className="absolute top-2 right-2 z-20 w-6 h-6 bg-primary-500 rounded-full 
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

                {/* Live template preview thumbnail */}
                <TemplateThumbnail template={tmpl} />

                {/* Template name & description */}
                <div className="p-3 pt-2">
                  <h3 className="text-sm font-semibold text-white mb-0.5 truncate">{tmpl.name}</h3>
                  <p className="text-[11px] text-surface-400 line-clamp-1">{tmpl.description}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}

      <div className="flex justify-between items-center max-w-6xl mx-auto pt-4">
        <button onClick={onBack} className="btn-secondary">
          ← Orqaga
        </button>
        <button
          onClick={onNext}
          disabled={!data.templateId}
          className="btn-primary min-w-[160px] text-center"
        >
          Davom etish →
        </button>
      </div>
    </motion.div>
  );
}
