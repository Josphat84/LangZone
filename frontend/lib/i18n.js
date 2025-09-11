"use client"; // important for i18next with Next.js app folder


import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation JSON files
import en from "../locales/en.json";
import fr from "../locales/fr.json";
import sn from "../locales/sn.json";
import es from "../locales/es.json";
import de from "../locales/de.json";
import pt from "../locales/pt.json";
import zh from "../locales/zh.json";
import ko from "../locales/ko.json";
import ja from "../locales/ja.json";

i18n
  .use(LanguageDetector) // auto-detect browser language
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      sn: { translation: sn },
      es: { translation: es },
      de: { translation: de },
      pt: { translation: pt },
      zh: { translation: zh },
      ko: { translation: ko },
      ja: { translation: ja },
    },
    fallbackLng: "en",       // default if detection fails
    interpolation: {
      escapeValue: false,    // React already escapes by default
    },
    detection: {
      order: ["querystring", "cookie", "localStorage", "navigator", "htmlTag"],
      caches: ["localStorage", "cookie"],
    },
  });

export default i18n;
