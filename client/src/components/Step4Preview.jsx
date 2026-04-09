import { motion } from 'framer-motion';
import { Sparkles, Smartphone, Monitor, Maximize2, Minimize2, Loader2 } from 'lucide-react';
import { useState, useRef, useCallback, useEffect } from 'react';
import { useLang } from '../i18n';

export default function Step4Preview({ data, onNext, onBack }) {
  const [viewMode, setViewMode] = useState('desktop'); // 'desktop' | 'mobile'
  const [fullscreen, setFullscreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const iframeRef = useRef(null);
  const debounceRef = useRef(null);

  const API = import.meta.env.VITE_API_URL || '';
  const { t } = useLang();

  const fetchFullPreview = useCallback(async () => {
    if (!data.templateId) return;
    setLoading(true);
    try {
      const payload = {
        templateId: data.templateId,
        eventTypeId: data.eventTypeId,
        hostName: data.hostName || '',
        guestName: data.guestName || '',
        eventTitle: data.eventTitle || '',
        eventDate: data.eventDate || '',
        eventTime: data.eventTime || '',
        location: data.location || '',
        locationUrl: data.locationUrl || '',
        message: data.message || '',
        customFields: data.customFields || {},
      };

      const res = await fetch(`${API}/api/preview/full`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const html = await res.text();
      const iframe = iframeRef.current;
      if (iframe) {
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.open();
        doc.write(html);
        doc.close();
      }
    } catch (err) {
      console.error('Full preview error:', err);
    } finally {
      setLoading(false);
    }
  }, [data, API]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchFullPreview(), 300);
    return () => clearTimeout(debounceRef.current);
  }, [
    data.templateId, data.hostName, data.guestName, data.eventTitle,
    data.eventDate, data.eventTime, data.location, data.locationUrl,
    data.message, JSON.stringify(data.customFields), fetchFullPreview,
  ]);

  const toggleFullscreen = () => setFullscreen(!fullscreen);

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-surface-950 flex flex-col">
        {/* Fullscreen header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-surface-900/80 backdrop-blur">
          <div className="flex items-center gap-3">
            <h3 className="text-white font-semibold text-sm">{t('step4.fullscreenTitle')}</h3>
            <div className="flex gap-1">
              <button
                onClick={() => setViewMode('desktop')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'desktop' ? 'bg-primary-500/20 text-primary-400' : 'text-surface-500 hover:text-white'}`}
              >
                <Monitor size={14} />
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'mobile' ? 'bg-primary-500/20 text-primary-400' : 'text-surface-500 hover:text-white'}`}
              >
                <Smartphone size={14} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleFullscreen} className="text-surface-400 hover:text-white p-1.5 rounded-md hover:bg-white/5 transition-all">
              <Minimize2 size={16} />
            </button>
          </div>
        </div>

        {/* Fullscreen iframe */}
        <div className="flex-1 flex justify-center bg-surface-950 overflow-auto p-4">
          <div className={`relative transition-all duration-300 ${
            viewMode === 'mobile' ? 'w-[390px]' : 'w-full max-w-[900px]'
          } h-full`}>
            {viewMode === 'mobile' && (
              <div className="absolute -inset-4 rounded-[2.5rem] border-2 border-white/10 bg-surface-900/30 pointer-events-none z-0">
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-1.5 rounded-full bg-white/10" />
              </div>
            )}
            <iframe
              ref={iframeRef}
              title="Full Preview"
              className="w-full h-full border-0 rounded-2xl bg-[#0a0a12] relative z-10"
              sandbox="allow-same-origin allow-scripts"
            />
          </div>
        </div>

        {/* Fullscreen footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-white/10 bg-surface-900/80">
          <button onClick={() => { setFullscreen(false); onBack(); }} className="btn-secondary text-sm">
            {t('step4.back')}
          </button>
          <button onClick={() => { setFullscreen(false); onNext(); }} className="btn-accent flex items-center gap-2 text-sm">
            <Sparkles size={14} />
            {t('step4.generate')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-display font-bold">
          {t('step4.title')}
        </h2>
        <p className="text-surface-400">{t('step4.desc')}</p>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setViewMode('desktop')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${viewMode === 'desktop'
              ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
              : 'bg-white/5 text-surface-400 border border-white/10 hover:bg-white/10'}`}
        >
          <Monitor size={14} /> {t('step4.desktop')}
        </button>
        <button
          onClick={() => setViewMode('mobile')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${viewMode === 'mobile'
              ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
              : 'bg-white/5 text-surface-400 border border-white/10 hover:bg-white/10'}`}
        >
          <Smartphone size={14} /> {t('step4.mobile')}
        </button>
        <button
          onClick={toggleFullscreen}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium
            bg-accent-500/10 text-accent-300 border border-accent-500/20 hover:bg-accent-500/20 transition-all"
        >
          <Maximize2 size={14} /> {t('step4.fullscreen')}
        </button>
      </div>

      {/* Preview container */}
      <div className="flex justify-center">
        <motion.div
          layout
          className={`relative transition-all duration-500 ease-out ${
            viewMode === 'mobile'
              ? 'w-[375px]'
              : 'w-full max-w-[700px]'
          }`}
        >
          {/* Device frame for mobile */}
          {viewMode === 'mobile' && (
            <div className="absolute -inset-3 rounded-[2rem] border-2 border-white/10 bg-surface-900/50 
              pointer-events-none z-0">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full bg-white/10" />
            </div>
          )}

          <div className="relative z-10">
            {loading && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-surface-950/60 backdrop-blur-sm rounded-2xl">
                <Loader2 className="w-6 h-6 text-primary-400 animate-spin" />
              </div>
            )}
            <iframe
              ref={iframeRef}
              title="Full Invitation Preview"
              className={`w-full border-0 rounded-2xl bg-[#0a0a12] ${
                viewMode === 'mobile' ? 'h-[667px]' : 'h-[700px]'
              } border border-white/10`}
              sandbox="allow-same-origin allow-scripts"
            />
          </div>
        </motion.div>
      </div>

      <div className="sticky bottom-0 z-20 bg-surface-950/90 backdrop-blur-lg border-t border-white/5 
        -mx-4 px-4 py-4 mt-6 sm:static sm:bg-transparent sm:backdrop-blur-none sm:border-0 sm:mx-0 sm:px-0 sm:py-0 sm:mt-0">
        <div className="flex justify-between items-center gap-3 max-w-[700px] mx-auto">
          <button onClick={onBack} className="btn-secondary flex-1 sm:flex-none py-3.5">
            {t('step4.back')}
          </button>
          <button onClick={onNext} className="btn-accent flex-1 sm:flex-none min-w-[160px] text-center flex items-center justify-center gap-2 py-3.5">
            <Sparkles size={16} />
            {t('step4.generate')}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
