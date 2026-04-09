import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const ref = useRef(null);
  const { lang, setLang } = useLang();
  const { setTheme, isDark } = useTheme();
  const labels = settingsLabels[lang] || settingsLabels.uz;

  // Close on outside click — use setTimeout to avoid race condition
  const handleClickOutside = useCallback((e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      // Delay adding listener to avoid capturing the opening click
      const id = setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 10);
      return () => {
        clearTimeout(id);
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [open, handleClickOutside]);

  const handleSetTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const handleSetLang = (newLang) => {
    setLang(newLang);
  };

  return (
    <div className="relative" ref={ref}>
      {/* Settings button */}
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all
          ${open
            ? 'bg-primary-500/20 text-primary-400'
            : 'bg-white/5 text-surface-400 hover:text-white hover:bg-white/10'
          } border border-white/10`}
        title={labels.title}
      >
        <motion.div
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <SettingsIcon size={14} />
        </motion.div>
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="settings-dropdown"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                {labels.title}
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="text-surface-500 hover:text-white p-0.5 rounded transition-colors"
              >
                <X size={12} />
              </button>
            </div>

            {/* Theme section */}
            <div className="mb-3">
              <p className="text-[10px] text-surface-500 uppercase tracking-wider font-medium mb-1.5">
                {labels.theme}
              </p>
              <div className="flex gap-1.5">
                <button
                  onClick={() => handleSetTheme('dark')}
                  className={`settings-option ${isDark ? 'active' : ''}`}
                >
                  <Moon size={12} />
                  <span>{labels.dark}</span>
                  {isDark && <Check size={10} className="ml-auto text-primary-400" />}
                </button>
                <button
                  onClick={() => handleSetTheme('light')}
                  className={`settings-option ${!isDark ? 'active' : ''}`}
                >
                  <Sun size={12} />
                  <span>{labels.light}</span>
                  {!isDark && <Check size={10} className="ml-auto text-primary-400" />}
                </button>
              </div>
            </div>

            {/* Language section */}
            <div>
              <p className="text-[10px] text-surface-500 uppercase tracking-wider font-medium mb-1.5">
                {labels.language}
              </p>
              <div className="flex gap-1.5">
                <button
                  onClick={() => handleSetLang('uz')}
                  className={`settings-option ${lang === 'uz' ? 'active' : ''}`}
                >
                  <span className="text-xs">🇺🇿</span>
                  <span>O'zbekcha</span>
                  {lang === 'uz' && <Check size={10} className="ml-auto text-primary-400" />}
                </button>
                <button
                  onClick={() => handleSetLang('ru')}
                  className={`settings-option ${lang === 'ru' ? 'active' : ''}`}
                >
                  <span className="text-xs">🇷🇺</span>
                  <span>Русский</span>
                  {lang === 'ru' && <Check size={10} className="ml-auto text-primary-400" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
