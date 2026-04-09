import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Lock, User, ArrowRight, Sparkles } from 'lucide-react';

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API = import.meta.env.VITE_API_URL || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = mode === 'login'
        ? { phone, password }
        : { phone, name, password };

      const res = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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
      setError('Tarmoq xatoligi. Qayta urinib ko\'ring.');
    } finally {
      setLoading(false);
    }
  };

  const formatPhone = (val) => {
    // Auto-format: +998 XX XXX XX XX
    let digits = val.replace(/[^\d+]/g, '');
    if (!digits.startsWith('+')) digits = '+' + digits;
    setPhone(digits);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(107,29,58,0.15) 0%, transparent 60%), #0b0d17' }}>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        {/* Logo / brand */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: 'linear-gradient(135deg, #c9a84c, #9e7e2e)', boxShadow: '0 8px 32px rgba(201,168,76,0.2)' }}
          >
            <Sparkles size={28} className="text-[#0b0d17]" />
          </motion.div>
          <h1 className="text-3xl font-display font-bold text-white mb-1">Taklifnoma</h1>
          <p className="text-surface-400 text-sm">Premium onlayn taklifnomalar platformasi</p>
        </div>

        {/* Auth card */}
        <div className="glass p-6 md:p-8 space-y-6">
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
              Kirish
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-[#c9a84c] to-[#9e7e2e] text-[#0b0d17] shadow-lg'
                  : 'text-surface-400 hover:text-white'
              }`}
            >
              Ro'yxatdan o'tish
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                    <User size={13} /> Ismingiz
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Abdullayev Yunus"
                    className="input-field"
                    required={mode === 'register'}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="label flex items-center gap-1.5">
                <Phone size={13} /> Telefon raqam
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => formatPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="label flex items-center gap-1.5">
                <Lock size={13} /> Parol
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="input-field"
                required
                minLength={4}
              />
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
                  {mode === 'login' ? 'Kirish' : "Ro'yxatdan o'tish"}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-surface-500 text-xs mt-6">
          © 2026 Taklifnoma — Barcha huquqlar himoyalangan
        </p>
      </motion.div>
    </div>
  );
}
