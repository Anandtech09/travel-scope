
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

const Hero: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Add scroll event listener for parallax effect
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden hero-gradient flex items-center justify-center">
      {/* Parallax Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transform scale-110"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1920&q=80')",
          transform: `translateY(${scrollY * 0.3}px) scale(1.1)`,
          transition: 'transform 0.1s cubic-bezier(0.2, 0, 0.8, 1)'
        }}
      />
      
      {/* Overlay gradient for text readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-travel-slate/30 via-transparent to-black/30"></div>

      {/* Travel Icons Popup */}
      <div className="absolute right-8 top-8 z-10">
        <Popover>
          <PopoverTrigger>
            <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center border border-white/50 cursor-pointer hover:bg-white/40 transition-all shadow-lg">
              <span className="text-lg">🌐</span>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4 bg-white/90 backdrop-blur-md">
            <div className="space-y-3">
              <h3 className="font-medium text-travel-slate">Travel Icons</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2 p-2 bg-travel-lightBlue/20 rounded-md">
                  <span className="text-xl">✈️</span>
                  <span className="text-sm text-travel-slate">Flights</span>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-travel-lightBlue/20 rounded-md">
                  <span className="text-xl">🌍</span>
                  <span className="text-sm text-travel-slate">Destinations</span>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-travel-lightBlue/20 rounded-md">
                  <span className="text-xl">🧳</span>
                  <span className="text-sm text-travel-slate">Luggage</span>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-travel-lightBlue/20 rounded-md">
                  <span className="text-xl">📸</span>
                  <span className="text-sm text-travel-slate">Photos</span>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Hero Content */}
      <div className="z-10 text-center px-4 max-w-3xl mx-auto animate-fade-in">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg mb-4">
          Discover Your Perfect Destination
        </h1>
        <p className="text-lg md:text-xl text-white/90 drop-shadow mb-8">
          AI-powered recommendations based on your budget and preferences
        </p>
        <Button className="bg-travel-teal hover:bg-travel-teal/90 text-white rounded-full px-8 py-6 text-lg shadow-lg animate-pulse-slow">
          <img 
            src="/lovable-uploads/a94d164b-d29c-4e41-a1bd-66bda4912d48.png" 
            alt="TravelScope" 
            className="w-8 h-8 mr-2 object-contain animate-spin-slow" 
          /> 
          Start Exploring
        </Button>
      </div>
    </div>
  );
};

export default Hero;
