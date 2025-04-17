
import React, { useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import SearchForm from '../components/SearchForm';
import DestinationCard, { Destination } from '../components/DestinationCard';
import DestinationDetail from '../components/DestinationDetail';
import Footer from '../components/Footer';
import { useToast } from '@/hooks/use-toast';
import { Compass, Loader2 } from 'lucide-react';
import { getTravelRecommendations } from '../utils/geminiApi';

const Index = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = async (location: string, budget: number) => {
    setIsLoading(true);
    setHasSearched(true);
    setSearchError(null);

    try {
      // Get real recommendations using Gemini API
      const recommendedDestinations = await getTravelRecommendations(location, budget);
      
      if (recommendedDestinations.length === 0) {
        setSearchError("No destinations found within your budget. Try increasing your budget or changing your location.");
      } else {
        setDestinations(recommendedDestinations);
        toast({
          title: "Destinations found!",
          description: `Found ${recommendedDestinations.length} destinations within your budget from ${location}`,
        });
      }
    } catch (error) {
      console.error("Error getting travel recommendations:", error);
      setSearchError("An error occurred while fetching destinations. Please try again.");
      toast({
        title: "Error",
        description: "Failed to get travel recommendations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDestinationClick = (destination: Destination) => {
    setSelectedDestination(destination);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <Hero />
        
        <div className="container mx-auto px-4">
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
          
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin h-12 w-12 text-travel-teal mb-4" />
              <p className="text-travel-slate">Finding perfect destinations for you...</p>
            </div>
          )}
          
          {!isLoading && hasSearched && destinations.length > 0 && (
            <div className="py-16">
              <h2 className="text-2xl md:text-3xl font-bold text-travel-slate mb-8 flex items-center">
                <Compass className="mr-2 h-6 w-6 text-travel-teal" /> 
                Recommended Destinations
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
              <p className="text-travel-slate text-xl">{searchError}</p>
            </div>
          )}
          
          {!hasSearched && (
            <div className="py-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-travel-slate mb-4">How TravelScope Works</h2>
                  <p className="text-gray-600 mb-6">
                    Our AI-powered travel recommendation engine helps you discover perfect destinations based on your location and budget.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-6 w-6 rounded-full bg-travel-lightBlue text-travel-teal flex items-center justify-center mr-3">1</span>
                      <p className="text-gray-600">Enter your current location and travel budget</p>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-6 w-6 rounded-full bg-travel-lightBlue text-travel-teal flex items-center justify-center mr-3">2</span>
                      <p className="text-gray-600">Our AI analyzes transportation costs and recommends destinations</p>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-6 w-6 rounded-full bg-travel-lightBlue text-travel-teal flex items-center justify-center mr-3">3</span>
                      <p className="text-gray-600">Browse detailed information about each destination</p>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-6 w-6 rounded-full bg-travel-lightBlue text-travel-teal flex items-center justify-center mr-3">4</span>
                      <p className="text-gray-600">Generate a custom trip plan for your selected destination</p>
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
                      <h3 className="text-xl font-bold">Start Your Adventure</h3>
                      <p className="text-sm text-white/80">Enter your details above to begin</p>
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
