import { useState, useRef, useEffect } from 'react';
import { Settings as SettingsIcon, Sun, Moon, Check, X } from 'lucide-react';
import { useLang } from '../i18n';
import { useTheme } from '../theme';

const settingsLabels = {
  uz: {
    title: 'Sozlamalar',
    theme: 'Mavzu',
    dark: "Qorong'u",
    light: "Yorug'",
    language: 'Til',
  },
  ru: {
    title: 'Настройки',
    theme: 'Тема',
    dark: 'Тёмная',
    light: 'Светлая',
    language: 'Язык',
  },
};

export default function SettingsDropdown() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const btnRef = useRef(null);
  const { lang, setLang } = useLang();
  const { setTheme, isDark } = useTheme();
  const labels = settingsLabels[lang] || settingsLabels.uz;

  useEffect(() => {
    if (!open) return;
    function onDocClick(e) {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        btnRef.current && !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('click', onDocClick, true);
    return () => document.removeEventListener('click', onDocClick, true);
  }, [open]);

  return (
    <>
      {/* Gear button */}
      <button
        ref={btnRef}
        onClick={() => setOpen(prev => !prev)}
        className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all
          ${open
            ? 'bg-primary-500/20 text-primary-400'
            : 'bg-white/5 text-surface-400 hover:text-white hover:bg-white/10'
          } border border-white/10`}
        title={labels.title}
        style={{ position: 'relative', zIndex: 200 }}
      >
        <SettingsIcon size={14} style={{ transition: 'transform 0.2s', transform: open ? 'rotate(90deg)' : 'none' }} />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          ref={panelRef}
          style={{
            position: 'fixed',
            top: 56,
            right: 16,
            zIndex: 9999,
            minWidth: 230,
            padding: 14,
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(15,17,30,0.97)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
            animation: 'fadeInDown 0.15s ease-out forwards',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: 2 }}>
              {labels.title}
            </span>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: 2 }}
            >
              <X size={12} />
            </button>
          </div>

          {/* Theme */}
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 9, color: '#888', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 600, marginBottom: 6 }}>
              {labels.theme}
            </p>
            <div style={{ display: 'flex', gap: 6 }}>
              <OptionBtn
                active={isDark}
                onClick={() => setTheme('dark')}
                icon={<Moon size={12} />}
                label={labels.dark}
              />
              <OptionBtn
                active={!isDark}
                onClick={() => setTheme('light')}
                icon={<Sun size={12} />}
                label={labels.light}
              />
            </div>
          </div>

          {/* Language */}
          <div>
            <p style={{ fontSize: 9, color: '#888', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 600, marginBottom: 6 }}>
              {labels.language}
            </p>
            <div style={{ display: 'flex', gap: 6 }}>
              <OptionBtn
                active={lang === 'uz'}
                onClick={() => setLang('uz')}
                icon={<span style={{ fontSize: 13 }}>🇺🇿</span>}
                label="O'zbekcha"
              />
              <OptionBtn
                active={lang === 'ru'}
                onClick={() => setLang('ru')}
                icon={<span style={{ fontSize: 13 }}>🇷🇺</span>}
                label="Русский"
              />
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {open && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9998,
            background: 'rgba(0,0,0,0.3)',
          }}
          onClick={() => setOpen(false)}
        />
      )}

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

function OptionBtn({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '7px 10px',
        borderRadius: 10,
        border: active ? '1px solid rgba(92,124,250,0.3)' : '1px solid rgba(255,255,255,0.08)',
        background: active ? 'rgba(92,124,250,0.12)' : 'rgba(255,255,255,0.03)',
        color: active ? '#fff' : 'rgba(255,255,255,0.5)',
        fontSize: 11,
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontFamily: 'inherit',
      }}
    >
      {icon}
      <span>{label}</span>
      {active && <Check size={10} style={{ marginLeft: 'auto', color: '#5c7cfa' }} />}
    </button>
  );
}
