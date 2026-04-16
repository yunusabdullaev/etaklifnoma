import { useEffect, useRef, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Renders the server-side template inside an iframe using srcdoc.
 * Uses /api/preview/full to get complete rendered HTML page.
 * Debounces API calls to avoid hammering the server during typing.
 */
export default function LivePreview({ data, className = '' }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');

  const API = import.meta.env.VITE_API_URL || '';
  const debounceRef = useRef(null);

  const fetchPreview = useCallback(async (previewData) => {
    if (!previewData.templateId) return;
    setLoading(true);
    setError(null);
    try {
      const payload = {
        templateId: previewData.templateId,
        eventTypeId: previewData.eventTypeId,
        hostName: previewData.hostName || '',
        guestName: previewData.guestName || '',
        eventTitle: previewData.eventTitle || '',
        eventDate: previewData.eventDate || '',
        eventTime: previewData.eventTime || '',
        location: previewData.location || '',
        locationUrl: previewData.locationUrl || '',
        message: previewData.message || '',
        customFields: previewData.customFields || {},
      };

      const res = await fetch(`${API}/api/preview/full`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        setError('Server xatoligi');
        return;
      }

      const html = await res.text();
      if (html && html.includes('<')) {
        // Inject CSS override to force all sections visible in preview
        // Templates use IntersectionObserver + opacity:0 for scroll-reveal,
        // but in the preview iframe the user can't scroll so middle sections stay hidden
        const previewOverride = `<style>
          .section, .info-card, .tl-item, .map-card, .dresscode-badge,
          [class*="section"], [class*="card"], [class*="reveal"] {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        </style>
        <script>
        window.__IS_PREVIEW__ = true;
        // 1. Envelope: always show in preview — block env_seen_ reads+writes
        (function(){
          var origGet = Storage.prototype.getItem;
          var origSet = Storage.prototype.setItem;
          Storage.prototype.getItem = function(k) {
            if (k && k.startsWith('env_seen_')) return null;
            return origGet.call(this, k);
          };
          Storage.prototype.setItem = function(k, v) {
            if (k && k.startsWith('env_seen_')) return;
            return origSet.call(this, k, v);
          };
        })();
        // 2. Force correct language from __INVITE_DATA__ flags (poll until switchLang is ready)
        (function poll(n){
          if (typeof window.switchLang === 'function') {
            var d = window.__INVITE_DATA__ || {};
            var lang = (d.langUz !== false) ? 'uz' : (d.langQq ? 'qq' : 'ru');
            window.switchLang(lang);
          } else if (n < 25) { setTimeout(function(){ poll(n+1); }, 80); }
        })(0);
        <\/script>`;
        const injectedHtml = html.replace('</head>', previewOverride + '</head>');
        setHtmlContent(injectedHtml);
      } else {
        setError('Bo\'sh javob');
      }
    } catch (err) {
      setError("Oldindan ko'rish xatoligi");
    } finally {
      setLoading(false);
    }
  }, [API]);

  // Debounced effect — re-renders 400ms after last data change
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchPreview(data);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [
    data.templateId, data.hostName, data.guestName, data.eventTitle,
    data.eventDate, data.eventTime, data.location, data.locationUrl,
    data.message, JSON.stringify(data.customFields), fetchPreview,
  ]);

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center 
          bg-surface-950/60 backdrop-blur-sm rounded-2xl">
          <Loader2 className="w-6 h-6 text-primary-400 animate-spin" />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center 
          bg-surface-950/80 rounded-2xl">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      {htmlContent ? (
        <iframe
          title="Invitation Preview"
          srcDoc={htmlContent}
          className="w-full h-full border-0 rounded-2xl bg-[#0a0a12]"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      ) : (
        <div className="w-full h-full rounded-2xl bg-[#0a0a12] flex items-center justify-center">
          <p className="text-surface-600 text-xs">Shablon tanlang</p>
        </div>
      )}
    </div>
  );
}
