import React, { useState, useEffect, useContext } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import SearchForm from '../components/SearchForm';
import DestinationCard, { Destination } from '../components/DestinationCard';
import DestinationDetail from '../components/DestinationDetail';
import Footer from '../components/Footer';
import NetworkBackground from '../components/NetworkBackground';
import { useToast } from '@/hooks/use-toast';
import { Compass, Loader2, AlertTriangle } from 'lucide-react';
import { getTravelRecommendations } from '../utils/geminiApi';
import { LanguageContext } from '@/context/LanguageContext';

const Index = () => {
  const { toast } = useToast();
  const { t } = useContext(LanguageContext);
  const [isLoading, setIsLoading] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchAttempts, setSearchAttempts] = useState(0);

  useEffect(() => {
    const handleToastEvent = (event: CustomEvent) => {
      if (event.detail) {
        toast({
          title: event.detail.title,
          description: event.detail.description,
          variant: event.detail.variant || "default"
        });
      }
    };

    document.addEventListener('showToast', handleToastEvent as EventListener);
    
    return () => {
      document.removeEventListener('showToast', handleToastEvent as EventListener);
    };
  }, [toast]);

  const sampleDestinations: Destination[] = [
    {
      id: "sample-1",
      name: "Paris",
      country: "France",
      description: "The City of Light, known for its art, fashion, gastronomy and culture.",
      image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&auto=format&fit=crop",
      imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&auto=format&fit=crop",
      transportationCost: 350,
      accommodationCost: 150,
      totalBudget: 500,
      currency: "€",
      distance: "1,500 miles",
      travelTime: "2-3 hours by air",
      cost: {
        train: 250,
        bus: 150
      },
      activities: ["Visit the Eiffel Tower", "Explore the Louvre Museum", "Stroll along the Seine River"],
      weather: {
        temperature: 22,
        condition: "Sunny",
        forecast: [
          { day: "Mon", temp: 22, condition: "Sunny" },
          { day: "Tue", temp: 24, condition: "Partly Cloudy" },
          { day: "Wed", temp: 21, condition: "Cloudy" }
        ]
      }
    },
    {
      id: "sample-2",
      name: "Bali",
      country: "Indonesia",
      description: "A tropical paradise with beaches, volcanoes and a vibrant local culture.",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop",
      imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop",
      transportationCost: 600,
      accommodationCost: 80,
      totalBudget: 680,
      currency: "$",
      distance: "8,000 miles",
      travelTime: "18-24 hours by air",
      cost: {
        train: null,
        bus: 50
      },
      activities: ["Relax on Kuta Beach", "Visit the Sacred Monkey Forest", "Tour the rice terraces"],
      weather: {
        temperature: 30,
        condition: "Humid",
        forecast: [
          { day: "Mon", temp: 30, condition: "Sunny" },
          { day: "Tue", temp: 31, condition: "Partly Cloudy" },
          { day: "Wed", temp: 29, condition: "Thunderstorms" }
        ]
      }
    },
    {
      id: "sample-3",
      name: "Tokyo",
      country: "Japan",
      description: "A bustling metropolis blending ultramodern and traditional charm.",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop",
      imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop",
      transportationCost: 750,
      accommodationCost: 120,
      totalBudget: 870,
      currency: "¥",
      distance: "7,500 miles",
      travelTime: "12-14 hours by air",
      cost: {
        train: 200,
        bus: 100
      },
      activities: ["Visit Senso-ji Temple", "Experience Shibuya Crossing", "Shop in Harajuku"],
      weather: {
        temperature: 25,
        condition: "Clear",
        forecast: [
          { day: "Mon", temp: 25, condition: "Clear" },
          { day: "Tue", temp: 26, condition: "Sunny" },
          { day: "Wed", temp: 24, condition: "Partly Cloudy" }
        ]
      }
    }
  ];

  const handleSearch = async (location: string, budget: number) => {
    setIsLoading(true);
    setHasSearched(true);
    setSearchError(null);
    setSearchAttempts(prev => prev + 1);

    try {
      let recommendedDestinations = await getTravelRecommendations(location, budget);
      
      if ((recommendedDestinations.length === 0 || searchAttempts > 0) && sampleDestinations.length > 0) {
        recommendedDestinations = sampleDestinations.filter(dest => dest.totalBudget <= budget);
        
        toast({
          title: "Using fast preview data",
          description: "Showing sample destinations while we process your request.",
          variant: "default"
        });
      }
      
      if (recommendedDestinations.length === 0) {
        setSearchError("No destinations found within your budget. Try increasing your budget or changing your location.");
        toast({
          title: "No destinations found",
          description: "Try increasing your budget or selecting a different location.",
          variant: "destructive"
        });
      } else {
        setDestinations(recommendedDestinations);
        toast({
          title: "Destinations found!",
          description: `Found ${recommendedDestinations.length} destinations within your budget from ${location}`,
        });
      }
    } catch (error) {
      console.error("Error getting travel recommendations:", error);
      
      if (sampleDestinations.length > 0) {
        setDestinations(sampleDestinations);
        toast({
          title: "Using preview data",
          description: "Showing sample destinations due to connection issues.",
          variant: "default"
        });
      } else {
        setSearchError("An error occurred while fetching destinations. Please try again or check your internet connection.");
        toast({
          title: "Error",
          description: "Failed to get travel recommendations. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDestinationClick = (destination: Destination) => {
    setSelectedDestination(destination);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900 relative overflow-hidden">
      <NetworkBackground />
      <Header />
      
      <main className="flex-grow relative z-10">
        <Hero />
        
        <div className="container mx-auto px-4">
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
          
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin h-12 w-12 text-travel-teal mb-4" />
              <p className="text-travel-slate dark:text-gray-300">{t("searching")}...</p>
            </div>
          )}
          
          {!isLoading && hasSearched && destinations.length > 0 && (
            <div className="py-16">
              <h2 className="text-2xl md:text-3xl font-bold text-travel-slate dark:text-white mb-8 flex items-center">
                <Compass className="mr-2 h-6 w-6 text-travel-teal" /> 
                {t("recommended_destinations")}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {destinations.map((destination) => (
                  <div key={destination.id} className="animate-fade-in">
                    <DestinationCard 
                      destination={destination} 
                      onClick={handleDestinationClick}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {!isLoading && searchError && (
            <div className="text-center py-20">
              <div className="mx-auto w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-travel-slate dark:text-white mb-2">{t("search_error")}</h3>
              <p className="text-travel-slate dark:text-gray-300 max-w-lg mx-auto">{searchError}</p>
            </div>
          )}
          
          {!hasSearched && (
            <div className="py-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-travel-slate dark:text-white mb-4">
                    {t("how_travelscope_works")}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {t("travel_engine_description")}
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-6 w-6 rounded-full bg-travel-lightBlue text-travel-teal flex items-center justify-center mr-3">1</span>
                      <p className="text-gray-600 dark:text-gray-300">{t("step1")}</p>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-6 w-6 rounded-full bg-travel-lightBlue text-travel-teal flex items-center justify-center mr-3">2</span>
                      <p className="text-gray-600 dark:text-gray-300">{t("step2")}</p>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-6 w-6 rounded-full bg-travel-lightBlue text-travel-teal flex items-center justify-center mr-3">3</span>
                      <p className="text-gray-600 dark:text-gray-300">{t("step3")}</p>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-6 w-6 rounded-full bg-travel-lightBlue text-travel-teal flex items-center justify-center mr-3">4</span>
                      <p className="text-gray-600 dark:text-gray-300">{t("step4")}</p>
                    </li>
                  </ul>
                </div>
                <div className="aspect-video relative rounded-lg overflow-hidden shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80" 
                    alt="Travel Planning"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">{t("start_adventure")}</h3>
                      <p className="text-sm text-white/80">{t("enter_details_begin")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
      
      <DestinationDetail 
        destination={selectedDestination}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  );
};

export default Index;
