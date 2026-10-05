import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, MapPin, ArrowRight, Sparkles, Flame, Clock } from 'lucide-react';

interface HeroBannerProps {
  onSearch: (q: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onSearch }) => {
  const { selectedAddress, setIsLocationPickerOpen, navigateTo } = useApp();
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
    } else {
      navigateTo('search');
    }
  };

  const quickCuisines = ['Biryani', 'Pizza', 'Burger', 'Chinese', 'Desserts'];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-orange-50/70 via-amber-50/30 to-transparent pt-6 pb-12 sm:pb-16 rounded-b-[2.5rem]">
      {/* Background soft ambient food blurs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text & Search Box */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/80 text-orange-700 text-xs font-bold mb-4 animate-in fade-in slide-in-from-bottom-2">
              <Sparkles size={14} className="text-orange-500" />
              <span>Fastest delivery in your neighborhood</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.1] font-display text-balance">
              Good food. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500">
                Great mood.
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Discover the best restaurants and delicious food near you. Hot meals prepared fresh and delivered right to your doorstep.
            </p>

            {/* Integrated Search & Location Bar */}
            <div className="mt-8 bg-white p-2 sm:p-2.5 rounded-3xl shadow-xl shadow-orange-950/5 border border-gray-100 max-w-2xl mx-auto lg:mx-0">
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-2">
                {/* Location trigger button */}
                <div
                  onClick={() => setIsLocationPickerOpen(true)}
                  className="w-full sm:w-auto flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors text-xs text-gray-700 font-semibold shrink-0"
                >
                  <MapPin size={16} className="text-orange-500" />
                  <span className="truncate max-w-[130px]">{selectedAddress.city}</span>
                </div>

                <div className="hidden sm:block h-7 w-[1px] bg-gray-200"></div>

                {/* Input query */}
                <div className="w-full flex-1 flex items-center gap-2 px-3">
                  <Search size={18} className="text-gray-400 shrink-0" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search for restaurants, dishes or cuisines..."
                    className="w-full py-2 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
                  />
                </div>

                {/* Search CTA button */}
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-bold text-sm shadow-md shadow-orange-500/25 hover:from-orange-600 hover:to-amber-600 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <span>Search</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>

            {/* Quick Cuisine Badges */}
            <div className="mt-4 flex items-center justify-center lg:justify-start gap-2 flex-wrap text-xs text-gray-500">
              <span className="font-semibold text-gray-400">Popular:</span>
              {quickCuisines.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setSearchInput(item);
                    onSearch(item);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white text-gray-700 hover:text-orange-600 border border-gray-200/60 shadow-2xs transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Right Visual Floating Food Showcase */}
          <div className="lg:col-span-5 relative hidden sm:flex items-center justify-center">
            <div className="relative w-80 h-80 sm:w-96 sm:h-96">
              {/* Rotating glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-400 to-amber-300 opacity-20 blur-xl animate-pulse"></div>

              {/* Main Circular Food Hero Plate */}
              <div className="w-full h-full rounded-full p-3 bg-white shadow-2xl border-4 border-white overflow-hidden relative group">
                <img
                  src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80"
                  alt="Royal Dum Biryani Handi"
                  className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Floating Badge 1: 30% OFF */}
              <div className="absolute -top-3 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-2 animate-bounce">
                <div className="w-7 h-7 rounded-xl bg-orange-500 text-white flex items-center justify-center">
                  <Flame size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Mega Offer</p>
                  <p className="text-xs font-black text-gray-900">Flat 30% OFF</p>
                </div>
              </div>

              {/* Floating Badge 2: 25 min delivery */}
              <div className="absolute -bottom-2 right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Average Arrival</p>
                  <p className="text-xs font-black text-gray-900">20–25 Mins</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
