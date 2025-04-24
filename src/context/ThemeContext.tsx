
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

  // Apply theme changes to document
  const applyTheme = (themeValue: Theme, colorValue: string) => {
    if (themeValue === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      document.documentElement.classList.remove("custom");
      document.documentElement.style.setProperty("--primary", "#0EA5E9");
      document.documentElement.style.removeProperty("--primary-hsl");
      document.documentElement.style.removeProperty("--accent-hsl");
    } else if (themeValue === "custom") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("custom");
      document.documentElement.classList.remove("light");
      document.documentElement.style.setProperty("--primary", colorValue);
      
      // Compute HSL value from hex
      const r = parseInt(colorValue.slice(1, 3), 16) / 255;
      const g = parseInt(colorValue.slice(3, 5), 16) / 255;
      const b = parseInt(colorValue.slice(5, 7), 16) / 255;
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        
        h /= 6;
      }
      
      const hslString = `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
      document.documentElement.style.setProperty("--primary-hsl", hslString);
      document.documentElement.style.setProperty("--accent-hsl", hslString);
      
      // Apply custom color to all elements directly
      updateAllThemeElements(colorValue);
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.remove("custom");
      document.documentElement.classList.add("light");
      document.documentElement.style.setProperty("--primary", "#0EA5E9");
      document.documentElement.style.removeProperty("--primary-hsl");
      document.documentElement.style.removeProperty("--accent-hsl");
    }
    
    // Ensure settings popover is on top
    const style = document.createElement('style');
    style.innerHTML = `
      .settings-popover button,
      .settings-popover [role="dialog"] {
        z-index: 9999 !important;
      }
    `;
    document.head.appendChild(style);
  };

  const updateAllThemeElements = (colorValue: string) => {
    // Update text colors
    const tealTextElements = document.querySelectorAll(".text-travel-teal");
    tealTextElements.forEach(el => {
      (el as HTMLElement).style.color = colorValue;
    });
    
    // Update background colors
    const tealBgElements = document.querySelectorAll(".bg-travel-teal");
    tealBgElements.forEach(el => {
      (el as HTMLElement).style.backgroundColor = colorValue;
    });

    // Update border colors
    const tealBorderElements = document.querySelectorAll(".border-travel-teal");
    tealBorderElements.forEach(el => {
      (el as HTMLElement).style.borderColor = colorValue;
    });
    
    // Update SVG elements (for weather icons)
    const svgElements = document.querySelectorAll("svg path");
    svgElements.forEach(el => {
      if (el.getAttribute('fill') === "#0EA5E9" || el.getAttribute('stroke') === "#0EA5E9") {
        el.setAttribute('fill', colorValue);
        el.setAttribute('stroke', colorValue);
      }
    });

    // Update chart elements for recharts
    const chartElements = document.querySelectorAll(".recharts-bar-rectangle");
    chartElements.forEach(el => {
      // For recharts elements with teal color
      if (el.getAttribute('fill')?.includes('#0EA5E9')) {
        el.setAttribute('fill', colorValue);
      }
    });
  };

  useEffect(() => {
    // Apply the theme
    applyTheme(theme, customColor);

    // Store theme and customColor in localStorage to persist between sessions
    localStorage.setItem("theme", theme);
    localStorage.setItem("customColor", customColor);
    
    // Dispatch a global theme change event for all components to react to
    window.dispatchEvent(new CustomEvent("themeChange", { 
      detail: { theme, customColor } 
    }));
    
    // Force all components to update
    document.dispatchEvent(new Event('themeUpdated'));
    
    // For custom theme, also update all elements directly
    if (theme === "custom") {
      // Wait a brief moment for the DOM to update
      setTimeout(() => {
        updateAllThemeElements(customColor);
      }, 100);
    }
    
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
