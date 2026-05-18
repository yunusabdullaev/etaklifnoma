import { useEffect, useRef, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

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
      const res = await fetch(`${API}/api/preview/full`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
        }),
      });
      if (!res.ok) { setError('Server xatoligi'); return; }
      const html = await res.text();
      if (html && html.includes('<')) {
        // Inject visibility CSS + preview flag + envelope override
        const headInject = [
          `<style>
            .section,[class*="section"],[class*="card"],[class*="reveal"],.tl-item,.map-card,.dresscode-badge {
              opacity:1!important; transform:none!important; transition:none!important;
            }
          </style>`,
          `<script>
            window.__IS_PREVIEW__=true;
            (function(){
              var g=Storage.prototype.getItem,s=Storage.prototype.setItem;
              Storage.prototype.getItem=function(k){if(k&&k.startsWith('env_seen_'))return null;return g.call(this,k);};
              Storage.prototype.setItem=function(k,v){if(k&&k.startsWith('env_seen_'))return;return s.call(this,k,v);};
            })();
          <\/script>`,
        ].join('');
        setHtmlContent(html.replace('</head>', headInject + '</head>'));
      } else {
        setError("Bo'sh javob");
      }
    } catch {
      setError("Oldindan ko'rish xatoligi");
    } finally {
      setLoading(false);
    }
  }, [API]);

  // Direct DOM highlight — no postMessage needed (allow-same-origin)
  const applyHighlight = useCallback((section) => {
    if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    highlightTimerRef.current = setTimeout(() => {
      const iframe = iframeRef.current;
      if (!iframe) return;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc || !doc.body) return;

      // Inject highlight CSS if missing
      if (!doc.getElementById('__hl_css')) {
        const st = doc.createElement('style');
        st.id = '__hl_css';
        st.textContent = `
          @keyframes __hl_pulse {
            0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,0);outline-color:rgba(99,102,241,.8);}
            50%{box-shadow:0 0 0 6px rgba(99,102,241,.15);outline-color:rgba(99,102,241,.5);}
          }
          .__hl {
            outline:2px solid rgba(99,102,241,.85)!important;
            outline-offset:3px!important;
            border-radius:8px!important;
            animation:__hl_pulse 1.5s ease-in-out infinite!important;
            position:relative!important;
            z-index:10!important;
          }`;
        (doc.head || doc.body).appendChild(st);
      }

      // Run tagger to add data-section attributes
      const d = iframe.contentWindow?.__INVITE_DATA__ || {};
      const di18n = {
        eventLabel:'heroText',bdEventLabel:'heroText',gradEventLabel:'heroText',jubEventLabel:'heroText',
        waitingMsg:'waitingMsg',bdWaitingMsg:'waitingMsg',
        countdownTitle:'labels',gradCountdownTitle:'labels',
        days:'labels',hours:'labels',minutes:'labels',seconds:'labels',jubYears:'labels',
        detailsTitle:'dateLocation',dateLabel:'dateLocation',timeLabel:'dateLocation',gradYear:'dateLocation',
        locationTitle:'location',venueLabel:'location',viewMap:'location',
        programTitle:'schedule',prog1:'schedule',prog2:'schedule',prog3:'schedule',prog4:'schedule',
        guestWelcome:'guestName',galleryTitle:'photos',dressCode:'dressCode',
      };
      doc.querySelectorAll('[data-i18n]').forEach(el => {
        const sec = di18n[el.getAttribute('data-i18n')];
        if (sec && !el.getAttribute('data-section')) el.setAttribute('data-section', sec);
      });
      [
        ['.hero-icon,.invitation-icon,.hero-emoji','heroEmoji'],
        ['.footer-msg,.waiting-msg,.waiting-message','waitingMsg'],
        ['.info-cards,.ic-wrap,.details-section,.details-wrap','dateLocation'],
        ['#program,.timeline-section,.program-section','schedule'],
        ['.map-card,.location-section,.map-wrap','location'],
        ['#musicToggle,.music-toggle','music'],
        ['section.wishes-section,#wishes','wishes'],
        ['section.rsvp-section,#rsvp','rsvp'],
        ['section.photo-gallery-section,#gallery','photos'],
        ['.countdown,.cd-section,.cd-wrap','labels'],
        ['.dresscode-badge','dressCode'],
        ['[data-tp="hostName"],.host-name,.greeting-family,.footer-names','hostName'],
        ['[data-tp="guestName"],.guest-name','guestName'],
        ['section.greeting-section,.invitation-message','message'],
      ].forEach(([sel, sec]) => {
        try { doc.querySelectorAll(sel).forEach(el => { if (!el.getAttribute('data-section')) el.setAttribute('data-section', sec); }); } catch {}
      });

      // Remove old highlight
      doc.querySelectorAll('.__hl').forEach(el => el.classList.remove('__hl'));
      if (!section) return;

      const sectionMap = {
        heroEmoji:   ['[data-section="heroEmoji"]','.hero-icon','.hero-emoji'],
        waitingMsg:  ['[data-section="waitingMsg"]','[data-i18n="waitingMsg"]','[data-i18n="bdWaitingMsg"]'],
        heroText:    ['[data-section="heroText"]','[data-i18n="eventLabel"]','[data-i18n="bdEventLabel"]','[data-i18n="gradEventLabel"]','[data-i18n="jubEventLabel"]'],
        eventTitle:  ['[data-section="eventTitle"]','.hero-title','.invitation-title','h1'],
        dateLocation:['[data-section="dateLocation"]','[data-i18n="detailsTitle"]','.info-cards','.ic-wrap'],
        schedule:    ['[data-section="schedule"]','[data-i18n="programTitle"]','#program'],
        location:    ['[data-section="location"]','[data-i18n="locationTitle"]','.map-card'],
        music:       ['[data-section="music"]','#musicToggle'],
        photos:      ['[data-section="photos"]','[data-i18n="galleryTitle"]','#gallery'],
        wishes:      ['[data-section="wishes"]','#wishes'],
        labels:      ['[data-section="labels"]','[data-i18n="countdownTitle"]','.countdown'],
        rsvp:        ['[data-section="rsvp"]','#rsvp'],
        hostName:    ['[data-section="hostName"]','[data-tp="hostName"]','.greeting-family'],
        guestName:   ['[data-section="guestName"]','[data-i18n="guestWelcome"]','[data-tp="guestName"]'],
        message:     ['[data-section="message"]','section.greeting-section'],
        dressCode:   ['[data-section="dressCode"]','[data-i18n="dressCode"]'],
      };

      const found = [];
      for (const sel of (sectionMap[section] || [])) {
        try { doc.querySelectorAll(sel).forEach(el => { el.classList.add('__hl'); found.push(el); }); } catch {}
      }

      // Text fallback
      if (found.length === 0) {
        const valueMap = {
          hostName: data?.hostName, guestName: data?.guestName,
          heroText: data?.customFields?.customEventLabelRu || data?.customFields?.customEventLabel,
          eventTitle: data?.eventTitle, message: data?.message, location: data?.location,
        };
        const val = (valueMap[section] || '').trim();
        if (val.length > 1) {
          doc.querySelectorAll('h1,h2,h3,h4,p,span,strong,em').forEach(el => {
            if (el.children.length <= 1 && el.textContent.trim().includes(val)) {
              el.classList.add('__hl'); found.push(el);
            }
          });
        }
      }

      if (found.length > 0) found[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
  }, [data]);

  useEffect(() => {
    activeSectionRef.current = activeSection;
    applyHighlight(activeSection);
  }, [activeSection, applyHighlight]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPreview(data), 400);
    return () => clearTimeout(debounceRef.current);
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
          onLoad={() => { if (activeSectionRef.current) applyHighlight(activeSectionRef.current); }}
        />
      ) : (
        <div className="w-full h-full rounded-2xl bg-[#0a0a12] flex items-center justify-center">
          <p className="text-surface-600 text-xs">Shablon tanlang</p>
        </div>
      )}
    </div>
  );
}
