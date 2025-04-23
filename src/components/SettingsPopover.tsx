
import React, { useState, useContext, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";
import { Globe } from "lucide-react";
import { ThemeContext } from "@/context/ThemeContext";
import { LanguageContext } from "@/context/LanguageContext";

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
  const { language, setLanguage, t } = useContext(LanguageContext);
  const [open, setOpen] = useState(false);

  // Function to handle theme change
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as any);
    // Close popover after selection on mobile
    if (window.innerWidth < 768) {
      setTimeout(() => setOpen(false), 300);
    }
  };

  // Function to handle language change
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    // Close popover after selection on mobile
    if (window.innerWidth < 768) {
      setTimeout(() => setOpen(false), 300);
    }
  };

  // Effect to ensure Popover stays in sync with open state
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (open && !(e.target as Element).closest('.settings-popover')) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="absolute top-4 right-4 z-50 settings-popover">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            aria-label="Settings"
            className="bg-white/60 dark:bg-gray-900/80 rounded-full p-3 shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-white transition-colors"
          >
            <Globe className="text-travel-teal" size={28} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-4 bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700">
          <div>
            <div className="mb-3 font-semibold dark:text-white">{t("choose_theme")}</div>
            <div className="flex items-center gap-3 mb-2">
              {themeOptions.map((th) => (
                <button
                  key={th.value}
                  onClick={() => handleThemeChange(th.value)}
                  className={`px-3 py-1.5 rounded transition-colors ${
                    theme === th.value 
                      ? "bg-travel-teal text-white" 
                      : "bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
                  } text-sm font-medium`}
                >
                  {t(th.labelKey)}
                </button>
              ))}
            </div>
            {theme === "custom" && (
              <div className="flex items-center gap-2 mb-4">
                <label className="text-sm dark:text-white" htmlFor="custom-color">{t("custom_color")}</label>
                <input
                  id="custom-color"
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-8 h-8 border rounded cursor-pointer"
                />
              </div>
            )}
            <div className="mb-2 mt-2 font-semibold dark:text-white">{t("choose_language")}</div>
            <div className="grid grid-cols-2 gap-2">
              {languageOptions.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => handleLanguageChange(lang.value)}
                  className={`px-3 py-1.5 rounded transition-colors ${
                    language === lang.value 
                      ? "bg-travel-teal text-white" 
                      : "bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
                  } text-sm`}
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
