import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Settings as SettingsIcon, Sun, Moon, Check, X } from 'lucide-react';
import { useLang } from '../i18n';
import { useTheme } from '../theme';

const labels = {
  uz: { title: 'Sozlamalar', theme: 'Mavzu', dark: "Qorong'u", light: "Yorug'", language: 'Til' },
  ru: { title: 'Настройки', theme: 'Тема', dark: 'Тёмная', light: 'Светлая', language: 'Язык' },
};

export default function SettingsDropdown() {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const panelRef = useRef(null);
  const { lang, setLang } = useLang();
  const { setTheme, isDark } = useTheme();
  const t = labels[lang] || labels.uz;

  // Calculate position based on button
  const updatePos = useCallback(() => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const panelWidth = 240;
    let left = rect.right - panelWidth;
    if (left < 8) left = 8;
    setPos({ top: rect.bottom + 8, left });
  }, []);

  // Open & position
  const toggle = () => {
    if (!open) updatePos();
    setOpen(prev => !prev);
  };

  // Reposition on scroll/resize
  useEffect(() => {
    if (!open) return;
    window.addEventListener('resize', updatePos);
    window.addEventListener('scroll', updatePos, true);
    return () => {
      window.removeEventListener('resize', updatePos);
      window.removeEventListener('scroll', updatePos, true);
    };
  }, [open, updatePos]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        btnRef.current?.contains(e.target) ||
        panelRef.current?.contains(e.target)
      ) return;
      setOpen(false);
    };
    setTimeout(() => document.addEventListener('click', handler), 0);
    return () => document.removeEventListener('click', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const panel = open ? createPortal(
    <>
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: 'transparent',
        }}
      />
      {/* Panel */}
      <div
        ref={panelRef}
        style={{
          position: 'fixed',
          top: pos.top,
          left: pos.left,
          zIndex: 9999,
          width: 240,
          padding: 14,
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.12)',
          background: 'rgba(12,14,28,0.97)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
          animation: 'settingsFadeIn 0.18s ease-out',
          fontFamily: "'Inter', 'Outfit', system-ui, sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: 1.5 }}>
            ⚙ {t.title}
          </span>
          <button
            onClick={() => setOpen(false)}
            style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: 2, display: 'flex' }}
          >
            <X size={13} />
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 -14px 14px', }} />

        {/* Theme section */}
        <SectionLabel text={t.theme} />
        <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
          <OptBtn active={isDark} onClick={() => setTheme('dark')} icon={<Moon size={13} />} label={t.dark} />
          <OptBtn active={!isDark} onClick={() => setTheme('light')} icon={<Sun size={13} />} label={t.light} />
        </div>

        {/* Language section */}
        <SectionLabel text={t.language} />
        <div style={{ display: 'flex', gap: 6 }}>
          <OptBtn active={lang === 'uz'} onClick={() => setLang('uz')} label="UZ" />
          <OptBtn active={lang === 'qq'} onClick={() => setLang('qq')} label="QQ" />
          <OptBtn active={lang === 'ru'} onClick={() => setLang('ru')} label="RU" />
          <OptBtn active={lang === 'en'} onClick={() => setLang('en')} label="EN" />
        </div>
      </div>

      <style>{`
        @keyframes settingsFadeIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>,
    document.body
  ) : null;

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggle}
        className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200
          ${open
            ? 'bg-primary-500/20 text-primary-400 border-primary-500/30'
            : 'bg-white/5 text-surface-400 hover:text-white hover:bg-white/10'
          } border border-white/10`}
        title={t.title}
      >
        <SettingsIcon
          size={14}
          style={{ transition: 'transform 0.25s ease', transform: open ? 'rotate(90deg)' : 'none' }}
        />
      </button>
      {panel}
    </>
  );
}

function SectionLabel({ text }) {
  return (
    <p style={{
      fontSize: 9, color: '#777', textTransform: 'uppercase',
      letterSpacing: 1.5, fontWeight: 600, marginBottom: 6,
    }}>
      {text}
    </p>
  );
}

function OptBtn({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, display: 'flex', alignItems: 'center', gap: 6,
        padding: '8px 10px', borderRadius: 10,
        border: active ? '1px solid rgba(92,124,250,0.35)' : '1px solid rgba(255,255,255,0.08)',
        background: active ? 'rgba(92,124,250,0.12)' : 'rgba(255,255,255,0.03)',
        color: active ? '#fff' : 'rgba(255,255,255,0.45)',
        fontSize: 11, fontWeight: 500, cursor: 'pointer',
        transition: 'all 0.2s ease', fontFamily: 'inherit',
      }}
      onMouseEnter={(e) => {
        if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#ddd'; }
      }}
      onMouseLeave={(e) => {
        if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }
      }}
    >
      {typeof icon === 'string' ? <span style={{ fontSize: 14, lineHeight: 1 }}>{icon}</span> : icon}
      <span>{label}</span>
      {active && <Check size={10} style={{ marginLeft: 'auto', color: '#5c7cfa' }} />}
    </button>
  );
}
