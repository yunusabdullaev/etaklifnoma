import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Cake, PartyPopper, GraduationCap, Sparkles, Loader2 } from 'lucide-react';
import { getEventTypes } from '../api';
import { useLang } from '../i18n';

const iconMap = {
  wedding: Heart,
  birthday: Cake,
  jubilee: PartyPopper,
  graduation: GraduationCap,
  custom: Sparkles,
};

const gradientMap = {
  wedding: 'from-rose-500/20 to-pink-500/20 border-rose-500/30 hover:border-rose-400/50',
  birthday: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 hover:border-amber-400/50',
  jubilee: 'from-violet-500/20 to-purple-500/20 border-violet-500/30 hover:border-violet-400/50',
  graduation: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 hover:border-emerald-400/50',
  custom: 'from-cyan-500/20 to-sky-500/20 border-cyan-500/30 hover:border-cyan-400/50',
};

const iconColorMap = {
  wedding: 'text-rose-400',
  birthday: 'text-amber-400',
  jubilee: 'text-violet-400',
  graduation: 'text-emerald-400',
  custom: 'text-cyan-400',
};

const selectedGlow = {
  wedding: 'shadow-rose-500/20',
  birthday: 'shadow-amber-500/20',
  jubilee: 'shadow-violet-500/20',
  graduation: 'shadow-emerald-500/20',
  custom: 'shadow-cyan-500/20',
};

