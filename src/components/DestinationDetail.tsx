
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Train, 
  Bus, 
  Calendar, 
  Utensils, 
  Hotel, 
  Camera, 
  Clock,
  X
} from 'lucide-react';
import type { Destination } from './DestinationCard';

interface DestinationDetailProps {
  destination: Destination | null;
  open: boolean;
  onClose: () => void;
}

// This would typically come from an API call when a destination is selected
const mockDetails = {
  attractions: [
    "Central Park",
    "Empire State Building",
    "Statue of Liberty"
  ],
  accommodation: {
    budget: "$50-100 per night",
    mid: "$100-200 per night",
    luxury: "$200+ per night"
  },
  food: {
    budget: "$20-30 per day",
    mid: "$40-70 per day",
    luxury: "$80+ per day"
  },
  bestTimeToVisit: "April to June, September to November",
  localTips: "Use the subway to get around, purchase a weekly MetroCard for unlimited rides."
};

const DestinationDetail: React.FC<DestinationDetailProps> = ({ destination, open, onClose }) => {
  if (!destination) return null;
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-travel-slate">
              {destination.name}
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-travel-slate/70">
            Detailed information and travel guide
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative h-60 w-full mt-4 rounded-md overflow-hidden">
          <img 
            src={destination.image} 
            alt={destination.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-travel-slate">About</h3>
            <p className="text-gray-600">{destination.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-travel-slate">Location & Travel</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-travel-teal" />
                    <span>{destination.distance} from your location</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-travel-teal" />
                    <span>Travel time: {destination.travelTime}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-travel-slate">Transportation Costs</h3>
                <div className="space-y-2">
                  {destination.cost.train && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Train className="h-4 w-4 mr-2 text-travel-slate" />
                        <span>By Train</span>
                      </div>
                      <Badge variant="outline" className="bg-travel-lightBlue text-travel-darkBlue">
                        {destination.currency} {destination.cost.train}
                      </Badge>
                    </div>
                  )}
                  
                  {destination.cost.bus && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Bus className="h-4 w-4 mr-2 text-travel-slate" />
                        <span>By Bus</span>
                      </div>
                      <Badge variant="outline" className="bg-travel-sand text-travel-slate">
                        {destination.currency} {destination.cost.bus}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-travel-slate">Best Time to Visit</h3>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-travel-teal" />
                  <span>{mockDetails.bestTimeToVisit}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-travel-slate">Accommodation</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Hotel className="h-4 w-4 mr-2 text-travel-slate" />
                      <span className="text-sm">Budget</span>
                    </div>
                    <span className="text-sm text-gray-600">{mockDetails.accommodation.budget}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Hotel className="h-4 w-4 mr-2 text-travel-slate" />
                      <span className="text-sm">Mid-range</span>
                    </div>
                    <span className="text-sm text-gray-600">{mockDetails.accommodation.mid}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Hotel className="h-4 w-4 mr-2 text-travel-slate" />
                      <span className="text-sm">Luxury</span>
                    </div>
                    <span className="text-sm text-gray-600">{mockDetails.accommodation.luxury}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-travel-slate">Food</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Utensils className="h-4 w-4 mr-2 text-travel-slate" />
                      <span className="text-sm">Budget</span>
                    </div>
                    <span className="text-sm text-gray-600">{mockDetails.food.budget}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Utensils className="h-4 w-4 mr-2 text-travel-slate" />
                      <span className="text-sm">Mid-range</span>
                    </div>
                    <span className="text-sm text-gray-600">{mockDetails.food.mid}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Utensils className="h-4 w-4 mr-2 text-travel-slate" />
                      <span className="text-sm">Luxury</span>
                    </div>
                    <span className="text-sm text-gray-600">{mockDetails.food.luxury}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-travel-slate">Top Attractions</h3>
                <div className="space-y-2">
                  {mockDetails.attractions.map((attraction, index) => (
                    <div key={index} className="flex items-center text-gray-600">
                      <Camera className="h-4 w-4 mr-2 text-travel-teal" />
                      <span>{attraction}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2 text-travel-slate">Local Tips</h3>
            <p className="text-gray-600">{mockDetails.localTips}</p>
          </div>
        </div>
        
        <DialogFooter className="mt-6">
          <Button className="bg-travel-teal hover:bg-travel-teal/90 text-white w-full">
            Create Trip Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DestinationDetail;
