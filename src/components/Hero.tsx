
import React, { useContext } from 'react';
import SettingsPopover from './SettingsPopover';
import { LanguageContext } from '@/context/LanguageContext';
import { ThemeContext } from '@/context/ThemeContext';

const Hero = () => {
  const { t } = useContext(LanguageContext);
  const { theme, customColor } = useContext(ThemeContext);

  const getNeonColor = () => {
    if (theme === 'custom') {
      return customColor;
    }
    return theme === 'dark' ? '#8B5CF6' : '#0EA5E9';
  };

  return (
    <div className="py-20 relative">
      {/* Settings (top-right corner, on top of hero) */}
      <SettingsPopover />
      
      <div 
        className="container mx-auto px-4 text-center relative z-10"
        style={{
          filter: `drop-shadow(0 0 10px ${getNeonColor()}) drop-shadow(0 0 20px ${getNeonColor()})`
        }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-travel-teal mb-4">
          {t("discover_perfect_destination")}
        </h1>
        <p className="text-xl text-travel-slate/90 dark:text-white/90 max-w-2xl mx-auto mb-8">
          {t("ai_powered_travel_planner")}
        </p>
        <div className="bg-white/10 dark:bg-gray-800/30 rounded-lg p-4 inline-block">
          <p className="text-travel-slate dark:text-white text-lg">
            {t("destinations_count")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
