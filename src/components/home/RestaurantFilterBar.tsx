import React from 'react';
import { SlidersHorizontal, ArrowUpDown, Tag, Leaf, Zap, X } from 'lucide-react';

export interface FilterState {
  sortBy: 'recommended' | 'rating' | 'deliveryTime' | 'priceAsc' | 'priceDesc' | 'distance';
  isVeg: boolean;
  offersOnly: boolean;
  fastDelivery: boolean;
  cuisine: string;
}

interface RestaurantFilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  totalCount: number;
}

export const RestaurantFilterBar: React.FC<RestaurantFilterBarProps> = ({
  filters,
  onFilterChange,
  totalCount,
}) => {
  const hasActiveFilters =
    filters.sortBy !== 'recommended' ||
    filters.isVeg ||
    filters.offersOnly ||
    filters.fastDelivery ||
    filters.cuisine !== 'All';

  const resetFilters = () => {
    onFilterChange({
      sortBy: 'recommended',
      isVeg: false,
      offersOnly: false,
      fastDelivery: false,
      cuisine: 'All',
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-3 sm:p-4 mb-6 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Interactive filter buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sort Dropdown */}
          <div className="relative inline-flex items-center">
            <label htmlFor="sort-select" className="sr-only">Sort by</label>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200/80 rounded-xl text-xs font-semibold text-gray-700 cursor-pointer transition-colors">
              <ArrowUpDown size={14} className="text-gray-500" />
              <select
                id="sort-select"
                value={filters.sortBy}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    sortBy: e.target.value as FilterState['sortBy'],
                  })
                }
                className="bg-transparent text-xs font-semibold text-gray-800 focus:outline-none cursor-pointer pr-1"
              >
                <option value="recommended">Sort: Recommended</option>
                <option value="rating">Rating: High to Low</option>
                <option value="deliveryTime">Delivery Time</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="distance">Distance</option>
              </select>
            </div>
          </div>

          {/* Pure Veg Toggle */}
          <button
            onClick={() => onFilterChange({ ...filters, isVeg: !filters.isVeg })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filters.isVeg
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200/80'
            }`}
          >
            <Leaf size={14} className={filters.isVeg ? 'text-white' : 'text-emerald-600'} />
            <span>Pure Veg</span>
          </button>

          {/* Offers Only Toggle */}
          <button
            onClick={() => onFilterChange({ ...filters, offersOnly: !filters.offersOnly })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filters.offersOnly
                ? 'bg-orange-500 text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200/80'
            }`}
          >
            <Tag size={14} className={filters.offersOnly ? 'text-white' : 'text-orange-500'} />
            <span>Special Offers</span>
          </button>

          {/* Fast Delivery (< 25 min) */}
          <button
            onClick={() => onFilterChange({ ...filters, fastDelivery: !filters.fastDelivery })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filters.fastDelivery
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200/80'
            }`}
          >
            <Zap size={14} className={filters.fastDelivery ? 'text-white' : 'text-amber-500'} />
            <span>Fast Delivery (&lt; 25m)</span>
          </button>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
            >
              <X size={14} />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Right: Count */}
        <div className="text-xs text-gray-400 font-medium">
          Showing <span className="font-bold text-gray-800">{totalCount}</span> restaurants
        </div>
      </div>
    </div>
  );
};
