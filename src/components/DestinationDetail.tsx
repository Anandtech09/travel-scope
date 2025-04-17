
import React, { useState, useEffect } from 'react';
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
  X,
  Loader2
} from 'lucide-react';
import { getDestinationDetails } from '../utils/geminiApi';
import ExpenseChart from './ExpenseChart';
import type { Destination } from './DestinationCard';

interface DestinationDetailProps {
  destination: Destination | null;
  open: boolean;
  onClose: () => void;
}

interface DestinationDetails {
  attractions: string[];
  accommodation: {
    budget: string;
    mid: string;
    luxury: string;
  };
  food: {
    budget: string;
    mid: string;
    luxury: string;
  };
  bestTimeToVisit: string;
  localTips: string;
  expenses: {
    transportation: number;
    accommodation: number;
    food: number;
    activities: number;
    other: number;
  };
}

const DestinationDetail: React.FC<DestinationDetailProps> = ({ destination, open, onClose }) => {
  const [details, setDetails] = useState<DestinationDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (destination && open) {
      fetchDestinationDetails();
    } else {
      // Reset state when dialog closes
      setDetails(null);
      setError(null);
    }
  }, [destination, open]);

  const fetchDestinationDetails = async () => {
    if (!destination) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const detailsData = await getDestinationDetails(destination);
      if (detailsData) {
        setDetails(detailsData);
      } else {
        throw new Error("Failed to fetch destination details");
      }
    } catch (err) {
      console.error("Error fetching destination details:", err);
      setError("Unable to load destination details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

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
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-travel-teal mb-4" />
            <p className="text-travel-slate">Loading destination details...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-red-500">{error}</p>
            <Button 
              onClick={fetchDestinationDetails} 
              variant="outline" 
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        ) : details ? (
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-travel-slate">About</h3>
              <p className="text-gray-600">{destination.description}</p>
            </div>
            
            {details.expenses && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-travel-slate">Estimated Expenses</h3>
                <ExpenseChart expenses={details.expenses} />
              </div>
            )}
            
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
                    <span>{details.bestTimeToVisit}</span>
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
                      <span className="text-sm text-gray-600">{details.accommodation.budget}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Hotel className="h-4 w-4 mr-2 text-travel-slate" />
                        <span className="text-sm">Mid-range</span>
                      </div>
                      <span className="text-sm text-gray-600">{details.accommodation.mid}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Hotel className="h-4 w-4 mr-2 text-travel-slate" />
                        <span className="text-sm">Luxury</span>
                      </div>
                      <span className="text-sm text-gray-600">{details.accommodation.luxury}</span>
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
                      <span className="text-sm text-gray-600">{details.food.budget}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Utensils className="h-4 w-4 mr-2 text-travel-slate" />
                        <span className="text-sm">Mid-range</span>
                      </div>
                      <span className="text-sm text-gray-600">{details.food.mid}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Utensils className="h-4 w-4 mr-2 text-travel-slate" />
                        <span className="text-sm">Luxury</span>
                      </div>
                      <span className="text-sm text-gray-600">{details.food.luxury}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-travel-slate">Top Attractions</h3>
                  <div className="space-y-2">
                    {details.attractions.map((attraction, index) => (
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
              <p className="text-gray-600">{details.localTips}</p>
            </div>
          </div>
        ) : (
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
              </div>
            </div>
          </div>
        )}
        
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
