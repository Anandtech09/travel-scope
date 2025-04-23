
import React, { createContext, useState, ReactNode, useEffect } from "react";
import translations from "../i18n/translations.json";

interface LanguageContextProps {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextProps>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState("en");
  
  // Load language preference from localStorage on initial load
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);
  
  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("language", language);
    // Add a custom event to notify components when language changes
    document.dispatchEvent(new CustomEvent("languageChange", { detail: language }));
  }, [language]);
  
  // Translation function that can be used across components
  const t = (key: string): string => {
    try {
      // Ensure we have the language, fallback to English if needed
      const currentLang = language in translations ? language : "en";
      // Return the translation or fallback to the key if not found
      return translations[currentLang]?.[key] || translations.en[key] || key;
    } catch (error) {
      console.error("Translation error:", error);
      return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
