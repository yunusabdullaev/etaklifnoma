import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import StepIndicator from './components/StepIndicator';
import Step1EventType from './components/Step1EventType';
import Step2Template from './components/Step2Template';
import Step3Content from './components/Step3Content';
import Step4Preview from './components/Step4Preview';
import Step5Generate from './components/Step5Generate';
import { Sparkles } from 'lucide-react';

const INITIAL_DATA = {
  eventType: null,
  eventTypeId: null,
  template: null,
  templateId: null,
  hostName: '',
  guestName: '',
  eventTitle: '',
  eventDate: '',
  eventTime: '',
  location: '',
  locationUrl: '',
  message: '',
  customFields: {},
};

export default function App() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(INITIAL_DATA);

  const updateData = useCallback((updates) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const nextStep = () => setStep((s) => Math.min(s + 1, 5));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));
  const resetWizard = () => {
    setData(INITIAL_DATA);
    setStep(1);
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1EventType data={data} onUpdate={updateData} onNext={nextStep} />;
      case 2: return <Step2Template data={data} onUpdate={updateData} onNext={nextStep} onBack={prevStep} />;
      case 3: return <Step3Content data={data} onUpdate={updateData} onNext={nextStep} onBack={prevStep} />;
      case 4: return <Step4Preview data={data} onNext={nextStep} onBack={prevStep} />;
      case 5: return <Step5Generate data={data} onReset={resetWizard} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/[0.03] rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-500/[0.03] rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/[0.015] rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-surface-950/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 
              flex items-center justify-center shadow-lg shadow-primary-500/20">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold text-white leading-none">
                Taklifnoma
              </h1>
              <p className="text-[10px] text-surface-500 leading-none mt-0.5">
                Onlayn taklif yaratuvchi
              </p>
            </div>
          </div>

          {step < 5 && (
            <div className="text-xs text-surface-500">
              Qadam <span className="text-white font-semibold">{step}</span>/5
            </div>
          )}
        </div>
      </header>

      {/* Step Indicator */}
      {step < 5 && (
        <div className="relative z-10 py-6 border-b border-white/5 bg-surface-950/50 backdrop-blur-sm">
          <StepIndicator currentStep={step} />
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 text-center">
          <p className="text-xs text-surface-600">
            © 2026 Taklifnoma — Barcha huquqlar himoyalangan
          </p>
        </div>
      </footer>
    </div>
  );
}
