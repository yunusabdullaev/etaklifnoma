import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import StepIndicator from './components/StepIndicator';
import Step1EventType from './components/Step1EventType';
import Step2Template from './components/Step2Template';
import Step3Content from './components/Step3Content';
import Step4Preview from './components/Step4Preview';
import Step5Generate from './components/Step5Generate';
import AuthPage from './components/AuthPage';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import SupportPage from './components/SupportPage';
import SettingsDropdown from './components/SettingsDropdown';
import { useLang } from './i18n';
import { Sparkles, LogOut, User, LayoutGrid, PlusCircle, MessageCircle } from 'lucide-react';

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
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'wizard' | 'support'
  const GLOBAL_DRAFT_KEY = 'etaklifnoma_wizard_draft';

  // Global wizard draft auto-save
  useEffect(() => {
    if (view === 'wizard' && step >= 1 && step < 5 && user) {
      localStorage.setItem(GLOBAL_DRAFT_KEY, JSON.stringify({ step, data }));
    }
  }, [step, data, view, user]);
  const [showAuth, setShowAuth] = useState(false); // landing → auth transition

  // Check saved auth on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('taklifnoma-token');
    const savedUser = localStorage.getItem('taklifnoma-user');

    if (savedToken && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (e) {
        localStorage.removeItem('taklifnoma-token');
        localStorage.removeItem('taklifnoma-user');
      }
    }
    setAuthChecked(true);
  }, []);

  const handleLogin = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    setView('wizard');
    setStep(1);
    setData(INITIAL_DATA);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('taklifnoma-token');
    localStorage.removeItem('taklifnoma-user');
    setStep(1);
    setData(INITIAL_DATA);
    setView('dashboard');
  };

  const updateData = useCallback((updates) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const nextStep = () => setStep((s) => Math.min(s + 1, 5));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));
  const resetWizard = () => {
    setData(INITIAL_DATA);
    setStep(1);
    setView('dashboard');
    localStorage.removeItem(GLOBAL_DRAFT_KEY);
  };

  const startWizard = (defaultSettings = null) => {
    localStorage.removeItem(GLOBAL_DRAFT_KEY);
    let freshData = { ...INITIAL_DATA };
    if (defaultSettings && Object.keys(defaultSettings).length > 0) {
        freshData.customFields = { ...defaultSettings };
    }
    setData(freshData);
    setStep(1);
    setView('wizard');
  };

  const continueWizard = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(GLOBAL_DRAFT_KEY));
      if (saved && saved.data) {
        setData(saved.data);
        setStep(saved.step || 1);
        setView('wizard');
      } else {
        startWizard();
      }
    } catch (e) {
      startWizard();
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1EventType data={data} onUpdate={updateData} onNext={nextStep} />;
      case 2: return <Step2Template data={data} onUpdate={updateData} onNext={nextStep} onBack={prevStep} />;
      case 3: return <Step3Content data={data} onUpdate={updateData} onNext={nextStep} onBack={prevStep} />;
      case 4: return <Step4Preview data={data} onNext={nextStep} onBack={prevStep} />;
      case 5: return <Step5Generate data={data} onReset={resetWizard} onBack={prevStep} />;
      default: return null;
    }
  };

  // Wait for auth check
  if (!authChecked) return null;

  // Show landing or auth page if not logged in
  if (!user) {
    if (!showAuth) {
      return <LandingPage onEnter={() => setShowAuth(true)} />;
    }
    return <AuthPage onLogin={handleLogin} onBack={() => setShowAuth(false)} />;
  }

  const showDashboard = view === 'dashboard';
  const showSupport = view === 'support';
  const { t } = useLang();

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
            <button onClick={() => setView('dashboard')} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 
                flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Sparkles size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-display font-bold text-white leading-none">
                  {t('header.title')}
                </h1>
                <p className="text-[10px] text-surface-500 leading-none mt-0.5">
                  {t('header.subtitle')}
                </p>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Settings dropdown (theme + lang) */}
            <SettingsDropdown />

            {/* Navigation tabs */}
            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-0.5">
              <button
                onClick={() => setView('dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  showDashboard
                    ? 'bg-primary-500/20 text-primary-400'
                    : 'text-surface-500 hover:text-white'
                }`}
              >
                <LayoutGrid size={12} />
                <span className="hidden sm:inline">{t('header.cabinet')}</span>
              </button>
              <button
                onClick={startWizard}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  !showDashboard
                    ? 'bg-primary-500/20 text-primary-400'
                    : 'text-surface-500 hover:text-white'
                }`}
              >
                <PlusCircle size={12} />
                <span className="hidden sm:inline">{t('header.create')}</span>
              </button>
              <button
                onClick={() => setView('support')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  showSupport
                    ? 'bg-primary-500/20 text-primary-400'
                    : 'text-surface-500 hover:text-white'
                }`}
              >
                <MessageCircle size={12} />
                <span className="hidden sm:inline">{t('header.support')}</span>
              </button>
            </div>

            {!showDashboard && !showSupport && step < 5 && (
              <div className="text-xs text-surface-500 hidden sm:block">
                {t('header.step')} <span className="text-white font-semibold">{step}</span>/5
              </div>
            )}
            
            {/* User info + logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <div className="flex items-center gap-1.5 text-xs text-surface-400">
                <User size={12} />
                <span className="hidden sm:inline max-w-[100px] truncate">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-surface-500 hover:text-rose-400 transition-colors p-1"
                title={t('header.logout')}
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Step Indicator — only in wizard mode */}
      {!showDashboard && !showSupport && (
        <div className="relative z-10 py-6 border-b border-white/5 bg-surface-950/50 backdrop-blur-sm">
          <StepIndicator currentStep={step} onStepClick={(s) => { if (s < step) setStep(s); }} />
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-12 pb-20 sm:pb-12">
        <AnimatePresence mode="wait">
          {showDashboard ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Dashboard token={token} onCreateNew={startWizard} onContinueDraft={continueWizard} />
            </motion.div>
          ) : showSupport ? (
            <motion.div
              key="support"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SupportPage token={token} onBack={() => setView('dashboard')} />
            </motion.div>
          ) : (
            <motion.div
              key={`wizard-${step}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer — hidden on mobile wizard to avoid overlap with sticky buttons */}
      <footer className={`relative z-10 border-t border-white/5 mt-auto ${!showDashboard ? 'hidden sm:block' : ''}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 text-center">
          <p className="text-xs text-surface-600">
            {t('footer.copyright')}
          </p>
        </div>
      </footer>
    </div>
  );
}
