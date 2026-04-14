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
  qq: [
    { id: 1, short: 'Tur', icon: LayoutGrid },
    { id: 2, short: 'Shablon', icon: Palette },
    { id: 3, short: 'Mazmun', icon: FileText },
    { id: 4, short: 'Koriw', icon: Eye },
    { id: 5, short: 'Silteme', icon: Link2 },
  ],
  en: [
    { id: 1, short: 'Type', icon: LayoutGrid },
    { id: 2, short: 'Template', icon: Palette },
    { id: 3, short: 'Content', icon: FileText },
    { id: 4, short: 'Preview', icon: Eye },
    { id: 5, short: 'Link', icon: Link2 },
  ],
};

export default function StepIndicator({ currentStep, onStepClick }) {
  const { lang } = useLang();
  const { isDark } = useTheme();
  const steps = stepsConfig[lang] || stepsConfig.uz;
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;
  const isLight = !isDark;

  const circleSize = 42;

  return (
    <div className="w-full max-w-2xl mx-auto px-6">
      {/* Main row — circles + line all centered */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>

        {/* Progress line container — sits exactly at circle centers */}
        <div style={{
          position: 'absolute',
          top: circleSize / 2 - 1.5,
          left: circleSize / 2,
          right: circleSize / 2,
          height: 3,
          pointerEvents: 'none',
        }}>
          <motion.div
            style={{
              height: '100%',
              borderRadius: 4,
              background: 'linear-gradient(90deg, #5c7cfa, #748ffc, #91a7ff)',
              boxShadow: '0 0 8px rgba(92,124,250,0.25)',
            }}
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>

        {/* Steps */}
        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const Icon = step.icon;

          const inactiveBg = isLight ? '#eef0f4' : 'rgba(255,255,255,0.06)';
          const inactiveBorder = isLight ? '1.5px solid rgba(0,0,0,0.08)' : '1.5px solid rgba(255,255,255,0.08)';
          const inactiveIconColor = isLight ? '#bbb' : 'rgba(255,255,255,0.2)';
          const inactiveText = isLight ? '#aaa' : 'rgba(255,255,255,0.25)';
          const completedText = isLight ? '#555' : '#94a3b8';

          return (
            <div key={step.id}
              onClick={() => isCompleted && onStepClick && onStepClick(step.id)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                width: circleSize, flexShrink: 0, position: 'relative', zIndex: 2,
                cursor: isCompleted ? 'pointer' : 'default',
              }}
            >
              {/* Circle */}
              <div
                style={{
                  width: circleSize,
                  height: circleSize,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  ...(isCompleted ? {
                    background: 'linear-gradient(135deg, #5c7cfa, #4263eb)',
                    boxShadow: '0 3px 12px rgba(92,124,250,0.3)',
                    border: 'none',
                  } : isActive ? {
                    background: 'linear-gradient(135deg, #4c6ef5, #3b5bdb)',
                    boxShadow: '0 3px 14px rgba(92,124,250,0.4)',
                    border: 'none',
                  } : {
                    background: inactiveBg,
                    border: inactiveBorder,
                  }),
                }}
              >
                {isCompleted ? (
                  <Check size={17} strokeWidth={3} color="#fff" />
                ) : (
                  <Icon size={15} strokeWidth={2} color={isActive ? '#fff' : inactiveIconColor} />
                )}
              </div>

              {/* Label */}
              <span style={{
                marginTop: 6,
                fontSize: 11,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#5c7cfa' : isCompleted ? completedText : inactiveText,
                whiteSpace: 'nowrap',
              }}>
                {step.short}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
