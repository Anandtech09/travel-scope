
import React, { useEffect, useState } from 'react';

// Array of beautiful travel background images
const backgroundImages = [
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=1600&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1458668383970-8ddd3927deed?w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=1600&auto=format&fit=crop"
];

interface RandomBackgroundSelectorProps {
  children: React.ReactNode;
  className?: string;
}

const RandomBackgroundSelector: React.FC<RandomBackgroundSelectorProps> = ({ children, className }) => {
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  
  useEffect(() => {
    // Select a random background image
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    setBackgroundImage(backgroundImages[randomIndex]);
  }, []);
  
  if (!backgroundImage) {
    return <div className={className}>{children}</div>;
  }
  
  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default RandomBackgroundSelector;
