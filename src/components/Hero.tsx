
import React, { useEffect, useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Map, Globe } from 'lucide-react';

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

const pngLayerImgs = [
  "https://pngimg.com/uploads/airplane/airplane_PNG5445.png",
  "https://pngimg.com/uploads/passport/passport_PNG19.png",
  "https://pngimg.com/uploads/camera/camera_PNG101412.png",
  "https://pngimg.com/uploads/suitcase/suitcase_PNG37.png",
  // Add more PNGs for stronger parallax
  "https://pngimg.com/uploads/world_map/world_map_PNG47.png",
  "https://pngimg.com/uploads/compass/compass_PNG59.png",
  "https://pngimg.com/uploads/hot_air_balloon/hot_air_balloon_PNG18.png",
];

const Hero: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [themeOpen, setThemeOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [exploding, setExploding] = useState(false);
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleThemeChange = (val: string) => {
    setTheme(val);
    document.documentElement.classList.remove('dark');
    if(val === "dark") {
      document.documentElement.classList.add('dark');
    }
    setThemeOpen(false);
  };

  const handleLanguageChange = (val: string) => {
    setLanguage(val);
    setLanguageOpen(false);
  };

  const onMapHover = () => setExploding(true);
  const onMapLeave = () => setExploding(false);

  return (
    <div className="relative w-full h-[65vh] md:h-[75vh] overflow-hidden hero-gradient flex items-center justify-center font-passero-one select-none">
      {/* Parallax PNG layers */}
      {pngLayerImgs.map((img, idx) => (
        <img
          key={img}
          src={img}
          alt={`parallax-img-${idx}`}
          style={{
            left: `${10 + idx * 12}%`,
            top: `${5 + idx * 10}%`,
            transform: `translateY(${(scrollY * (0.14 + idx * 0.06))}px) scale(0.56)`,
            zIndex: 2 + idx,
          }}
          className={`pointer-events-none absolute w-20 h-20 md:w-24 md:h-24 object-contain opacity-60 animate-float${idx % 2 === 0 ? '' : '-delay'}`}
        />
      ))}
      {/* Parallax BG */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center scale-110"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1920&q=80')",
          transform: `translateY(${scrollY * 0.3}px) scale(1.08)`,
          transition: 'transform 0.1s cubic-bezier(0.2,0,0.8,1)'
        }}
      />
      {/* Overlay for text readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-travel-slate/30 via-transparent to-black/30"></div>

      {/* Travel Globe icon popover for Theme + Language */}
      <div className="absolute right-8 top-8 z-10">
        <Popover>
          <PopoverTrigger asChild>
            <button className="w-14 h-14 rounded-full bg-white/70 border-4 border-travel-teal shadow-lg flex items-center justify-center hover:scale-110 transition-transform relative group">
              <span className="block w-10 h-10 rounded-full bg-gradient-to-tr from-travel-orange via-travel-yellow to-travel-teal flex items-center justify-center text-3xl font-bold animate-spin-reverse-slow">
                <Globe className="w-8 h-8 text-travel-teal" />
              </span>
              {/* Remove any plus symbol or text here */}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-5 bg-white/90 backdrop-blur-lg font-passero-one" align="end">
            <h3 className="font-semibold text-xl text-travel-slate mb-4 font-kalnia-glaze">TravelScope Options</h3>
            {/* Theme picker */}
            <div className="mb-1">
              <button
                className="w-full flex justify-between items-center bg-travel-lightBlue/30 rounded px-3 py-2 mb-2 hover:bg-travel-lightBlue/60 focus:outline-none"
                onClick={() => setThemeOpen(!themeOpen)}
              >
                <span className="font-semibold">Theme</span>
                <span className="text-sm text-travel-slate opacity-70">{THEME_OPTIONS.find(t=>t.value===theme)?.label}</span>
              </button>
              {themeOpen && (
                <div className="flex flex-col px-4 pb-2 space-y-2 animate-fade-in">
                  {THEME_OPTIONS.map(opt=>(
                    <button
                      key={opt.value}
                      className={`w-full text-left py-1 rounded hover:bg-travel-teal/20 ${theme === opt.value ? "font-bold text-travel-teal" : "text-travel-slate"}`}
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
                className="w-full flex justify-between items-center bg-travel-lightBlue/30 rounded px-3 py-2 mb-2 hover:bg-travel-lightBlue/60 focus:outline-none"
                onClick={() => setLanguageOpen(!languageOpen)}
              >
                <span className="font-semibold">Language</span>
                <span className="text-sm text-travel-slate opacity-70">{LANG_OPTIONS.find(t=>t.value===language)?.label}</span>
              </button>
              {languageOpen && (
                <div className="flex flex-col px-4 pb-2 space-y-2 animate-fade-in">
                  {LANG_OPTIONS.map(opt=>(
                    <button
                      key={opt.value}
                      className={`w-full text-left py-1 rounded hover:bg-travel-teal/20 ${language === opt.value ? "font-bold text-travel-teal" : "text-travel-slate"}`}
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

      {/* Hero Content */}
      <div className="z-10 text-center px-4 max-w-3xl mx-auto animate-fade-in">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg mb-4 font-passero-one">
          Discover Your Perfect Destination
        </h1>
        <p className="text-lg md:text-xl text-white/90 drop-shadow mb-8 font-passero-one">
          AI-powered recommendations based on your budget and preferences
        </p>
        {/* Start Exploring Button with Map icon */}
        <button
          className="relative bg-travel-teal hover:bg-travel-teal/90 text-white rounded-full px-8 py-6 text-lg shadow-lg font-passero-one flex items-center justify-center mx-auto transition-all duration-300"
          onMouseEnter={onMapHover}
          onMouseLeave={onMapLeave}
        >
          <span className={`transition-all duration-300 mr-2 ${exploding ? "scale-125 animate-explode" : ""}`}>
            <Map className={`w-8 h-8 ${exploding ? "text-yellow-300" : "text-white"} transition-all duration-300`} />
          </span>
          Start Exploring
        </button>
      </div>

      {/* How Travelscope Works card has been removed as per your request */}

      {/* Keyframes for explode */}
      <style>{`
        @keyframes explode {
          0% { transform: scale(1) rotate(0deg);}
          40% { transform: scale(1.7) rotate(20deg);}
          60% { transform: scale(0.9) rotate(-10deg);}
          100% { transform: scale(1) rotate(0deg);}
        }
        .animate-explode {
          animation: explode 0.55s cubic-bezier(.22,2,.22,1) 1;
        }
      `}</style>
    </div>
  );
};

export default Hero;

