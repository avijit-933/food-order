import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { RESTAURANTS, MENU_ITEMS } from '../data/mockData';
import { FoodCard } from '../components/restaurant/FoodCard';
import { CustomizationModal } from '../components/restaurant/CustomizationModal';
import { MenuItem } from '../types';
import { formatPrice } from '../utils/formatters';
import {
  Star,
  Clock,
  MapPin,
  Heart,
  Share2,
  ArrowLeft,
  Search,
  Leaf,
  Sparkles,
  Info,
} from 'lucide-react';

export const RestaurantDetailPage: React.FC = () => {
  const {
    selectedRestaurantId,
    navigateTo,
    toggleFavoriteRestaurant,
    isFavorite,
    showToast,
  } = useApp();

  const restaurant = RESTAURANTS.find((r) => r.id === selectedRestaurantId) || RESTAURANTS[0];
  const favorite = isFavorite(restaurant.id);

  // All menu items for this restaurant
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('All');
  const [menuSearch, setMenuSearch] = useState('');
  const [vegOnly, setVegOnly] = useState(false);

  // Customization modal
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    const items = MENU_ITEMS.filter((i) => i.restaurantId === restaurant.id);
    setMenuItems(items);
  }, [restaurant.id]);

  // Distinct categories available in this restaurant's menu
  const availableCategories = ['All', ...Array.from(new Set(menuItems.map((i) => i.category)))];

  // Filtered menu items
  const filteredMenu = menuItems.filter((item) => {
    if (vegOnly && !item.isVeg) return false;
    if (selectedTab !== 'All' && item.category !== selectedTab) return false;
    if (menuSearch.trim()) {
      const q = menuSearch.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard', 'Share FoodieGo menu with friends', 'info');
    } else {
      showToast('Share restaurant', restaurant.name, 'info');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      {/* Top Navigation Bar with Back Button */}
      <div className="bg-white border-b border-gray-100 py-3 sticky top-14 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-orange-600 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Restaurants</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavoriteRestaurant(restaurant.id)}
              className={`p-2 rounded-xl border transition-colors ${
                favorite
                  ? 'border-rose-200 bg-rose-50 text-rose-600'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
              title="Save to favorites"
            >
              <Heart size={16} className={favorite ? 'fill-rose-600' : ''} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              title="Share restaurant"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Restaurant Header Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
          {/* Cover Photo */}
          <div className="relative h-48 sm:h-64 lg:h-72 w-full bg-gray-100">
            <img
              src={restaurant.coverImage || restaurant.image}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

            {restaurant.discount && (
              <div className="absolute top-4 left-4 bg-orange-500 text-white font-black text-xs px-3.5 py-1.5 rounded-xl shadow-md uppercase">
                {restaurant.discount}
              </div>
            )}

            <div className="absolute bottom-4 left-4 right-4 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-white/20 backdrop-blur-md uppercase tracking-wider mb-1.5">
                  {restaurant.isOpen ? '🟢 Open Now' : '🔴 Closed'}
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display">
                  {restaurant.name}
                </h1>
                <p className="text-xs sm:text-sm text-gray-200 mt-1 font-medium">
                  {restaurant.cuisine.join(' • ')}
                </p>
              </div>

              {/* Rating Card */}
              <div className="bg-white/95 backdrop-blur-md text-gray-900 px-4 py-2 rounded-2xl shadow-xl border border-white flex items-center gap-3 shrink-0 self-start sm:self-auto">
                <div className="p-2 rounded-xl bg-emerald-600 text-white font-extrabold flex items-center gap-1 text-sm">
                  <Star size={14} className="fill-white" />
                  <span>{restaurant.rating}</span>
                </div>
                <div>
                  <div className="text-xs font-bold">{restaurant.ratingCount.toLocaleString()} ratings</div>
                  <div className="text-[10px] text-gray-500">Verified Foodie Reviews</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="p-4 sm:p-5 bg-gray-50/70 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <Clock size={16} />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-semibold uppercase block">Delivery Time</span>
                <span className="font-bold text-gray-800">{restaurant.deliveryTime}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <MapPin size={16} />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-semibold uppercase block">Distance</span>
                <span className="font-bold text-gray-800">{restaurant.distance} away</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <span className="font-bold text-sm">₹</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-semibold uppercase block">Cost for two</span>
                <span className="font-bold text-gray-800">{formatPrice(restaurant.priceForTwo)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Leaf size={16} />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-semibold uppercase block">Hygiene Rating</span>
                <span className="font-bold text-emerald-700">FSSAI Certified 4.8★</span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Filtering Toolbar */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth pb-1 md:pb-0">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedTab(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedTab === cat
                    ? 'bg-orange-500 text-white shadow-xs shadow-orange-500/20'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200/70 hover:text-gray-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Right Filters: Veg Switch & Menu Search */}
          <div className="flex items-center gap-3">
            {/* Pure Veg Switch */}
            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                vegOnly
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Leaf size={14} />
              <span>Veg Only</span>
            </button>

            {/* In-menu search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                placeholder="Search dish in menu..."
                className="pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500 w-44 sm:w-56"
              />
            </div>
          </div>
        </div>

        {/* Menu Dishes Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 font-display">
              {selectedTab === 'All' ? 'Recommended & Full Menu' : selectedTab}
            </h3>
            <span className="text-xs text-gray-400 font-medium">
              {filteredMenu.length} {filteredMenu.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {filteredMenu.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredMenu.map((item) => (
                <FoodCard
                  key={item.id}
                  item={item}
                  restaurantId={restaurant.id}
                  restaurantName={restaurant.name}
                  onOpenCustomization={(it) => setCustomizingItem(it)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
              <Info size={32} className="text-gray-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-gray-800">No dishes match your selection</h4>
              <p className="text-xs text-gray-400 mt-1">Try toggling off &quot;Veg Only&quot; or clearing your dish search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Food Customization Modal */}
      {customizingItem && (
        <CustomizationModal
          item={customizingItem}
          restaurantId={restaurant.id}
          restaurantName={restaurant.name}
          onClose={() => setCustomizingItem(null)}
        />
      )}
    </div>
  );
};
