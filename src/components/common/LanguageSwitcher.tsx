import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'km';

  const toggleLanguage = () => {
    const nextLang = currentLang === 'km' ? 'en' : 'km';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('bg_sla_language', nextLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl bg-white hover:bg-gray-100 text-[#232F3F] border border-gray-200 hover:border-gray-300 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white dark:border-white/20 dark:hover:border-white/40 transition-all shadow-xs cursor-pointer active:scale-95"
      title="Switch Language / ប្តូរភាសា (ENG: Montserrat | KHM: Kantumruy Pro)"
    >
      <Globe className="w-4 h-4 text-[#77BC1F]" />
      <span className={currentLang === 'km' ? 'font-khmer font-bold' : 'font-english font-bold'}>
        {currentLang === 'km' ? '🇰🇭 ភាសាខ្មែរ' : '🇬🇧 English'}
      </span>
    </button>
  );
};
