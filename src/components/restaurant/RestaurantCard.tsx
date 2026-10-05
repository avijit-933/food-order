import React from 'react';
import { Restaurant } from '../../types';
import { useApp } from '../../context/AppContext';
import { Star, Clock, MapPin, Heart, Bike } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const { navigateTo, toggleFavoriteRestaurant, isFavorite } = useApp();
  const favorite = isFavorite(restaurant.id);

  return (
    <div
      onClick={() => navigateTo('restaurant', { restaurantId: restaurant.id })}
      className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group w-full border border-gray-100/90 cursor-pointer flex flex-col justify-between"
    >
      {/* Image Container with Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient shadow for text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>

        {/* Discount Badge */}
        {restaurant.discount && (
          <div className="absolute top-3.5 left-0 bg-gradient-to-r from-orange-600 to-amber-500 text-white px-3 py-1 rounded-r-xl text-[11px] font-extrabold shadow-md tracking-tight uppercase">
            {restaurant.discount}
          </div>
        )}

        {/* Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavoriteRestaurant(restaurant.id);
          }}
          className={`absolute top-3.5 right-3.5 p-2 rounded-full backdrop-blur-md transition-all ${
            favorite
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-white/80 hover:bg-white text-gray-700 hover:text-rose-500'
          }`}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={16} className={favorite ? 'fill-white' : ''} />
        </button>

        {/* Bottom Delivery Time Tag on Image */}
        <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 text-white text-xs font-semibold drop-shadow-md">
          <div className="p-1 rounded-md bg-black/40 backdrop-blur-xs">
            <Clock size={12} className="inline mr-1 text-orange-300" />
            <span>{restaurant.deliveryTime}</span>
          </div>
          <span className="text-white/60">•</span>
          <div className="p-1 rounded-md bg-black/40 backdrop-blur-xs">
            <span>{restaurant.distance}</span>
          </div>
        </div>
      </div>

      {/* Restaurant Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Veg Indicator */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1 font-display">
              {restaurant.name}
            </h3>
            {restaurant.isVeg && (
              <span
                className="shrink-0 w-4 h-4 border border-emerald-600 rounded flex items-center justify-center mt-1"
                title="Pure Veg Restaurant"
              >
                <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
              </span>
            )}
          </div>

          {/* Rating & Cuisines */}
          <div className="flex items-center gap-2 mb-2 text-xs">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg font-bold bg-emerald-600 text-white shadow-2xs">
              <Star size={11} className="fill-current" />
              <span>{restaurant.rating.toFixed(1)}</span>
            </div>
            <span className="text-gray-400 text-[11px]">({restaurant.ratingCount.toLocaleString()}+)</span>
            <span className="text-gray-300">·</span>
            <p className="text-gray-600 truncate font-medium flex-1">
              {restaurant.cuisine.join(', ')}
            </p>
          </div>
        </div>

        {/* Footer Info (Price for two & Delivery note) */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600 mt-2">
          <div className="flex items-center gap-1 font-medium">
            <span className="font-bold text-gray-900">{formatPrice(restaurant.priceForTwo)}</span>
            <span className="text-gray-400 text-[11px]">for two</span>
          </div>

          <div className="flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">
            <Bike size={12} />
            <span>Fast Courier</span>
          </div>
        </div>
      </div>
    </div>
  );
};
