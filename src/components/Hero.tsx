
import React from 'react';
import { Button } from '@/components/ui/button';
import { Compass } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden hero-gradient flex items-center justify-center">
      <div 
        className="absolute inset-0 z-0 opacity-20" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1920&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      <div className="z-10 text-center px-4 max-w-3xl mx-auto animate-fade-in">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-travel-slate mb-4">
          Discover Your Perfect Destination
        </h1>
        <p className="text-lg md:text-xl text-travel-slate/80 mb-8">
          AI-powered recommendations based on your budget and preferences
        </p>
        <Button className="bg-travel-teal hover:bg-travel-teal/90 text-white rounded-full px-8 py-6 text-lg">
          <Compass className="mr-2 h-5 w-5" /> Start Exploring
        </Button>
      </div>
    </div>
  );
};

export default Hero;
