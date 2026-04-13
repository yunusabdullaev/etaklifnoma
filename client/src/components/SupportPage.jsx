import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../i18n';
import {
  MessageCircle, Send, ArrowLeft, Clock, CheckCircle,
  XCircle, Loader2, Plus, ChevronRight, AlertCircle
} from 'lucide-react';

export default function SupportPage({ token, onBack }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const API = import.meta.env.VITE_API_URL || '';
  const { t } = useLang();

  // Fetch tickets
  const fetchTickets = async () => {
    try {
      const res = await fetch(`${API}/api/support`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setTickets(Array.isArray(data.data) ? data.data : []);
      }
    } catch (err) {
      console.error('Fetch tickets error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    // Poll for updates every 15 seconds
    const interval = setInterval(fetchTickets, 15000);
    return () => clearInterval(interval);
  }, []);

  // Submit new ticket
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setSending(true);
    setError('');

    try {
      const res = await fetch(`${API}/api/support`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subject: subject.trim(), message: message.trim() }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess('Murojaat yuborildi! Tez orada javob beramiz.');
        setSubject('');
        setMessage('');
        setShowForm(false);
        fetchTickets();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Xatolik');
      }
    } catch (err) {
      setError('Tarmoq xatoligi');
    } finally {
      setSending(false);
    }
  };

  const statusIcon = (status) => {
    switch (status) {
      case 'open': return <Clock size={14} className="text-amber-400" />;
      case 'answered': return <CheckCircle size={14} className="text-emerald-400" />;
      case 'closed': return <XCircle size={14} className="text-surface-500" />;
      default: return null;
    }
  };

  const statusLabel = (status) => {
    switch (status) {
      case 'open': return 'Kutilmoqda';
      case 'answered': return 'Javob berildi';
      case 'closed': return 'Yopilgan';
      default: return status;
    }
  };

  // Selected ticket detail
  if (selectedTicket) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <button
          onClick={() => setSelectedTicket(null)}
          className="flex items-center gap-2 text-sm text-surface-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Orqaga
        </button>

        <div className="glass p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">{selectedTicket.subject}</h3>
            <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
              {statusIcon(selectedTicket.status)}
              {statusLabel(selectedTicket.status)}
            </span>
          </div>

          <div className="text-xs text-surface-500">
            {new Date(selectedTicket.createdAt).toLocaleString('uz-UZ')}
          </div>

          {/* User message */}
          <div className="p-4 rounded-xl bg-primary-500/10 border border-primary-500/20">
            <p className="text-xs text-primary-400 mb-1 font-medium">Sizning xabaringiz:</p>
            <p className="text-sm text-surface-300 whitespace-pre-wrap">{selectedTicket.message}</p>
          </div>

          {/* Admin reply */}
          {selectedTicket.adminReply ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-xs text-emerald-400 mb-1 font-medium">Admin javobi:</p>
              <p className="text-sm text-surface-300 whitespace-pre-wrap">{selectedTicket.adminReply}</p>
              {selectedTicket.repliedAt && (
                <p className="text-xs text-surface-500 mt-2">
                  {new Date(selectedTicket.repliedAt).toLocaleString('uz-UZ')}
                </p>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
              <Clock size={20} className="text-amber-400 mx-auto mb-2" />
              <p className="text-sm text-surface-400">Javob kutilmoqda...</p>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="text-surface-400 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
              <MessageCircle size={24} className="text-primary-400" />
              Yordam markazi
            </h2>
            <p className="text-surface-400 text-sm mt-1">Muammo yoki savolingiz bormi?</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus size={14} /> Yangi murojaat
        </button>
      </div>

      {/* Success message */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3"
        >
          <CheckCircle size={18} className="text-emerald-400" />
          <p className="text-sm text-emerald-300">{success}</p>
        </motion.div>
      )}

      {/* New ticket form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="glass p-6 space-y-4 overflow-hidden"
          >
            <h3 className="text-base font-semibold text-white">Yangi murojaat</h3>

            <div>
              <label className="text-xs text-surface-400 mb-1.5 block">Mavzu *</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Masalan: Shablon yuklanmayapti"
                className="input-field w-full"
                maxLength={200}
              />
            </div>

            <div>
              <label className="text-xs text-surface-400 mb-1.5 block">Xabar *</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Muammoingizni batafsil yozing..."
                className="input-field w-full min-h-[120px] resize-y"
                maxLength={2000}
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 flex items-center gap-1.5">
                <AlertCircle size={14} /> {error}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary text-sm"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                disabled={sending || !subject.trim() || !message.trim()}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                Yuborish
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Tickets list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 text-primary-400 animate-spin" />
        </div>
      ) : tickets.length === 0 ? (
        <div className="glass p-12 text-center">
          <MessageCircle size={40} className="text-surface-600 mx-auto mb-4" />
          <p className="text-surface-400">Hozircha murojaatingiz yo'q</p>
          <p className="text-surface-600 text-sm mt-1">Muammo bo'lsa, yuqoridagi tugmani bosing</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tickets.map((ticket) => (
            <motion.button
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              whileHover={{ scale: 1.01 }}
              className="w-full text-left p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]
                hover:bg-white/[0.04] hover:border-white/[0.12] transition-all flex items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {statusIcon(ticket.status)}
                  <h4 className="text-sm font-medium text-white truncate">{ticket.subject}</h4>
                </div>
                <p className="text-xs text-surface-500 truncate">{ticket.message}</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-surface-600">
                  <span>{new Date(ticket.createdAt).toLocaleDateString('uz-UZ')}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                    ticket.status === 'answered'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : ticket.status === 'open'
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'bg-white/5 text-surface-500'
                  }`}>
                    {statusLabel(ticket.status)}
                  </span>
                </div>
              </div>
              <ChevronRight size={16} className="text-surface-600 flex-shrink-0" />
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
