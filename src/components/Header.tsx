
import React from 'react';
import { MapPin, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="flex items-center">
        <MapPin className="h-6 w-6 text-travel-teal mr-2" />
        <h1 className="text-xl font-bold text-travel-slate">TravelScope</h1>
      </div>
      
      <div className="hidden md:flex items-center space-x-4">
        <Button variant="ghost" className="text-travel-slate">Destinations</Button>
        <Button variant="ghost" className="text-travel-slate">About</Button>
        <Button variant="ghost" className="text-travel-slate">Contact</Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" className="rounded-full">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
