import { useEffect, useRef, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

const SECTION_MAP = {
  heroEmoji:   ['#hero-emoji','.hero-icon','.invitation-icon','.hero-emoji','.hero-image'],
  waitingMsg:  ['[data-i18n="waitingMsg"]','[data-i18n="bdWaitingMsg"]','.footer-msg','.waiting-msg'],
  heroText:    ['[data-i18n="eventLabel"]','[data-i18n="bdEventLabel"]','[data-i18n="gradEventLabel"]','[data-i18n="jubEventLabel"]','.hero-label','.event-label'],
  eventTitle:  ['[data-tp="eventTitle"]','.hero-title','.bd-title','.grad-title','.jub-title','.hero-names','h1'],
  dateLocation:['.details-section','[data-i18n="detailsTitle"]','.info-cards','.ic-wrap','.cards-row'],
  schedule:    ['.program-section','[data-i18n="programTitle"]','#program','.timeline-section'],
  location:    ['.map-section','.map-card','[data-i18n="locationTitle"]','[data-i18n="venueLabel"]','.location-section'],
  music:       ['#musicToggle','.music-toggle'],
  photos:      ['#gallery','.photo-gallery-section','[data-i18n="galleryTitle"]'],
  wishes:      ['#wishes','section.wishes-section'],
  labels:      ['.countdown-section','.countdown','[data-i18n="countdownTitle"]','[data-i18n="gradCountdownTitle"]','.cd-section'],
  rsvp:        ['#rsvp','section.rsvp-section'],
  hostName:    ['[data-tp="hostName"]','.greeting-family','.host-name','.footer-names'],
  guestName:   ['[data-tp="guestName"]','.guest-name'],
  message:     ['[data-tp="message"]','.greeting-text','.invitation-message'],
  dressCode:   ['[data-i18n="dressCode"]','.dresscode-badge'],
  age:         ['.bd-age-badge', '.bd-age-num'],
  theme:       ['.dresscode-badge'],
  years:       ['.jub-years-badge', '.jub-years-num'],
  graduationYear: ['.grad-year-badge', '.grad-year-num'],
  school:      ['.grad-year-badge', '.info-card'],
  brideName:   ['.hero-names','.hero-name'],
  groomName:   ['.hero-names','.hero-name'],
};

const HL_CSS = `
  @keyframes __hl_pulse {
    0%,100%{ outline-color:rgba(99,102,241,1); box-shadow:0 0 0 4px rgba(99,102,241,0.2); }
    50%{ outline-color:rgba(99,102,241,0.6); box-shadow:0 0 0 8px rgba(99,102,241,0.05); }
  }
  .__hl {
    outline: 3px solid rgba(99,102,241,1) !important;
    outline-offset: 4px !important;
    border-radius: 6px !important;
    animation: __hl_pulse 1.2s ease-in-out infinite !important;
    position: relative !important;
    z-index: 999 !important;
  }
`;

export default function LivePreview({ data, className = '', activeSection = null }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');

  const API = import.meta.env.VITE_API_URL || '';
  const iframeRef = useRef(null);
  const debounceRef = useRef(null);
  const hlTimerRef = useRef(null);
  const activeSectionRef = useRef(null);
  const abortRef = useRef(null);
  // Keep latest data accessible without re-creating callbacks
  const dataRef = useRef(data);
  useEffect(() => { dataRef.current = data; }, [data]);

  const fetchPreview = useCallback(async (d) => {
    if (!d.templateId) return;
    // Abort previous in-flight request
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API}/api/preview/full`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          templateId: d.templateId, eventTypeId: d.eventTypeId,
          hostName: d.hostName||'', guestName: d.guestName||'',
          eventTitle: d.eventTitle||'', eventDate: d.eventDate||'',
          eventTime: d.eventTime||'', location: d.location||'',
          locationUrl: d.locationUrl||'', message: d.message||'',
          customFields: d.customFields||{},
        }),
      });
      if (!res.ok) { setError('Server xatoligi'); return; }
      const html = await res.text();
      if (html?.includes('<')) {
        const inject = `<style>.section,[class*="section"],[class*="card"],[class*="reveal"],.tl-item{opacity:1!important;transform:none!important;transition:none!important;}</style>` +
          `<script>window.__IS_PREVIEW__=true;(function(){var g=Storage.prototype.getItem,s=Storage.prototype.setItem;Storage.prototype.getItem=function(k){if(k&&k.startsWith('env_seen_'))return null;return g.call(this,k);};Storage.prototype.setItem=function(k,v){if(k&&k.startsWith('env_seen_'))return;return s.call(this,k,v);};})();<\/script>`;
        setHtmlContent(html.replace('</head>', inject + '</head>'));
      } else setError("Bo'sh javob");
    } catch (err) {
      if (err.name !== 'AbortError') setError("Xatolik");
    }
    finally { setLoading(false); }
  }, [API]);

  // Core highlight function — direct DOM access via allow-same-origin
  const applyHighlight = useCallback((section) => {
    if (hlTimerRef.current) clearTimeout(hlTimerRef.current);
    hlTimerRef.current = setTimeout(() => {
      const iframe = iframeRef.current;
      if (!iframe) return;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc?.body) return;

      // Inject CSS once
      if (!doc.getElementById('__hl_css')) {
        const st = doc.createElement('style');
        st.id = '__hl_css';
        st.textContent = HL_CSS;
        (doc.head || doc.documentElement).appendChild(st);
      }

      // Clear old highlights
      doc.querySelectorAll('.__hl').forEach(el => el.classList.remove('__hl'));
      if (!section) return;

      const selectors = SECTION_MAP[section] || [];
      const found = [];

      for (const sel of selectors) {
        try {
          doc.querySelectorAll(sel).forEach(el => {
            el.classList.add('__hl');
            found.push(el);
          });
        } catch {}
        if (found.length > 0) break; // stop at first matching selector
      }

      // Text fallback — last resort
      if (found.length === 0) {
        const d = dataRef.current;
        const vals = {
          hostName: d.hostName, guestName: d.guestName,
          message: d.message, eventTitle: d.eventTitle, location: d.location,
          heroText: d.customFields?.customEventLabelRu || d.customFields?.customEventLabel,
        };
        const val = (vals[section] || '').trim();
        if (val.length > 1) {
          for (const el of doc.querySelectorAll('h1,h2,h3,h4,p,span,strong,em,b,div')) {
            const kids = el.children.length;
            if (kids <= 1 && el.textContent.trim().includes(val)) {
              el.classList.add('__hl');
              found.push(el);
              break;
            }
          }
        }
      }

      if (found.length > 0) {
        found[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 200);
  }, []); // stable — uses dataRef for data

  // When activeSection changes → highlight
  useEffect(() => {
    activeSectionRef.current = activeSection;
    applyHighlight(activeSection);
  }, [activeSection, applyHighlight]);

  // Debounced preview refresh (600ms to reduce API calls during typing)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPreview(data), 600);
    return () => { clearTimeout(debounceRef.current); };
  }, [
    data.templateId, data.hostName, data.guestName, data.eventTitle,
    data.eventDate, data.eventTime, data.location, data.locationUrl,
    data.message, JSON.stringify(data.customFields), fetchPreview,
  ]);

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-950/60 backdrop-blur-sm rounded-2xl">
          <Loader2 className="w-6 h-6 text-primary-400 animate-spin" />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-950/80 rounded-2xl">
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
            const sec = activeSectionRef.current;
            if (sec) applyHighlight(sec);
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
