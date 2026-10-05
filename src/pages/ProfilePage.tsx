import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { INITIAL_COUPONS } from '../data/coupons';
import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Tag,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
  Edit2,
  Shield,
  Bike,
  Plus,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, logout, switchRole } = useAuth();
  const { navigateTo, savedAddresses, setIsLocationPickerOpen, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<
    'profile' | 'addresses' | 'payments' | 'coupons' | 'settings'
  >('profile');

  const [name, setName] = useState(user?.name || 'Avijit Jana');
  const [email, setEmail] = useState(user?.email || 'avijit93326@gmail.com');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Profile updated', 'Your personal details have been saved', 'success');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      {/* Profile Header */}
      <div className="bg-white border-b border-gray-100 py-8 mb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={
                    user?.avatar ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80'
                  }
                  alt={name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl object-cover border-2 border-orange-200 shadow-md"
                />
                <button
                  type="button"
                  onClick={() => showToast('Avatar update', 'Photo uploaded successfully', 'info')}
                  className="absolute -bottom-1 -right-1 p-1.5 bg-orange-500 text-white rounded-xl shadow cursor-pointer hover:bg-orange-600"
                >
                  <Edit2 size={12} />
                </button>
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 font-display">{name}</h1>
                <p className="text-xs text-gray-500">{email} • {phone}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800 px-2 py-0.5 rounded-md">
                    Role: {user?.role || 'customer'}
                  </span>
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    ● Active Member
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Portal Switchers */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  switchRole('delivery');
                  navigateTo('delivery-panel');
                }}
                className="px-3.5 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Bike size={14} />
                <span>Rider Hub</span>
              </button>
              <button
                onClick={() => {
                  switchRole('admin');
                  navigateTo('admin');
                }}
                className="px-3.5 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Shield size={14} />
                <span>Admin Hub</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Navigation Sidebar */}
          <div className="md:col-span-4 bg-white rounded-3xl p-4 border border-gray-100 shadow-xs space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full py-2.5 px-3 rounded-2xl text-left text-xs font-bold flex items-center gap-2.5 transition-all ${
                activeTab === 'profile' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <User size={16} />
              <span>Personal Details</span>
            </button>

            <button
              onClick={() => navigateTo('orders')}
              className="w-full py-2.5 px-3 rounded-2xl text-left text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2.5 transition-all"
            >
              <Package size={16} />
              <span>My Orders</span>
            </button>

            <button
              onClick={() => navigateTo('favorites')}
              className="w-full py-2.5 px-3 rounded-2xl text-left text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2.5 transition-all"
            >
              <Heart size={16} />
              <span>Saved Favorites</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full py-2.5 px-3 rounded-2xl text-left text-xs font-bold flex items-center gap-2.5 transition-all ${
                activeTab === 'addresses' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <MapPin size={16} />
              <span>Saved Addresses</span>
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full py-2.5 px-3 rounded-2xl text-left text-xs font-bold flex items-center gap-2.5 transition-all ${
                activeTab === 'payments' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <CreditCard size={16} />
              <span>Payment Methods</span>
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`w-full py-2.5 px-3 rounded-2xl text-left text-xs font-bold flex items-center gap-2.5 transition-all ${
                activeTab === 'coupons' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Tag size={16} />
              <span>My Coupons &amp; Offers</span>
            </button>

            <button
              onClick={() => navigateTo('support')}
              className="w-full py-2.5 px-3 rounded-2xl text-left text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2.5 transition-all"
            >
              <HelpCircle size={16} />
              <span>Help &amp; Support</span>
            </button>

            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={() => {
                  logout();
                  navigateTo('home');
                }}
                className="w-full py-2.5 px-3 rounded-2xl text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-all"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Right Content Panel */}
          <div className="md:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
            {activeTab === 'profile' && (
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-1">Personal Details</h3>
                <p className="text-xs text-gray-500 mb-6">Manage your contact information and preferences</p>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 font-medium"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Saved Addresses</h3>
                    <p className="text-xs text-gray-500">Easily switch delivery destinations</p>
                  </div>
                  <button
                    onClick={() => setIsLocationPickerOpen(true)}
                    className="px-3.5 py-1.5 bg-orange-50 text-orange-600 rounded-xl text-xs font-bold hover:bg-orange-100 flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Address
                  </button>
                </div>

                <div className="space-y-3">
                  {savedAddresses.map((addr) => (
                    <div key={addr.id} className="p-4 rounded-2xl border border-gray-200 flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold text-gray-900">{addr.type}</span>
                        <p className="text-xs text-gray-700 mt-1">{addr.houseFlat}, {addr.street}</p>
                        <p className="text-[11px] text-gray-400">{addr.city}, {addr.state} - {addr.pinCode}</p>
                      </div>
                      <span className="text-[11px] font-bold text-orange-600">Saved</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-1">Saved Payment Instruments</h3>
                <p className="text-xs text-gray-500 mb-4">Secure tokens verified with PCI-DSS compliance</p>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl border border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                        UPI
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-900">Google Pay (avijit@okaxis)</span>
                        <span className="text-[10px] text-gray-400 block">Primary default payment method</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Verified</span>
                  </div>

                  <div className="p-4 rounded-2xl border border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                        VISA
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-900">HDFC Bank Card (ending in 4242)</span>
                        <span className="text-[10px] text-gray-400 block">Expires 12/28</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Verified</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'coupons' && (
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-1">Available Vouchers</h3>
                <p className="text-xs text-gray-500 mb-4">Promo codes ready to apply at checkout</p>

                <div className="space-y-3">
                  {INITIAL_COUPONS.map((c) => (
                    <div key={c.code} className="p-4 rounded-2xl border border-orange-100 bg-orange-50/30 flex justify-between items-center">
                      <div>
                        <span className="font-mono text-xs font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded">
                          {c.code}
                        </span>
                        <h4 className="text-xs font-bold text-gray-900 mt-1">{c.title}</h4>
                        <p className="text-[11px] text-gray-500">{c.description}</p>
                      </div>
                      <button
                        onClick={() => navigateTo('home')}
                        className="px-3 py-1.5 bg-orange-500 text-white rounded-xl text-xs font-bold"
                      >
                        Use Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
