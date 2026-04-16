import { useState, useEffect, useRef } from 'react';
import { Send, CheckCircle2, Loader2, Link2, KeyRound } from 'lucide-react';
import { useLang } from '../i18n';

export default function TelegramConnector({ value, onChange }) {
  const { t } = useLang();
  const [token, setToken] = useState(null);
  const [botUrl, setBotUrl] = useState('');
  const [isPolling, setIsPolling] = useState(false);
  const [loading, setLoading] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [manualInput, setManualInput] = useState(value || '');
  const pollIntervalRef = useRef(null);

  const startLinking = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/bot/generate-link`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.token);
        setBotUrl(data.botUrl);
        setIsPolling(true);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isPolling && token) {
      pollIntervalRef.current = setInterval(async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/bot/check-link?token=${token}`);
          const data = await res.json();
          if (data.success && data.chatId) {
            onChange(data.chatId);
            setIsPolling(false);
            setToken(null);
          }
        } catch (e) {
          // ignore
        }
      }, 2000);
    }

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [isPolling, token]);

  if (value && !manualMode) {
    return (
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="text-emerald-500" size={20} />
          <div>
            <p className="text-emerald-400 text-xs font-semibold tracking-wide">TELEGRAM ULANDI</p>
            <p className="text-surface-400 text-[10px]">Chat ID: {value}</p>
          </div>
        </div>
        <button
          onClick={() => { onChange(''); setManualInput(''); }}
          className="text-[10px] text-rose-400 hover:bg-rose-500/10 px-2 py-1.5 rounded transition-all font-medium"
        >
          O'zgartirish
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-sky-500/15 bg-sky-500/5 p-4 text-center">
      <div className="w-12 h-12 bg-sky-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
        <Send className="text-sky-400" size={20} />
      </div>
      <h4 className="text-white text-sm font-semibold mb-1">Telegramni ulash</h4>
      <p className="text-surface-400 text-[11px] mb-4 leading-relaxed">
        Mehmonlar taklifnomaga qoldirgan tilaklarini va <br/>tashriflarini to'g'ridan-to'g'ri Telegramingizda qabul qiling.
      </p>

      {manualMode ? (
        <div className="flex flex-col gap-2 relative text-left">
          <label className="text-[10px] text-surface-400 font-medium ml-1">Qo'lda kiritish (Chat ID):</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Masalan: 5887503077"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value.replace(/[^0-9-]/g, ''))}
              className="input-field flex-1 font-mono text-xs"
              inputMode="numeric"
            />
            <button
              onClick={() => {
                if (manualInput) {
                  onChange(manualInput);
                  setManualMode(false);
                }
              }}
              className="bg-sky-500 hover:bg-sky-600 text-white px-4 rounded-xl text-xs font-medium transition-all"
            >
              Saqlash
            </button>
          </div>
          <button
            onClick={() => setManualMode(false)}
            className="text-[10px] text-surface-500 hover:text-white mt-1 w-fit mx-auto"
          >
            Orqaga qaytish
          </button>
        </div>
      ) : !isPolling ? (
        <div className="space-y-3">
          <button
            onClick={startLinking}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-sky-500 text-white font-medium py-3 rounded-xl text-sm hover:bg-sky-600 transition-all shadow-[0_4px_15px_rgba(14,165,233,0.25)] active:scale-[0.98]"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Link2 size={16} />}
            Botga ulanish tugmasi
          </button>
          <button
            onClick={() => setManualMode(true)}
            className="text-[10px] flex items-center justify-center gap-1.5 text-surface-400 hover:text-white transition-colors mx-auto w-fit"
          >
            <KeyRound size={12} /> yoki qo'lga kiritish (ID orqali)
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <a
            href={botUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-sky-500 text-white font-medium py-3 rounded-xl text-sm hover:bg-sky-600 transition-all shadow-[0_4px_15px_rgba(14,165,233,0.4)] animate-pulse"
          >
            Telegramda ochish (START ni bosing)
          </a>
          <div className="flex items-center justify-center gap-2 text-surface-400 text-[11px] bg-surface-900/50 p-2 rounded-lg">
            <Loader2 size={14} className="animate-spin text-sky-400" />
            Tasdiqlashingiz kutilmoqda...
          </div>
          <button
            onClick={() => { setIsPolling(false); setToken(null); }}
            className="text-[11px] text-surface-500 hover:text-white underline-offset-4 hover:underline"
          >
            Bekor qilish
          </button>
        </div>
      )}
    </div>
  );
}
