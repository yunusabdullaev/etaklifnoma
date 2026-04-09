import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ExternalLink, Copy, Eye, Calendar, MapPin, Clock, Trash2, Check, LayoutGrid } from 'lucide-react';

export default function Dashboard({ token, onCreateNew }) {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState(null);

  const API = import.meta.env.VITE_API_URL || '';
  const APP_URL = window.location.origin.replace(':5173', ':3000');

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const res = await fetch(`${API}/api/invitations/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setInvitations(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching invitations:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = (slug) => {
    const url = `${APP_URL}/invite/${slug}/view`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const deleteInvitation = async (id) => {
    if (!confirm('Bu taklifnomani o\'chirmoqchimisiz?')) return;
    try {
      await fetch(`${API}/api/invitations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvitations(prev => prev.filter(inv => inv.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const eventIcons = {
    wedding: '💍',
    birthday: '🎂',
    graduation: '🎓',
    jubilee: '🎉',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <LayoutGrid size={24} className="text-primary-400" />
            Mening taklifnomalarim
          </h2>
          <p className="text-surface-400 text-sm mt-1">
            {invitations.length > 0
              ? `Jami: ${invitations.length} ta taklifnoma`
              : 'Hali taklifnoma yaratilmagan'}
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className="btn-primary flex items-center gap-2 px-5 py-2.5"
        >
          <Plus size={16} />
          Yangi yaratish
        </button>
      </div>

      {/* Empty state */}
      {invitations.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-12 text-center"
        >
          <div className="text-6xl mb-4">📨</div>
          <h3 className="text-xl font-display font-semibold text-white mb-2">
            Hali taklifnoma yo'q
          </h3>
          <p className="text-surface-400 text-sm mb-6 max-w-md mx-auto">
            Birinchi premium taklifnomangizni yarating — to'y, tug'ilgan kun, yubiley yoki bitiruvchilar kechasi uchun!
          </p>
          <button
            onClick={onCreateNew}
            className="btn-primary inline-flex items-center gap-2 px-6 py-3"
          >
            <Plus size={18} />
            Taklifnoma yaratish
          </button>
        </motion.div>
      )}

      {/* Invitations grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {invitations.map((inv, i) => (
            <motion.div
              key={inv.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              className="glass group hover:border-primary-500/30 transition-all duration-300"
            >
              {/* Card header with event type badge */}
              <div className="p-4 pb-3 border-b border-white/5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {eventIcons[inv.eventType?.name] || '📨'}
                    </span>
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-primary-400">
                        {inv.eventType?.label || 'Taklif'}
                      </span>
                      <h3 className="text-white font-semibold text-sm leading-tight mt-0.5">
                        {inv.eventTitle || inv.hostName || 'Taklifnoma'}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-surface-500 text-[10px]">
                    <Eye size={10} />
                    {inv.viewCount || 0}
                  </div>
                </div>
              </div>

              {/* Card body */}
              <div className="p-4 space-y-2.5">
                {inv.eventDate && (
                  <div className="flex items-center gap-2 text-xs text-surface-300">
                    <Calendar size={12} className="text-primary-400 flex-shrink-0" />
                    {formatDate(inv.eventDate)}
                  </div>
                )}
                {inv.eventTime && (
                  <div className="flex items-center gap-2 text-xs text-surface-300">
                    <Clock size={12} className="text-primary-400 flex-shrink-0" />
                    {inv.eventTime}
                  </div>
                )}
                {inv.location && (
                  <div className="flex items-center gap-2 text-xs text-surface-300">
                    <MapPin size={12} className="text-primary-400 flex-shrink-0" />
                    <span className="truncate">{inv.location}</span>
                  </div>
                )}
                {inv.template && (
                  <div className="text-[10px] text-surface-500 bg-white/5 inline-block px-2 py-0.5 rounded-full">
                    🎨 {inv.template.name}
                  </div>
                )}
              </div>

              {/* Card actions */}
              <div className="p-3 pt-0 flex gap-2">
                <a
                  href={`${APP_URL}/invite/${inv.slug}/view`}
                  target="_blank"
                  rel="noopener"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg
                    bg-primary-500/10 text-primary-400 text-xs font-medium
                    hover:bg-primary-500/20 transition-colors"
                >
                  <ExternalLink size={12} />
                  Ko'rish
                </a>
                <button
                  onClick={() => copyLink(inv.slug)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
                    copiedSlug === inv.slug
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-white/5 text-surface-300 hover:bg-white/10'
                  }`}
                >
                  {copiedSlug === inv.slug ? <Check size={12} /> : <Copy size={12} />}
                  {copiedSlug === inv.slug ? 'Nusxalandi!' : 'Link nusxalash'}
                </button>
                <button
                  onClick={() => deleteInvitation(inv.id)}
                  className="p-2 rounded-lg text-surface-500 hover:text-rose-400 hover:bg-rose-400/10 transition-all"
                  title="O'chirish"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
