import re

with open('client/src/App.jsx', 'r') as f:
    text = f.read()

# Add global draft auto-saving
search_initial = """  const [view, setView] = useState('dashboard'); // 'dashboard' | 'wizard' | 'support'"""
replace_initial = """  const [view, setView] = useState('dashboard'); // 'dashboard' | 'wizard' | 'support'
  const GLOBAL_DRAFT_KEY = 'etaklifnoma_wizard_draft';

  // Global wizard draft auto-save
  useEffect(() => {
    if (view === 'wizard' && step >= 1 && step < 5 && user) {
      localStorage.setItem(GLOBAL_DRAFT_KEY, JSON.stringify({ step, data }));
    }
  }, [step, data, view, user]);"""
text = text.replace(search_initial, replace_initial)

# Update resetWizard and startWizard
search_reset = """  const resetWizard = () => {
    setData(INITIAL_DATA);
    setStep(1);
    setView('dashboard');
  };

  const startWizard = (defaultSettings = null) => {
    let freshData = { ...INITIAL_DATA };
    if (defaultSettings && Object.keys(defaultSettings).length > 0) {
        freshData.customFields = { ...defaultSettings };
    }
    setData(freshData);
    setStep(1);
    setView('wizard');
  };"""

replace_reset = """  const resetWizard = () => {
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
  };"""
text = text.replace(search_reset, replace_reset)

# Update Dashboard component pass
search_dashboard = """<Dashboard token={token} onCreateNew={startWizard} />"""
replace_dashboard = """<Dashboard token={token} onCreateNew={startWizard} onContinueDraft={continueWizard} />"""
text = text.replace(search_dashboard, replace_dashboard)

with open('client/src/App.jsx', 'w') as f:
    f.write(text)

print("SUCCESS: App.jsx updated for global draft")
