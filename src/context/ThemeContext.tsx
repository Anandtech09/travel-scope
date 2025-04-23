
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
  }, [theme, customColor]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, customColor, setCustomColor }}>
      {children}
    </ThemeContext.Provider>
  );
};
