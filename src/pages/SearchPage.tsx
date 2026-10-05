import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { RESTAURANTS, MENU_ITEMS, CATEGORIES } from '../data/mockData';
import { RestaurantCard } from '../components/restaurant/RestaurantCard';
import { FoodCard } from '../components/restaurant/FoodCard';
import { CustomizationModal } from '../components/restaurant/CustomizationModal';
import { MenuItem } from '../types';
import { Search, X, Clock, Flame, Utensils, Store } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const { navigateTo } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'dishes' | 'restaurants'>('all');

  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Biryani',
    'Burger',
    'Butter Naan',
    'Pizza',
  ]);

  const popularSearches = [
    'Chicken Dum Biryani',
    'Paneer Butter Masala',
    'Truffle Burger',
    'Margherita Pizza',
    'Hakka Noodles',
    'Cheesecake',
  ];

  // Customization modal state
  const [customizingItem, setCustomizingItem] = useState<{
    item: MenuItem;
    restaurantId: string;
    restaurantName: string;
  } | null>(null);

  // Perform search across dishes and restaurants
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return { dishes: [], restaurants: [] };
    }
    const q = searchQuery.toLowerCase().trim();

    const matchedDishes = MENU_ITEMS.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
    );

    const matchedRestaurants = RESTAURANTS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.cuisine.some((c) => c.toLowerCase().includes(q)) ||
        r.tags.some((t) => t.toLowerCase().includes(q)) ||
        matchedDishes.some((d) => d.restaurantId === r.id)
    );

    return {
      dishes: matchedDishes,
      restaurants: matchedRestaurants,
    };
  }, [searchQuery]);

  const handleSelectSearchTerm = (term: string) => {
    setSearchQuery(term);
    if (!recentSearches.includes(term)) {
      setRecentSearches((prev) => [term, ...prev.slice(0, 5)]);
    }
  };

  const clearRecent = () => setRecentSearches([]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      {/* Search Header Bar */}
      <div className="bg-white border-b border-gray-100 py-6 sticky top-14 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="relative">
            <Search size={20} className="absolute left-4 top-3.5 text-orange-500" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for restaurants, dishes or cuisines (e.g. Biryani, Burger, Pizza)..."
              className="w-full pl-12 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-700 p-0.5 rounded-full"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Search Result Type Tabs */}
          {searchQuery.trim() && (
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'all'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All ({searchResults.dishes.length + searchResults.restaurants.length})
              </button>
              <button
                onClick={() => setActiveTab('dishes')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === 'dishes'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Utensils size={12} />
                Dishes ({searchResults.dishes.length})
              </button>
              <button
                onClick={() => setActiveTab('restaurants')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === 'restaurants'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Store size={12} />
                Restaurants ({searchResults.restaurants.length})
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {!searchQuery.trim() ? (
          /* Pre-search states: Recent & Popular */
          <div className="space-y-8">
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <Clock size={14} />
                    <span>Recent Searches</span>
                  </div>
                  <button
                    onClick={clearRecent}
                    className="text-xs text-rose-600 font-semibold hover:underline"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSelectSearchTerm(term)}
                      className="px-3.5 py-2 bg-white hover:bg-orange-50 text-gray-700 hover:text-orange-600 border border-gray-200 rounded-xl text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Clock size={12} className="text-gray-400" />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                <Flame size={14} className="text-orange-500" />
                <span>Trending Searches</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSelectSearchTerm(term)}
                    className="px-4 py-2 bg-white hover:bg-orange-50 text-gray-800 hover:text-orange-600 border border-gray-200 hover:border-orange-300 rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Cuisines Explore */}
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Cuisine Categories
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CATEGORIES.slice(0, 8).map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => handleSelectSearchTerm(cat.name)}
                    className="p-3 bg-white hover:bg-orange-50/50 rounded-2xl border border-gray-100 shadow-2xs cursor-pointer flex items-center gap-3 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-900 block group-hover:text-orange-600">
                        {cat.name}
                      </span>
                      <span className="text-[10px] text-gray-400">Explore options</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Live Results */
          <div className="space-y-8">
            {/* Dishes Section */}
            {(activeTab === 'all' || activeTab === 'dishes') && searchResults.dishes.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Utensils size={18} className="text-orange-500" />
                  <span>Popular Dishes ({searchResults.dishes.length})</span>
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {searchResults.dishes.map((item) => {
                    const rest = RESTAURANTS.find((r) => r.id === item.restaurantId);
                    return (
                      <FoodCard
                        key={item.id}
                        item={item}
                        restaurantId={item.restaurantId}
                        restaurantName={rest?.name || 'Restaurant'}
                        onOpenCustomization={(it) =>
                          setCustomizingItem({
                            item: it,
                            restaurantId: it.restaurantId,
                            restaurantName: rest?.name || 'Restaurant',
                          })
                        }
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Restaurants Section */}
            {(activeTab === 'all' || activeTab === 'restaurants') &&
              searchResults.restaurants.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Store size={18} className="text-orange-500" />
                    <span>Restaurants serving &quot;{searchQuery}&quot; ({searchResults.restaurants.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {searchResults.restaurants.map((restaurant) => (
                      <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                    ))}
                  </div>
                </div>
              )}

            {/* No Results Fallback */}
            {searchResults.dishes.length === 0 && searchResults.restaurants.length === 0 && (
              <div className="py-16 text-center bg-white rounded-3xl border border-gray-100 p-8">
                <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-3">
                  <Search size={28} />
                </div>
                <h4 className="text-base font-bold text-gray-900">
                  No matches found for &quot;{searchQuery}&quot;
                </h4>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Double-check your spelling, or explore popular cravings like Biryani, Burgers, and Pizzas.
                </p>
                <div className="mt-5 flex justify-center gap-2 flex-wrap">
                  {['Biryani', 'Pizza', 'Burger', 'Chinese'].map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSelectSearchTerm(term)}
                      className="px-3.5 py-1.5 bg-orange-50 text-orange-600 rounded-xl text-xs font-bold hover:bg-orange-100 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {customizingItem && (
        <CustomizationModal
          item={customizingItem.item}
          restaurantId={customizingItem.restaurantId}
          restaurantName={customizingItem.restaurantName}
          onClose={() => setCustomizingItem(null)}
        />
      )}
    </div>
  );
};
