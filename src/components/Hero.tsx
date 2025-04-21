
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

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

      {/* Floating Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Spinning Travel Icons */}
        <div className="absolute top-[10%] left-[10%] animate-spin-slow">
          <div className="w-12 h-12 rounded-full bg-travel-teal/20 flex items-center justify-center">
            <span className="text-2xl">✈️</span>
          </div>
        </div>
        <div className="absolute top-[20%] right-[15%] animate-spin-reverse-slow">
          <div className="w-14 h-14 rounded-full bg-travel-lightBlue/20 flex items-center justify-center">
            <span className="text-2xl">🌍</span>
          </div>
        </div>
        <div className="absolute bottom-[25%] left-[20%] animate-float">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-xl">🧳</span>
          </div>
        </div>
        <div className="absolute bottom-[15%] right-[20%] animate-float-delay">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-xl">📸</span>
          </div>
        </div>
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
