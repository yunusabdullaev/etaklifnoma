import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  uz: {
    // Header
    'header.title': 'Taklifnoma',
    'header.subtitle': 'Premium taklifnomalar',
    'header.cabinet': 'Kabinet',
    'header.create': 'Yaratish',
    'header.support': 'Yordam',
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
    'auth.back': 'Orqaga',

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
    'dashboard.edit': 'Tahrirlash',
    'dashboard.editTitle': 'Taklifnomani tahrirlash',
    'dashboard.save': 'Saqlash',
    'dashboard.editSaved': 'Muvaffaqiyatli saqlandi!',
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
    'step3.langDesc': "Taklifnomada qaysi tillar bo'lsin?",
    'step3.langUzToggle': "O'zbek tili",
    'step3.langQqToggle': "Qaraqalpoq tili",
    'step3.langRuToggle': "Rus tili",
    'step3.ruFields': 'Ruscha matnlar',
    'step3.qqFields': 'Qaraqalpoqcha matnlar',
    'step3.ruHostName': 'Имя хозяина (ruscha)',
    'step3.ruGuestName': 'Имя гостя (ruscha)',
    'step3.ruEventTitle': 'Название мероприятия (ruscha)',
    'step3.ruMessage': 'Сообщение (ruscha)',
    'step3.qqHostName': 'Mezban atı (qaraqalpoqcha)',
    'step3.qqGuestName': 'Mehman atı (qaraqalpoqcha)',
    'step3.qqEventTitle': 'Ilaje atı (qaraqalpoqcha)',
    'step3.qqMessage': 'Xabar (qaraqalpoqcha)',
    'step3.program': 'Bayram dasturi',
    'step3.programRu': 'Программа (ruscha)',
    'step3.programQq': 'Bag\'darlanma (qaraqalpoqcha)',
    'step3.addItem': "Punkt qo'shish",
    'step3.addItemRu': 'Добавить пункт',
    'step3.addItemQq': 'Punkt qosıw',
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

    // Support
    'support.title': 'Yordam markazi',
    'support.subtitle': 'Muammo yoki savolingiz bormi?',
    'support.newTicket': 'Yangi murojaat',
    'support.subject': 'Mavzu',
    'support.subjectPlaceholder': 'Masalan: Shablon yuklanmayapti',
    'support.message': 'Xabar',
    'support.messagePlaceholder': 'Muammoingizni batafsil yozing...',
    'support.send': 'Yuborish',
    'support.cancel': 'Bekor qilish',
    'support.sent': 'Murojaat yuborildi!',
    'support.empty': "Hozircha murojaatingiz yo'q",
    'support.emptyDesc': "Muammo bo'lsa, yuqoridagi tugmani bosing",
    'support.back': 'Orqaga',
    'support.loading': 'Xabarlar yuklanmoqda...',
    'support.inputPlaceholder': 'Xabar yozing...',
    'support.waiting': 'Kutilmoqda',
    'support.answered': 'Javob berildi',
    'support.closed': 'Yopilgan',
    'support.admin': 'Support',

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
    'header.support': 'Помощь',
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
    'auth.back': 'Назад',

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
    'dashboard.edit': 'Редактировать',
    'dashboard.editTitle': 'Редактирование приглашения',
    'dashboard.save': 'Сохранить',
    'dashboard.editSaved': 'Успешно сохранено!',
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
    'step3.langDesc': 'Какие языки использовать в приглашении?',
    'step3.langUzToggle': 'Узбекский',
    'step3.langQqToggle': 'Каракалпакский',
    'step3.langRuToggle': 'Русский',
    'step3.ruFields': 'Тексты на русском',
    'step3.qqFields': 'Тексты на каракалпакском',
    'step3.ruHostName': 'Имя хозяина',
    'step3.ruGuestName': 'Имя гостя',
    'step3.ruEventTitle': 'Название мероприятия',
    'step3.ruMessage': 'Сообщение',
    'step3.qqHostName': 'Mezban atı',
    'step3.qqGuestName': 'Mehman atı',
    'step3.qqEventTitle': 'Ilaje atı',
    'step3.qqMessage': 'Xabar',
    'step3.program': 'Программа',
    'step3.programRu': 'Программа (рус)',
    'step3.programQq': 'Бағдарланма (қарақалпақша)',
    'step3.addItem': 'Добавить пункт',
    'step3.addItemRu': 'Добавить пункт',
    'step3.addItemQq': 'Пункт қосыў',
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

    // Support
    'support.title': 'Центр поддержки',
    'support.subtitle': 'Есть проблема или вопрос?',
    'support.newTicket': 'Новое обращение',
    'support.subject': 'Тема',
    'support.subjectPlaceholder': 'Например: Шаблон не загружается',
    'support.message': 'Сообщение',
    'support.messagePlaceholder': 'Опишите проблему подробно...',
    'support.send': 'Отправить',
    'support.cancel': 'Отмена',
    'support.sent': 'Обращение отправлено!',
    'support.empty': 'Обращений пока нет',
    'support.emptyDesc': 'Если есть проблема, нажмите кнопку выше',
    'support.back': 'Назад',
    'support.loading': 'Загрузка сообщений...',
    'support.inputPlaceholder': 'Напишите сообщение...',
    'support.waiting': 'Ожидание',
    'support.answered': 'Ответили',
    'support.closed': 'Закрыто',
    'support.admin': 'Поддержка',

    // Common
    'common.loading': 'Загрузка...',
    'common.error': 'Произошла ошибка',
  },

  qq: {
    // Header
    'header.title': 'Taklifnama',
    'header.subtitle': 'Premium mırájatlar',
    'header.cabinet': 'Kabinet',
    'header.create': 'Jaratıw',
    'header.support': 'Járdem',
    'header.step': 'Qadam',
    'header.logout': 'Shıǵıw',

    // Auth
    'auth.login': 'Kiriw',
    'auth.register': 'Dizimnen otiw',
    'auth.phone': 'Telefon nomer',
    'auth.password': 'Parol',
    'auth.name': 'Atıńız',
    'auth.loginBtn': 'Kiriw →',
    'auth.registerBtn': 'Dizimnen otiw →',
    'auth.otpTitle': 'Tastıyıqlaw kodı',
    'auth.otpDesc': 'Telegram botqa jiberilgen 6 sanlı kodni kiritiń',
    'auth.otpResend': 'Qayta jiberiw',
    'auth.otpBack': 'Artqa',
    'auth.otpExpires': 'Kod járamlilik múddeti:',
    'auth.noAccount': 'Akkauntıńız joqpa?',
    'auth.hasAccount': 'Akkauntıńız barma?',
    'auth.back': 'Artına',

    // Dashboard
    'dashboard.title': 'Meniń mırájatlarım',
    'dashboard.total': 'mırájat',
    'dashboard.empty': 'Házirshe mırájat jaratılmaǵan',
    'dashboard.emptyTitle': 'Házirshe mırájat joq',
    'dashboard.emptyDesc': 'Birinshi premium mırájatıńızdı jaratıń — toy, tuwılǵan kún, yubilej yaki pitkeriwshiler keshesi ushın!',
    'dashboard.createBtn': 'Mırájat jaratıw',
    'dashboard.newBtn': 'Jańa jaratıw',
    'dashboard.view': 'Kóriw',
    'dashboard.copyLink': 'Siltemeni kóshiriw',
    'dashboard.copied': 'Kóshirildi!',
    'dashboard.delete': 'Óshiriw',
    'dashboard.deleteConfirm': 'Usı mırájattı óshiriwdi qáleysizbe?',
    'dashboard.edit': 'Redaktorlaw',
    'dashboard.editTitle': 'Mırájattı redaktorlaw',
    'dashboard.save': 'Saqlaw',
    'dashboard.editSaved': 'Tabıslı saqlandı!',
    'dashboard.views': 'kóriw',

    // Step 1
    'step1.title': 'Ilaje túrin tańlań',
    'step1.desc': 'Qanday márásim ushın mırájat jaratpaqshısız?',
    'step1.next': 'Dawam etiw →',

    // Step 2
    'step2.title': 'Shablon tańlań',
    'step2.count': 'shablon bar',
    'step2.empty': 'Usı túr ushın shablon tabılmadı',
    'step2.next': 'Dawam etiw →',
    'step2.back': '← Artqa',

    // Step 3
    'step3.title': 'Mazmunın kiritiń',
    'step3.desc': 'Mırájat maǵlıwmatların toltırıń',
    'step3.host': 'Mezban atı',
    'step3.guest': 'Mehman atı',
    'step3.eventTitle': 'Ilaje atı',
    'step3.date': 'Sána',
    'step3.time': 'Waqıt',
    'step3.location': 'Mánzil',
    'step3.mapLink': 'Karta siltemesi',
    'step3.message': 'Xabar',
    'step3.messagePlaceholder': 'Sizdi márásimimizge shaqıramız...',
    'step3.templateFields': 'Shablon maydanları',
    'step3.extras': 'Qosımsha sazlamalar',
    'step3.music': 'Fon muzıkası (silteme)',
    'step3.telegram': 'Telegram Bot (tilewler ushın)',
    'step3.preview': 'Kórinisi',
    'step3.hide': 'Jasırıw',
    'step3.show': 'Kórsetiw',
    'step3.next': 'Kóriw →',
    'step3.back': '← Artqa',
    'step3.dateLocation': 'Sána hám orın',
    'step3.basicInfo': 'Tiykarǵı maǵlıwmatlar',
    'step3.langSettings': 'Til sazlamaları',
    'step3.langDesc': 'Mırájatda qaysi tiller bolsın?',
    'step3.langUzToggle': 'Ózbek tili',
    'step3.langQqToggle': 'Qaraqalpaq tili',
    'step3.langRuToggle': 'Rus tili',
    'step3.ruFields': 'Russha tekstler',
    'step3.qqFields': 'Qaraqalpaqsha tekstler',
    'step3.ruHostName': 'Имя хозяина (russha)',
    'step3.ruGuestName': 'Имя гостя (russha)',
    'step3.ruEventTitle': 'Название мероприятия (russha)',
    'step3.ruMessage': 'Сообщение (russha)',
    'step3.qqHostName': 'Mezban atı (qaraqalpaqsha)',
    'step3.qqGuestName': 'Mehman atı (qaraqalpaqsha)',
    'step3.qqEventTitle': 'Ilaje atı (qaraqalpaqsha)',
    'step3.qqMessage': 'Xabar (qaraqalpaqsha)',
    'step3.program': 'Bag\'darlanma',
    'step3.programRu': 'Программа (russha)',
    'step3.programQq': 'Bag\'darlanma (qaraqalpaqsha)',
    'step3.addItem': 'Punkt qosıw',
    'step3.addItemRu': 'Добавить пункт',
    'step3.addItemQq': 'Punkt qosıw',
    'step3.musicHint': 'MP3 faylǵa tuwrıdan-tuwrı silteme',
    'step3.telegramHint': 'Format: BOT_TOKEN:CHAT_ID — @BotFather dan alıń',

    // Step 4
    'step4.title': 'Tolıq kóriw',
    'step4.desc': 'Mırájat usınday kóriniste boladı — muzıka, animatsiyalar, til almasıw menen',
    'step4.desktop': 'Desktop',
    'step4.mobile': 'Mobil',
    'step4.fullscreen': 'Tolıq ekran',
    'step4.fullscreenTitle': 'Tolıq kóriw',
    'step4.back': '← Redaktorlaw',
    'step4.generate': 'Silteme jaratıw',

    // Step 5
    'step5.title': 'Mırájat tayar! 🎉',
    'step5.ready': 'Silteme jaratıwǵa tayarsızba?',
    'step5.desc': 'Premium mırájatıńız jaratıldı',
    'step5.link': 'Mırájat siltemesi',
    'step5.copy': 'Kóshiriw',
    'step5.copied': 'Kóshirildi!',
    'step5.open': 'Ashıw',
    'step5.createAnother': 'Jańa jaratıw',
    'step5.share': 'Bólisiw',
    'step5.views': 'Kóriwler',

    // Footer
    'footer.copyright': '© 2026 Taklifnama — Barlıq huqıqlar qorǵalǵan',

    // Support
    'support.title': 'Járdem oraylıǵı',
    'support.subtitle': 'Máselingiz yamasa sorawıngız barma?',
    'support.newTicket': 'Jańa múrájaat',
    'support.subject': 'Tema',
    'support.subjectPlaceholder': 'Mısalı: Shablon júklenbeypti',
    'support.message': 'Xabar',
    'support.messagePlaceholder': 'Máseleńizdi tolıq jazıń...',
    'support.send': 'Jiberiw',
    'support.cancel': 'Biykar etiw',
    'support.sent': 'Múrájaat jiberildi!',
    'support.empty': 'Házirge kúnge múrájaatıńız joq',
    'support.emptyDesc': 'Másele bolsa, joqarıdaǵı túymeni basıń',
    'support.back': 'Artqa',
    'support.loading': 'Xabarlar júklenip atır...',
    'support.inputPlaceholder': 'Xabar jazıń...',
    'support.waiting': 'Kútilmoqda',
    'support.answered': 'Juwap berildi',
    'support.closed': 'Jabılǵan',
    'support.admin': 'Qollaw',

    // Common
    'common.loading': 'Júklenip atır...',
    'common.error': 'Qátelik júz berdi',
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
  const toggleLang = () => {
    const cycle = ['uz', 'qq', 'ru'];
    const idx = cycle.indexOf(lang);
    setLang(cycle[(idx + 1) % cycle.length]);
  };

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
