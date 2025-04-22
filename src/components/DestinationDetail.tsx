
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
  Loader2,
  Plane
} from 'lucide-react';
import { getDestinationDetails } from '../utils/geminiApi';
import ExpenseChart from './ExpenseChart';
import type { Destination } from './DestinationCard';
import { useToast } from '@/hooks/use-toast';

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

// Sample fallback data if API fails
const fallbackDetails: DestinationDetails = {
  attractions: [
    "Famous landmark",
    "Local market",
    "Historic district"
  ],
  accommodation: {
    budget: "$30-50 per night",
    mid: "$100-150 per night",
    luxury: "$200+ per night"
  },
  food: {
    budget: "$5-10 per meal",
    mid: "$15-30 per meal",
    luxury: "$50+ per meal"
  },
  bestTimeToVisit: "Spring and Fall for mild weather",
  localTips: "Visit during weekdays to avoid crowds. Local transportation is reliable and affordable.",
  expenses: {
    transportation: 30,
    accommodation: 35,
    food: 20,
    activities: 10,
    other: 5
  }
};

const DestinationDetail: React.FC<DestinationDetailProps> = ({ destination, open, onClose }) => {
  const [details, setDetails] = useState<DestinationDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tripPlanOpen, setTripPlanOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (destination && open) {
      fetchDestinationDetails();
    } else {
      // Reset state when dialog closes
      setDetails(null);
      setError(null);
      setTripPlanOpen(false);
    }
  }, [destination, open]);

  const fetchDestinationDetails = async () => {
    if (!destination) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const detailsData = await getDestinationDetails(destination);
      if (detailsData) {
        // Ensure the expenses object has all required properties
        const expenses = {
          transportation: detailsData.expenses?.transportation || 30,
          accommodation: detailsData.expenses?.accommodation || 35,
          food: detailsData.expenses?.food || 20,
          activities: detailsData.expenses?.activities || 10,
          other: detailsData.expenses?.other || 5
        };
        
        setDetails({
          ...detailsData,
          expenses
        });
      } else {
        throw new Error("Failed to fetch destination details");
      }
    } catch (err) {
      console.error("Error fetching destination details:", err);
      setError("Unable to load destination details. Using sample data instead.");
      
      // Use fallback data
      setDetails(fallbackDetails);
      
      toast({
        title: "Using fallback data",
        description: "We couldn't load the latest details, so we're showing sample information.",
        variant: "default"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTripPlan = () => {
    setTripPlanOpen(true);
    toast({
      title: "Trip plan created!",
      description: `Your trip to ${destination?.name} has been added to your itinerary.`,
      variant: "default"
    });
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
            Detailed information and travel guide for {destination.name}, {destination.country}
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Plane className="h-4 w-4 mr-2 text-travel-slate" />
                        <span>By Air</span>
                      </div>
                      <Badge variant="outline" className="bg-travel-sand text-travel-slate">
                        {destination.currency} {destination.transportationCost}
                      </Badge>
                    </div>
                    
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
            
            {tripPlanOpen && (
              <div className="border border-travel-teal p-4 rounded-lg bg-travel-lightBlue/20">
                <h3 className="text-lg font-semibold mb-2 text-travel-slate">Your Trip Plan</h3>
                <p className="text-gray-600 mb-2">Your trip to {destination.name} has been created!</p>
                <ul className="list-disc pl-5 text-gray-600">
                  <li>Destination: {destination.name}, {destination.country}</li>
                  <li>Budget: {destination.currency} {destination.totalBudget}</li>
                  <li>Travel Mode: Flight + Local Transportation</li>
                  <li>Duration: 7 days (suggested)</li>
                </ul>
                <p className="text-gray-600 mt-2">Check your email for the detailed itinerary.</p>
              </div>
            )}
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
          <Button 
            className="bg-travel-teal hover:bg-travel-teal/90 text-white w-full"
            onClick={handleCreateTripPlan}
          >
            Create Trip Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DestinationDetail;
