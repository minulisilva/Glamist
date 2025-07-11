// src/LanguageContext.js
import React, { createContext, useState, useContext } from 'react';

// Define translations
const translations = {
  en: {
    // Home.jsx translations
    welcome: 'Welcome to Glamist',
    heroText: 'Discover a world of beauty at Glamist! From expert hair styling to luxurious skin care, we bring your vision to life with unparalleled style and care.',
    bookNow: 'Book Now',
    ourWork: 'Our Work',
    servicesTitle: 'Our Signature Services',
    servicesText: 'Explore our top-tier salon services crafted to enhance your beauty and confidence.',
    awardsTitle: 'Our Awards',
    awardsText: 'We’re proud to be recognized for our excellence in beauty and service.',
    testimonialsTitle: 'What Our Clients Say',
    // App.jsx translations
    home: 'Home',
    hair: 'Hair',
    nail: 'Nail',
    tattoo: 'Tattoo',
    piercings: 'Piercings',
    skin: 'Skin',
    aboutUs: 'About Us',
    contact: 'Contact',
    logIn: 'Log In',
    signUp: 'Sign Up',
    notFoundTitle: '404 - Page Not Found',
    notFoundText: 'The page you\'re looking for doesn\'t exist.',
    goToHome: 'Go to Home',
    footerTagline: 'Empowering salon professionals with cutting-edge management solutions. Elevate your business with Glamist.',
    quickLinks: 'Quick Links',
    contactUs: 'Contact Us',
    email: 'Email: ',
    phone: 'Phone: ',
    address: 'SLIIT, Kandy',
    copyright: `© ${new Date().getFullYear()} Glamist. All rights reserved.`,
    designedBy: 'Designed by SLIIT 2nd Year Undergraduates',
  },
  es: {
    welcome: 'Bienvenido a Glamist',
    heroText: '¡Descubre un mundo de belleza en Glamist! Desde peinados expertos hasta cuidados de la piel de lujo, damos vida a tu visión con estilo y cuidado inigualables.',
    bookNow: 'Reservar Ahora',
    ourWork: 'Nuestro Trabajo',
    servicesTitle: 'Nuestros Servicios Exclusivos',
    servicesText: 'Explora nuestros servicios de salón de primera categoría diseñados para realzar tu belleza y confianza.',
    awardsTitle: 'Nuestros Premios',
    awardsText: 'Estamos orgullosos de ser reconocidos por nuestra excelencia en belleza y servicio.',
    testimonialsTitle: 'Lo Que Dicen Nuestros Clientes',
    home: 'Inicio',
    hair: 'Cabello',
    nail: 'Uñas',
    tattoo: 'Tatuaje',
    piercings: 'Perforaciones',
    skin: 'Piel',
    aboutUs: 'Sobre Nosotros',
    contact: 'Contacto',
    logIn: 'Iniciar Sesión',
    signUp: 'Registrarse',
    notFoundTitle: '404 - Página No Encontrada',
    notFoundText: 'La página que buscas no existe.',
    goToHome: 'Ir a Inicio',
    footerTagline: 'Potenciando a los profesionales de salones con soluciones de gestión avanzadas. Eleva tu negocio con Glamist.',
    quickLinks: 'Enlaces Rápidos',
    contactUs: 'Contáctanos',
    email: 'Correo: ',
    phone: 'Teléfono: ',
    address: 'SLIIT, Kandy',
    copyright: `© ${new Date().getFullYear()} Glamist. Todos los derechos reservados.`,
    designedBy: 'Diseñado por estudiantes de segundo año de SLIIT',
  },
  it: {
    welcome: 'Benvenuto a Glamist',
    heroText: 'Scopri un mondo di bellezza con Glamist! Dall’acconciatura esperta alla cura della pelle di lusso, diamo vita alla tua visione con stile e attenzione senza pari.',
    bookNow: 'Prenota Ora',
    ourWork: 'Il Nostro Lavoro',
    servicesTitle: 'I Nostri Servizi Esclusivi',
    servicesText: 'Esplora i nostri servizi di salone di alta qualità progettati per valorizzare la tua bellezza e fiducia.',
    awardsTitle: 'I Nostri Premi',
    awardsText: 'Siamo orgogliosi di essere riconosciuti per la nostra eccellenza in bellezza e servizio.',
    testimonialsTitle: 'Cosa Dicono i Nostri Clienti',
    home: 'Home',
    hair: 'Capelli',
    nail: 'Unghie',
    tattoo: 'Tatuaggi',
    piercings: 'Piercing',
    skin: 'Pelle',
    aboutUs: 'Chi Siamo',
    contact: 'Contatti',
    logIn: 'Accedi',
    signUp: 'Registrati',
    notFoundTitle: '404 - Pagina Non Trovata',
    notFoundText: 'La pagina che stai cercando non esiste.',
    goToHome: 'Torna alla Home',
    footerTagline: 'Potenziamento dei professionisti dei saloni con soluzioni di gestione all’avanguardia. Eleva il tuo business con Glamist.',
    quickLinks: 'Link Rapidi',
    contactUs: 'Contattaci',
    email: 'Email: ',
    phone: 'Telefono: ',
    address: 'SLIIT, Kandy',
    copyright: `© ${new Date().getFullYear()} Glamist. Tutti i diritti riservati.`,
    designedBy: 'Progettato da studenti del secondo anno di SLIIT',
  },
  si: {
    welcome: 'ග්ලැමිස්ට් වෙත සාදරයෙන් පිළිගනිමු',
    heroText: 'ග්ලැමිස්ට් හි ලස්සන ලෝකයක් සොයා ගන්න! විශේෂඥ හිසකෙස් සැකසුම් සිට සුඛෝපභෝගී සම රැකවරණය දක්වා, අපි ඔබේ දැක්ම අසමසම විලාසයෙන් සහ රැකවරණයෙන් ජීවමාන කරමු.',
    bookNow: 'දැන් වෙන්කර ගන්න',
    ourWork: 'අපේ වැඩ',
    servicesTitle: 'අපේ සුවිශේෂී සේවා',
    servicesText: 'ඔබේ ලස්සන සහ විශ්වාසය වැඩි කිරීමට සකස් කර ඇති අපගේ ඉහළම සැලෝන් සේවා ගවේෂණය කරන්න.',
    awardsTitle: 'අපේ සම්මාන',
    awardsText: 'ලස්සන සහ සේවයේ විශිෂ්ටත්වය සඳහා අපට පිළිගැනීමක් ලැබීම ගැන අපි ආඩම්බර වෙමු.',
    testimonialsTitle: 'අපේ ගනුදෙනුකරුවන් පවසන දේ',
    home: 'මුල් පිටුව',
    hair: 'හිසකෙස්',
    nail: 'නියපොතු',
    tattoo: 'ටැටූ',
    piercings: 'පිහිටුවීම්',
    skin: 'සම',
    aboutUs: 'අප ගැන',
    contact: 'සම්බන්ධ කරන්න',
    logIn: 'පිවිසෙන්න',
    signUp: 'ලියාපදිංචි වන්න',
    notFoundTitle: '404 - පිටුව හමු නොවිණි',
    notFoundText: 'ඔබ සොයන පිටුව නොපවතී.',
    goToHome: 'මුල් පිටුවට යන්න',
    footerTagline: 'සැලෝන් වෘත්තිකයන්ට නවීන කළමනාකරණ විසඳුම් සමඟ බලය ලබා දෙයි. ග්ලැමිස්ට් සමඟ ඔබේ ව්‍යාපාරය ඉහළ නංවන්න.',
    quickLinks: 'ඉක්මන් සබැඳි',
    contactUs: 'අප හා සම්බන්ධ වන්න',
    email: 'ඊමේල්: ',
    phone: 'දුරකථන: ',
    address: 'SLIIT, කැන්ඩි',
    copyright: `© ${new Date().getFullYear()} ග්ලැමිස්ට්. සියලු හිමිකම් ඇවිරිණි.`,
    designedBy: 'SLIIT දෙවන වසරේ උපාධි අපේක්ෂකයින් විසින් නිර්මාණය කරන ලදි',
  },
  ja: {
    welcome: 'グラミストへようこそ',
    heroText: 'グラミストで美の世界を発見してください！専門的なヘアスタイリングから贅沢なスキンケアまで、あなたのビジョンを比類のないスタイルとケアで実現します。',
    bookNow: '今すぐ予約',
    ourWork: '私たちの作品',
    servicesTitle: '私たちのシグネチャーサービス',
    servicesText: 'あなたの美しさと自信を高めるために作られた、最高級のサロンサービスをご覧ください。',
    awardsTitle: '私たちの受賞歴',
    awardsText: '美しさとサービスの卓越性が認められ、誇りに思います。',
    testimonialsTitle: 'お客様の声',
    home: 'ホーム',
    hair: 'ヘア',
    nail: 'ネイル',
    tattoo: 'タトゥー',
    piercings: 'ピアス',
    skin: 'スキン',
    aboutUs: '私たちについて',
    contact: 'お問い合わせ',
    logIn: 'ログイン',
    signUp: 'サインアップ',
    notFoundTitle: '404 - ページが見つかりません',
    notFoundText: 'お探しのページは存在しません。',
    goToHome: 'ホームへ戻る',
    footerTagline: 'サロンのプロフェッショナルに最先端の管理ソリューションを提供します。グラミストでビジネスを向上させましょう。',
    quickLinks: 'クイックリンク',
    contactUs: 'お問い合わせ',
    email: 'メール: ',
    phone: '電話: ',
    address: 'SLIIT、カンディ',
    copyright: `© ${new Date().getFullYear()} グラミスト。全著作権所有。`,
    designedBy: 'SLIIT 2年生の学部生によって設計されました',
  },
  ko: {
    welcome: '글래미스트에 오신 것을 환영합니다',
    heroText: '글래미스트에서 아름다움의 세계를 발견하세요! 전문 헤어 스타일링부터 럭셔리한 스킨케어까지, 당신의 비전을 독보적인 스타일과 케어로 실현합니다.',
    bookNow: '지금 예약',
    ourWork: '우리의 작품',
    servicesTitle: '우리의 시그니처 서비스',
    servicesText: '당신의 아름다움과 자신감을 향상시키기 위해 제작된 최고급 살롱 서비스를 탐험하세요.',
    awardsTitle: '우리의 수상 경력',
    awardsText: '아름다움과 서비스의 우수성을 인정받아 자랑스럽습니다.',
    testimonialsTitle: '고객의 말',
    home: '홈',
    hair: '헤어',
    nail: '네일',
    tattoo: '타투',
    piercings: '피어싱',
    skin: '스킨',
    aboutUs: '회사 소개',
    contact: '연락처',
    logIn: '로그인',
    signUp: '가입하기',
    notFoundTitle: '404 - 페이지를 찾을 수 없습니다',
    notFoundText: '찾고 있는 페이지가 존재하지 않습니다.',
    goToHome: '홈으로 가기',
    footerTagline: '최첨단 관리 솔루션으로 살롱 전문가를 지원합니다. 글래미스트로 비즈니스를 향상시키세요.',
    quickLinks: '빠른 링크',
    contactUs: '문의하기',
    email: '이메일: ',
    phone: '전화: ',
    address: 'SLIIT, 캔디',
    copyright: `© ${new Date().getFullYear()} 글래미스트. 모든 권리 보유.`,
    designedBy: 'SLIIT 2학년 학부생이 설계했습니다',
  },
};

// Create the context
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // Default to English
  const value = {
    language,
    setLanguage,
    t: (key) => translations[language][key] || key, // Translation function
  };
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);