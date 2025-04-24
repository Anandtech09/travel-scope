
import React, { useContext } from 'react';
import RandomBackgroundSelector from './RandomBackgroundSelector';
import SettingsPopover from './SettingsPopover';
import { LanguageContext } from '@/context/LanguageContext';

const Hero = () => {
  const { t } = useContext(LanguageContext);

  return (
    <RandomBackgroundSelector className="py-20 bg-fixed bg-cover bg-center relative" style={{ backgroundAttachment: 'fixed' }}>
      {/* Settings (top-right corner, on top of hero) */}
      <SettingsPopover />
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-4">
          {t("discover_perfect_destination")}
        </h1>
        <p className="text-xl text-white/90 drop-shadow-md max-w-2xl mx-auto mb-8">
          {t("ai_powered_travel_planner")}
        </p>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-block">
          <p className="text-white text-lg">
            {t("destinations_count")}
          </p>
        </div>
      </div>
    </RandomBackgroundSelector>
  );
};

export default Hero;
