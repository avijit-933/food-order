import React from 'react';
import { useApp } from '../../context/AppContext';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';
import { Home, Search, Heart, Package, User, ShoppingBag, ArrowRight } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { currentPage, navigateTo, favorites } = useApp();
  const { itemCount, grandTotal, setIsCartOpen } = useCart();

  const navItems = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'search' as const, label: 'Search', icon: Search },
    { id: 'favorites' as const, label: 'Favorites', icon: Heart, badge: favorites.length },
    { id: 'orders' as const, label: 'Orders', icon: Package },
    { id: 'profile' as const, label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden pointer-events-none">
      {/* Sticky Cart Action Banner (above bottom bar) */}
      {itemCount > 0 && currentPage !== 'checkout' && currentPage !== 'cart' && (
        <div className="px-4 pb-2 pointer-events-auto">
          <div
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-gradient-to-r from-orange-600 to-amber-500 text-white rounded-2xl p-3.5 shadow-xl flex items-center justify-between cursor-pointer animate-in slide-in-from-bottom-2"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold text-xs">
                <ShoppingBag size={16} />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider block text-orange-100">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'} in Cart
                </span>
                <span className="text-sm font-extrabold">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold bg-white text-orange-600 px-3.5 py-1.5 rounded-xl shadow-xs">
              <span>View Cart</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav Bar */}
      <nav className="bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 py-2 pointer-events-auto shadow-lg flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors relative ${
                isActive ? 'text-orange-600' : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              <div className="relative">
                <Icon size={20} className={isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-orange-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-semibold ${isActive ? 'text-orange-600 font-bold' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
