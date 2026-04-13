import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../i18n';
import SettingsDropdown from './SettingsDropdown';
import {
  Sparkles, ArrowRight, Palette, Languages, Music, MapPin,
  Smartphone, Share2, MessageCircle, Clock, Shield, Zap,
  ChevronDown, Star
} from 'lucide-react';

const features = [
  {
    icon: Palette,
    color: 'from-rose-500 to-pink-600',
    titleUz: '200+ premium shablon',
    titleQq: '200+ premium shablon',
    titleRu: '200+ премиум шаблонов',
    descUz: "To'y, tug'ilgan kun, yubiley va bitiruvchilar kechasi uchun 200 dan ortiq zamonaviy dizayn",
    descQq: "Toy, tuwılǵan kún, yubilej hám pitkeriwshiler keshesi ushın 200 den artıq dizayn",
    descRu: 'Более 200 шаблонов для свадьбы, дня рождения, юбилея и выпускного',
  },
  {
    icon: Languages,
    color: 'from-blue-500 to-indigo-600',
    titleUz: '3 tilda qo\'llab-quvvatlash',
    titleQq: '3 tilde qollab-quwatlaw',
    titleRu: 'Поддержка 3 языков',
    descUz: "O'zbek, qaraqalpoq va rus tillarida taklifnomalar — mehmonlaringiz o'z tilida o'qiydi",
    descQq: "Ózbek, qaraqalpaq hám rus tillerinde mırájatlar — mexmanlarıńız óz tilinde oqıydı",
    descRu: 'Приглашения на узбекском, каракалпакском и русском — каждый гость прочитает на своём языке',
  },
  {
    icon: Music,
    color: 'from-violet-500 to-purple-600',
    titleUz: 'Fon musiqasi',
    titleQq: 'Fon muzıkası',
    titleRu: 'Фоновая музыка',
    descUz: "Sevimli musiqangizni qo'shing — taklifnoma ochilganda avtomatik o'ynaydi",
    descQq: "Súyikli muzıkańızdı qosıń — mırájat ashılǵanda avtomatik oynaydı",
    descRu: 'Добавьте любимую музыку — она автоматически заиграет при открытии приглашения',
  },
  {
    icon: MapPin,
    color: 'from-emerald-500 to-teal-600',
    titleUz: 'Xarita integratsiyasi',
    titleQq: 'Karta integratsiyası',
    titleRu: 'Интеграция с картой',
    descUz: "Google Maps havolasi — mehmonlaringiz yo'lni osongina topadi",
    descQq: "Google Maps siltemesi — mexmanlarıńız jolın ańsat tabadı",
    descRu: 'Ссылка на Google Maps — гости легко найдут место проведения',
  },
  {
    icon: Smartphone,
    color: 'from-amber-500 to-orange-600',
    titleUz: 'Mobil moslashgan',
    titleQq: 'Mobil moslanǵan',
    titleRu: 'Мобильная адаптация',
    descUz: "Barcha qurilmalarda mukammal ko'rinadi — telefon, planshet, kompyuter",
    descQq: "Barlıq qurilmalarda múkemmel kórinedi — telefon, planshet, kompyuter",
    descRu: 'Идеально выглядит на всех устройствах — телефоне, планшете, компьютере',
  },
  {
    icon: MessageCircle,
    color: 'from-cyan-500 to-blue-600',
    titleUz: 'Telegram tilaklar',
    titleQq: 'Telegram tilekler',
    titleRu: 'Пожелания в Telegram',
    descUz: "Mehmonlar to'g'ridan-to'g'ri taklifnomadan tilak yozib, sizga Telegram orqali yuboradi",
    descQq: "Mexmanlar tuwrıdan-tuwrı mırájattan tilek jazıp, sizge Telegram arqalı jiberedi",
    descRu: 'Гости пишут пожелания прямо в приглашении, а вы получаете их в Telegram',
  },
];

const stats = [
  { value: '200+', labelUz: 'Shablonlar', labelQq: 'Shablonlar', labelRu: 'Шаблонов' },
  { value: '3', labelUz: 'Til', labelQq: 'Til', labelRu: 'Языка' },
  { value: '4', labelUz: 'Tadbir turi', labelQq: 'Ilaje túri', labelRu: 'Типа событий' },
  { value: '∞', labelUz: 'Taklifnomalar', labelQq: 'Mırájatlar', labelRu: 'Приглашений' },
];

