
import React, { useContext } from 'react';
import { MapPin } from 'lucide-react';
import { LanguageContext } from '@/context/LanguageContext';

const Footer = () => {
  const { t } = useContext(LanguageContext);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-travel-slate text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <MapPin className="h-6 w-6 text-travel-teal mr-2" />
              <h3 className="text-xl font-bold">TravelScope</h3>
            </div>
            <p className="text-white/70 text-sm">
              {t("footer_description")}
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">{t("quick_links")}</h4>
            <ul className="space-y-2 text-white/70">
              <li><a href="#" className="hover:text-travel-teal transition-colors">{t("link_home")}</a></li>
              <li><a href="#" className="hover:text-travel-teal transition-colors">{t("link_destinations")}</a></li>
              <li><a href="#" className="hover:text-travel-teal transition-colors">{t("link_about")}</a></li>
              <li><a href="#" className="hover:text-travel-teal transition-colors">{t("link_contact")}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">{t("features")}</h4>
            <ul className="space-y-2 text-white/70">
              <li><a href="#" className="hover:text-travel-teal transition-colors">{t("feature_ai")}</a></li>
              <li><a href="#" className="hover:text-travel-teal transition-colors">{t("feature_budget")}</a></li>
              <li><a href="#" className="hover:text-travel-teal transition-colors">{t("feature_transport")}</a></li>
              <li><a href="#" className="hover:text-travel-teal transition-colors">{t("feature_guides")}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">{t("contact_us")}</h4>
            <ul className="space-y-2 text-white/70">
              <li>{t("email")}</li>
              <li>{t("phone")}</li>
              <li>{t("address")}</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/50 text-sm">
          {t("copyright").replace("2025", currentYear.toString())}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
