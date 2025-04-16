
import React, { useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import SearchForm from '../components/SearchForm';
import DestinationCard, { Destination } from '../components/DestinationCard';
import DestinationDetail from '../components/DestinationDetail';
import Footer from '../components/Footer';
import { useToast } from '@/hooks/use-toast';
import { Compass } from 'lucide-react';

const Index = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Mock API call to get destinations based on location and budget
  const handleSearch = (location: string, budget: number) => {
    setIsLoading(true);
    setHasSearched(true);

    // Simulate API call with setTimeout
    setTimeout(() => {
      // Mock data that would come from the AI recommendation engine
      const mockDestinations: Destination[] = [
        {
          id: '1',
          name: 'New York City',
          image: 'https://images.unsplash.com/photo-1582145641536-5f85e4c3beec?auto=format&fit=crop&w=800&q=80',
          description: 'Experience the vibrant culture, iconic skyline, and endless entertainment options in the city that never sleeps.',
          cost: {
            train: 120,
            bus: 75
          },
          currency: '$',
          distance: '250 miles',
          travelTime: '3-4 hours'
        },
        {
          id: '2',
          name: 'Sedona',
          image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=800&q=80',
          description: 'Discover stunning red rock formations, spiritual vortexes, and breathtaking hiking trails in this Arizona desert town.',
          cost: {
            bus: 65
          },
          currency: '$',
          distance: '180 miles',
          travelTime: '2.5 hours'
        },
        {
          id: '3',
          name: 'Lake Tahoe',
          image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80',
          description: 'Enjoy crystal-clear waters surrounded by snow-capped mountains, perfect for both summer and winter activities.',
          cost: {
            train: 95,
            bus: 55
          },
          currency: '$',
          distance: '200 miles',
          travelTime: '3 hours'
        },
        {
          id: '4',
          name: 'Charleston',
          image: 'https://images.unsplash.com/photo-1569418042459-b21419b1a05e?auto=format&fit=crop&w=800&q=80',
          description: 'Step into southern charm with cobblestone streets, antebellum architecture, and renowned culinary delights.',
          cost: {
            train: 110,
            bus: 70
          },
          currency: '$',
          distance: '220 miles',
          travelTime: '3.5 hours'
        },
        {
          id: '5',
          name: 'Aspen',
          image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80',
          description: 'A world-famous mountain destination offering luxurious experiences alongside breathtaking alpine scenery.',
          cost: {
            bus: 85
          },
          currency: '$',
          distance: '310 miles',
          travelTime: '5 hours'
        },
        {
          id: '6',
          name: 'San Francisco',
          image: 'https://images.unsplash.com/photo-1475066392170-59d55d96fe51?auto=format&fit=crop&w=800&q=80',
          description: 'Explore iconic landmarks, diverse neighborhoods, and exceptional cuisine in this hilly city by the bay.',
          cost: {
            train: 130,
            bus: 85
          },
          currency: '$',
          distance: '380 miles',
          travelTime: '6 hours'
        }
      ];

      setDestinations(mockDestinations);
      setIsLoading(false);
      
      toast({
        title: "Destinations found!",
        description: `Found ${mockDestinations.length} destinations within your budget from ${location}`,
      });
    }, 2000);
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
          <SearchForm onSearch={handleSearch} />
          
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-travel-teal mb-4"></div>
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
          
          {!isLoading && hasSearched && destinations.length === 0 && (
            <div className="text-center py-20">
              <p className="text-travel-slate text-xl">No destinations found. Try adjusting your budget or location.</p>
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
