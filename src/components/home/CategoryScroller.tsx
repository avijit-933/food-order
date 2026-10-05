import React, { useRef } from 'react';
import { CATEGORIES } from '../../data/mockData';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryScrollerProps {
  selectedCategory: string;
  onSelectCategory: (categoryName: string) => void;
}

export const CategoryScroller: React.FC<CategoryScrollerProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-display">
            Inspiration for your first order
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Explore by popular cuisines and crave-worthy dishes</p>
        </div>

        {/* Scroll Buttons (Desktop) */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600 shadow-2xs transition-colors cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600 shadow-2xs transition-colors cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Area */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-3 -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        {/* "All" button */}
        <button
          onClick={() => onSelectCategory('All')}
          className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer"
        >
          <div
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-300 ${
              selectedCategory === 'All'
                ? 'bg-gradient-to-tr from-orange-500 to-amber-500 text-white ring-4 ring-orange-200 shadow-md scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 group-hover:scale-105'
            }`}
          >
            🍽️
          </div>
          <span
            className={`text-xs text-center transition-colors ${
              selectedCategory === 'All' ? 'font-bold text-orange-600' : 'font-medium text-gray-700 group-hover:text-gray-900'
            }`}
          >
            All Items
          </span>
        </button>

        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer"
            >
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden transition-all duration-300 relative shadow-sm ${
                  isSelected
                    ? 'ring-4 ring-orange-500 shadow-md scale-105'
                    : 'hover:ring-2 hover:ring-orange-300 group-hover:scale-105'
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
              </div>

              <span
                className={`text-xs text-center transition-colors flex items-center gap-1 ${
                  isSelected
                    ? 'font-bold text-orange-600'
                    : 'font-medium text-gray-700 group-hover:text-gray-900'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
