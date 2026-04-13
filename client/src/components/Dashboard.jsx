import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ExternalLink, Copy, Eye, Calendar, MapPin, Clock, Trash2, Check, LayoutGrid, Pencil, X, Save, Loader2 } from 'lucide-react';
import { useLang } from '../i18n';

export default function Dashboard({ token, onCreateNew }) {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState(null);
  const [editingInv, setEditingInv] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');

  const API = import.meta.env.VITE_API_URL || '';
  const APP_URL = window.location.origin;
  const { t } = useLang();

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
    if (!confirm(t('dashboard.deleteConfirm'))) return;
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

  // Open edit modal
  const openEdit = (inv) => {
    setEditForm({
      hostName: inv.hostName || '',
      guestName: inv.guestName || '',
      eventTitle: inv.eventTitle || '',
      eventTime: inv.eventTime || '',
      location: inv.location || '',
      locationUrl: inv.locationUrl || '',
      message: inv.message || '',
    });
    setEditingInv(inv);
  };

  // Save edits
  const saveEdit = async () => {
    if (!editingInv) return;
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/invitations/${editingInv.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (data.success) {
        await fetchInvitations();
        setEditingInv(null);
        setSaveSuccess(t('dashboard.editSaved'));
        setTimeout(() => setSaveSuccess(''), 2000);
      }
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
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
            {t('dashboard.title')}
          </h2>
          <p className="text-surface-400 text-sm mt-1">
            {invitations.length > 0
              ? `${invitations.length} ${t('dashboard.total')}`
              : t('dashboard.empty')}
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className="btn-primary flex items-center gap-2 px-5 py-2.5"
        >
          <Plus size={16} />
          {t('dashboard.newBtn')}
        </button>
      </div>

      {/* Save success */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-sm text-emerald-300">
            <Check size={16} /> {saveSuccess}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {invitations.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-12 text-center"
        >
          <div className="text-6xl mb-4">📨</div>
          <h3 className="text-xl font-display font-semibold text-white mb-2">
            {t('dashboard.emptyTitle')}
          </h3>
          <p className="text-surface-400 text-sm mb-6 max-w-md mx-auto">
            {t('dashboard.emptyDesc')}
          </p>
          <button
            onClick={onCreateNew}
            className="btn-primary inline-flex items-center gap-2 px-6 py-3"
          >
            <Plus size={18} />
            {t('dashboard.createBtn')}
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
              {/* Card header */}
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
                  {t('dashboard.view')}
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
                  {copiedSlug === inv.slug ? t('dashboard.copied') : t('dashboard.copyLink')}
                </button>
                <button
                  onClick={() => openEdit(inv)}
                  className="p-2 rounded-lg text-surface-500 hover:text-amber-400 hover:bg-amber-400/10 transition-all"
                  title={t('dashboard.edit')}
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => deleteInvitation(inv.id)}
                  className="p-2 rounded-lg text-surface-500 hover:text-rose-400 hover:bg-rose-400/10 transition-all"
                  title={t('dashboard.delete')}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingInv && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/80 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setEditingInv(null); }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="glass w-full max-w-lg max-h-[80vh] overflow-y-auto"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
                <h3 className="text-lg font-display font-semibold text-white flex items-center gap-2">
                  <Pencil size={18} className="text-amber-400" />
                  {t('dashboard.editTitle')}
                </h3>
                <button onClick={() => setEditingInv(null)} className="text-surface-500 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <div className="p-5 space-y-4">
                {/* Date — readonly */}
                <div>
                  <label className="text-xs text-surface-400 mb-1.5 block">{t('step3.date')} 🔒</label>
                  <div className="input-field w-full !bg-white/[0.03] !text-surface-500 !cursor-not-allowed">
                    {formatDate(editingInv.eventDate)}
                  </div>
                </div>

                {/* Time — editable */}
                <div>
                  <label className="text-xs text-surface-400 mb-1.5 block">{t('step3.time')}</label>
                  <input
                    type="time"
                    value={editForm.eventTime}
                    onChange={(e) => setEditForm(p => ({ ...p, eventTime: e.target.value }))}
                    className="input-field w-full"
                  />
                </div>

                {/* Host name */}
                <div>
                  <label className="text-xs text-surface-400 mb-1.5 block">{t('step3.hostName')}</label>
                  <input
                    type="text"
                    value={editForm.hostName}
                    onChange={(e) => setEditForm(p => ({ ...p, hostName: e.target.value }))}
                    className="input-field w-full"
                  />
                </div>

                {/* Event title */}
                <div>
                  <label className="text-xs text-surface-400 mb-1.5 block">{t('step3.eventTitle')}</label>
                  <input
                    type="text"
                    value={editForm.eventTitle}
                    onChange={(e) => setEditForm(p => ({ ...p, eventTitle: e.target.value }))}
                    className="input-field w-full"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="text-xs text-surface-400 mb-1.5 block">{t('step3.location')}</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm(p => ({ ...p, location: e.target.value }))}
                    className="input-field w-full"
                  />
                </div>

                {/* Location URL */}
                <div>
                  <label className="text-xs text-surface-400 mb-1.5 block">{t('step3.locationUrl')}</label>
                  <input
                    type="url"
                    value={editForm.locationUrl}
                    onChange={(e) => setEditForm(p => ({ ...p, locationUrl: e.target.value }))}
                    className="input-field w-full"
                    placeholder="https://maps.google.com/..."
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="text-xs text-surface-400 mb-1.5 block">{t('step3.message')}</label>
                  <textarea
                    value={editForm.message}
                    onChange={(e) => setEditForm(p => ({ ...p, message: e.target.value }))}
                    className="input-field w-full min-h-[80px] resize-y"
                  />
                </div>
              </div>

              {/* Modal footer */}
              <div className="p-5 pt-0 flex justify-end gap-2">
                <button onClick={() => setEditingInv(null)} className="btn-secondary text-sm">
                  {t('support.cancel')}
                </button>
                <button onClick={saveEdit} disabled={saving} className="btn-primary flex items-center gap-2 text-sm">
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  {t('dashboard.save')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
