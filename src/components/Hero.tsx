
import React, { useEffect, useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Globe, Map } from 'lucide-react';

const THEME_OPTIONS = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "Custom", value: "custom" },
];

const LANG_OPTIONS = [
  { label: "English", value: "en" },
  { label: "Malayalam", value: "ml" },
  { label: "Tamil", value: "ta" },
  { label: "Hindi", value: "hi" },
];

// Fixed background images instead of PNG layers
const backgroundImages = [
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800",
  "https://images.unsplash.com/photo-1531761535209-180757000d30?auto=format&fit=crop&w=800",
  "https://images.unsplash.com/photo-1467377791767-c929b5dc9a23?auto=format&fit=crop&w=800",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800",
];

const Hero: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [themeOpen, setThemeOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");
  const [customThemeOpen, setCustomThemeOpen] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("#0EA5E9");
  const [accentColor, setAccentColor] = useState("#F97316");
  const [mapHovered, setMapHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleThemeChange = (val: string) => {
    if (val === "custom") {
      setCustomThemeOpen(true);
    } else {
      setTheme(val);
      document.documentElement.classList.remove('dark');
      if(val === "dark") {
        document.documentElement.classList.add('dark');
      }
    }
    setThemeOpen(false);
  };

  const handleLanguageChange = (val: string) => {
    setLanguage(val);
    // Show a toast notification about language change
    const event = new CustomEvent('showToast', { 
      detail: { 
        title: 'Language Changed', 
        description: `Language set to ${LANG_OPTIONS.find(lang => lang.value === val)?.label}` 
      } 
    });
    document.dispatchEvent(event);
    setLanguageOpen(false);
  };

  const handleCustomThemeApply = () => {
    setTheme("custom");
    document.documentElement.classList.remove('dark');
    
    // Apply custom colors as CSS variables
    document.documentElement.style.setProperty('--primary', primaryColor);
    document.documentElement.style.setProperty('--accent', accentColor);
    
    setCustomThemeOpen(false);
  };

  return (
    <div className="relative w-full h-[65vh] md:h-[75vh] overflow-hidden hero-gradient flex items-center justify-center font-passero-one select-none">
      {/* Background Images */}
      <div className="absolute inset-0 z-0">
        {/* Main background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1920&q=80')",
          }}
        />
        
        {/* Additional location images as background decorations - fixed position */}
        {backgroundImages.map((img, idx) => (
          <div
            key={idx}
            className="absolute bg-cover bg-center rounded-lg shadow-lg overflow-hidden opacity-50"
            style={{
              width: `${100 + idx * 20}px`,
              height: `${100 + idx * 20}px`,
              left: `${10 + idx * 15}%`,
              top: `${5 + idx * 12}%`,
              backgroundImage: `url(${img})`,
              transform: 'rotate(' + (idx * 5 - 10) + 'deg)',
              zIndex: 1 + idx,
            }}
          />
        ))}
      </div>
      
      {/* Overlay for text readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-travel-slate/30 via-transparent to-black/30"></div>

      {/* Travel Globe icon popover for Theme + Language */}
      <div className="absolute right-8 top-8 z-10">
        <Popover>
          <PopoverTrigger asChild>
            <button className="w-14 h-14 rounded-full bg-white/70 border-4 border-travel-teal shadow-lg flex items-center justify-center hover:scale-110 transition-transform relative group">
              <Globe className="w-8 h-8 text-travel-teal" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-5 bg-white/90 backdrop-blur-lg dark:bg-travel-slate/90 dark:text-white font-passero-one" align="end">
            <h3 className="font-semibold text-xl text-travel-slate dark:text-white mb-4 font-kalnia-glaze">TravelScope Options</h3>
            {/* Theme picker */}
            <div className="mb-1">
              <button
                className="w-full flex justify-between items-center bg-travel-lightBlue/30 dark:bg-travel-slate/50 rounded px-3 py-2 mb-2 hover:bg-travel-lightBlue/60 dark:hover:bg-travel-slate/30 focus:outline-none"
                onClick={() => setThemeOpen(!themeOpen)}
              >
                <span className="font-semibold">Theme</span>
                <span className="text-sm text-travel-slate dark:text-white opacity-70">{THEME_OPTIONS.find(t=>t.value===theme)?.label}</span>
              </button>
              {themeOpen && (
                <div className="flex flex-col px-4 pb-2 space-y-2 animate-fade-in">
                  {THEME_OPTIONS.map(opt=>(
                    <button
                      key={opt.value}
                      className={`w-full text-left py-1 rounded hover:bg-travel-teal/20 ${theme === opt.value ? "font-bold text-travel-teal dark:text-travel-lightBlue" : "text-travel-slate dark:text-white"}`}
                      onClick={()=>handleThemeChange(opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Language picker */}
            <div>
              <button
                className="w-full flex justify-between items-center bg-travel-lightBlue/30 dark:bg-travel-slate/50 rounded px-3 py-2 mb-2 hover:bg-travel-lightBlue/60 dark:hover:bg-travel-slate/30 focus:outline-none"
                onClick={() => setLanguageOpen(!languageOpen)}
              >
                <span className="font-semibold">Language</span>
                <span className="text-sm text-travel-slate dark:text-white opacity-70">{LANG_OPTIONS.find(t=>t.value===language)?.label}</span>
              </button>
              {languageOpen && (
                <div className="flex flex-col px-4 pb-2 space-y-2 animate-fade-in">
                  {LANG_OPTIONS.map(opt=>(
                    <button
                      key={opt.value}
                      className={`w-full text-left py-1 rounded hover:bg-travel-teal/20 ${language === opt.value ? "font-bold text-travel-teal dark:text-travel-lightBlue" : "text-travel-slate dark:text-white"}`}
                      onClick={()=>handleLanguageChange(opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Custom Theme Dialog */}
      <Dialog open={customThemeOpen} onOpenChange={setCustomThemeOpen}>
        <DialogContent className="font-passero-one">
          <DialogHeader>
            <DialogTitle className="text-2xl font-passero-one">Customize Your Theme</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Primary Color</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-10 w-10 cursor-pointer rounded border"
                />
                <span className="text-sm">{primaryColor}</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Accent Color</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color" 
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="h-10 w-10 cursor-pointer rounded border"
                />
                <span className="text-sm">{accentColor}</span>
              </div>
            </div>
            <div className="pt-2">
              <Button onClick={handleCustomThemeApply} className="w-full font-passero-one">
                Apply Custom Theme
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hero Content */}
      <div className="z-10 text-center px-4 max-w-3xl mx-auto animate-fade-in">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg mb-4 font-passero-one">
          Discover Your Perfect Destination
        </h1>
        <p className="text-lg md:text-xl text-white/90 drop-shadow mb-8 font-passero-one">
          AI-powered recommendations based on your budget and preferences
        </p>
        {/* Start Exploring Button with Map icon - simplified animation */}
        <button
          className="relative bg-travel-teal hover:bg-travel-teal/90 text-white rounded-full px-8 py-6 text-lg shadow-lg font-passero-one flex items-center justify-center mx-auto transition-all duration-300"
          onMouseEnter={() => setMapHovered(true)}
          onMouseLeave={() => setMapHovered(false)}
        >
          <Map className={`w-8 h-8 mr-2 transition-colors duration-300 ${mapHovered ? "text-yellow-300" : "text-white"}`} />
          Start Exploring
        </button>
      </div>
    </div>
  );
};

export default Hero;
