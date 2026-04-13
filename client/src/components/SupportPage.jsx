import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, Send, ArrowLeft, Clock, CheckCircle,
  XCircle, Loader2, Plus, ChevronRight
} from 'lucide-react';

export default function SupportPage({ token, onBack }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [activeTicket, setActiveTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [subject, setSubject] = useState('');
  const [newMsg, setNewMsg] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState('');

  const chatEndRef = useRef(null);
  const API = import.meta.env.VITE_API_URL || '';

  // Fetch tickets list
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for active ticket
  const fetchMessages = async (ticketId) => {
    try {
      const res = await fetch(`${API}/api/support/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.data) {
        setMessages(data.data.messages || []);
        setActiveTicket(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchTickets(); }, []);

  // Poll for new messages when in chat view
  useEffect(() => {
    if (!activeTicket) return;
    const interval = setInterval(() => fetchMessages(activeTicket.id), 5000);
    return () => clearInterval(interval);
  }, [activeTicket?.id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // Create new ticket
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !newMsg.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`${API}/api/support`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ subject: subject.trim(), message: newMsg.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setSubject('');
        setNewMsg('');
        setShowForm(false);
        setSuccess('Murojaat yuborildi!');
        setTimeout(() => setSuccess(''), 2000);
        await fetchTickets();
        // Open the new ticket chat
        if (data.data?.ticket?.id) {
          await fetchMessages(data.data.ticket.id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  // Send chat message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !activeTicket) return;
    setSending(true);
    try {
      await fetch(`${API}/api/support/${activeTicket.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text: newMsg.trim() }),
      });
      setNewMsg('');
      await fetchMessages(activeTicket.id);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const statusBadge = (status) => {
    const styles = {
      open: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      answered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      closed: 'bg-surface-800 text-surface-500 border-white/5',
    };
    const labels = { open: 'Kutilmoqda', answered: 'Javob berildi', closed: 'Yopilgan' };
    return (
      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${styles[status] || ''}`}>
        {labels[status] || status}
      </span>
    );
  };

  // ═══════════════ CHAT VIEW ═══════════════
  if (activeTicket) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col h-[calc(100vh-200px)] max-h-[700px]"
      >
        {/* Chat header */}
        <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06]">
          <button
            onClick={() => { setActiveTicket(null); setMessages([]); fetchTickets(); }}
            className="text-surface-400 hover:text-white transition-colors p-1"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white truncate">{activeTicket.subject}</h3>
            <p className="text-xs text-surface-500">#{activeTicket.id?.slice(0, 8)}</p>
          </div>
          {statusBadge(activeTicket.status)}
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 scrollbar-thin">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-surface-500 text-sm">
              Xabarlar yuklanmoqda...
            </div>
          ) : (
            messages.map((msg, i) => (
              <motion.div
                key={msg.id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                  msg.sender === 'user'
                    ? 'bg-primary-500/20 border border-primary-500/30 rounded-br-md'
                    : 'bg-white/[0.05] border border-white/[0.08] rounded-bl-md'
                }`}>
                  <p className="text-sm text-surface-200 whitespace-pre-wrap">{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${
                    msg.sender === 'user' ? 'text-primary-400/50' : 'text-surface-600'
                  }`}>
                    {msg.sender === 'admin' ? '🛟 Support · ' : ''}
                    {new Date(msg.createdAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Message input */}
        <form onSubmit={handleSendMessage} className="pt-3 border-t border-white/[0.06]">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              placeholder="Xabar yozing..."
              className="input-field flex-1 !rounded-full !py-2.5 !px-4 text-sm"
              autoFocus
            />
            <button
              type="submit"
              disabled={sending || !newMsg.trim()}
              className="w-10 h-10 rounded-full bg-primary-500 hover:bg-primary-400 disabled:bg-surface-700 
                disabled:text-surface-500 text-white flex items-center justify-center transition-all
                shadow-lg shadow-primary-500/20 disabled:shadow-none"
            >
              {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
        </form>
      </motion.div>
    );
  }

  // ═══════════════ TICKETS LIST VIEW ═══════════════
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

      {/* Success */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 
              flex items-center gap-2 text-sm text-emerald-300"
          >
            <CheckCircle size={16} /> {success}
          </motion.div>
        )}
      </AnimatePresence>

      {/* New ticket form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreateTicket}
            className="glass p-5 space-y-3 overflow-hidden"
          >
            <h3 className="text-sm font-semibold text-white">Yangi murojaat</h3>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Mavzu: Masalan, Shablon yuklanmayapti"
              className="input-field w-full"
              maxLength={200}
            />
            <textarea
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              placeholder="Muammoingizni batafsil yozing..."
              className="input-field w-full min-h-[100px] resize-y"
              maxLength={2000}
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm">
                Bekor qilish
              </button>
              <button
                type="submit"
                disabled={sending || !subject.trim() || !newMsg.trim()}
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
          <MessageCircle size={40} className="text-surface-600 mx-auto mb-3" />
          <p className="text-surface-400 text-sm">Hozircha murojaatingiz yo'q</p>
          <p className="text-surface-600 text-xs mt-1">Muammo bo'lsa, yuqoridagi tugmani bosing</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tickets.map((ticket) => {
            const lastMsg = ticket.messages?.[0];
            return (
              <motion.button
                key={ticket.id}
                onClick={async () => {
                  setChatLoading(true);
                  await fetchMessages(ticket.id);
                  setChatLoading(false);
                }}
                whileHover={{ scale: 1.005 }}
                className="w-full text-left p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]
                  hover:bg-white/[0.05] hover:border-white/[0.12] transition-all flex items-center gap-3"
              >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  ticket.status === 'answered'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : ticket.status === 'open'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-white/5 text-surface-500'
                }`}>
                  {ticket.status === 'answered' ? <CheckCircle size={18} /> :
                   ticket.status === 'open' ? <Clock size={18} /> : <XCircle size={18} />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-medium text-white truncate">{ticket.subject}</h4>
                    {statusBadge(ticket.status)}
                  </div>
                  <p className="text-xs text-surface-500 truncate mt-0.5">
                    {lastMsg ? `${lastMsg.sender === 'admin' ? '🛟 ' : ''}${lastMsg.text}` : ticket.message}
                  </p>
                  <p className="text-[10px] text-surface-600 mt-1">
                    {new Date(ticket.updatedAt || ticket.createdAt).toLocaleDateString('uz-UZ')}
                  </p>
                </div>

                <ChevronRight size={16} className="text-surface-600 flex-shrink-0" />
              </motion.button>
            );
          })}
        </div>
      )}

      {chatLoading && (
        <div className="fixed inset-0 bg-surface-950/60 z-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
        </div>
      )}
    </motion.div>
  );
}
