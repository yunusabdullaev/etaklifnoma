import { motion } from 'framer-motion';
import { Check, LayoutGrid, Palette, FileText, Eye, Link2 } from 'lucide-react';
import { useLang } from '../i18n';

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
  const steps = stepsConfig[lang] || stepsConfig.uz;
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="flex items-center justify-between relative">
        {/* Track background */}
        <div
          className="absolute left-[10%] right-[10%] rounded-full"
          style={{ top: 22, height: 3, background: 'rgba(255,255,255,0.06)' }}
        />
        {/* Active track with gradient */}
        <motion.div
          className="absolute rounded-full"
          style={{
            top: 22,
            left: '10%',
            height: 3,
            background: 'linear-gradient(90deg, #5c7cfa, #748ffc, #91a7ff)',
            boxShadow: '0 0 12px rgba(92,124,250,0.4), 0 0 4px rgba(92,124,250,0.6)',
          }}
          initial={{ width: '0%' }}
          animate={{ width: `${progress * 0.8}%` }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10" style={{ minWidth: 56 }}>
              {/* Glow ring for active */}
              {isActive && (
                <motion.div
                  className="absolute"
                  style={{
                    top: -2, left: '50%', transform: 'translateX(-50%)',
                    width: 52, height: 52, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(92,124,250,0.15) 0%, transparent 70%)',
                  }}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.3, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
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
                    boxShadow: '0 4px 16px rgba(92,124,250,0.35), 0 0 0 2px rgba(92,124,250,0.15)',
                  } : isActive ? {
                    background: 'linear-gradient(135deg, #4c6ef5, #3b5bdb)',
                    boxShadow: '0 4px 20px rgba(92,124,250,0.5), 0 0 0 3px rgba(92,124,250,0.2)',
                  } : {
                    background: 'rgba(255,255,255,0.04)',
                    border: '1.5px solid rgba(255,255,255,0.1)',
                    boxShadow: 'none',
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
                      color: isActive ? '#fff' : 'rgba(255,255,255,0.3)',
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
                  color: isActive ? '#748ffc' : isCompleted ? '#94a3b8' : 'rgba(255,255,255,0.3)',
                  transition: 'all 0.3s',
                }}
              >
                {step.short}
              </span>

              {/* Step number badge for active */}
              {isActive && (
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    fontSize: 9,
                    color: '#5c7cfa',
                    fontWeight: 700,
                    letterSpacing: 1,
                    marginTop: 2,
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
