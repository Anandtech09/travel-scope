
import React, { useState, useContext } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Globe } from "lucide-react";
import { ThemeContext } from "@/context/ThemeContext";
import { LanguageContext } from "@/context/LanguageContext";
import translations from "@/i18n/translations.json";

const themeOptions = [
  { value: "light", labelKey: "theme_light" },
  { value: "dark", labelKey: "theme_dark" },
  { value: "custom", labelKey: "theme_custom" },
];

const languageOptions = [
  { value: "en", label: "English" },
  { value: "ml", label: "മലയാളം" },
  { value: "hi", label: "हिंदी" },
  { value: "ta", label: "தமிழ்" },
];

const SettingsPopover: React.FC = () => {
  const { theme, setTheme, customColor, setCustomColor } = useContext(ThemeContext);
  const { language, setLanguage } = useContext(LanguageContext);
  const [open, setOpen] = useState(false);

  const t = (key: string) => {
    return translations[language]?.[key] || translations["en"][key] || key;
  };

  return (
    <div className="absolute top-4 right-4 z-50">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            aria-label="Settings"
            className="bg-white/60 dark:bg-gray-900/80 rounded-full p-3 shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-white transition-colors"
          >
            <Globe className="text-travel-teal" size={28} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-4">
          <div>
            <div className="mb-3 font-semibold">{t("choose_theme")}</div>
            <div className="flex items-center gap-3 mb-2">
              {themeOptions.map((th) => (
                <button
                  key={th.value}
                  onClick={() => setTheme(th.value as any)}
                  className={`px-3 py-1.5 rounded ${theme === th.value ? "bg-travel-teal text-white" : "bg-muted"} text-sm font-medium`}
                >
                  {t(th.labelKey)}
                </button>
              ))}
            </div>
            {theme === "custom" && (
              <div className="flex items-center gap-2 mb-4">
                <label className="text-sm" htmlFor="custom-color">{t("custom_color")}</label>
                <input
                  id="custom-color"
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-8 h-8 border rounded"
                />
              </div>
            )}
            <div className="mb-2 mt-2 font-semibold">{t("choose_language")}</div>
            <div className="grid grid-cols-2 gap-2">
              {languageOptions.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => setLanguage(lang.value)}
                  className={`px-3 py-1.5 rounded ${language === lang.value ? "bg-travel-teal text-white" : "bg-muted"} text-sm`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SettingsPopover;
