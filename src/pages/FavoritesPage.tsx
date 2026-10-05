import React from 'react';
import { useApp } from '../context/AppContext';
import { RESTAURANTS, MENU_ITEMS } from '../data/mockData';
import { RestaurantCard } from '../components/restaurant/RestaurantCard';
import { FoodCard } from '../components/restaurant/FoodCard';
import { CustomizationModal } from '../components/restaurant/CustomizationModal';
import { MenuItem } from '../types';
import { Heart, UtensilsCrossed } from 'lucide-react';

export const FavoritesPage: React.FC = () => {
  const { favorites, navigateTo } = useApp();
  const [customizingItem, setCustomizingItem] = React.useState<MenuItem | null>(null);

  // Saved restaurants
  const savedRestaurants = RESTAURANTS.filter((r) => favorites.includes(r.id));
  // Popular dishes from favorite restaurants
  const favoriteDishes = MENU_ITEMS.filter((m) => favorites.includes(m.restaurantId)).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      <div className="bg-white border-b border-gray-100 py-6 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-500">
              <Heart size={22} className="fill-rose-500" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 font-display">Your Favorites</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            All your loved dining spots and mouthwatering dishes saved for quick ordering
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {savedRestaurants.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 max-w-md mx-auto shadow-xs">
            <Heart size={44} className="text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900">No favorites saved yet</h3>
            <p className="text-xs text-gray-500 mt-1 mb-5">
              Tap the heart icon on any restaurant or dish to save it here for fast reordering.
            </p>
            <button
              onClick={() => navigateTo('home')}
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 cursor-pointer"
            >
              Explore Restaurants
            </button>
          </div>
        ) : (
          <>
            {/* Favorite Restaurants */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 font-display">
                Saved Restaurants ({savedRestaurants.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {savedRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            </div>

            {/* Favorite Dishes from these restaurants */}
            {favoriteDishes.length > 0 && (
              <div className="pt-6 border-t border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4 font-display">
                  Top Recommended Dishes from Your Favorites
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {favoriteDishes.map((item) => {
                    const r = RESTAURANTS.find((rest) => rest.id === item.restaurantId);
                    return (
                      <FoodCard
                        key={item.id}
                        item={item}
                        restaurantId={item.restaurantId}
                        restaurantName={r?.name || 'Restaurant'}
                        onOpenCustomization={(it) => setCustomizingItem(it)}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {customizingItem && (
        <CustomizationModal
          item={customizingItem}
          restaurantId={customizingItem.restaurantId}
          restaurantName="Restaurant"
          onClose={() => setCustomizingItem(null)}
        />
      )}
    </div>
  );
};