// Client-side translations for event types (DB stores only UZ)
const eventTypeTranslations = {
  qq: {
    wedding:    { label: 'Toy',            description: 'Nikax hám toy ushın premium shaqırıwlar' },
    birthday:   { label: 'Tuwılǵan kún',   description: 'Tuwılǵan kún ushın shaqırıwlar' },
    jubilee:    { label: 'Yubilej',         description: 'Yubilej hám bayramlar ushın shaqırıwlar' },
    graduation: { label: 'Pitkeriwshiler',  description: 'Pitkeriwshiler keshesi ushın shaqırıwlar' },
    custom:     { label: 'Basqa tadbir',    description: 'Súnnet, Naoróz yaki basqa islegen bayram ushın' },
  },
  ru: {
    wedding:    { label: 'Свадьба',         description: 'Премиум приглашения для никаха и свадьбы' },
    birthday:   { label: 'День рождения',   description: 'Яркие приглашения на день рождения' },
    jubilee:    { label: 'Юбилей',          description: 'Приглашения для юбилеев и праздников' },
    graduation: { label: 'Выпускной',       description: 'Приглашения на выпускной вечер и торжества' },
    custom:     { label: 'Другое событие',  description: 'Обрезание, Навруз или любой другой праздник' },
  },
  en: {
    wedding:    { label: 'Wedding',         description: 'Premium invitations for weddings & celebrations' },
    birthday:   { label: 'Birthday',        description: 'Vibrant birthday party invitations' },
    jubilee:    { label: 'Anniversary',     description: 'Invitations for anniversaries & celebrations' },
    graduation: { label: 'Graduation',      description: 'Invitations for graduation parties & ceremonies' },
    custom:     { label: 'Custom Event',    description: 'Circumcision, Navruz or any other celebration' },
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

    const guestName = 'Hurmatli mehmonlar!';
    const eventTitle =
      ev === 'birthday'   ? "Tug'ilgan kun bayrami" :
      ev === 'graduation' ? 'Bitiruv kechasi' :
      ev === 'wedding'    ? 'Nikoh marosimi' :
      ev === 'custom'     ? 'Tadbir taklifi' :
                            'Yubiley bayramiga taklif';

    const message =
      ev === 'wedding'    ? "Sizni farzandlarimiz nikoh to'yiga tashrif buyurishingizni so'rab qolamiz." :
      ev === 'birthday'   ? 'Sizni bayramimizga taklif qilamiz. Birga shodlanaylik!' :
      ev === 'graduation' ? "Universitetni tamomlash quvonchini biz bilan baham ko'ring!" :
      ev === 'custom'     ? 'Sizni bayramimizga taklif etamiz. Kelishingizni kutib qolamiz!' :
                            'Orzular ushalgan yubiley oqshomimizga lutfan taklif etamiz!';

    const customFields = {
      ...data.customFields,
      guestNameRu: 'Уважаемые гости!',
      eventTitleRu:
        ev === 'birthday'   ? 'Праздник дня рождения' :
        ev === 'graduation' ? 'Выпускной вечер' :
        ev === 'wedding'    ? 'Свадебное торжество' :
        ev === 'custom'     ? 'Приглашение на мероприятие' :
                              'Приглашение на юбилей',
      messageRu:
        ev === 'wedding'    ? 'Приглашаем вас разделить радость нашего бракосочетания.' :
        ev === 'birthday'   ? 'Приглашаем вас на наш праздник. Мы будем рады видеть вас!' :
        ev === 'graduation' ? 'Разделите с нами радость окончания университета!' :
        ev === 'custom'     ? 'Приглашаем вас на наше мероприятие. Ждём вас!' :
                              'Пожалуйста, приглашаем вас на наш юбилейный вечер!',
      guestNameQq: 'Húrmetli miymanlar!',
      eventTitleQq:
        ev === 'birthday'   ? 'Tuwılǵan kún bayramı' :
        ev === 'graduation' ? 'Pitiriw keshesi' :
        ev === 'wedding'    ? 'Nikax márásimi' :
        ev === 'custom'     ? 'Ilaje shaqırıwı' :
                              'Yubileyge shaqırıw',
      messageQq:
        ev === 'wedding'    ? 'Sizdi perzentlerimizdeń neke toyına shaqırıp qalamız.' :
        ev === 'birthday'   ? 'Sizdi bayramımızǵa shaqıramız. Qosılıp quwanayıq!' :
        ev === 'graduation' ? 'Universitetti pitiriw quwanıshın biz benen bólesiń!' :
        ev === 'custom'     ? 'Sizdi ilajemizge shaqıramız. Kelishingizdi kutip qalamız!' :
                              'Ármanlar orınlanǵan yubiley aqshamımızǵa lutfan shaqıramız!',

      // Custom event — default labels (user can override in Step3)
      ...(ev === 'custom' ? {
        customEventLabel:    'Tadbir taklifi',
        customEventLabelRu:  'Приглашение',
        customEventLabelQq:  'Ilaje shaqırıwı',
        customCountdownTitle:    'Tadbirgacha qolgan vaqt',
        customCountdownTitleRu:  'До мероприятия осталось',
        customCountdownTitleQq:  'Ilajege qalǵan waqıt',
        customWaitingMsg:    'Sizni kutib qolamiz! ✨',
        customWaitingMsgRu:  'Ждём вас! ✨',
        customWaitingMsgQq:  'Sizdi kútip qalamız! ✨',
        customDetailsTitle:    'Tadbir tafsilotlari',
        customDetailsTitleRu:  'Детали мероприятия',
        customDetailsTitleQq:  'Ilaje tafsilatları',
        customProgramTitle:    'Tadbir dasturi',
        customProgramTitleRu:  'Программа мероприятия',
        customProgramTitleQq:  'Ilaje baǵdarlanması',
      } : {}),
    };

    onUpdate({
      eventType,
      eventTypeId: eventType.id,
      templateId: null,
      template: null,
      guestName,
      eventTitle,
      message,
      customFields,
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

  // Sort so 'custom' always appears last
  const sorted = [...eventTypes].sort((a, b) =>
    a.name === 'custom' ? 1 : b.name === 'custom' ? -1 : 0
  );

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
        {sorted.map((et, i) => {
          const Icon = iconMap[et.name] || PartyPopper;
          const isSelected = data.eventTypeId === et.id;
          const isCustom = et.name === 'custom';

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
              className={`relative group p-6 rounded-2xl border backdrop-blur-xl
                transition-all duration-300 cursor-pointer
                ${isCustom ? 'text-left' : 'text-center'}
                bg-gradient-to-br ${gradientMap[et.name] || 'from-surface-700/50 to-surface-800/50 border-white/10'}
                ${isCustom ? 'sm:col-span-2' : ''}
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

              <div className={`flex items-center gap-4 ${isCustom ? '' : 'flex-col'}`}>
                <div className={`${isCustom ? 'w-14 h-14 shrink-0' : 'w-12 h-12 mb-2'} rounded-xl bg-white/10 flex items-center justify-center 
                  ${iconColorMap[et.name]} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={isCustom ? 28 : 24} />
                </div>
                <div className={isCustom ? 'flex-1 text-left' : 'text-center w-full'}>
                  <h3 className={`text-lg font-semibold text-white mb-1 flex items-center gap-2 ${isCustom ? '' : 'justify-center'}`}>
                    {eventTypeTranslations[lang]?.[et.name]?.label || et.label}
                    {isCustom && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 uppercase tracking-wider">
                        Yangi
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-surface-400 leading-relaxed">
                    {eventTypeTranslations[lang]?.[et.name]?.description || et.description}
                  </p>
                  {isCustom && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['Sunnat to\'yi', 'Novruz', 'Hashar', 'Ramazon', '...'].map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-surface-400 border border-white/10">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

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
