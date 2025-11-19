import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/LanguageSelector.css';

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="language-selector">
      <button
        className={`lang-btn ${i18n.language === 'pt-BR' ? 'active' : ''}`}
        onClick={() => handleLanguageChange('pt-BR')}
        title="Português"
      >
        🇧🇷 PT
      </button>
      <button
        className={`lang-btn ${i18n.language === 'en-US' ? 'active' : ''}`}
        onClick={() => handleLanguageChange('en-US')}
        title="English"
      >
        🇺🇸 EN
      </button>
    </div>
  );
}
