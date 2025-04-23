
import React from 'react';
import RandomBackgroundSelector from './RandomBackgroundSelector';

const Hero = () => {
  return (
    <RandomBackgroundSelector className="py-20 bg-fixed bg-cover bg-center" style={{ backgroundAttachment: 'fixed' }}>
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-4">
          Discover Your Perfect Destination
        </h1>
        <p className="text-xl text-white/90 drop-shadow-md max-w-2xl mx-auto mb-8">
          Let our AI-powered travel planner find amazing destinations that match your budget and preferences
        </p>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-block">
          <p className="text-white text-lg">
            <span className="font-bold">1,500+</span> destinations &bull; <span className="font-bold">100+</span> countries &bull; <span className="font-bold">Unlimited</span> adventures
          </p>
        </div>
      </div>
    </RandomBackgroundSelector>
  );
};

export default Hero;
