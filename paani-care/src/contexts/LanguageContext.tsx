import React, { createContext, useContext, useState, useEffect } from 'react';

// Language definitions for Northeast India and other major languages
export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
}

export const languages: Language[] = [
  // English and Hindi
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', region: 'International' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', region: 'India' },
  
  // Northeast Indian Languages
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🏔️', region: 'Assam' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🌾', region: 'West Bengal/Tripura' },
  { code: 'bpy', name: 'Bishnupriya', nativeName: 'বিষ্ণুপ্রিয়া মণিপুরী', flag: '🏞️', region: 'Manipur' },
  { code: 'mni', name: 'Manipuri', nativeName: 'মৈতৈলোন্', flag: '🏔️', region: 'Manipur' },
  { code: 'kha', name: 'Khasi', nativeName: 'কা খাসি', flag: '⛰️', region: 'Meghalaya' },
  { code: 'grt', name: 'Garo', nativeName: 'আ•চিক কাতা', flag: '🌲', region: 'Meghalaya' },
  { code: 'lus', name: 'Mizo', nativeName: 'Mizo ṭawng', flag: '🌿', region: 'Mizoram' },
  { code: 'nag', name: 'Nagamese', nativeName: 'নাগামিজ', flag: '🏞️', region: 'Nagaland' },
  { code: 'sck', name: 'Sadri', nativeName: 'सादरी', flag: '🌱', region: 'Jharkhand/Assam' },
  { code: 'bo', name: 'Tibetan', nativeName: 'བོད་སྐད་', flag: '🏔️', region: 'Sikkim/Arunachal' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', flag: '🇳🇵', region: 'Sikkim/Darjeeling' },
  { code: 'dz', name: 'Dzongkha', nativeName: 'རྫོང་ཁ', flag: '🏔️', region: 'Bhutan border areas' },
  
  // Additional Indian Languages
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🌾', region: 'Andhra Pradesh' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🌴', region: 'Tamil Nadu' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🌺', region: 'Karnataka' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🥥', region: 'Kerala' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🦚', region: 'Gujarat' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🏛️', region: 'Maharashtra' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🌾', region: 'Punjab' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🏛️', region: 'Odisha' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🌙', region: 'Urdu speaking regions' },
  
  // International Languages
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', region: 'China border areas' },
  { code: 'my', name: 'Burmese', nativeName: 'မြန်မာဘာသာ', flag: '🇲🇲', region: 'Myanmar border' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', region: 'Thailand' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', region: 'Vietnam' }
];

// Translation keys and content
export interface Translations {
  [key: string]: {
    [langCode: string]: string;
  };
}

