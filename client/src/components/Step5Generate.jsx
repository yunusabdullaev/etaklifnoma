import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Copy, Check, ExternalLink, PartyPopper, RotateCcw } from 'lucide-react';
import { createInvitation } from '../api';
import { useLang } from '../i18n';

export default function Step5Generate({ data, onReset }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const { t } = useLang();

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        eventTypeId: data.eventTypeId,
        templateId: data.templateId,
        hostName: data.hostName,
        guestName: data.guestName || undefined,
        eventTitle: data.eventTitle || undefined,
        eventDate: data.eventDate,
        eventTime: data.eventTime || undefined,
        location: data.location,
        locationUrl: data.locationUrl || undefined,
        message: data.message || undefined,
        customFields: data.customFields && Object.keys(data.customFields).length > 0
          ? data.customFields : undefined,
      };
      const res = await createInvitation(payload);
      setResult(res.data);
    } catch (err) {
      const errData = err.response?.data?.error;
      setError(errData?.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const publicUrl = result?.publicUrl || '';
  const fullUrl = publicUrl.startsWith('http') 
    ? publicUrl 
    : `${window.location.origin}${publicUrl}`;
  // The rendered HTML view URL for sharing
  const viewUrl = fullUrl ? `${fullUrl}/view` : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(viewUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const el = document.createElement('textarea');
      el.value = viewUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Generate state
  if (!result && !loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-8 py-8"
      >
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-display font-bold">
            Havola yaratishga tayyormisiz?
          </h2>
          <p className="text-surface-400">
            {t('step5.desc')}
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
          >
            {error}
          </motion.div>
        )}

        <motion.div
          className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 
            border border-white/10 flex items-center justify-center"
          animate={{ rotate: [0, 3, -3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-6xl">{data.eventType?.icon || '💌'}</span>
        </motion.div>

        <button
          onClick={handleGenerate}
          className="btn-accent text-lg px-10 py-4 inline-flex items-center gap-2"
        >
          <PartyPopper size={20} />
          {t('step4.generate')}
        </button>
      </motion.div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="w-10 h-10 text-primary-400" />
        </motion.div>
        <p className="text-surface-400 animate-pulse-soft">{t('common.loading')}</p>
      </div>
    );
  }

  // Success state
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 120 }}
      className="text-center space-y-8 py-4"
    >
      {/* Celebration */}
      <div className="space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
          className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-emerald-500/20 to-green-500/20 
            border border-emerald-500/30 flex items-center justify-center shadow-xl shadow-emerald-500/10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            <Check className="w-10 h-10 text-emerald-400" strokeWidth={3} />
          </motion.div>
        </motion.div>

        <div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
            {t('step5.title')}
          </h2>
          <p className="text-surface-400">{t('step5.desc')}</p>
        </div>
      </div>

      {/* Link card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-lg mx-auto glass-strong p-6 space-y-4"
      >
        <p className="text-xs text-surface-500 uppercase tracking-wider font-medium">
          {t('step5.link')}
        </p>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-surface-900/80 border border-white/10 rounded-xl px-4 py-3 
            text-sm text-primary-300 font-mono truncate select-all">
            {viewUrl}
          </div>
          <button
            onClick={handleCopy}
            className={`shrink-0 p-3 rounded-xl transition-all duration-300 ${
              copied
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-white/10 text-white border border-white/10 hover:bg-white/15'
            }`}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>

        {copied && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-emerald-400 font-medium"
          >
            ✓ {t('step5.copied')}
          </motion.p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <a
            href={viewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm"
          >
            <ExternalLink size={14} />
            {t('step5.open')}
          </a>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: data.eventTitle || 'Taklifnoma', url: viewUrl });
              }
            }}
            className="btn-secondary flex-1 text-sm"
          >
            📤 Ulashish
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex justify-center gap-6 text-sm"
      >
        <div className="text-center">
          <p className="text-surface-500 text-xs">Slug</p>
          <p className="font-mono text-primary-400">{result?.slug}</p>
        </div>
        <div className="text-center">
          <p className="text-surface-500 text-xs">Ko'rishlar</p>
          <p className="text-white font-semibold">{result?.viewCount || 0}</p>
        </div>
      </motion.div>

      {/* New invitation */}
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 text-surface-400 hover:text-white transition-colors text-sm"
      >
        <RotateCcw size={14} />
        {t('step5.createAnother')}
      </button>
    </motion.div>
  );
}
