
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
      console.log("Language loaded from storage:", savedLanguage);
    }
  }, []);
  
  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("language", language);
    
    // Force update all components that use the t function
    document.documentElement.lang = language;
    
    // Dispatch a custom event for components to listen to
    const languageChangeEvent = new CustomEvent("languageChange", { detail: language });
    window.dispatchEvent(languageChangeEvent);
    
    console.log("Language changed and saved:", language);
    
    // Force re-render of components with data-i18n attribute
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (key) {
        el.textContent = translations[language as keyof typeof translations]?.[key as keyof (typeof translations)[keyof typeof translations]] || 
                         translations.en[key as keyof typeof translations.en] || 
                         key;
      }
    });
    
    // Force all components to update
    document.dispatchEvent(new Event('languageUpdated'));
  }, [language]);
  
  // Translation function that can be used across components
  const t = (key: string): string => {
    try {
      // Ensure we have the language, fallback to English if needed
      const currentLang = language in translations ? language : "en";
      // Get the translations for the current language
      const currentTranslations = translations[currentLang as keyof typeof translations] || {};
      
      // Try to get the translation for the key
      // @ts-ignore - this is a dynamic access
      const translation = currentTranslations[key] || translations.en[key] || key;
      
      return translation;
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
