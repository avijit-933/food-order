import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DeliveryRouteMap } from '../components/map/DeliveryRouteMap';
import { formatPrice } from '../utils/formatters';
import {
  Bike,
  Package,
  DollarSign,
  Clock,
  Phone,
  CheckCircle2,
  Navigation,
  MapPin,
  Store,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

export const DeliveryPartnerPage: React.FC = () => {
  const { showToast, navigateTo } = useApp();

  // Driver stats
  const [todayOrders, setTodayOrders] = useState(12);
  const [completedOrders, setCompletedOrders] = useState(8);
  const [pendingOrders, setPendingOrders] = useState(4);
  const [todayEarnings, setTodayEarnings] = useState(1250);

  // Active delivery state machine
  const [activeStep, setActiveStep] = useState<
    'navigate_restaurant' | 'picked_up' | 'arrived_customer' | 'delivered'
  >('picked_up');

  const [enteredOtp, setEnteredOtp] = useState('');
  const [newRequestVisible, setNewRequestVisible] = useState(false);

  const handleNextStatus = () => {
    if (activeStep === 'navigate_restaurant') {
      setActiveStep('picked_up');
      showToast('Status Updated', 'Order #FG-10254 picked up from Spice Garden', 'info');
    } else if (activeStep === 'picked_up') {
      setActiveStep('arrived_customer');
      showToast('Arrived at Customer', 'Reached delivery destination', 'info');
    } else if (activeStep === 'arrived_customer') {
      if (enteredOtp !== '4291' && enteredOtp !== '1234') {
        showToast('Invalid OTP', 'Ask customer for 4-digit PIN (Hint: 4291)', 'error');
        return;
      }
      setActiveStep('delivered');
      setCompletedOrders((c) => c + 1);
      setPendingOrders((p) => Math.max(0, p - 1));
      setTodayEarnings((e) => e + 75);
      showToast('Delivery Completed! 🎉', 'Earned ₹75 delivery fee + ₹20 tip', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] pb-24">
      {/* Rider Top Bar */}
      <div className="bg-gray-900 text-white py-4 sticky top-14 z-20 shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold">
              <Bike size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold font-display">Rajesh Kumar (Partner)</h1>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[10px] text-emerald-400 font-semibold uppercase">Online</span>
              </div>
              <p className="text-xs text-gray-400">Hero Splendor • WB 34 AD 8219 • 4.9★</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setNewRequestVisible(true)}
              className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Simulate New Order
            </button>
            <button
              onClick={() => navigateTo('home')}
              className="text-xs text-gray-400 hover:text-white"
            >
              Back to Store
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Today&apos;s Orders</span>
              <Package size={16} className="text-orange-500" />
            </div>
            <div className="text-2xl font-black text-gray-900 font-display">{todayOrders}</div>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Completed</span>
              <CheckCircle2 size={16} className="text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-emerald-600 font-display">{completedOrders}</div>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Pending</span>
              <Clock size={16} className="text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-600 font-display">{pendingOrders}</div>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Today&apos;s Earnings</span>
              <DollarSign size={16} className="text-blue-500" />
            </div>
            <div className="text-2xl font-black text-gray-900 font-display">{formatPrice(todayEarnings)}</div>
          </div>
        </div>

        {/* Active Order in Progress */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full">
                Active Order
              </span>
              <h2 className="text-lg font-bold text-gray-900 mt-1">Order #FG-10254 • Deliver to Customer</h2>
            </div>
            <span className="text-xs font-bold text-gray-900 bg-gray-100 px-3 py-1.5 rounded-xl">
              Payout: ₹95
            </span>
          </div>

          {/* Live Navigation Map */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <Navigation size={14} className="text-orange-500" />
                <span>Live Route Navigation (Google Maps Platform)</span>
              </span>
              <span className="text-xs font-bold text-emerald-600">2.4 km remaining • 8 mins</span>
            </div>
            <DeliveryRouteMap
              restaurantName="Spice Garden"
              customerAddress="Greenfield Heights, Dantan"
              orderStatus="Out for Delivery"
              height="280px"
            />
          </div>

          {/* Pickup & Drop Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
              <div className="flex items-center gap-2 text-xs font-bold text-orange-800 mb-1">
                <Store size={16} className="text-orange-600" />
                <span>Pickup: Spice Garden</span>
              </div>
              <p className="text-xs text-gray-600">Grand Trunk Road, Bypass Crossing, Dantan</p>
              <p className="text-[11px] text-gray-400 mt-1">Order: 1x Biryani, 1x Paneer Butter Masala</p>
            </div>

            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 mb-1">
                  <MapPin size={16} className="text-emerald-600" />
                  <span>Deliver To: Avijit Jana</span>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Calling Customer', 'Connecting to Avijit (+91 98765 43210)...', 'info')}
                  className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  <Phone size={12} />
                </button>
              </div>
              <p className="text-xs text-gray-600">Flat 4B, Greenfield Heights, Station Road, Dantan</p>
              <p className="text-[11px] text-gray-400 mt-1">Instructions: &quot;Please ring bell twice&quot;</p>
            </div>
          </div>

          {/* Action State Machine Controller */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block">
                Next Delivery Milestone
              </span>
              <span className="text-sm font-bold text-gray-900">
                {activeStep === 'navigate_restaurant' && 'Head to Restaurant for Pickup'}
                {activeStep === 'picked_up' && 'In Transit: On the way to Customer'}
                {activeStep === 'arrived_customer' && 'Arrived: Enter 4-digit Delivery PIN'}
                {activeStep === 'delivered' && 'Order Completed Successfully!'}
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {activeStep === 'arrived_customer' && (
                <input
                  type="text"
                  maxLength={4}
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  placeholder="PIN: 4291"
                  className="px-3 py-2 bg-white border border-gray-300 rounded-xl text-center text-xs font-mono font-bold tracking-widest w-28 focus:ring-1 focus:ring-orange-500"
                />
              )}

              {activeStep !== 'delivered' ? (
                <button
                  onClick={handleNextStatus}
                  className="flex-1 sm:flex-initial px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  {activeStep === 'navigate_restaurant' && 'Confirm Pickup'}
                  {activeStep === 'picked_up' && 'Mark Arrived at Customer'}
                  {activeStep === 'arrived_customer' && 'Verify PIN & Deliver'}
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-4 py-2 rounded-xl">
                  ✓ Order Delivered
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Simulated New Incoming Request Modal */}
      {newRequestVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 text-center animate-in zoom-in-95 duration-150">
            <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-3 animate-bounce">
              <Bike size={28} />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
              New Delivery Ping!
            </span>

            <h3 className="text-lg font-black text-gray-900 mt-2 font-display">
              The Burger Hub &amp; Grill
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Pickup: 1.2 km away • Drop: 2.1 km away</p>

            <div className="my-4 p-3 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between text-xs font-bold text-gray-800">
              <span>Estimated Payout</span>
              <span className="text-emerald-600">₹85.00</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setNewRequestVisible(false);
                  showToast('Order Rejected', 'Next driver in pool notified', 'info');
                }}
                className="py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Pass / Reject
              </button>
              <button
                onClick={() => {
                  setNewRequestVisible(false);
                  setPendingOrders((p) => p + 1);
                  showToast('Order Accepted! 🚴', 'Navigate to Burger Hub & Grill', 'success');
                }}
                className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20"
              >
                Accept Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
