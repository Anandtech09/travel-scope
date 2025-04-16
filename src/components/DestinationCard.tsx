
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Train, Bus, Calendar, ArrowRight } from 'lucide-react';

export interface Destination {
  id: string;
  name: string;
  image: string;
  description: string;
  cost: {
    train?: number;
    bus?: number;
  };
  currency: string;
  distance: string;
  travelTime: string;
}

interface DestinationCardProps {
  destination: Destination;
  onClick: (destination: Destination) => void;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ destination, onClick }) => {
  return (
    <Card className="destination-card group h-full flex flex-col">
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <img 
          src={destination.image} 
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <h3 className="absolute bottom-3 left-3 text-white font-bold text-xl">{destination.name}</h3>
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{destination.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <MapPin className="h-4 w-4 mr-1 text-travel-teal" />
          <span>{destination.distance}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
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
