import { motion } from 'framer-motion';
import { Sparkles, Smartphone, Monitor } from 'lucide-react';
import { useState } from 'react';
import LivePreview from './LivePreview';

export default function Step4Preview({ data, onNext, onBack }) {
  const [viewMode, setViewMode] = useState('desktop'); // 'desktop' | 'mobile'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-display font-bold">
          Taklifnomani ko'rib chiqing
        </h2>
        <p className="text-surface-400">Hamma narsa to'g'ri ekanligiga ishonch hosil qiling</p>
      </div>

      {/* View mode toggle */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setViewMode('desktop')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${viewMode === 'desktop'
              ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
              : 'bg-white/5 text-surface-400 border border-white/10 hover:bg-white/10'}`}
        >
          <Monitor size={14} /> Desktop
        </button>
        <button
          onClick={() => setViewMode('mobile')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${viewMode === 'mobile'
              ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
              : 'bg-white/5 text-surface-400 border border-white/10 hover:bg-white/10'}`}
        >
          <Smartphone size={14} /> Mobil
        </button>
      </div>

      {/* Preview container */}
      <div className="flex justify-center">
        <motion.div
          layout
          className={`relative transition-all duration-500 ease-out ${
            viewMode === 'mobile'
              ? 'w-[375px]'
              : 'w-full max-w-[520px]'
          }`}
        >
          {/* Device frame for mobile */}
          {viewMode === 'mobile' && (
            <div className="absolute -inset-3 rounded-[2rem] border-2 border-white/10 bg-surface-900/50 
              pointer-events-none z-0">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full bg-white/10" />
            </div>
          )}

          <div className="relative z-10">
            <LivePreview
              data={data}
              className={`rounded-2xl border border-white/10 overflow-hidden ${
                viewMode === 'mobile' ? 'h-[667px]' : 'h-[700px]'
              }`}
            />
          </div>
        </motion.div>
      </div>

      <div className="flex justify-between items-center max-w-[520px] mx-auto pt-4">
        <button onClick={onBack} className="btn-secondary">
          ← Tahrirlash
        </button>
        <button onClick={onNext} className="btn-accent min-w-[200px] text-center flex items-center justify-center gap-2">
          <Sparkles size={16} />
          Havola yaratish
        </button>
      </div>
    </motion.div>
  );
}
