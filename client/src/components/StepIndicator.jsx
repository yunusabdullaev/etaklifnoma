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
      <div className="flex items-center justify-between relative">
        {/* Only the active/completed track — no background line */}
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
              boxShadow: '0 0 10px rgba(92,124,250,0.3)',
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

          const inactiveBg = isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)';
          const inactiveBorder = isLight ? '1.5px solid rgba(0,0,0,0.08)' : '1.5px solid rgba(255,255,255,0.08)';
          const inactiveIconColor = isLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)';
          const inactiveTextColor = isLight ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.25)';
          const completedTextColor = isLight ? '#444' : '#94a3b8';

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10" style={{ minWidth: 56 }}>
              {/* Glow for active */}
              {isActive && (
                <motion.div
                  style={{
                    position: 'absolute',
                    top: -1, left: '50%', transform: 'translateX(-50%)',
                    width: 50, height: 50, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(92,124,250,0.18) 0%, transparent 70%)',
                  }}
                  animate={{ scale: [1, 1.25, 1], opacity: [0.7, 0.25, 0.7] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}

              {/* Circle */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...(isCompleted ? {
                    background: 'linear-gradient(135deg, #5c7cfa, #4263eb)',
                    boxShadow: '0 4px 14px rgba(92,124,250,0.3)',
                  } : isActive ? {
                    background: 'linear-gradient(135deg, #4c6ef5, #3b5bdb)',
                    boxShadow: '0 4px 18px rgba(92,124,250,0.45)',
                  } : {
                    background: inactiveBg,
                    border: inactiveBorder,
                  }),
                }}
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
                    color={isActive ? '#fff' : inactiveIconColor}
                  />
                )}
              </div>

              {/* Label */}
              <span
                style={{
                  marginTop: 7,
                  fontSize: 11,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#5c7cfa' : isCompleted ? completedTextColor : inactiveTextColor,
                  transition: 'all 0.3s',
                }}
              >
                {step.short}
              </span>

              {/* Step badge */}
              {isActive && (
                <motion.span
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 0.6, y: 0 }}
                  style={{ fontSize: 9, color: '#5c7cfa', fontWeight: 700, letterSpacing: 1, marginTop: 1 }}
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
