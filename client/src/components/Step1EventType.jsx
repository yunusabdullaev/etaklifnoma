import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Cake, PartyPopper, GraduationCap, Loader2 } from 'lucide-react';
import { getEventTypes } from '../api';
import { useLang } from '../i18n';

const iconMap = {
  wedding: Heart,
  birthday: Cake,
  jubilee: PartyPopper,
  graduation: GraduationCap,
};

const gradientMap = {
  wedding: 'from-rose-500/20 to-pink-500/20 border-rose-500/30 hover:border-rose-400/50',
  birthday: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 hover:border-amber-400/50',
  jubilee: 'from-violet-500/20 to-purple-500/20 border-violet-500/30 hover:border-violet-400/50',
  graduation: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 hover:border-emerald-400/50',
};

const iconColorMap = {
  wedding: 'text-rose-400',
  birthday: 'text-amber-400',
  jubilee: 'text-violet-400',
  graduation: 'text-emerald-400',
};

const selectedGlow = {
  wedding: 'shadow-rose-500/20',
  birthday: 'shadow-amber-500/20',
  jubilee: 'shadow-violet-500/20',
  graduation: 'shadow-emerald-500/20',
};

// Client-side translations for event types (DB stores only UZ)
const eventTypeTranslations = {
  qq: {
    wedding: { label: 'Toy', description: 'Nikax hám toy ushın premium shaqırıwlar' },
    birthday: { label: 'Tuwılǵan kún', description: 'Tuwılǵan kún ushın shaqırıwlar' },
    jubilee: { label: 'Yubilej', description: 'Yubilej hám bayramlar ushın shaqırıwlar' },
    graduation: { label: 'Pitkeriwshiler', description: 'Pitkeriwshiler keshesi ushın shaqırıwlar' },
  },
  ru: {
    wedding: { label: 'Свадьба', description: 'Премиум приглашения для никаха и свадьбы' },
    birthday: { label: 'День рождения', description: 'Яркие приглашения на день рождения' },
    jubilee: { label: 'Юбилей', description: 'Приглашения для юбилеев и праздников' },
    graduation: { label: 'Выпускной', description: 'Приглашения на выпускной вечер и торжества' },
  },
  en: {
    wedding: { label: 'Wedding', description: 'Premium invitations for weddings & celebrations' },
    birthday: { label: 'Birthday', description: 'Vibrant birthday party invitations' },
    jubilee: { label: 'Anniversary', description: 'Invitations for anniversaries & celebrations' },
    graduation: { label: 'Graduation', description: 'Invitations for graduation parties & ceremonies' },
  },
};

export default function Step1EventType({ data, onUpdate, onNext }) {
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t, lang } = useLang();

  useEffect(() => {
    getEventTypes()
      .then((res) => { setEventTypes(res.data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, []);

  const handleSelect = (eventType) => {
    const ev = eventType.name || 'wedding';
    
    // Top level defaults
    const guestName = 'Hurmatli mehmonlar!';
    const eventTitle = ev==='birthday' ? "Tug'ilgan kun bayrami" : ev==='graduation' ? "Bitiruv kechasi" : ev==='wedding' ? "Nikoh marosimi" : "Yubiley bayramiga taklif";
    const message = ev==='wedding' ? "Sizni farzandlarimiz nikoh to'yiga tashrif buyurishingizni so'rab qolamiz." : ev==='birthday' ? "Sizni bayramimizga taklif qilamiz. Birga shodlanaylik!" : ev==='graduation' ? "Universitetni tamomlash quvonchini biz bilan baham ko'ring!" : "Orzular ushalgan yubiley oqshomimizga lutfan taklif etamiz!";

    // Custom fields defaults
    const customFields = {
       ...data.customFields,
       guestNameRu: 'Уважаемые гости!',
       eventTitleRu: ev==='birthday' ? "Праздник дня рождения" : ev==='graduation' ? "Выпускной вечер" : ev==='wedding' ? "Свадебное торжество" : "Приглашение на юбилей",
       messageRu: ev==='wedding' ? "Приглашаем вас разделить радость нашего бракосочетания." : ev==='birthday' ? "Приглашаем вас на наш праздник. Если вы приедете, мы будем счастливы." : ev==='graduation' ? "Разделите с нами радость окончания университета!" : "Пожалуйста, приглашаем вас на наш юбилейный вечер!",

       guestNameQq: 'Húrmetli miymanlar!',
       eventTitleQq: ev==='birthday' ? 'Tuwılǵan kún bayramı' : ev==='graduation' ? 'Pitiriw keshesi' : ev==='wedding' ? "Nikax márásimi" : 'Yubileyge shaqırıw',
       messageQq: ev==='wedding' ? "Sizdi perzentlerimizdeń neke toyına shaqırıp qalamız." : ev==='birthday' ? "Sizdi bayramımızǵa shaqıramız. Qosılıp quwanayıq!" : ev==='graduation' ? "Universitetti pitiriw quwanıshın biz benen bólesiń!" : "Ármanlar orınlanǵan yubiley aqshamımızǵa lutfan shaqıramız!"
    };

    onUpdate({ 
       eventType, 
       eventTypeId: eventType.id, 
       templateId: null, 
       template: null,
       guestName,
       eventTitle,
       message,
       customFields
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 mb-2">{t('common.error')}</p>
        <p className="text-surface-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-display font-bold">
          {t('step1.title')}
        </h2>
        <p className="text-surface-400">{t('step1.desc')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
        {eventTypes.map((et, i) => {
          const Icon = iconMap[et.name] || PartyPopper;
          const isSelected = data.eventTypeId === et.id;

          return (
            <motion.button
              key={et.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              onClick={() => {
                if (isSelected) onNext();
                else handleSelect(et);
              }}
              className={`relative group p-6 rounded-2xl border backdrop-blur-xl text-left
                transition-all duration-300 cursor-pointer
                bg-gradient-to-br ${gradientMap[et.name] || 'from-surface-700/50 to-surface-800/50 border-white/10'}
                ${isSelected 
                  ? `ring-2 ring-offset-2 ring-offset-surface-950 ring-primary-500 shadow-2xl ${selectedGlow[et.name]}` 
                  : 'hover:scale-[1.02]'
                }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="selected-check"
                  className="absolute top-3 right-3 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}

              <div className={`w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 
                ${iconColorMap[et.name]} group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">
                {eventTypeTranslations[lang]?.[et.name]?.label || et.label}
              </h3>
              <p className="text-sm text-surface-400 leading-relaxed">
                {eventTypeTranslations[lang]?.[et.name]?.description || et.description}
              </p>

              {isSelected && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                  className="pt-3 border-t border-white/10"
                >
                  <div className="bg-primary-500 text-white w-full py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary-500/30 text-sm font-semibold tracking-wide">
                    {t('step1.next').replace('->', '').replace('→', '').trim()} &rarr;
                  </div>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="sticky bottom-0 z-20 bg-surface-950/90 backdrop-blur-lg border-t border-white/5 
        -mx-4 px-4 py-4 mt-6 sm:static sm:bg-transparent sm:backdrop-blur-none sm:border-0 sm:mx-0 sm:px-0 sm:py-0 sm:mt-0">
        <div className="flex justify-center pt-0 sm:pt-4">
          <button
            onClick={onNext}
            disabled={!data.eventTypeId}
            className="btn-primary w-full sm:w-auto min-w-[200px] text-center py-3.5"
          >
            {t('step1.next')}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
