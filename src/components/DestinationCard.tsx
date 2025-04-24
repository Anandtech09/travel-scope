
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Train, Bus, Calendar, ArrowRight, Earth } from 'lucide-react';

export interface Destination {
  id: string;
  name: string;
  country?: string;
  image: string;
  description: string;
  cost: {
    train?: number;
    bus?: number;
  };
  transportationCost?: number;
  accommodationCost?: number;
  totalBudget?: number;
  currency: string;
  distance: string;
  travelTime: string;
  imageUrl?: string;
  activities?: string[];
  weather?: {
    temperature: number;
    condition: string;
    forecast: {
      day: string;
      temp: number;
      condition: string;
    }[];
  };
}

interface DestinationCardProps {
  destination: Destination;
  onClick: (destination: Destination) => void;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ destination, onClick }) => {
  const [imageError, setImageError] = useState(false);
  
  const fallbackImageUrl = "https://images.unsplash.com/photo-1475066392170-59d55d96fe51?auto=format&fit=crop&w=800&q=80";
  
  return (
    <Card className="destination-card group h-full flex flex-col">
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        {imageError ? (
          <div className="w-full h-full bg-travel-lightBlue flex items-center justify-center">
            <Earth className="w-16 h-16 text-travel-teal" />
          </div>
        ) : (
          <img 
            src={destination.image || destination.imageUrl || fallbackImageUrl} 
            alt={destination.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <h3 className="absolute bottom-3 left-3 text-white font-bold text-xl">{destination.name}</h3>
        {destination.country && (
          <div className="absolute bottom-3 right-3">
            <Badge variant="outline" className="bg-black/40 text-white border-none">
              {destination.country}
            </Badge>
          </div>
        )}
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">{destination.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
          <MapPin className="h-4 w-4 mr-1 text-travel-teal" />
          <span>{destination.distance}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          <Calendar className="h-4 w-4 mr-1 text-travel-teal" />
          <span>{destination.travelTime}</span>
        </div>
        
        <div className="mt-auto space-y-2">
          {destination.cost.train && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Train className="h-4 w-4 mr-1 text-travel-slate" />
                <span className="text-sm">By Train</span>
              </div>
              <Badge variant="outline" className="bg-travel-lightBlue text-travel-darkBlue border-travel-teal/30">
                {destination.currency} {destination.cost.train}
              </Badge>
            </div>
          )}
          
          {destination.cost.bus && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bus className="h-4 w-4 mr-1 text-travel-slate" />
                <span className="text-sm">By Bus</span>
              </div>
              <Badge variant="outline" className="bg-travel-sand text-travel-slate border-travel-orange/30">
                {destination.currency} {destination.cost.bus}
              </Badge>
            </div>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          className="mt-4 text-travel-teal hover:text-travel-darkBlue hover:bg-travel-lightBlue/50"
          onClick={() => onClick(destination)}
        >
          View Details <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default DestinationCard;
