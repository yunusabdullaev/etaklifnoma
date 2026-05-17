import { useEffect, useRef, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Renders the server-side template inside an iframe using srcdoc.
 * Uses /api/preview/full to get complete rendered HTML page.
 * Debounces API calls to avoid hammering the server during typing.
 */
export default function LivePreview({ data, className = '', activeSection = null }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');

  const API = import.meta.env.VITE_API_URL || '';
  const debounceRef = useRef(null);
  const iframeRef = useRef(null);
  const activeSectionRef = useRef(null);
  const highlightTimerRef = useRef(null);

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
          /* Section highlight pulse */
          @keyframes __preview_pulse {
            0%,100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); outline-color: rgba(99,102,241,0.8); }
            50% { box-shadow: 0 0 0 6px rgba(99,102,241,0.15); outline-color: rgba(99,102,241,0.5); }
          }
          .__preview_highlight {
            outline: 2px solid rgba(99,102,241,0.8) !important;
            outline-offset: 3px !important;
            border-radius: 8px !important;
            animation: __preview_pulse 1.5s ease-in-out infinite !important;
            position: relative !important;
            z-index: 10 !important;
          }
        </style>
        <script>
        (function() {
          // data-section selectors (set by templateEngine.js tagger script) take priority
          var sectionMap = {
            heroEmoji:   ['[data-section="heroEmoji"]', '.hero-icon', '.hero-emoji', '.invitation-icon', '.envelope-icon img'],
            waitingMsg:  ['[data-section="waitingMsg"]', '.footer-msg', '.waiting-msg', '.waiting-message'],
            heroText:    ['[data-section="heroText"]', '.hero-title', '.invitation-title', '.event-name', 'h1'],
            dateLocation:['[data-section="dateLocation"]', '.info-cards', '.ic-wrap', '.details-section'],
            schedule:    ['[data-section="schedule"]', '#program', '.timeline-section', '.program-section'],
            location:    ['[data-section="location"]', '.map-card', '.location-section', '.map-wrap'],
            music:       ['[data-section="music"]', '#musicToggle', '.music-toggle'],
            photos:      ['[data-section="photos"]', '#gallery', '.photo-gallery-section'],
            wishes:      ['[data-section="wishes"]', '#wishes', '.wishes-section'],
            labels:      ['[data-section="labels"]', '.countdown', '.cd-section', '.cd-wrap'],
            rsvp:        ['[data-section="rsvp"]', '#rsvp', '.rsvp-section'],
            hostName:    ['[data-section="hostName"]', '[data-tp="hostName"]', '.host-name', '.greeting-family'],
            guestName:   ['[data-section="guestName"]', '[data-tp="guestName"]', '.guest-name'],
            message:     ['[data-section="message"]', '.greeting-section', 'section.greeting-section'],
          };
          var lastHighlighted = [];
          window.addEventListener('message', function(e) {
            if (!e.data || e.data.type !== 'highlight') return;
            // Remove previous highlights
            lastHighlighted.forEach(function(el) { el.classList.remove('__preview_highlight'); });
            lastHighlighted = [];
            var sec = e.data.section;
            if (!sec) return;

            // 1. Try CSS selector approach first
            var selectors = sectionMap[sec] || [];
            selectors.forEach(function(sel) {
              try {
                var els = document.querySelectorAll(sel);
                els.forEach(function(el) {
                  el.classList.add('__preview_highlight');
                  lastHighlighted.push(el);
                });
              } catch(e) {}
            });

            // 2. If no match AND we have a text value, search by text content
            var val = (e.data.value || '').trim();
            if (lastHighlighted.length === 0 && val.length > 1) {
              var candidates = document.querySelectorAll('h1,h2,h3,h4,p,span,div,strong,em,b');
              candidates.forEach(function(el) {
                // Only leaf-level or near-leaf elements
                if (el.children.length <= 2 && el.textContent.trim().includes(val)) {
                  el.classList.add('__preview_highlight');
                  lastHighlighted.push(el);
                }
              });
            }

            // Scroll to first highlighted element
            if (lastHighlighted.length > 0) {
              lastHighlighted[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          });
        })();
        <\/script>`
        + `<style>
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

  // Helper: send highlight to iframe (with delay to let tagger script run first)
  const sendHighlight = (section) => {
    if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    highlightTimerRef.current = setTimeout(() => {
      const iframe = iframeRef.current;
      if (!iframe || !iframe.contentWindow) return;
      const valueMap = {
        hostName:    data?.hostName || '',
        guestName:   data?.guestName || '',
        heroText:    data?.eventTitle || '',
        message:     data?.message || '',
        dateLocation: data?.eventDate || '',
        location:    data?.location || '',
      };
      iframe.contentWindow.postMessage({
        type: 'highlight',
        section: section || null,
        value: valueMap[section] || '',
      }, '*');
    }, 120); // wait for iframe DOMContentLoaded tagger to finish
  };

  // Track latest activeSection in ref so onLoad can access it
  useEffect(() => {
    activeSectionRef.current = activeSection;
    sendHighlight(activeSection);
  }, [activeSection]); // eslint-disable-line

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
          ref={iframeRef}
          title="Invitation Preview"
          srcDoc={htmlContent}
          className="w-full h-full border-0 rounded-2xl bg-[#0a0a12]"
          sandbox="allow-scripts allow-same-origin allow-forms"
          onLoad={() => {
            // Re-send highlight after iframe reloads (srcDoc change clears old DOM)
            if (activeSectionRef.current) {
              sendHighlight(activeSectionRef.current);
            }
          }}
        />
      ) : (
        <div className="w-full h-full rounded-2xl bg-[#0a0a12] flex items-center justify-center">
          <p className="text-surface-600 text-xs">Shablon tanlang</p>
        </div>
      )}
    </div>
  );
}
