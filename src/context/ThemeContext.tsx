
import React, { createContext, useState, useEffect } from "react";

type Theme = "light" | "dark" | "custom";

interface ThemeContextProps {
  theme: Theme;
  setTheme: (t: Theme) => void;
  customColor: string;
  setCustomColor: (c: string) => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: "light",
  setTheme: () => {},
  customColor: "#0EA5E9",
  setCustomColor: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("light");
  const [customColor, setCustomColor] = useState("#0EA5E9");

  useEffect(() => {
    // Apply theme to document root
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      document.documentElement.classList.remove("custom");
      document.documentElement.style.setProperty("--primary", "#0EA5E9");
    } else if (theme === "custom") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("custom");
      document.documentElement.classList.remove("light");
      document.documentElement.style.setProperty("--primary", customColor);
      
      // Apply custom color to all elements with text-travel-teal class in real-time
      const tealTextElements = document.querySelectorAll(".text-travel-teal");
      tealTextElements.forEach(el => {
        (el as HTMLElement).style.color = customColor;
      });
      
      // Apply custom color to all elements with bg-travel-teal class in real-time
      const tealBgElements = document.querySelectorAll(".bg-travel-teal");
      tealBgElements.forEach(el => {
        (el as HTMLElement).style.backgroundColor = customColor;
      });
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.remove("custom");
      document.documentElement.classList.add("light");
      document.documentElement.style.setProperty("--primary", "#0EA5E9");
    }

    // Store theme and customColor in localStorage to persist between sessions
    localStorage.setItem("theme", theme);
    localStorage.setItem("customColor", customColor);
    
    // Dispatch a global theme change event for all components to react to
    window.dispatchEvent(new CustomEvent("themeChange", { 
      detail: { theme, customColor } 
    }));
    
    console.log("Theme applied:", theme, customColor);
  }, [theme, customColor]);

  // Load saved theme and customColor from localStorage on initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const savedCustomColor = localStorage.getItem("customColor");

    if (savedTheme) {
      setTheme(savedTheme);
    }
    
    if (savedCustomColor) {
      setCustomColor(savedCustomColor);
    }
    
    console.log("Theme loaded from storage:", savedTheme, savedCustomColor);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, customColor, setCustomColor }}>
      {children}
    </ThemeContext.Provider>
  );
};
