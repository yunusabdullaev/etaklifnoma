import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Lock, User, ArrowRight, Sparkles, ShieldCheck, ArrowLeft, Globe, Eye, EyeOff } from 'lucide-react';
import { useLang } from '../i18n';

export default function AuthPage({ onLogin, onBack }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'verify'
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const otpRefs = useRef([]);
  const API = import.meta.env.VITE_API_URL || '';
  const { lang, toggleLang, t } = useLang();

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const formatPhone = (val) => {
    // Only allow digits, max 9
    const digits = val.replace(/\D/g, '').slice(0, 9);
    setPhone(digits);
  };

  // Format for display: XX XXX XX XX
  const displayPhone = (digits) => {
    if (!digits) return '';
    const parts = [];
    if (digits.length > 0) parts.push(digits.slice(0, 2));
    if (digits.length > 2) parts.push(digits.slice(2, 5));
    if (digits.length > 5) parts.push(digits.slice(5, 7));
    if (digits.length > 7) parts.push(digits.slice(7, 9));
    return parts.join(' ');
  };

  // Full phone number for API
  const fullPhone = '+998' + phone;

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (newOtp.every(d => d !== '') && newOtp.join('').length === 6) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newOtp = pasted.split('');
      setOtp(newOtp);
      otpRefs.current[5]?.focus();
      handleVerify(pasted);
    }
  };

  // Register → direct login (no OTP)
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone, name, password }),
      });

      const data = await res.json();

      if (data.success && data.data?.token) {
        // Direct login — no OTP needed
        const { token, user } = data.data;
        localStorage.setItem('taklifnoma-token', token);
        localStorage.setItem('taklifnoma-user', JSON.stringify(user));
        onLogin(user, token);
      } else {
        setError(data.message || 'Xatolik yuz berdi');
      }
    } catch (err) {
      setError('Tarmoq xatoligi');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerify = async (code) => {
    if (!code || code.length !== 6) return;
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone, code }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('taklifnoma-token', data.data.token);
        localStorage.setItem('taklifnoma-user', JSON.stringify(data.data.user));
        onLogin(data.data.user, data.data.token);
      } else {
        setError(data.message || 'Kod noto\'g\'ri');
        setOtp(['', '', '', '', '', '']);
        otpRefs.current[0]?.focus();
      }
    } catch (err) {
      setError('Tarmoq xatoligi');
    } finally {
      setLoading(false);
    }
  };

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('taklifnoma-token', data.data.token);
        localStorage.setItem('taklifnoma-user', JSON.stringify(data.data.user));
        onLogin(data.data.user, data.data.token);
      } else {
        setError(data.message || 'Xatolik yuz berdi');
      }
    } catch (err) {
      setError('Tarmoq xatoligi');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (countdown > 0) return;
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone, name, password }),
      });
      const data = await res.json();
      if (data.success) {
        setCountdown(300);
        setOtp(['', '', '', '', '', '']);
        otpRefs.current[0]?.focus();
      } else {
        setError(data.message || 'Xatolik');
      }
    } catch (err) {
      setError('Tarmoq xatoligi');
    } finally {
      setLoading(false);
    }
  };

  const formatCountdown = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(107,29,58,0.15) 0%, transparent 60%), #0b0d17' }}>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        {/* Back button */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-surface-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            {t('auth.back') || 'Orqaga'}
          </button>
        )}

        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: 'linear-gradient(135deg, #c9a84c, #9e7e2e)', boxShadow: '0 8px 32px rgba(201,168,76,0.2)' }}
          >
            {mode === 'verify' ? <ShieldCheck size={28} className="text-[#0b0d17]" /> : <Sparkles size={28} className="text-[#0b0d17]" />}
          </motion.div>
          <h1 className="text-3xl font-display font-bold text-white mb-1">Taklifnoma</h1>
          <p className="text-surface-400 text-sm">
            {mode === 'verify' ? t('auth.otpTitle') : t('header.subtitle')}
          </p>
        </div>

        {/* Auth card */}
        <div className="glass p-6 md:p-8 space-y-6">
          {/* Language toggle in auth */}
          <div className="flex justify-end">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold
                bg-white/5 border border-white/10 text-surface-300 hover:text-white hover:bg-white/10 transition-all"
            >
              <Globe size={11} />
              {lang === 'uz' ? 'QQ' : lang === 'qq' ? 'RU' : lang === 'ru' ? 'EN' : 'UZ'}
            </button>
          </div>
          <AnimatePresence mode="wait">
            {/* ── VERIFY OTP ── */}
            {mode === 'verify' && (
              <motion.div
                key="verify"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <p className="text-surface-300 text-sm">
                    {t('auth.otpDesc')}
                  </p>
                  <p className="text-primary-400 text-xs mt-1 font-mono">{fullPhone}</p>
                </div>

                {/* OTP inputs */}
                <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => otpRefs.current[i] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-12 h-14 text-center text-xl font-bold rounded-xl
                        bg-white/5 border border-white/10 text-white
                        focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30
                        transition-all outline-none"
                      style={{ fontFamily: 'monospace' }}
                    />
                  ))}
                </div>

                {/* Countdown / Resend */}
                <div className="text-center">
                  {countdown > 0 ? (
                    <p className="text-surface-500 text-xs">
                      {t('auth.otpExpires')}: <span className="text-white font-mono">{formatCountdown(countdown)}</span>
                    </p>
                  ) : (
                    <button
                      onClick={handleResend}
                      disabled={loading}
                      className="text-primary-400 text-xs hover:text-primary-300 transition-colors"
                    >
                      {t('auth.otpResend')}
                    </button>
                  )}
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-rose-400 text-sm text-center bg-rose-400/10 py-2 px-3 rounded-lg"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  onClick={() => { setMode('register'); setError(''); }}
                  className="flex items-center justify-center gap-1.5 text-surface-500 text-xs hover:text-white transition-colors mx-auto"
                >
                  <ArrowLeft size={12} /> {t('auth.otpBack')}
                </button>
              </motion.div>
            )}

            {/* ── LOGIN / REGISTER ── */}
            {mode !== 'verify' && (
              <motion.div
                key="auth-form"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Tab switch */}
                <div className="flex bg-white/5 rounded-xl p-1">
                  <button
                    onClick={() => { setMode('login'); setError(''); }}
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                      mode === 'login'
                        ? 'bg-gradient-to-r from-[#c9a84c] to-[#9e7e2e] text-[#0b0d17] shadow-lg'
                        : 'text-surface-400 hover:text-white'
                    }`}
                  >
                    {t('auth.login')}
                  </button>
                  <button
                    onClick={() => { setMode('register'); setError(''); }}
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                      mode === 'register'
                        ? 'bg-gradient-to-r from-[#c9a84c] to-[#9e7e2e] text-[#0b0d17] shadow-lg'
                        : 'text-surface-400 hover:text-white'
                    }`}
                  >
                    {t('auth.register')}
                  </button>
                </div>

                <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">
                  <AnimatePresence mode="wait">
                    {mode === 'register' && (
                      <motion.div
                        key="name-field"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <label className="label flex items-center gap-1.5">
                          <User size={13} /> {t('auth.name')}
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Aliyev Jasur"
                          className="input-field"
                          required={mode === 'register'}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div>
                    <label className="label flex items-center gap-1.5">
                      <Phone size={13} /> {t('auth.phone')}
                    </label>
                    <div className="flex items-center gap-0">
                      <span className="flex items-center justify-center px-3 py-3 rounded-l-xl
                        bg-primary-500/10 border border-r-0 border-white/10 text-primary-400
                        text-sm font-semibold select-none whitespace-nowrap"
                        style={{ minWidth: 64 }}
                      >+998</span>
                      <input
                        type="tel"
                        value={displayPhone(phone)}
                        onChange={(e) => formatPhone(e.target.value)}
                        placeholder="90 123 45 67"
                        className="input-field flex-1"
                        style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                        maxLength={12}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label flex items-center gap-1.5">
                      <Lock size={13} /> {t('auth.password')}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••"
                        className="input-field w-full pr-10"
                        required
                        minLength={4}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-white transition-colors p-1"
                        tabIndex="-1"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-rose-400 text-sm text-center bg-rose-400/10 py-2 px-3 rounded-lg"
                    >
                      {error}
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-3.5"
                  >
                    {loading ? (
                      <span className="inline-block w-5 h-5 border-2 border-[#0b0d17] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        {mode === 'login' ? t('auth.loginBtn') : t('auth.registerBtn')}
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-surface-500 text-xs mt-6">
          {t('footer.copyright')}
        </p>
      </motion.div>
    </div>
  );
}
