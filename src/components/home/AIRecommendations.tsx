import React from 'react';
import { useApp } from '../../context/AppContext';
import { useCart } from '../../context/CartContext';
import { Sparkles, Star, Plus, Flame } from 'lucide-react';
import { MENU_ITEMS, RESTAURANTS } from '../../data/mockData';
import { MenuItem } from '../../types';
import { formatPrice } from '../../utils/formatters';

interface AIRecommendationsProps {
  onSelectItemForCustomization: (item: MenuItem, restId: string, restName: string) => void;
}

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  onSelectItemForCustomization,
}) => {
  const { navigateTo } = useApp();
  const { addItem } = useCart();

  // Curated AI intelligent suggestions (biryani and chef favorites)
  const recommendedItems = MENU_ITEMS.filter((i) => i.isRecommended).slice(0, 4);

  return (
    <section className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent p-5 sm:p-6 rounded-3xl border border-orange-100 relative overflow-hidden">
        {/* Decorative flair */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-orange-500 text-white shadow-xs">
                <Sparkles size={14} />
              </span>
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                Personalized For You
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 font-display">
              Because you love Royal Biryani &amp; Mughlai ❤️
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Smart recommendations tailored to your past orders and top local favorites
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-orange-200/60 self-start sm:self-auto">
            <Flame size={14} className="text-orange-500" />
            <span>AI Flavor Match 98%</span>
          </div>
        </div>

        {/* Horizontal grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendedItems.map((item) => {
            const restaurant = RESTAURANTS.find((r) => r.id === item.restaurantId);
            const restName = restaurant?.name || 'Top Kitchen';

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-3 border border-gray-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] font-bold text-emerald-700">
                      <Star size={10} className="fill-emerald-600 text-emerald-600" />
                      <span>{item.rating}</span>
                    </div>

                    <div className="absolute bottom-2 left-2 text-[10px] font-semibold text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded">
                      {restName}
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-1 mb-1">
                    <h4 className="text-xs font-bold text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                      {item.name}
                    </h4>
                  </div>
                  <p className="text-[11px] text-gray-500 line-clamp-2 mb-3">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-auto">
                  <span className="text-sm font-extrabold text-gray-900">
                    {formatPrice(item.price)}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      if (item.customization && item.customization.length > 0) {
                        onSelectItemForCustomization(item, item.restaurantId, restName);
                      } else {
                        addItem({
                          menuItem: item,
                          restaurantId: item.restaurantId,
                          restaurantName: restName,
                          quantity: 1,
                          selectedOptions: [],
                          unitPrice: item.price,
                        });
                      }
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 hover:bg-orange-500 text-orange-600 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
                  >
                    <Plus size={14} />
                    <span>ADD</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
