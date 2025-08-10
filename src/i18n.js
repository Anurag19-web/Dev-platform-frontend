import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./languages/en.json";
import hi from "./languages/hi.json";

const savedLanguage = localStorage.getItem("language") || "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi }
  },
  lng: savedLanguage, // default language
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

i18n.on("languageChanged", (lng) => {
  localStorage.setItem("language", lng);
});

export default i18n;