export default function LandingPage({ onEnter }) {
  const { lang } = useLang();
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const tx = (uz, qq, ru) => lang === 'ru' ? ru : lang === 'qq' ? qq : uz;

  return (
    <div className="min-h-screen bg-surface-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary-500/[0.04] rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-accent-500/[0.04] rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-primary-500/[0.02] rounded-full blur-[150px]" />
      </div>

      {/* Settings button (top-right) */}
      <div className="fixed top-4 right-4 z-50">
        <SettingsDropdown />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-[90vh] flex flex-col items-center justify-center px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-3 mb-8"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 
              flex items-center justify-center shadow-2xl shadow-primary-500/30">
              <Sparkles size={28} className="text-white" />
            </div>
          </motion.div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold text-white leading-[1.1] mb-6">
            <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-clip-text text-transparent">
              eTaklifnoma
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-surface-300 font-light leading-relaxed mb-4 max-w-2xl mx-auto">
            {tx(
              "Premium raqamli taklifnomalar — to'y, tug'ilgan kun, yubiley va bitiruvchilar kechasi uchun",
              "Premium sanli mırájatlar — toy, tuwılǵan kún, yubilej hám pitkeriwshiler keshesi ushın",
              "Премиум цифровые приглашения — для свадьбы, дня рождения, юбилея и выпускного"
            )}
          </p>

          <p className="text-sm text-surface-500 mb-10 max-w-lg mx-auto">
            {tx(
              "200+ zamonaviy shablon · 3 tilda · musiqa · animatsiyalar · Telegram tilaklar",
              "200+ zámanagóy shablon · 3 tilde · muzıka · animatsiyalar · Telegram tilekler",
              "200+ шаблонов · 3 языка · музыка · анимации · пожелания в Telegram"
            )}
          </p>

          {/* CTA Button */}
          <motion.button
            onClick={onEnter}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl
              bg-gradient-to-r from-primary-500 to-accent-500 text-white text-lg font-semibold
              shadow-2xl shadow-primary-500/25 hover:shadow-primary-500/40
              transition-all duration-300"
          >
            {tx('Kirish', 'Kiriw', 'Войти')}
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={24} className="text-surface-600" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-16 border-y border-white/5 bg-surface-950/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-display font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <p className="text-sm text-surface-400 mt-1">
                  {tx(stat.labelUz, stat.labelQq, stat.labelRu)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              {tx('Imkoniyatlar', 'Imkaniyatlar', 'Возможности')}
            </h2>
            <p className="text-surface-400 max-w-lg mx-auto">
              {tx(
                "Bir necha daqiqada professional taklifnoma yarating",
                "Bir neshe daqıyqada professional mırájat jaratıń",
                "Создайте профессиональное приглашение за несколько минут"
              )}
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  onMouseEnter={() => setHoveredFeature(i)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  className="group relative p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]
                    hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300"
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.color}
                    flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">
                    {tx(feature.titleUz, feature.titleQq, feature.titleRu)}
                  </h3>
                  <p className="text-sm text-surface-400 leading-relaxed">
                    {tx(feature.descUz, feature.descQq, feature.descRu)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 py-20 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              {tx('Qanday ishlaydi?', 'Qalay isleydi?', 'Как это работает?')}
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                titleUz: 'Shablon tanlang',
                titleQq: 'Shablon tańlań',
                titleRu: 'Выберите шаблон',
                descUz: "200+ premium shablonlardan o'zingizga yoqqanini tanlang",
                descQq: "200+ premium shablonlardan ózińizge jaqqanın tańlań",
                descRu: 'Выберите понравившийся из 200+ премиум шаблонов',
                icon: Palette,
              },
              {
                step: '02',
                titleUz: "Ma'lumot kiriting",
                titleQq: 'Maǵlıwmat kiritiń',
                titleRu: 'Заполните данные',
                descUz: "Ism, sana, joy, xabar — barchasini o'zingiz yozing",
                descQq: "Atı, sána, orın, xabar — bárshesin ózińiz jazıń",
                descRu: 'Имя, дата, место, сообщение — заполните всё сами',
                icon: Zap,
              },
              {
                step: '03',
                titleUz: 'Ulashing',
                titleQq: 'Bólisiń',
                titleRu: 'Поделитесь',
                descUz: "Havola oling va Telegram, WhatsApp orqali yuboring",
                descQq: "Silteme alıń hám Telegram, WhatsApp arqalı jiberiń",
                descRu: 'Получите ссылку и отправьте через Telegram или WhatsApp',
                icon: Share2,
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl
                    bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-white/10 mb-5">
                    <Icon size={28} className="text-primary-400" />
                  </div>
                  <div className="text-[10px] font-bold text-primary-500 tracking-widest mb-2">
                    {tx('QADAM', 'QADAM', 'ШАГ')} {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {tx(item.titleUz, item.titleQq, item.titleRu)}
                  </h3>
                  <p className="text-sm text-surface-400">
                    {tx(item.descUz, item.descQq, item.descRu)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 py-20 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center p-8 sm:p-12 rounded-3xl
            bg-gradient-to-br from-primary-500/10 to-accent-500/10
            border border-white/[0.08]"
        >
          <Star size={32} className="text-primary-400 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-4">
            {tx(
              "Hoziroq premium taklifnoma yarating!",
              "Házir premium mırájat jaratıń!",
              "Создайте премиум приглашение прямо сейчас!"
            )}
          </h2>
          <p className="text-surface-400 mb-8">
            {tx(
              "Bepul · Tez · Professional",
              "Tegin · Tez · Professional",
              "Бесплатно · Быстро · Профессионально"
            )}
          </p>
          <motion.button
            onClick={onEnter}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl
              bg-gradient-to-r from-primary-500 to-accent-500 text-white text-lg font-semibold
              shadow-2xl shadow-primary-500/25 hover:shadow-primary-500/40
              transition-all duration-300"
          >
            {tx('Boshlash', 'Baslaw', 'Начать')}
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-6 text-center">
        <p className="text-xs text-surface-600">
          © 2026 eTaklifnoma.uz — {tx(
            'Barcha huquqlar himoyalangan',
            'Barlıq huqıqlar qorǵalǵan',
            'Все права защищены'
          )}
        </p>
      </footer>
    </div>
  );
}
