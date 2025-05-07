// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './translations/en.json';
import ptTranslation from './translations/pt.json';
import esTranslation from './translations/es.json';
import frTranslation from './translations/fr.json';
import cnTranslation from './translations/cn.json';
import jpTranslation from './translations/jp.json';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslation,
    },
    pt: {
      translation: ptTranslation,
    },
    es: {
      translation: esTranslation,
    },
    fr: {
      translation: frTranslation,
    },
    cn: {
      translation: cnTranslation,
    },
    jp: {
      translation: jpTranslation,
    },
  },
  lng: 'jp', // Default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

export default i18n;
