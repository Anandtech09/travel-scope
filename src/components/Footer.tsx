
import React from 'react';
import { MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-travel-slate text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <MapPin className="h-6 w-6 text-travel-teal mr-2" />
              <h3 className="text-xl font-bold">TravelScope</h3>
            </div>
            <p className="text-white/70 text-sm">
              AI-powered travel recommendations to help you discover your next adventure.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-white/70">
              <li><a href="#" className="hover:text-travel-teal transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-travel-teal transition-colors">Destinations</a></li>
              <li><a href="#" className="hover:text-travel-teal transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-travel-teal transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Features</h4>
            <ul className="space-y-2 text-white/70">
              <li><a href="#" className="hover:text-travel-teal transition-colors">AI Recommendations</a></li>
              <li><a href="#" className="hover:text-travel-teal transition-colors">Budget Planning</a></li>
              <li><a href="#" className="hover:text-travel-teal transition-colors">Transportation Info</a></li>
              <li><a href="#" className="hover:text-travel-teal transition-colors">Travel Guides</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-2 text-white/70">
              <li>Email: info@travelscope.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Travel Street, Explore City</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/50 text-sm">
          &copy; {new Date().getFullYear()} TravelScope. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
