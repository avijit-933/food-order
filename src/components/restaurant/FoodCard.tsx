import React from 'react';
import { MenuItem } from '../../types';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';
import { Star, Plus, Minus, Sparkles } from 'lucide-react';

interface FoodCardProps {
  item: MenuItem;
  restaurantId: string;
  restaurantName: string;
  onOpenCustomization: (item: MenuItem) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  item,
  restaurantId,
  restaurantName,
  onOpenCustomization,
}) => {
  const { items, addItem, updateQuantity } = useCart();

  // Find if this item exists in cart (matching base itemId)
  const cartItemsForThisFood = items.filter((i) => i.menuItem.id === item.id);
  const totalQuantityInCart = cartItemsForThisFood.reduce((sum, i) => sum + i.quantity, 0);

  const handleAddClick = () => {
    // If item has customizable options, open modal
    if (item.customization && item.customization.length > 0) {
      onOpenCustomization(item);
    } else {
      addItem({
        menuItem: item,
        restaurantId,
        restaurantName,
        quantity: 1,
        selectedOptions: [],
        unitPrice: item.price,
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100/90 shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row justify-between gap-4">
      {/* Food Details (Left) */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Veg/Non-Veg & Badges */}
          <div className="flex items-center gap-2 mb-1.5">
            {item.isVeg ? (
              <span
                className="w-4 h-4 border border-emerald-600 rounded flex items-center justify-center shrink-0"
                title="Pure Veg"
              >
                <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
              </span>
            ) : (
              <span
                className="w-4 h-4 border border-rose-600 rounded flex items-center justify-center shrink-0"
                title="Non-Vegetarian"
              >
                <span className="w-2 h-2 bg-rose-600 rounded-full"></span>
              </span>
            )}

            {item.isBestseller && (
              <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-tight">
                <Sparkles size={10} /> Bestseller
              </span>
            )}

            {item.isRecommended && !item.isBestseller && (
              <span className="bg-orange-100 text-orange-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-tight">
                Must Try
              </span>
            )}
          </div>

          {/* Name */}
          <h4 className="text-base font-bold text-gray-900 mb-1">{item.name}</h4>

          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-2">
            <div className="flex items-center gap-0.5 font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              <Star size={11} className="fill-emerald-600 text-emerald-600" />
              <span>{item.rating}</span>
            </div>
            <span className="text-[11px] text-gray-400">({item.ratingCount})</span>
          </div>

          {/* Price */}
          <div className="text-base font-extrabold text-gray-900 mb-2">
            {formatPrice(item.price)}
          </div>

          {/* Description */}
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed max-w-lg">
            {item.description}
          </p>
        </div>

        {item.customization && item.customization.length > 0 && (
          <div className="text-[11px] text-orange-600 font-medium mt-2">
            Customisable options available
          </div>
        )}
      </div>

      {/* Food Image and ADD Button (Right) */}
      <div className="relative shrink-0 flex flex-col items-center self-end sm:self-center">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shadow-xs relative bg-gray-100">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        {/* Action Button Floating Over Bottom of Image */}
        <div className="-mt-4 z-10">
          {totalQuantityInCart > 0 ? (
            <div className="bg-white rounded-xl shadow-lg border border-orange-200 flex items-center p-1 text-orange-600 font-bold text-xs">
              <button
                type="button"
                onClick={() => {
                  const firstMatching = cartItemsForThisFood[0];
                  if (firstMatching) updateQuantity(firstMatching.cartItemId, -1);
                }}
                className="w-7 h-7 flex items-center justify-center hover:bg-orange-50 rounded-lg text-gray-600 hover:text-orange-600 transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="px-2 font-black text-sm text-gray-900">{totalQuantityInCart}</span>
              <button
                type="button"
                onClick={handleAddClick}
                className="w-7 h-7 flex items-center justify-center hover:bg-orange-50 rounded-lg text-orange-600 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAddClick}
              className="px-6 py-2 bg-white hover:bg-orange-50 text-orange-600 border border-orange-200 hover:border-orange-400 rounded-xl font-extrabold text-xs shadow-md transition-all uppercase tracking-wider flex items-center gap-1 cursor-pointer"
            >
              <span>Add</span>
              <Plus size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
