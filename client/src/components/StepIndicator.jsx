import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const steps = [
  { id: 1, title: 'Tur', short: 'Tur' },
  { id: 2, title: 'Shablon', short: 'Shablon' },
  { id: 3, title: 'Mazmun', short: 'Mazmun' },
  { id: 4, title: 'Ko\'rish', short: 'Ko\'rish' },
  { id: 5, title: 'Havola', short: 'Havola' },
];

export default function StepIndicator({ currentStep }) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="flex items-center justify-between relative">
        {/* Progress line background */}
        <div className="absolute top-5 left-[10%] right-[10%] h-[2px] bg-white/10 rounded-full" />
        {/* Active progress line */}
        <motion.div
          className="absolute top-5 left-[10%] h-[2px] bg-gradient-to-r from-primary-500 to-primary-400 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 80}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                  transition-all duration-300 ${
                    isCompleted
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                      : isActive
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/40 ring-4 ring-primary-500/20'
                        : 'bg-white/[0.07] text-surface-400 border border-white/10'
                  }`}
                animate={isActive ? { scale: [1, 1.08, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                {isCompleted ? <Check size={18} strokeWidth={3} /> : step.id}
              </motion.div>
              <span className={`mt-2 text-xs font-medium transition-colors duration-300 ${
                isActive ? 'text-primary-400' : isCompleted ? 'text-surface-300' : 'text-surface-500'
              }`}>
                {step.short}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
