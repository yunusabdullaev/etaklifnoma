import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ExternalLink, Copy, Eye, Calendar, MapPin, Clock, Trash2, Check, LayoutGrid, Pencil, X, Save, Loader2, QrCode, Users, Download, UserCheck, UserX, HelpCircle, MessageSquare, Copy as CopyIcon, Share2, Send } from 'lucide-react';
import { useLang } from '../i18n';

export default function Dashboard({ token, onCreateNew, onContinueDraft }) {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState(null);
  const [editingInv, setEditingInv] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [qrModal, setQrModal] = useState(null); // { slug, qrCode, url }
  const [rsvpModal, setRsvpModal] = useState(null); // { slug, rsvps, stats }
  const [wishesModal, setWishesModal] = useState(null); // { slug, wishes }
  const [duplicating, setDuplicating] = useState(null); // slug being duplicated
  const [hasDraft, setHasDraft] = useState(false);

  const API = import.meta.env.VITE_API_URL || '';
  const APP_URL = window.location.origin;
  const { t, lang } = useLang();


  const handleCreateNew = () => {
    let defaultSettings = null;
    if (invitations && invitations.length > 0) {
      const lastInv = invitations[0];
      if (lastInv.customFields) {
        defaultSettings = {
          telegramChatId: lastInv.customFields.telegramChatId,
          telegramBot: lastInv.customFields.telegramBot,
          langUz: lastInv.customFields.langUz,
          langQq: lastInv.customFields.langQq,
          langRu: lastInv.customFields.langRu,
          defaultLang: lastInv.customFields.defaultLang, langOrder: lastInv.customFields.langOrder,
          showShareWa: lastInv.customFields.showShareWa,
          showShareTg: lastInv.customFields.showShareTg,
          showCalendarBtn: lastInv.customFields.showCalendarBtn,
          showPrintBtn: lastInv.customFields.showPrintBtn,
          enableWishes: lastInv.customFields.enableWishes,
          musicUrl: lastInv.customFields.musicUrl,
        };
      }
    }
    onCreateNew(defaultSettings);
  };

  useEffect(() => { 
    try {
      const draft = localStorage.getItem('etaklifnoma_wizard_draft');
      if (draft && JSON.parse(draft).step) setHasDraft(true);
    } catch(e){}
    fetchInvitations(); 
  }, []);

  const fetchInvitations = async () => {
    try {
      const res = await fetch(`${API}/api/invitations/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setInvitations(data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const copyLink = (slug) => {
    const url = `${APP_URL}/invite/${slug}/view`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const shareViaWhatsApp = (slug, title) => {
    const url = `${APP_URL}/invite/${slug}/view`;
    const text = encodeURIComponent(`💍 ${title || 'Taklifnoma'}\n${url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareViaTelegram = (slug, title) => {
    const url = encodeURIComponent(`${APP_URL}/invite/${slug}/view`);
    const text = encodeURIComponent(`💍 ${title || 'Taklifnoma'}`);
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
  };

  const deleteInvitation = async (id) => {
    if (!confirm(t('dashboard.deleteConfirm'))) return;
    try {
      await fetch(`${API}/api/invitations/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      setInvitations(prev => prev.filter(inv => inv.id !== id));
    } catch (err) { console.error(err); }
  };

  const openEdit = (inv) => {
    setEditForm({
      hostName: inv.hostName || '', guestName: inv.guestName || '',
      eventTitle: inv.eventTitle || '', eventTime: inv.eventTime || '',
      location: inv.location || '', locationUrl: inv.locationUrl || '',
      message: inv.message || '',
      enableRsvp: inv.customFields?.enableRsvp !== false,
    });
    setEditingInv(inv);
  };

  const saveEdit = async () => {
    if (!editingInv) return;
    setSaving(true);
    try {
      const { enableRsvp, ...fields } = editForm;
      const res = await fetch(`${API}/api/invitations/${editingInv.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...fields, customFields: { ...editingInv.customFields, enableRsvp } }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchInvitations();
        setEditingInv(null);
        setSaveSuccess(t('dashboard.editSaved'));
        setTimeout(() => setSaveSuccess(''), 2000);
      }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  // QR Code — premium branded card
  const openQr = async (slug) => {
    try {
      const res = await fetch(`${API}/api/invitations/${slug}/qr`);
      const data = await res.json();
      if (data.success) {
        // Generate premium QR card with branding
        const qrImg = new Image();
        qrImg.crossOrigin = 'anonymous';
        qrImg.onload = () => {
          const canvas = document.createElement('canvas');
          const W = 600, H = 720;
          canvas.width = W; canvas.height = H;
          const ctx = canvas.getContext('2d');

          // Background gradient
          const bg = ctx.createLinearGradient(0, 0, W, H);
          bg.addColorStop(0, '#0b0d17');
          bg.addColorStop(1, '#141830');
          ctx.fillStyle = bg;
          ctx.beginPath();
          ctx.roundRect(0, 0, W, H, 24);
          ctx.fill();

          // Gold border
          const border = ctx.createLinearGradient(0, 0, W, 0);
          border.addColorStop(0, '#d4a853');
          border.addColorStop(0.5, '#f5d89a');
          border.addColorStop(1, '#d4a853');
          ctx.strokeStyle = border;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(8, 8, W - 16, H - 16, 20);
          ctx.stroke();

          // Top decorative line
          ctx.fillStyle = '#d4a85340';
          ctx.fillRect(W / 2 - 50, 32, 100, 2);

          // Title — Russian
          ctx.fillStyle = '#d4a853';
          ctx.font = 'bold 24px "Montserrat", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('ПРИГЛАШЕНИЕ', W / 2, 70);

          // Subtitle — Russian
          ctx.fillStyle = '#8b8fa3';
          ctx.font = '16px "Montserrat", sans-serif';
          ctx.fillText('Премиум цифровое приглашение', W / 2, 98);

          // QR white card background
          const qrSize = 400;
          const qrX = (W - qrSize) / 2, qrY = 125;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.roundRect(qrX, qrY, qrSize, qrSize, 16);
          ctx.fill();

          // QR shadow
          ctx.shadowColor = 'rgba(212, 168, 83, 0.15)';
          ctx.shadowBlur = 30;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.roundRect(qrX, qrY, qrSize, qrSize, 16);
          ctx.fill();
          ctx.shadowBlur = 0;

          // QR code image
          ctx.drawImage(qrImg, qrX + 25, qrY + 25, qrSize - 50, qrSize - 50);

          // Scan text — Russian
          ctx.fillStyle = '#9ca3af';
          ctx.font = '16px "Montserrat", sans-serif';
          ctx.fillText('Отсканируйте камерой телефона', W / 2, qrY + qrSize + 35);

          // Bottom decorative line
          ctx.fillStyle = '#d4a85340';
          ctx.fillRect(W / 2 - 60, qrY + qrSize + 55, 120, 1);

          // Brand
          ctx.fillStyle = '#d4a853';
          ctx.font = 'bold 28px "Montserrat", sans-serif';
          ctx.fillText('eTaklifnoma.uz', W / 2, H - 55);

          // Bottom tagline — Russian
          ctx.fillStyle = '#6b7280';
          ctx.font = '13px "Montserrat", sans-serif';
          ctx.fillText('Сервис премиум приглашений', W / 2, H - 28);

          setQrModal({ ...data.data, qrCode: canvas.toDataURL('image/png') });
        };
        qrImg.src = data.data.qrCode;
      }
    } catch (err) { console.error(err); }
  };

  const downloadQr = () => {
    if (!qrModal?.qrCode) return;
    const a = document.createElement('a');
    a.href = qrModal.qrCode;
    a.download = `taklifnoma-qr-${Date.now()}.png`;
    a.click();
  };

  // RSVP
  const openRsvp = async (slug) => {
    try {
      const res = await fetch(`${API}/api/invitations/${slug}/rsvp`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setRsvpModal({ slug, ...data.data });
    } catch (err) { console.error(err); }
  };

  // Wishes Modal
  const openWishes = async (slug) => {
    try {
      const res = await fetch(`${API}/api/wishes/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setWishesModal({ slug, wishes: data.data || [] });
    } catch (err) { console.error(err); }
  };

  // Duplicate Invitation
  const duplicateInvitation = async (inv) => {
    if (duplicating) return;
    setDuplicating(inv.slug);
    try {
      const res = await fetch(`${API}/api/invitations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          eventTypeId: inv.eventTypeId,
          templateId: inv.templateId,
          hostName: inv.hostName,
          guestName: inv.guestName || undefined,
          eventTitle: inv.eventTitle ? `${inv.eventTitle} (nusxa)` : undefined,
          eventDate: inv.eventDate,
          eventTime: inv.eventTime || undefined,
          location: inv.location,
          locationUrl: inv.locationUrl || undefined,
          message: inv.message || undefined,
          customFields: inv.customFields || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchInvitations();
        setSaveSuccess('📋 Nusxa yaratildi!');
        setTimeout(() => setSaveSuccess(''), 3000);
      }
    } catch (err) { console.error(err); }
    finally { setDuplicating(null); }
  };

  const localeMap = { uz: 'uz-UZ', qq: 'kk-KZ', ru: 'ru-RU', en: 'en-US' };
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const locale = localeMap[lang] || 'en-US';
    return new Date(dateStr).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    return timeStr.substring(0, 5); // "20:00:00" → "20:00"
  };

  // Event type translations for dashboard
  const eventTypeLabels = {
    wedding: { uz: "To'y taklifi", qq: 'Toy shaqırıwı', ru: 'Свадьба', en: 'Wedding' },
    birthday: { uz: "Tug'ilgan kun", qq: 'Tuwılǵan kún', ru: 'День рождения', en: 'Birthday' },
    jubilee: { uz: 'Yubiley', qq: 'Yubilej', ru: 'Юбилей', en: 'Anniversary' },
    graduation: { uz: 'Bitiruvchilar', qq: 'Pitkeriwshiler', ru: 'Выпускной', en: 'Graduation' },
  };
  const getEventLabel = (inv) => {
    const name = inv.eventType?.name;
    return eventTypeLabels[name]?.[lang] || inv.eventType?.label || 'Invitation';
  };

  const eventIcons = { wedding: '💍', birthday: '🎂', graduation: '🎓', jubilee: '🎉' };

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
            {invitations.length > 0 ? `${invitations.length} ${t('dashboard.total')}` : t('dashboard.empty')}
          </p>
        </div>
        <div className="flex gap-3">
          {hasDraft && (
            <button onClick={onContinueDraft} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all text-accent-400 bg-accent-500/10 border border-accent-500/20 hover:bg-accent-500/20 shadow-sm shadow-accent-500/10">
              <Pencil size={16} /> Davom etish
            </button>
          )}
          <button onClick={handleCreateNew} className="btn-primary flex items-center gap-2 px-5 py-2.5">
            <Plus size={16} /> {t('dashboard.newBtn')}
          </button>
        </div>
      </div>

      {/* Success */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-sm text-emerald-300">
            <Check size={16} /> {saveSuccess}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty */}
      {invitations.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-12 text-center">
          <div className="text-6xl mb-4">📨</div>
          <h3 className="text-xl font-display font-semibold text-white mb-2">{t('dashboard.emptyTitle')}</h3>
          <p className="text-surface-400 text-sm mb-6 max-w-md mx-auto">{t('dashboard.emptyDesc')}</p>
          <div className="flex justify-center gap-3">
            {hasDraft && (
              <button onClick={onContinueDraft} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all text-accent-400 bg-accent-500/10 border border-accent-500/20 hover:bg-accent-500/20">
                <Pencil size={18} /> Davom etish
              </button>
            )}
            <button onClick={handleCreateNew} className="btn-primary inline-flex items-center gap-2 px-6 py-3">
              <Plus size={18} /> {t('dashboard.createBtn')}
            </button>
          </div>
        </motion.div>
      )}

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {invitations.map((inv, i) => (
            <motion.div key={inv.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.05 }}
              className="glass group hover:border-primary-500/30 transition-all duration-300">

              <div className="p-4 pb-3 border-b border-white/5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{eventIcons[inv.eventType?.name] || '📨'}</span>
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-primary-400">
                        {getEventLabel(inv)}
                      </span>
                      <h3 className="text-white font-semibold text-sm leading-tight mt-0.5">
                        {inv.eventTitle || inv.hostName || 'Taklifnoma'}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {/* Expired badge */}
                    {inv.eventDate && new Date(inv.eventDate) < new Date(new Date().toDateString()) && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/20">{t('dashboard.expired') || "O'tgan"}</span>
                    )}
                    <span className={`flex items-center gap-1 text-[10px] font-medium ${
                      (inv.viewCount || 0) > 10 ? 'text-emerald-400' :
                      (inv.viewCount || 0) > 0 ? 'text-amber-400' : 'text-surface-500'
                    }`}>
                      <Eye size={10} /> {inv.viewCount || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-2.5">
                {inv.eventDate && (
                  <div className="flex items-center gap-2 text-xs text-surface-300">
                    <Calendar size={12} className="text-primary-400 flex-shrink-0" /> {formatDate(inv.eventDate)}
                  </div>
                )}
                {inv.eventTime && (
                  <div className="flex items-center gap-2 text-xs text-surface-300">
                    <Clock size={12} className="text-primary-400 flex-shrink-0" /> {formatTime(inv.eventTime)}
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

              {/* ── Share Panel ── */}
              <div className="px-3 pb-1">
                <p className="text-[9px] font-semibold uppercase tracking-widest text-surface-600 mb-1.5">📤 {t('dashboard.share') || 'Ulashish'}</p>
                <div className="flex gap-1.5">
                  {/* WhatsApp */}
                  <button
                    onClick={() => shareViaWhatsApp(inv.slug, inv.eventTitle || inv.hostName)}
                    title={t('dashboard.shareWa') || 'WhatsApp'}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-[11px] font-medium
                      bg-emerald-500/10 text-emerald-400 border border-emerald-500/15
                      hover:bg-emerald-500/20 hover:border-emerald-500/30 transition-all"
                  >
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12.004 2c-5.514 0-9.993 4.478-9.993 9.993 0 1.76.463 3.464 1.344 4.97L2 22l5.184-1.361a9.945 9.945 0 004.82 1.232h.004c5.512 0 9.991-4.48 9.991-9.994 0-2.67-1.039-5.18-2.927-7.069A9.952 9.952 0 0012.004 2z"/></svg>
                    {t('dashboard.shareWa') || 'WhatsApp'}
                  </button>

                  {/* Telegram */}
                  <button
                    onClick={() => shareViaTelegram(inv.slug, inv.eventTitle || inv.hostName)}
                    title={t('dashboard.shareTg') || 'Telegram'}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-[11px] font-medium
                      bg-sky-500/10 text-sky-400 border border-sky-500/15
                      hover:bg-sky-500/20 hover:border-sky-500/30 transition-all"
                  >
                    <Send size={11} />
                    {t('dashboard.shareTg') || 'Telegram'}
                  </button>

                  {/* Copy Link */}
                  <button
                    onClick={() => copyLink(inv.slug)}
                    title={t('dashboard.shareLink') || 'Link nusxalash'}
                    className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-[11px] font-medium border transition-all ${
                      copiedSlug === inv.slug
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
                        : 'bg-white/[0.04] text-surface-400 border-white/[0.06] hover:bg-white/[0.08] hover:text-white'
                    }`}
                  >
                    {copiedSlug === inv.slug ? <Check size={11} /> : <Copy size={11} />}
                    {copiedSlug === inv.slug ? (t('dashboard.linkCopied') || 'Nusxalandi!') : (t('dashboard.shareLink') || 'Link')}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="p-3 pt-1 flex gap-2 flex-wrap">
                <a href={`${APP_URL}/invite/${inv.slug}/view`} target="_blank" rel="noopener"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg
                    bg-primary-500/10 text-primary-400 text-xs font-medium hover:bg-primary-500/20 transition-colors">
                  <ExternalLink size={12} /> {t('dashboard.view')}
                </a>
              </div>
              <div className="px-3 pb-3 flex gap-1.5">
                <button onClick={() => openQr(inv.slug)} title="QR Kod"
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] text-surface-400 bg-white/[0.03] hover:bg-white/[0.08] hover:text-white transition-all">
                  <QrCode size={12} /> QR
                </button>
                <button onClick={() => openRsvp(inv.slug)} title="RSVP"
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] text-surface-400 bg-white/[0.03] hover:bg-white/[0.08] hover:text-white transition-all">
                  <Users size={12} /> RSVP
                </button>
                <button onClick={() => openWishes(inv.slug)} title="Tabriklar"
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] text-surface-400 bg-white/[0.03] hover:bg-white/[0.08] hover:text-primary-300 transition-all">
                  <MessageSquare size={12} /> 💌
                </button>
                <button onClick={() => duplicateInvitation(inv)} title="Nusxa olish" disabled={duplicating === inv.slug}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] text-surface-400 bg-white/[0.03] hover:bg-white/[0.08] hover:text-amber-300 transition-all disabled:opacity-40">
                  {duplicating === inv.slug ? <Loader2 size={12} className="animate-spin" /> : <Copy size={12} />}
                  📋
                </button>
                <button onClick={() => openEdit(inv)} title={t('dashboard.edit')}
                  className="p-1.5 rounded-lg text-surface-500 hover:text-amber-400 hover:bg-amber-400/10 transition-all">
                  <Pencil size={12} />
                </button>
                <button onClick={() => deleteInvitation(inv.id)} title={t('dashboard.delete')}
                  className="p-1.5 rounded-lg text-surface-500 hover:text-rose-400 hover:bg-rose-400/10 transition-all">
                  <Trash2 size={12} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ═══ QR MODAL — PREMIUM ═══ */}
      <AnimatePresence>
        {qrModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/80 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setQrModal(null); }}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="glass w-full max-w-sm text-center p-6 border border-amber-500/20">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-display font-semibold bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">📱 QR Kod</h3>
                <button onClick={() => setQrModal(null)} className="text-surface-500 hover:text-white"><X size={18} /></button>
              </div>
              <div className="rounded-2xl overflow-hidden mb-5 border border-amber-500/10 shadow-xl shadow-amber-500/5">
                <img src={qrModal.qrCode} alt="QR Code" className="w-full" />
              </div>
              <button onClick={downloadQr}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                  bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold
                  shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all">
                <Download size={16} /> Yuklab olish (PNG)
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ RSVP MODAL ═══ */}
      <AnimatePresence>
        {rsvpModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/80 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setRsvpModal(null); }}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="glass w-full max-w-lg max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center p-5 border-b border-white/[0.06]">
                <h3 className="text-lg font-display font-semibold text-white flex items-center gap-2">
                  <Users size={20} className="text-primary-400" /> RSVP — Mehmonlar
                </h3>
                <button onClick={() => setRsvpModal(null)} className="text-surface-500 hover:text-white"><X size={18} /></button>
              </div>

              {/* Stats */}
              {rsvpModal.stats && (
                <div className="grid grid-cols-4 gap-2 p-5 pb-0">
                  <div className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <p className="text-2xl font-bold text-white">{rsvpModal.stats.total}</p>
                    <p className="text-[10px] text-surface-500 mt-1">Jami</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                    <p className="text-2xl font-bold text-emerald-400">{rsvpModal.stats.attending}</p>
                    <p className="text-[10px] text-emerald-400/50 mt-1">Keladi</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                    <p className="text-2xl font-bold text-amber-400">{rsvpModal.stats.maybe}</p>
                    <p className="text-[10px] text-amber-400/50 mt-1">Noaniq</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-rose-500/5 border border-rose-500/10">
                    <p className="text-2xl font-bold text-rose-400">{rsvpModal.stats.notAttending}</p>
                    <p className="text-[10px] text-rose-400/50 mt-1">Kelmaydi</p>
                  </div>
                </div>
              )}

              {rsvpModal.stats?.totalGuests > 0 && (
                <div className="mx-5 mt-3 p-3 rounded-xl bg-primary-500/5 border border-primary-500/10 text-center">
                  <span className="text-sm text-primary-300">
                    👥 Jami mehmonlar soni: <strong className="text-white">{rsvpModal.stats.totalGuests}</strong>
                  </span>
                </div>
              )}

              {/* List */}
              <div className="p-5 space-y-2">
                {(!rsvpModal.rsvps || rsvpModal.rsvps.length === 0) ? (
                  <div className="text-center py-8 text-surface-500 text-sm">
                    <Users size={32} className="mx-auto mb-2 opacity-30" />
                    Hali hech kim javob bermagan
                  </div>
                ) : (
                  rsvpModal.rsvps.map((r) => (
                    <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        r.status === 'attending' ? 'bg-emerald-500/10 text-emerald-400'
                          : r.status === 'maybe' ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {r.status === 'attending' ? <UserCheck size={14} /> :
                         r.status === 'maybe' ? <HelpCircle size={14} /> : <UserX size={14} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">{r.guestName}</p>
                        <p className="text-[10px] text-surface-500">
                          {r.guestCount > 1 ? `${r.guestCount} ${lang === 'en' ? 'guests' : lang === 'ru' ? 'чел.' : 'kishi'} · ` : ''}
                          {new Date(r.createdAt).toLocaleDateString(localeMap[lang] || 'en-US')}
                        </p>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        r.status === 'attending' ? 'bg-emerald-500/10 text-emerald-400'
                          : r.status === 'maybe' ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {r.status === 'attending'
                          ? (lang === 'en' ? '✅ Attending' : lang === 'ru' ? '✅ Придёт' : '✅ Keladi')
                          : r.status === 'maybe'
                          ? (lang === 'en' ? '🤔 Maybe' : lang === 'ru' ? '🤔 Возможно' : '🤔 Noaniq')
                          : (lang === 'en' ? '❌ Declined' : lang === 'ru' ? '❌ Не придёт' : '❌ Kelmaydi')}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ WISHES MODAL ═══ */}
      <AnimatePresence>
        {wishesModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/80 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setWishesModal(null); }}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="glass w-full max-w-lg max-h-[80vh] flex flex-col">
              <div className="flex justify-between items-center p-5 border-b border-white/[0.06] shrink-0">
                <h3 className="text-lg font-display font-semibold text-white flex items-center gap-2">
                  <MessageSquare size={20} className="text-primary-400" />
                  💌 Tabriklar
                  {wishesModal.wishes.length > 0 && (
                    <span className="text-xs font-normal bg-primary-500/20 text-primary-300 px-2 py-0.5 rounded-full">
                      {wishesModal.wishes.length}
                    </span>
                  )}
                </h3>
                <button onClick={() => setWishesModal(null)} className="text-surface-500 hover:text-white"><X size={18} /></button>
              </div>
              <div className="overflow-y-auto flex-1 p-5 space-y-3">
                {wishesModal.wishes.length === 0 ? (
                  <div className="text-center py-12 text-surface-500">
                    <MessageSquare size={40} className="mx-auto mb-3 opacity-20" />
                    <p className="text-sm">Hali hech kim tabrik qoldirmagan</p>
                  </div>
                ) : (
                  wishesModal.wishes.map((w) => (
                    <div key={w.id} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-white flex items-center gap-1.5">
                          👤 {w.guestName}
                        </p>
                        <p className="text-[10px] text-surface-500">
                          {new Date(w.createdAt || w.created_at).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long' })}
                        </p>
                      </div>
                      <p className="text-sm text-surface-300 leading-relaxed">💬 {w.message}</p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ EDIT MODAL ═══ */}
      <AnimatePresence>
        {editingInv && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/80 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setEditingInv(null); }}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="glass w-full max-w-lg max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
                <h3 className="text-lg font-display font-semibold text-white flex items-center gap-2">
                  <Pencil size={18} className="text-amber-400" /> {t('dashboard.editTitle')}
                </h3>
                <button onClick={() => setEditingInv(null)} className="text-surface-500 hover:text-white"><X size={18} /></button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="text-xs text-surface-400 mb-1.5 block">{t('step3.date')} 🔒</label>
                  <div className="input-field w-full !bg-white/[0.03] !text-surface-500 !cursor-not-allowed">{formatDate(editingInv.eventDate)}</div>
                </div>
                <div>
                  <label className="text-xs text-surface-400 mb-1.5 block">{t('step3.time')}</label>
                  <input type="time" value={editForm.eventTime} onChange={(e) => setEditForm(p => ({ ...p, eventTime: e.target.value }))}
                    className="input-field w-full" />
                </div>
                <div>
                  <label className="text-xs text-surface-400 mb-1.5 block">{t('step3.hostName')}</label>
                  <input type="text" value={editForm.hostName} onChange={(e) => setEditForm(p => ({ ...p, hostName: e.target.value }))}
                    className="input-field w-full" />
                </div>
                <div>
                  <label className="text-xs text-surface-400 mb-1.5 block">{t('step3.eventTitle')}</label>
                  <input type="text" value={editForm.eventTitle} onChange={(e) => setEditForm(p => ({ ...p, eventTitle: e.target.value }))}
                    className="input-field w-full" />
                </div>
                <div>
                  <label className="text-xs text-surface-400 mb-1.5 block">{t('step3.location')}</label>
                  <input type="text" value={editForm.location} onChange={(e) => setEditForm(p => ({ ...p, location: e.target.value }))}
                    className="input-field w-full" />
                </div>
                <div>
                  <label className="text-xs text-surface-400 mb-1.5 block">{t('step3.locationUrl')}</label>
                  <input type="url" value={editForm.locationUrl} onChange={(e) => setEditForm(p => ({ ...p, locationUrl: e.target.value }))}
                    className="input-field w-full" placeholder="https://maps.google.com/..." />
                </div>
                <div>
                  <label className="text-xs text-surface-400 mb-1.5 block">{t('step3.message')}</label>
                  <textarea value={editForm.message} onChange={(e) => setEditForm(p => ({ ...p, message: e.target.value }))}
                    className="input-field w-full min-h-[80px] resize-y" />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                  <div>
                    <label className="text-xs text-surface-300 font-medium">✅ {t('step3.rsvp')}</label>
                    <p className="text-[10px] text-surface-500 mt-0.5">{t('step3.rsvpHint')}</p>
                  </div>
                  <button type="button"
                    onClick={() => setEditForm(p => ({ ...p, enableRsvp: !p.enableRsvp }))}
                    className={`w-11 h-6 rounded-full transition-all duration-300 relative flex-shrink-0 ${
                      editForm.enableRsvp ? 'bg-primary-500' : 'bg-surface-700'
                    }`}>
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${
                      editForm.enableRsvp ? 'left-[22px]' : 'left-0.5'
                    }`} />
                  </button>
                </div>
              </div>
              <div className="p-5 pt-0 flex justify-end gap-2">
                <button onClick={() => setEditingInv(null)} className="btn-secondary text-sm">{t('support.cancel')}</button>
                <button onClick={saveEdit} disabled={saving} className="btn-primary flex items-center gap-2 text-sm">
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {t('dashboard.save')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
