import React, { createContext, useContext, useState, useEffect } from 'react';
import { Address, Order, Restaurant } from '../types';
import { INITIAL_ADDRESSES } from '../data/mockData';
import { orderApi } from '../api/orderApi';
import { userApi } from '../api/userApi';

export type AppPage =
  | 'home'
  | 'restaurant'
  | 'search'
  | 'cart'
  | 'checkout'
  | 'confirmation'
  | 'tracking'
  | 'orders'
  | 'favorites'
  | 'profile'
  | 'support'
  | 'delivery-panel'
  | 'admin';

interface ToastState {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentPage: AppPage;
  navigateTo: (page: AppPage, extra?: { restaurantId?: string; orderId?: string }) => void;
  selectedRestaurantId: string | null;
  setSelectedRestaurantId: (id: string | null) => void;
  activeOrderId: string | null;
  setActiveOrderId: (id: string | null) => void;
  selectedAddress: Address;
  setSelectedAddress: (addr: Address) => void;
  savedAddresses: Address[];
  addNewAddress: (addr: Omit<Address, 'id'>) => Promise<Address>;
  detectLocation: () => Promise<void>;
  isDetectingLocation: boolean;
  toasts: ToastState[];
  showToast: (title: string, description?: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  isLocationPickerOpen: boolean;
  setIsLocationPickerOpen: (open: boolean) => void;
  ratingModalOrder: Order | null;
  openRatingModal: (order: Order) => void;
  closeRatingModal: () => void;
  favorites: string[];
  toggleFavoriteRestaurant: (restaurantId: string) => void;
  isFavorite: (restaurantId: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | null>('FG-10254');
  const [savedAddresses, setSavedAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem('foodiego_addresses');
    return saved ? JSON.parse(saved) : INITIAL_ADDRESSES;
  });
  const [selectedAddress, setSelectedAddress] = useState<Address>(() => savedAddresses[0] || INITIAL_ADDRESSES[0]);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [ratingModalOrder, setRatingModalOrder] = useState<Order | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('foodiego_favorites');
    return saved ? JSON.parse(saved) : ['rest-1', 'rest-3', 'rest-7'];
  });

  useEffect(() => {
    localStorage.setItem('foodiego_addresses', JSON.stringify(savedAddresses));
  }, [savedAddresses]);

  useEffect(() => {
    localStorage.setItem('foodiego_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const showToast = (title: string, description?: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const navigateTo = (page: AppPage, extra?: { restaurantId?: string; orderId?: string }) => {
    if (extra?.restaurantId) {
      setSelectedRestaurantId(extra.restaurantId);
    }
    if (extra?.orderId) {
      setActiveOrderId(extra.orderId);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addNewAddress = async (addr: Omit<Address, 'id'>): Promise<Address> => {
    const created = await userApi.addAddress(addr);
    setSavedAddresses((prev) => [...prev, created]);
    setSelectedAddress(created);
    showToast('Address saved', `${created.type}: ${created.houseFlat}, ${created.street}`, 'success');
    return created;
  };

  const detectLocation = async () => {
    setIsDetectingLocation(true);
    if (!navigator.geolocation) {
      showToast('Geolocation not supported', 'Please enter your address manually.', 'info');
      setIsDetectingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const detected: Address = {
          id: `addr-loc-${Date.now()}`,
          name: 'Current Location',
          phone: '+91 98765 43210',
          houseFlat: 'GPS Detected Spot',
          street: 'Main Road Corridor',
          landmark: 'Accurate via GPS',
          city: 'Dantan',
          state: 'West Bengal',
          pinCode: '721426',
          type: 'Home',
          coordinates: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
        };
        setSelectedAddress(detected);
        setIsDetectingLocation(false);
        setIsLocationPickerOpen(false);
        showToast('Location updated', `Accurate coordinates pinned (${detected.city})`, 'success');
      },
      () => {
        // Fallback to Dantan, West Bengal default
        const defaultLoc: Address = {
          id: `addr-loc-dantan`,
          name: 'Avijit Jana',
          phone: '+91 98765 43210',
          houseFlat: 'Station Road Center',
          street: 'Bazaar Hub',
          landmark: 'Near Railway Overbridge',
          city: 'Dantan',
          state: 'West Bengal',
          pinCode: '721426',
          type: 'Home',
          coordinates: { lat: 21.9622, lng: 87.2711 },
        };
        setSelectedAddress(defaultLoc);
        setIsDetectingLocation(false);
        setIsLocationPickerOpen(false);
        showToast('Default location set', 'Delivering to Dantan, West Bengal', 'info');
      },
      { timeout: 8000 }
    );
  };

  const toggleFavoriteRestaurant = (restaurantId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(restaurantId);
      if (exists) {
        showToast('Removed from favorites', undefined, 'info');
        return prev.filter((id) => id !== restaurantId);
      } else {
        showToast('Added to favorites ❤️', undefined, 'success');
        return [...prev, restaurantId];
      }
    });
  };

  const isFavorite = (restaurantId: string) => favorites.includes(restaurantId);

  const openRatingModal = (order: Order) => {
    setRatingModalOrder(order);
  };

  const closeRatingModal = () => {
    setRatingModalOrder(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        navigateTo,
        selectedRestaurantId,
        setSelectedRestaurantId,
        activeOrderId,
        setActiveOrderId,
        selectedAddress,
        setSelectedAddress,
        savedAddresses,
        addNewAddress,
        detectLocation,
        isDetectingLocation,
        toasts,
        showToast,
        removeToast,
        isLocationPickerOpen,
        setIsLocationPickerOpen,
        ratingModalOrder,
        openRatingModal,
        closeRatingModal,
        favorites,
        toggleFavoriteRestaurant,
        isFavorite,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
