import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/formatters';
import { INITIAL_NOTIFICATIONS } from '../../data/mockData';
import {
  MapPin,
  Search,
  ShoppingCart,
  User as UserIcon,
  ChevronDown,
  Bell,
  Heart,
  Package,
  LogOut,
  Shield,
  Bike,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentPage,
    navigateTo,
    selectedAddress,
    setIsLocationPickerOpen,
    favorites,
  } = useApp();

  const { itemCount, grandTotal, setIsCartOpen } = useCart();
  const { user, isAuthenticated, role, switchRole, logout, openAuthModal } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 py-2.5'
            : 'bg-white border-b border-gray-100 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-6">
            {/* Left: Mobile Menu & Brand Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 text-gray-700 md:hidden hover:bg-gray-100 rounded-xl"
                aria-label="Toggle Navigation"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              {/* FoodieGo Logo */}
              <div
                onClick={() => navigateTo('home')}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-orange-500/30 group-hover:scale-105 transition-transform">
                  <span className="font-extrabold text-lg tracking-tight font-display">FG</span>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-display">
                      Foodie<span className="text-orange-500">Go</span>
                    </span>
                    <span className="inline-block w-2 h-2 rounded-full bg-orange-500"></span>
                  </div>
                  <span className="hidden sm:block text-[10px] uppercase font-bold text-gray-400 tracking-widest -mt-1">
                    Fresh & Express
                  </span>
                </div>
              </div>

              {/* Location Picker Trigger */}
              <div
                onClick={() => setIsLocationPickerOpen(true)}
                className="hidden lg:flex items-center gap-2 pl-4 ml-3 border-l border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="p-1.5 bg-orange-50 text-orange-500 rounded-lg">
                  <MapPin size={16} />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <span>Deliver to</span>
                    <ChevronDown size={12} className="text-gray-400" />
                  </div>
                  <div className="text-xs font-bold text-gray-800 max-w-[170px] truncate">
                    {selectedAddress.type}: {selectedAddress.city}, {selectedAddress.state}
                  </div>
                </div>
              </div>
            </div>

            {/* Middle: Global Search Input (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-md mx-2">
              <div
                onClick={() => navigateTo('search')}
                className="w-full flex items-center gap-2.5 px-4 py-2 bg-gray-100/90 hover:bg-gray-100 rounded-2xl cursor-pointer border border-transparent hover:border-gray-200 transition-all text-gray-500 text-xs"
              >
                <Search size={16} className="text-orange-500 shrink-0" />
                <span className="truncate">Search for restaurants, dishes or cuisines...</span>
                <span className="ml-auto text-[10px] bg-white px-2 py-0.5 rounded-md text-gray-400 font-mono shadow-xs border border-gray-200">
                  /
                </span>
              </div>
            </div>

            {/* Right: Actions, Role switch, User, Cart */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Role Switcher Pill (Quick preview helper for Customer/Admin/Delivery) */}
              <div className="hidden xl:flex items-center gap-1 p-1 bg-gray-100 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => switchRole('customer')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    role === 'customer'
                      ? 'bg-white text-orange-600 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Customer
                </button>
                <button
                  onClick={() => {
                    switchRole('delivery');
                    navigateTo('delivery-panel');
                  }}
                  className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                    role === 'delivery'
                      ? 'bg-white text-emerald-600 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Bike size={12} />
                  Rider
                </button>
                <button
                  onClick={() => {
                    switchRole('admin');
                    navigateTo('admin');
                  }}
                  className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                    role === 'admin'
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Shield size={12} />
                  Admin
                </button>
              </div>

              {/* Mobile Search Button */}
              <button
                onClick={() => navigateTo('search')}
                className="p-2 md:hidden text-gray-700 hover:bg-gray-100 rounded-xl"
                aria-label="Search food"
              >
                <Search size={20} />
              </button>

              {/* Wishlist/Favorites */}
              <button
                onClick={() => navigateTo('favorites')}
                className="relative p-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors hidden sm:flex items-center justify-center"
                aria-label="Wishlist"
              >
                <Heart size={20} />
                {favorites.length > 0 && (
                  <span className="absolute 1 top-1 right-1 w-2 h-2 rounded-full bg-orange-500"></span>
                )}
              </button>

              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="relative p-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors flex items-center justify-center"
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-[10px] text-white font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 pb-2 border-b border-gray-100 flex items-center justify-between">
                      <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Notifications</h4>
                      <button
                        onClick={() => {
                          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
                        }}
                        className="text-[11px] text-orange-600 font-semibold hover:underline"
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            if (n.type === 'order') navigateTo('tracking');
                            setIsNotifOpen(false);
                          }}
                          className={`p-3 text-left hover:bg-gray-50 cursor-pointer transition-colors ${
                            !n.read ? 'bg-orange-50/40' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-900">{n.title}</span>
                            <span className="text-[10px] text-gray-400">{n.timestamp}</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile / Auth Button */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1 pl-2 rounded-full border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <span className="hidden sm:inline-block text-xs font-bold text-gray-800 max-w-[100px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover border border-orange-200"
                    />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs font-bold text-gray-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700">
                          {user.role}
                        </span>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            navigateTo('profile');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <UserIcon size={14} /> My Profile
                        </button>
                        <button
                          onClick={() => {
                            navigateTo('orders');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Package size={14} /> My Orders
                        </button>
                        <button
                          onClick={() => {
                            navigateTo('favorites');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Heart size={14} /> Favorites
                        </button>
                        <button
                          onClick={() => {
                            navigateTo('delivery-panel');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-medium text-emerald-700 hover:bg-emerald-50 flex items-center gap-2"
                        >
                          <Bike size={14} /> Delivery Dashboard
                        </button>
                        <button
                          onClick={() => {
                            navigateTo('admin');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-medium text-blue-700 hover:bg-blue-50 flex items-center gap-2"
                        >
                          <Shield size={14} /> Admin Dashboard
                        </button>
                      </div>

                      <div className="border-t border-gray-100 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                        >
                          <LogOut size={14} /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => openAuthModal('register')}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-gray-900 hover:bg-black rounded-xl transition-all shadow-sm"
                  >
                    Sign Up
                  </button>
                </div>
              )}

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/25 transition-all group cursor-pointer"
                aria-label="Open Shopping Cart"
              >
                <div className="relative">
                  <ShoppingCart size={17} className="group-hover:scale-110 transition-transform" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-white text-orange-600 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline">
                  {itemCount > 0 ? formatPrice(grandTotal) : 'Cart'}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Location Header Bar */}
          <div className="flex lg:hidden items-center justify-between pt-2.5 mt-2 border-t border-gray-100 text-xs">
            <div
              onClick={() => setIsLocationPickerOpen(true)}
              className="flex items-center gap-1.5 text-gray-800 cursor-pointer truncate"
            >
              <MapPin size={14} className="text-orange-500 shrink-0" />
              <span className="font-semibold text-gray-500 text-[11px]">Deliver to:</span>
              <span className="font-bold truncate max-w-[200px]">
                {selectedAddress.type} ({selectedAddress.city})
              </span>
              <ChevronDown size={12} className="text-gray-400 shrink-0" />
            </div>

            <div className="flex items-center gap-2 text-[11px] font-bold">
              <button
                onClick={() => navigateTo('delivery-panel')}
                className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md"
              >
                Rider
              </button>
              <button
                onClick={() => navigateTo('admin')}
                className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex md:hidden">
          <div className="w-4/5 max-w-xs bg-white h-full p-6 shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-500 text-white font-bold flex items-center justify-center font-display">
                    FG
                  </div>
                  <span className="text-xl font-bold font-display">
                    Foodie<span className="text-orange-500">Go</span>
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-800"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="py-4 space-y-2">
                <button
                  onClick={() => {
                    navigateTo('home');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl text-left text-sm font-semibold flex items-center gap-3 ${
                    currentPage === 'home' ? 'bg-orange-50 text-orange-600' : 'text-gray-700'
                  }`}
                >
                  <Sparkles size={16} /> Explore Food
                </button>
                <button
                  onClick={() => {
                    navigateTo('search');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl text-left text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                >
                  <Search size={16} /> Search Dishes
                </button>
                <button
                  onClick={() => {
                    navigateTo('orders');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl text-left text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                >
                  <Package size={16} /> My Orders
                </button>
                <button
                  onClick={() => {
                    navigateTo('favorites');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl text-left text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                >
                  <Heart size={16} /> Saved Favorites
                </button>
                <button
                  onClick={() => {
                    navigateTo('profile');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl text-left text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                >
                  <UserIcon size={16} /> Profile & Addresses
                </button>
                <button
                  onClick={() => {
                    navigateTo('delivery-panel');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl text-left text-sm font-semibold text-emerald-700 hover:bg-emerald-50 flex items-center gap-3"
                >
                  <Bike size={16} /> Delivery Partner Hub
                </button>
                <button
                  onClick={() => {
                    navigateTo('admin');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl text-left text-sm font-semibold text-blue-700 hover:bg-blue-50 flex items-center gap-3"
                >
                  <Shield size={16} /> Admin Portal
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-xs font-bold text-rose-600 bg-rose-50 rounded-xl"
                >
                  Sign Out ({user?.name.split(' ')[0]})
                </button>
              ) : (
                <button
                  onClick={() => {
                    openAuthModal('login');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-xs font-bold text-white bg-orange-500 rounded-xl"
                >
                  Sign In / Sign Up
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
