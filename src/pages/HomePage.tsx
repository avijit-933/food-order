import React, { useState, useMemo } from 'react';
import { HeroBanner } from '../components/home/HeroBanner';
import { CategoryScroller } from '../components/home/CategoryScroller';
import { RestaurantFilterBar, FilterState } from '../components/home/RestaurantFilterBar';
import { AIRecommendations } from '../components/home/AIRecommendations';
import { RestaurantCard } from '../components/restaurant/RestaurantCard';
import { CustomizationModal } from '../components/restaurant/CustomizationModal';
import { RESTAURANTS, MENU_ITEMS } from '../data/mockData';
import { MenuItem, Restaurant } from '../types';
import { useApp } from '../context/AppContext';
import { UtensilsCrossed, RefreshCw } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigateTo } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [filters, setFilters] = useState<FilterState>({
    sortBy: 'recommended',
    isVeg: false,
    offersOnly: false,
    fastDelivery: false,
    cuisine: 'All',
  });

  // Customization modal state
  const [customizingItem, setCustomizingItem] = useState<{
    item: MenuItem;
    restaurantId: string;
    restaurantName: string;
  } | null>(null);

  // Filter restaurants based on category, search, and filters
  const filteredRestaurants = useMemo(() => {
    let list = [...RESTAURANTS];

    // Search query from hero
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisine.some((c) => c.toLowerCase().includes(q)) ||
          r.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      const catLower = selectedCategory.toLowerCase();
      list = list.filter((r) =>
        r.cuisine.some((c) => c.toLowerCase().includes(catLower)) ||
        r.tags.some((t) => t.toLowerCase().includes(catLower)) ||
        // Also check if restaurant has menu items in this category
        MENU_ITEMS.some(
          (m) => m.restaurantId === r.id && m.category.toLowerCase().includes(catLower)
        )
      );
    }

    // Pure veg filter
    if (filters.isVeg) {
      list = list.filter((r) => r.isVeg);
    }

    // Offers only filter
    if (filters.offersOnly) {
      list = list.filter((r) => Boolean(r.discount));
    }

    // Fast delivery (< 25 min)
    if (filters.fastDelivery) {
      list = list.filter((r) => {
        const timeVal = parseInt(r.deliveryTime);
        return !isNaN(timeVal) && timeVal <= 25;
      });
    }

    // Sorting
    if (filters.sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === 'deliveryTime') {
      list.sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
    } else if (filters.sortBy === 'priceAsc') {
      list.sort((a, b) => a.priceForTwo - b.priceForTwo);
    } else if (filters.sortBy === 'priceDesc') {
      list.sort((a, b) => b.priceForTwo - a.priceForTwo);
    } else if (filters.sortBy === 'distance') {
      list.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    }

    return list;
  }, [selectedCategory, searchQuery, filters]);

  const handleHeroSearch = (query: string) => {
    setSearchQuery(query);
    // Scroll smoothly to restaurants section
    const elem = document.getElementById('restaurants-section');
    elem?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-16">
      {/* Hero Section */}
      <HeroBanner onSearch={handleHeroSearch} />

      {/* Horizontal Food Categories */}
      <CategoryScroller
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSearchQuery('');
        }}
      />

      {/* AI Smart Recommendation Section */}
      <AIRecommendations
        onSelectItemForCustomization={(item, restId, restName) =>
          setCustomizingItem({ item, restaurantId: restId, restaurantName: restName })
        }
      />

      {/* Main Restaurant Discovery Section */}
      <section id="restaurants-section" className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-display">
              Top restaurants near you
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Handpicked dining destinations with authentic recipes and lightning-fast courier service
            </p>
          </div>

          {searchQuery && (
            <div className="text-xs text-orange-600 bg-orange-50 px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 self-start">
              <span>Matching: &quot;{searchQuery}&quot;</span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-gray-400 hover:text-gray-700 font-bold ml-1"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Filter & Sort Bar */}
        <RestaurantFilterBar
          filters={filters}
          onFilterChange={setFilters}
          totalCount={filteredRestaurants.length}
        />

        {/* Restaurant Cards Grid */}
        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="py-16 text-center bg-white rounded-3xl border border-gray-100 p-8 shadow-xs max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-4">
              <UtensilsCrossed size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No restaurants found</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Try adjusting your category, resetting your filters, or broadening your search criteria.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setFilters({
                  sortBy: 'recommended',
                  isVeg: false,
                  offersOnly: false,
                  fastDelivery: false,
                  cuisine: 'All',
                });
              }}
              className="mt-5 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 inline-flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw size={14} />
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* Food Customization Modal if triggered from AI Recommendation */}
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
