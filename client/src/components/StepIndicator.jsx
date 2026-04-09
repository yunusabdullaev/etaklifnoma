import { motion } from 'framer-motion';
import { Check, LayoutGrid, Palette, FileText, Eye, Link2 } from 'lucide-react';
import { useLang } from '../i18n';
import { useTheme } from '../theme';

const stepsConfig = {
  uz: [
    { id: 1, short: 'Tur', icon: LayoutGrid },
    { id: 2, short: 'Shablon', icon: Palette },
    { id: 3, short: 'Mazmun', icon: FileText },
    { id: 4, short: "Ko'rish", icon: Eye },
    { id: 5, short: 'Havola', icon: Link2 },
  ],
  ru: [
    { id: 1, short: 'Тип', icon: LayoutGrid },
    { id: 2, short: 'Шаблон', icon: Palette },
    { id: 3, short: 'Данные', icon: FileText },
    { id: 4, short: 'Просмотр', icon: Eye },
    { id: 5, short: 'Ссылка', icon: Link2 },
  ],
};

export default function StepIndicator({ currentStep }) {
  const { lang } = useLang();
  const { isDark } = useTheme();
  const steps = stepsConfig[lang] || stepsConfig.uz;
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;
  const isLight = !isDark;

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="flex items-center justify-between relative" style={{ paddingBottom: 4 }}>
        {/* Background track — full width between first and last circle centers */}
        <div
          style={{
            position: 'absolute',
            top: 21,
            left: 28,
            right: 28,
            height: 3,
            borderRadius: 4,
            background: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)',
          }}
        />
        {/* Active progress track inside wrapper for correct width */}
        {/* Use a wrapper div for correct width calculation */}
        <div
          style={{
            position: 'absolute',
            top: 21,
            left: 28,
            right: 28,
            height: 3,
            pointerEvents: 'none',
          }}
        >
          <motion.div
            style={{
              height: '100%',
              borderRadius: 4,
              background: 'linear-gradient(90deg, #5c7cfa, #748ffc, #91a7ff)',
              boxShadow: '0 0 10px rgba(92,124,250,0.35)',
            }}
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>

        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const Icon = step.icon;

          // Colors based on theme
          const inactiveBg = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)';
          const inactiveBorder = isLight ? '1.5px solid rgba(0,0,0,0.1)' : '1.5px solid rgba(255,255,255,0.1)';
          const inactiveIconColor = isLight ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.25)';
          const inactiveTextColor = isLight ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.3)';
          const completedTextColor = isLight ? '#555' : '#94a3b8';

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10" style={{ minWidth: 56 }}>
              {/* Glow ring for active */}
              {isActive && (
                <motion.div
                  style={{
                    position: 'absolute',
                    top: -2, left: '50%', transform: 'translateX(-50%)',
                    width: 52, height: 52, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(92,124,250,0.15) 0%, transparent 70%)',
                  }}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.2, 0.6] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}

              {/* Circle */}
              <motion.div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  cursor: 'default',
                  ...(isCompleted ? {
                    background: 'linear-gradient(135deg, #5c7cfa, #4263eb)',
                    boxShadow: '0 4px 16px rgba(92,124,250,0.3)',
                    border: 'none',
                  } : isActive ? {
                    background: 'linear-gradient(135deg, #4c6ef5, #3b5bdb)',
                    boxShadow: '0 4px 20px rgba(92,124,250,0.45)',
                    border: 'none',
                  } : {
                    background: inactiveBg,
                    border: inactiveBorder,
                    boxShadow: isLight ? '0 1px 4px rgba(0,0,0,0.04)' : 'none',
                  }),
                }}
                animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Check size={18} strokeWidth={3} color="#fff" />
                  </motion.div>
                ) : (
                  <Icon
                    size={16}
                    strokeWidth={2}
                    style={{
                      color: isActive ? '#fff' : inactiveIconColor,
                      transition: 'color 0.3s',
                    }}
                  />
                )}
              </motion.div>

              {/* Label */}
              <span
                style={{
                  marginTop: 8,
                  fontSize: 11,
                  fontWeight: isActive ? 600 : 500,
                  letterSpacing: isActive ? 0.3 : 0,
                  color: isActive ? '#5c7cfa' : isCompleted ? completedTextColor : inactiveTextColor,
                  transition: 'all 0.3s',
                }}
              >
                {step.short}
              </span>

              {/* Step counter badge */}
              {isActive && (
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    fontSize: 9,
                    color: '#5c7cfa',
                    fontWeight: 700,
                    letterSpacing: 1,
                    marginTop: 1,
                    opacity: 0.7,
                  }}
                >
                  {step.id}/5
                </motion.span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
