import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  uz: {
    // Header
    'header.title': 'Taklifnoma',
    'header.subtitle': 'Premium taklifnomalar',
    'header.cabinet': 'Kabinet',
    'header.create': 'Yaratish',
    'header.step': 'Qadam',
    'header.logout': 'Chiqish',

    // Auth
    'auth.login': 'Kirish',
    'auth.register': "Ro'yxatdan o'tish",
    'auth.phone': 'Telefon raqam',
    'auth.password': 'Parol',
    'auth.name': 'Ismingiz',
    'auth.loginBtn': 'Kirish →',
    'auth.registerBtn': "Ro'yxatdan o'tish →",
    'auth.otpTitle': 'Tasdiqlash kodi',
    'auth.otpDesc': 'Telegram botga yuborilgan 6 raqamli kodni kiriting',
    'auth.otpResend': 'Qayta yuborish',
    'auth.otpBack': 'Orqaga',
    'auth.otpExpires': 'Kod amal qilish muddati:',
    'auth.noAccount': "Hisobingiz yo'qmi?",
    'auth.hasAccount': 'Hisobingiz bormi?',

    // Dashboard
    'dashboard.title': 'Mening taklifnomalarim',
    'dashboard.total': 'ta taklifnoma',
    'dashboard.empty': 'Hali taklifnoma yaratilmagan',
    'dashboard.emptyTitle': "Hali taklifnoma yo'q",
    'dashboard.emptyDesc': "Birinchi premium taklifnomangizni yarating — to'y, tug'ilgan kun, yubiley yoki bitiruvchilar kechasi uchun!",
    'dashboard.createBtn': 'Taklifnoma yaratish',
    'dashboard.newBtn': 'Yangi yaratish',
    'dashboard.view': "Ko'rish",
    'dashboard.copyLink': 'Link nusxalash',
    'dashboard.copied': 'Nusxalandi!',
    'dashboard.delete': "O'chirish",
    'dashboard.deleteConfirm': "Bu taklifnomani o'chirmoqchimisiz?",
    'dashboard.views': 'ko\'rish',

    // Step 1
    'step1.title': 'Tadbir turini tanlang',
    'step1.desc': "Qanday marosim uchun taklif yaratmoqchisiz?",
    'step1.next': 'Davom etish →',

    // Step 2
    'step2.title': 'Shablon tanlang',
    'step2.count': 'ta shablon mavjud',
    'step2.empty': 'Bu tur uchun shablon topilmadi',
    'step2.next': 'Davom etish →',
    'step2.back': '← Orqaga',

    // Step 3
    'step3.title': 'Taklif mazmunini kiriting',
    'step3.desc': "Taklifnoma tafsilotlarini to'ldiring",
    'step3.host': 'Mezbon ismi',
    'step3.guest': 'Mehmon ismi',
    'step3.eventTitle': 'Tadbir nomi',
    'step3.date': 'Sana',
    'step3.time': 'Vaqt',
    'step3.location': 'Manzil',
    'step3.mapLink': 'Xarita havolasi',
    'step3.message': 'Xabar',
    'step3.messagePlaceholder': "Sizni marosimimizga taklif qilamiz...",
    'step3.templateFields': 'Shablon maydonlari',
    'step3.extras': "Qo'shimcha sozlamalar",
    'step3.music': 'Fon musiqasi (havola)',
    'step3.telegram': 'Telegram Bot (tilaklar uchun)',
    'step3.preview': "Jonli ko'rinish",
    'step3.hide': 'Yashirish',
    'step3.show': "Ko'rish",
    'step3.next': "Ko'rish →",
    'step3.back': '← Orqaga',
    'step3.dateLocation': 'Sana va joy',
    'step3.basicInfo': "Asosiy ma'lumotlar",
    'step3.langSettings': 'Til sozlamalari',
    'step3.langUz': "Faqat o'zbek",
    'step3.langUzru': 'Ikki tilda',
    'step3.langRu': 'Faqat ruscha',
    'step3.langRuDesc': "Taklifnoma to'liq ruscha ko'rinadi",
    'step3.langUzruDesc': "Mehmonlar RU tugmasini bosganda shu matnlar ko'rinadi",
    'step3.ruHostName': 'Имя хозяина',
    'step3.ruGuestName': 'Имя гостя',
    'step3.ruEventTitle': 'Название мероприятия',
    'step3.ruMessage': 'Сообщение',
    'step3.program': 'Bayram dasturi',
    'step3.programRu': 'Программа (рус)',
    'step3.addItem': "Punkt qo'shish",
    'step3.addItemRu': 'Добавить пункт',
    'step3.musicHint': "MP3 faylga to'g'ridan-to'g'ri havola",
    'step3.telegramHint': 'Format: BOT_TOKEN:CHAT_ID — @BotFather dan oling',

    // Step 4
    'step4.title': "To'liq ko'rib chiqing",
    'step4.desc': "Taklifnoma xuddi shu ko'rinishda bo'ladi — musiqa, animatsiyalar, til almashtirish bilan",
    'step4.desktop': 'Desktop',
    'step4.mobile': 'Mobil',
    'step4.fullscreen': "To'liq ekran",
    'step4.fullscreenTitle': "To'liq ko'rish",
    'step4.back': '← Tahrirlash',
    'step4.generate': 'Havola yaratish',

    // Step 5
    'step5.title': 'Taklifnoma tayyor! 🎉',
    'step5.ready': 'Havola yaratishga tayyormisiz?',
    'step5.desc': "Premium taklifnomangiz yaratildi",
    'step5.link': 'Taklifnoma havolasi',
    'step5.copy': 'Nusxalash',
    'step5.copied': 'Nusxalandi!',
    'step5.open': 'Ochish',
    'step5.createAnother': 'Yana yaratish',
    'step5.share': 'Ulashish',
    'step5.views': "Ko'rishlar",

    // Footer
    'footer.copyright': '© 2026 Taklifnoma — Barcha huquqlar himoyalangan',

    // Common
    'common.loading': 'Yuklanmoqda...',
    'common.error': 'Xatolik yuz berdi',
  },

  ru: {
    // Header
    'header.title': 'Такlifнома',
    'header.subtitle': 'Премиум приглашения',
    'header.cabinet': 'Кабинет',
    'header.create': 'Создать',
    'header.step': 'Шаг',
    'header.logout': 'Выйти',

    // Auth
    'auth.login': 'Вход',
    'auth.register': 'Регистрация',
    'auth.phone': 'Номер телефона',
    'auth.password': 'Пароль',
    'auth.name': 'Ваше имя',
    'auth.loginBtn': 'Войти →',
    'auth.registerBtn': 'Зарегистрироваться →',
    'auth.otpTitle': 'Код подтверждения',
    'auth.otpDesc': 'Введите 6-значный код, отправленный в Telegram бот',
    'auth.otpResend': 'Отправить снова',
    'auth.otpBack': 'Назад',
    'auth.otpExpires': 'Код действует:',
    'auth.noAccount': 'Нет аккаунта?',
    'auth.hasAccount': 'Есть аккаунт?',

    // Dashboard
    'dashboard.title': 'Мои приглашения',
    'dashboard.total': 'приглашений',
    'dashboard.empty': 'Приглашений пока нет',
    'dashboard.emptyTitle': 'Приглашений пока нет',
    'dashboard.emptyDesc': 'Создайте своё первое премиум приглашение — для свадьбы, дня рождения, юбилея или выпускного!',
    'dashboard.createBtn': 'Создать приглашение',
    'dashboard.newBtn': 'Создать новое',
    'dashboard.view': 'Открыть',
    'dashboard.copyLink': 'Копировать ссылку',
    'dashboard.copied': 'Скопировано!',
    'dashboard.delete': 'Удалить',
    'dashboard.deleteConfirm': 'Вы уверены, что хотите удалить это приглашение?',
    'dashboard.views': 'просм.',

    // Step 1
    'step1.title': 'Выберите тип события',
    'step1.desc': 'Для какого мероприятия создаём приглашение?',
    'step1.next': 'Продолжить →',

    // Step 2
    'step2.title': 'Выберите шаблон',
    'step2.count': 'шаблонов доступно',
    'step2.empty': 'Шаблоны для этого типа не найдены',
    'step2.next': 'Продолжить →',
    'step2.back': '← Назад',

    // Step 3
    'step3.title': 'Заполните содержимое',
    'step3.desc': 'Укажите детали приглашения',
    'step3.host': 'Имя хозяина',
    'step3.guest': 'Имя гостя',
    'step3.eventTitle': 'Название события',
    'step3.date': 'Дата',
    'step3.time': 'Время',
    'step3.location': 'Место',
    'step3.mapLink': 'Ссылка на карту',
    'step3.message': 'Сообщение',
    'step3.messagePlaceholder': 'Приглашаем вас на наше торжество...',
    'step3.templateFields': 'Поля шаблона',
    'step3.extras': 'Дополнительные настройки',
    'step3.music': 'Фоновая музыка (ссылка)',
    'step3.telegram': 'Telegram Бот (для пожеланий)',
    'step3.preview': 'Предпросмотр',
    'step3.hide': 'Скрыть',
    'step3.show': 'Показать',
    'step3.next': 'Предпросмотр →',
    'step3.back': '← Назад',
    'step3.dateLocation': 'Дата и место',
    'step3.basicInfo': 'Основная информация',
    'step3.langSettings': 'Настройки языка',
    'step3.langUz': 'Только узбекский',
    'step3.langUzru': 'Два языка',
    'step3.langRu': 'Только русский',
    'step3.langRuDesc': 'Приглашение полностью на русском',
    'step3.langUzruDesc': 'Гости увидят переключатель UZ/RU',
    'step3.ruHostName': 'Имя хозяина',
    'step3.ruGuestName': 'Имя гостя',
    'step3.ruEventTitle': 'Название мероприятия',
    'step3.ruMessage': 'Сообщение',
    'step3.program': 'Программа',
    'step3.programRu': 'Программа (рус)',
    'step3.addItem': 'Добавить пункт',
    'step3.addItemRu': 'Добавить пункт',
    'step3.musicHint': 'Прямая ссылка на MP3 файл',
    'step3.telegramHint': 'Формат: BOT_TOKEN:CHAT_ID — получите у @BotFather',

    // Step 4
    'step4.title': 'Полный предпросмотр',
    'step4.desc': 'Так будет выглядеть приглашение — с музыкой, анимациями и переключателем языка',
    'step4.desktop': 'Десктоп',
    'step4.mobile': 'Мобильный',
    'step4.fullscreen': 'Полный экран',
    'step4.fullscreenTitle': 'Полный просмотр',
    'step4.back': '← Редактировать',
    'step4.generate': 'Создать ссылку',

    // Step 5
    'step5.title': 'Приглашение готово! 🎉',
    'step5.ready': 'Готовы создать ссылку?',
    'step5.desc': 'Ваше премиум приглашение создано',
    'step5.link': 'Ссылка на приглашение',
    'step5.copy': 'Копировать',
    'step5.copied': 'Скопировано!',
    'step5.open': 'Открыть',
    'step5.createAnother': 'Создать ещё',
    'step5.share': 'Поделиться',
    'step5.views': 'Просмотры',

    // Footer
    'footer.copyright': '© 2026 Taklifnoma — Все права защищены',

    // Common
    'common.loading': 'Загрузка...',
    'common.error': 'Произошла ошибка',
  },
};

const LangContext = createContext();

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('taklifnoma-lang') || 'uz';
  });

  useEffect(() => {
    localStorage.setItem('taklifnoma-lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key) => translations[lang]?.[key] || translations.uz[key] || key;
  const toggleLang = () => setLang(lang === 'uz' ? 'ru' : 'uz');

  return (
    <LangContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
