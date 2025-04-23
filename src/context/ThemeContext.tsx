
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
      document.documentElement.style.setProperty("--primary", "#0EA5E9");
    } else if (theme === "custom") {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.setProperty("--primary", customColor);
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.setProperty("--primary", "#0EA5E9");
    }

    // Store theme and customColor in localStorage to persist between sessions
    localStorage.setItem("theme", theme);
    localStorage.setItem("customColor", customColor);
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
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, customColor, setCustomColor }}>
      {children}
    </ThemeContext.Provider>
  );
};
