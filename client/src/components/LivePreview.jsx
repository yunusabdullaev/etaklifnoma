import { useEffect, useRef, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Renders the server-side template inside a sandboxed iframe with live data.
 * Uses /api/preview/full to get complete rendered HTML page.
 * Debounces API calls to avoid hammering the server during typing.
 */
export default function LivePreview({ data, className = '' }) {
  const iframeRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  const API = import.meta.env.VITE_API_URL || '';

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

      const html = await res.text();

      // Write full HTML into iframe
      const iframe = iframeRef.current;
      if (iframe) {
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.open();
        doc.write(html);
        doc.close();
      }
    } catch (err) {
      setError('Oldindan ko\'rish xatoligi');
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
      <iframe
        ref={iframeRef}
        title="Invitation Preview"
        className="w-full h-full border-0 rounded-2xl bg-[#0a0a12]"
        sandbox="allow-same-origin allow-scripts"
      />
    </div>
  );
}
