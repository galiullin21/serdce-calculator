import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ruTranslations from './locales/ru.json';
import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';

// Get saved language from localStorage or default to Russian
const savedLanguage = localStorage.getItem('language') || 'ru';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ru: { translation: ruTranslations },
      en: { translation: enTranslations },
      es: { translation: esTranslations },
    },
    lng: savedLanguage,
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
  });

// Save language to localStorage when it changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
});

export default i18n;
