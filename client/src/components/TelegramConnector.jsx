import { useState, useEffect, useRef } from 'react';
import { Send, CheckCircle2, Loader2, Link2, KeyRound } from 'lucide-react';
import { useLang } from '../i18n';

export default function TelegramConnector({ value, onChange }) {
  const { lang } = useLang();

  const tcTranslations = {
    uz: { connected: 'TELEGRAM ULANDI', change: "O'zgartirish", title: 'Telegramni ulash', desc: "Mehmonlar taklifnomaga qoldirgan tilaklarini va<br/>tashriflarini to'g'ridan-to'g'ri Telegramingizda qabul qiling.", manual: "Qo'lda kiritish (Chat ID):", placeholder: "Masalan: 5887503077", save: "Saqlash", back: "Orqaga qaytish", btnConnect: "Botga ulanish tugmasi", btnManual: "yoki qo'lga kiritish (ID orqali)", open: "Telegramda ochish (START ni bosing)", waiting: "Tasdiqlashingiz kutilmoqda...", cancel: "Bekor qilish" },
    ru: { connected: 'TELEGRAM ПОДКЛЮЧЕН', change: "Изменить", title: 'Подключить Telegram', desc: "Получайте пожелания и ответы гостей<br/>напрямую в ваш Telegram.", manual: "Ручной ввод (Chat ID):", placeholder: "Например: 5887503077", save: "Сохранить", back: "Вернуться назад", btnConnect: "Кнопка подключения к боту", btnManual: "или ввести вручную (по ID)", open: "Открыть в Telegram (нажмите START)", waiting: "Ожидание вашего подтверждения...", cancel: "Отмена" },
    qq: { connected: 'TELEGRAM JALǴANDI', change: "Ózgertiw", title: 'Telegramdı jalǵaw', desc: "Mıymanlar qaldırǵan tilekler hám<br/>tastıyıqlawlardı tuwrıdan-tuwrı Telegramda qabıl etiń.", manual: "Qoldan kiritiw (Chat ID):", placeholder: "Mısalı: 5887503077", save: "Saqlaw", back: "Artqa qaytıw", btnConnect: "Botqa jalǵanıw túymesi", btnManual: "yaki qoldan kiritiw (ID arqalı)", open: "Telegramda ashıw (START tı basıń)", waiting: "Tastıyıqlawıńız kútilmekte...", cancel: "Biykar etiw" },
    en: { connected: 'TELEGRAM CONNECTED', change: "Change", title: 'Connect Telegram', desc: "Receive guest wishes and RSVP confirmations<br/>directly in your Telegram.", manual: "Manual Entry (Chat ID):", placeholder: "Example: 5887503077", save: "Save", back: "Go Back", btnConnect: "Bot connection button", btnManual: "or manual entry (via ID)", open: "Open in Telegram (press START)", waiting: "Waiting for your confirmation...", cancel: "Cancel" }
  };
  const t = tcTranslations[lang] || tcTranslations['uz'];
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
            <p className="text-emerald-400 text-xs font-semibold tracking-wide">{t.connected}</p>
            <p className="text-surface-400 text-[10px]">Chat ID: {value}</p>
          </div>
        </div>
        <button
          onClick={() => { onChange(''); setManualInput(''); }}
          className="text-[10px] text-rose-400 hover:bg-rose-500/10 px-2 py-1.5 rounded transition-all font-medium"
        >
          {t.change}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-sky-500/15 bg-sky-500/5 p-4 text-center">
      <div className="w-12 h-12 bg-sky-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
        <Send className="text-sky-400" size={20} />
      </div>
      <h4 className="text-white text-sm font-semibold mb-1">{t.title}</h4>
      <p className="text-surface-400 text-[11px] mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: t.desc }} />

      {manualMode ? (
        <div className="flex flex-col gap-2 relative text-left">
          <label className="text-[10px] text-surface-400 font-medium ml-1">{t.manual}</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={t.placeholder}
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
              {t.save}
            </button>
          </div>
          <button
            onClick={() => setManualMode(false)}
            className="text-[10px] text-surface-500 hover:text-white mt-1 w-fit mx-auto"
          >
            {t.back}
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
            {t.btnConnect}
          </button>
          <button
            onClick={() => setManualMode(true)}
            className="text-[10px] flex items-center justify-center gap-1.5 text-surface-400 hover:text-white transition-colors mx-auto w-fit"
          >
            <KeyRound size={12} /> {t.btnManual}
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
            {t.open}
          </a>
          <div className="flex items-center justify-center gap-2 text-surface-400 text-[11px] bg-surface-900/50 p-2 rounded-lg">
            <Loader2 size={14} className="animate-spin text-sky-400" />
            {t.waiting}
          </div>
          <button
            onClick={() => { setIsPolling(false); setToken(null); }}
            className="text-[11px] text-surface-500 hover:text-white underline-offset-4 hover:underline"
          >
            {t.cancel}
          </button>
        </div>
      )}
    </div>
  );
}