export const translations: Translations = {
  // Navigation
  'nav.home': {
    en: 'Home',
    hi: 'होम',
    as: 'ঘৰ',
    bn: 'হোম',
    mni: 'য়ুম',
    kha: 'কা জিংইয়াহ',
    grt: 'দাক গিমিক',
    lus: 'In',
    ne: 'घर',
    bo: 'ཁྱིམ',
    te: 'హోమ్',
    ta: 'முகப்பு',
    zh: '首页',
    my: 'အိမ်'
  },
  'nav.dashboard': {
    en: 'Dashboard',
    hi: 'डैशबोर्ड',
    as: 'ডেছবৰ্ড',
    bn: 'ড্যাশবোর্ড',
    mni: 'ডেশবোর্ড',
    kha: 'ডেশবোর্ড',
    grt: 'ডেশবোর্ড',
    lus: 'Dashboard',
    ne: 'ड्यासबोर्ड',
    bo: 'ལས་འགན',
    te: 'డాష్‌బోర్డ్',
    ta: 'டாஷ்போர்டு',
    zh: '仪表板',
    my: 'ဒက်ရှ်ဘုတ်'
  },
  'nav.map': {
    en: 'Map',
    hi: 'नक्शा',
    as: 'মানচিত্ৰ',
    bn: 'মানচিত্র',
    mni: 'মেপ',
    kha: 'কা মানচিত্র',
    grt: 'নাক্সা',
    lus: 'Map',
    ne: 'नक्सा',
    bo: 'ས་བཀྲ',
    te: 'మ్యాప్',
    ta: 'வரைபடம்',
    zh: '地图',
    my: 'မြေပုံ'
  },
  'nav.gallery': {
    en: 'Gallery',
    hi: 'गैलरी',
    as: 'গেলাৰী',
    bn: 'গ্যালারি',
    mni: 'গেলারি',
    kha: 'গেলারি',
    grt: 'গেলারি',
    lus: 'Gallery',
    ne: 'ग्यालरी',
    bo: 'པར་ཁང',
    te: 'గ్యాలరీ',
    ta: 'படக்காட்சி',
    zh: '画廊',
    my: 'ပြခန်း'
  },
  'nav.news': {
    en: 'News',
    hi: 'समाचार',
    as: 'বাতৰি',
    bn: 'সংবাদ',
    mni: 'পাউজেল',
    kha: 'কা খবর',
    grt: 'খবৰ',
    lus: 'Thuthlung',
    ne: 'समाचार',
    bo: 'གསར་འགྱུར',
    te: 'వార్తలు',
    ta: 'செய்திகள்',
    zh: '新闻',
    my: 'သတင်း'
  },
  'nav.about': {
    en: 'About',
    hi: 'के बारे में',
    as: 'বিষয়ে',
    bn: 'সম্পর্কে',
    mni: 'মতাং',
    kha: 'কা জিংই',
    grt: 'গিসিক',
    lus: 'Chungchang',
    ne: 'बारेमा',
    bo: 'སྐོར',
    te: 'గురించి',
    ta: 'பற்றி',
    zh: '关于',
    my: 'အကြောင်း'
  },
  'nav.contact': {
    en: 'Contact',
    hi: 'संपर्क',
    as: 'যোগাযোগ',
    bn: 'যোগাযোগ',
    mni: 'যোগাযোগ',
    kha: 'জোগাযোগ',
    grt: 'জোগাজোগ',
    lus: 'Biak',
    ne: 'सम्पर्क',
    bo: 'འབྲེལ་བ',
    te: 'సంప్రదించండి',
    ta: 'தொடர்பு',
    zh: '联系',
    my: 'ဆက်သွယ်'
  },
  
  // Common actions
  'action.login': {
    en: 'Login',
    hi: 'लॉगिन',
    as: 'লগইন',
    bn: 'লগইন',
    mni: 'লগইন',
    kha: 'লগইন',
    grt: 'লগইন',
    lus: 'Login',
    ne: 'लगइन',
    bo: 'ནང་འཇུག',
    te: 'లాగిన్',
    ta: 'உள்நுழைவு',
    zh: '登录',
    my: 'လော့ဂ်အင်'
  },
  'action.register': {
    en: 'Get Started',
    hi: 'शुरू करें',
    as: 'আৰম্ভ কৰক',
    bn: 'শুরু করুন',
    mni: 'হৌগদবনি',
    kha: 'হা শুৰু',
    grt: 'শুৰু কৰক',
    lus: 'Tan la',
    ne: 'सुरु गर्नुहोस्',
    bo: 'འགོ་བཙུགས',
    te: 'ప్రారంభించండి',
    ta: 'தொடங்குங்கள்',
    zh: '开始',
    my: 'စတင်ပါ'
  },
  'action.logout': {
    en: 'Logout',
    hi: 'लॉगआउट',
    as: 'লগআউট',
    bn: 'লগআউট',
    mni: 'লগআউট',
    kha: 'লগআউট',
    grt: 'লগআউট',
    lus: 'Logout',
    ne: 'लगआउट',
    bo: 'ཕྱིར་འཐོན',
    te: 'లాగౌట్',
    ta: 'வெளியேறு',
    zh: '退出',
    my: 'လော့ဂ်အောက်'
  },
  'theme.light': {
    en: 'Light Mode',
    hi: 'लाइट मोड',
    as: 'লাইট মোড',
    bn: 'হালকা মোড',
    mni: 'মংগল মোড',
    kha: 'লাইট মোড',
    grt: 'লাইট মোড',
    lus: 'Light Mode',
    ne: 'उज्यालो मोड',
    bo: 'འོད་མདངས',
    te: 'లైట్ మోడ్',
    ta: 'ஒளி முறை',
    zh: '浅色模式',
    my: 'အလင်းမုဒ်'
  },
  'theme.dark': {
    en: 'Dark Mode',
    hi: 'डार्क मोड',
    as: 'ডাৰ্ক মোড',
    bn: 'অন্ধকার মোড',
    mni: 'আমিবা মোড',
    kha: 'ডাৰ্ক মোড',
    grt: 'ডাৰ্ক মোড',
    lus: 'Dark Mode',
    ne: 'अँध्यारो मोड',
    bo: 'མུན་པའི',
    te: 'డార్క్ మోడ్',
    ta: 'இருண்ட முறை',
    zh: '深色模式',
    my: 'အမှောင်မုဒ်'
  },
  'language.select': {
    en: 'Select Language',
    hi: 'भाषा चुनें',
    as: 'ভাষা বাছক',
    bn: 'ভাষা নির্বাচন করুন',
    mni: 'লোল খনবা',
    kha: 'কা কতিয়েন বা নং রিং',
    grt: 'কু কাতা দিলানি',
    lus: 'Ṭawng thlan',
    ne: 'भाषा छान्नुहोस्',
    bo: 'སྐད་ཡིག་འདེམས',
    te: 'భాష ఎంచుకోండి',
    ta: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    zh: '选择语言',
    my: 'ဘာသာစကားရွေးချယ်ပါ'
  }
};

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]); // Default to English

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('paani-care-language');
    if (savedLanguage) {
      const found = languages.find(lang => lang.code === savedLanguage);
      if (found) {
        setCurrentLanguage(found);
      }
    }
  }, []);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('paani-care-language', language.code);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    
    return translation[currentLanguage.code] || translation['en'] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageProvider;