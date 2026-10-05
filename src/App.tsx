/**
 * FoodieGo - Modern Online Food Ordering & Discovery Platform
 * Complete Production-Style Implementation
 */

import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { CartProvider } from './context/CartContext';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { MobileNav } from './components/common/MobileNav';
import { ToastContainer } from './components/common/Toast';
import { AuthModal } from './components/common/AuthModal';
import { LocationPickerModal } from './components/common/LocationPickerModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { RatingModal } from './components/review/RatingModal';

// Pages
import { HomePage } from './pages/HomePage';
import { RestaurantDetailPage } from './pages/RestaurantDetailPage';
import { SearchPage } from './pages/SearchPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ProfilePage } from './pages/ProfilePage';
import { SupportPage } from './pages/SupportPage';
import { DeliveryPartnerPage } from './pages/DeliveryPartnerPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

const AppContent: React.FC = () => {
  const { currentPage } = useApp();

  const showFooter =
    currentPage !== 'delivery-panel' &&
    currentPage !== 'admin' &&
    currentPage !== 'checkout' &&
    currentPage !== 'tracking';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#1E1E24]">
      {/* Global Navigation Header */}
      <Navbar />

      {/* Main Routed Page Content */}
      <main className="flex-1">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'restaurant' && <RestaurantDetailPage />}
        {currentPage === 'search' && <SearchPage />}
        {currentPage === 'checkout' && <CheckoutPage />}
        {currentPage === 'confirmation' && <OrderConfirmationPage />}
        {currentPage === 'tracking' && <OrderTrackingPage />}
        {currentPage === 'orders' && <OrderHistoryPage />}
        {currentPage === 'favorites' && <FavoritesPage />}
        {currentPage === 'profile' && <ProfilePage />}
        {currentPage === 'support' && <SupportPage />}
        {currentPage === 'delivery-panel' && <DeliveryPartnerPage />}
        {currentPage === 'admin' && <AdminDashboardPage />}
      </main>

      {/* Global Footer */}
      {showFooter && <Footer />}

      {/* Bottom Navigation for Mobile */}
      <MobileNav />

      {/* Global Overlays & Modals */}
      <CartDrawer />
      <LocationPickerModal />
      <AuthModal />
      <RatingModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AppProvider>
    </AuthProvider>
  );
}
