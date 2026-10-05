import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { orderApi } from '../api/orderApi';
import { Order, OrderStatus } from '../types';
import { DeliveryRouteMap } from '../components/map/DeliveryRouteMap';
import { formatPrice } from '../utils/formatters';
import {
  Clock,
  Phone,
  MessageSquare,
  CheckCircle2,
  CircleDot,
  Store,
  MapPin,
  Bike,
  ShieldCheck,
  Star,
  ChevronRight,
  X,
  Send,
} from 'lucide-react';

const STATUS_STEPS: OrderStatus[] = [
  'Placed',
  'Confirmed',
  'Preparing',
  'Out for Delivery',
  'Delivered',
];

export const OrderTrackingPage: React.FC = () => {
  const { activeOrderId, navigateTo, openRatingModal, showToast } = useApp();
  const [order, setOrder] = useState<Order | null>(null);

  // Call / Chat Modals
  const [showCallModal, setShowCallModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'rider'; text: string; time: string }[]>([
    { sender: 'rider', text: 'Hi Avijit, I have picked up your order from Spice Garden and am on my way!', time: '11:42 AM' },
  ]);
  const [newMsg, setNewMsg] = useState('');

  useEffect(() => {
    orderApi.getById(activeOrderId || 'FG-10254').then((res) => {
      if (res) setOrder(res);
    });
  }, [activeOrderId]);

  const currentStatusIndex = order ? STATUS_STEPS.indexOf(order.status) : 3;

  const advanceStatusDemo = async () => {
    if (!order) return;
    const nextIdx = Math.min(currentStatusIndex + 1, STATUS_STEPS.length - 1);
    const nextStatus = STATUS_STEPS[nextIdx];
    const updated = await orderApi.updateStatus(order.id, nextStatus);
    if (updated) {
      setOrder(updated);
      showToast('Order Status Updated', `Status is now: ${nextStatus}`, 'info');
      if (nextStatus === 'Delivered') {
        openRatingModal(updated);
      }
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: newMsg.trim(), time: 'Just now' },
    ]);
    setNewMsg('');
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'rider', text: 'Got it, arriving in 5 minutes!', time: 'Just now' },
      ]);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-3.5 sticky top-14 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900 font-display">Live Order Tracking</h2>
            <p className="text-xs text-gray-500 font-mono">Order #{order?.id || 'FG-10254'}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={advanceStatusDemo}
              className="text-[11px] font-bold bg-orange-100 hover:bg-orange-200 text-orange-800 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              Advance Step (Demo)
            </button>
            <button
              onClick={() => navigateTo('orders')}
              className="text-xs font-semibold text-gray-600 hover:text-gray-900 px-2"
            >
              All Orders
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Estimated Arrival Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold mb-2">
              <Clock size={13} />
              <span>
                {order?.status === 'Delivered' ? 'Delivery Completed' : 'Estimated Arrival: 18–22 mins'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
              {order?.status === 'Placed' && 'Order Placed with Restaurant'}
              {order?.status === 'Confirmed' && 'Restaurant Confirmed Your Order'}
              {order?.status === 'Preparing' && 'Kitchen is preparing your meal'}
              {order?.status === 'Out for Delivery' && 'Your food is on the way!'}
              {order?.status === 'Delivered' && 'Order Delivered! Enjoy your meal 😋'}
            </h1>
            <p className="text-xs text-white/80 mt-1">
              Food delivery partner assigned and following GPS route
            </p>
          </div>

          {order?.otp && order.status !== 'Delivered' && (
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-center shrink-0 self-start sm:self-auto">
              <span className="text-[10px] text-white/70 uppercase tracking-widest block font-bold">
                Delivery PIN / OTP
              </span>
              <span className="text-2xl font-black font-mono tracking-widest">{order.otp}</span>
            </div>
          )}
        </div>

        {/* Live Google Maps Route Visualizer */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Bike size={18} className="text-orange-500" />
            <span>Live Courier Location (GPS Enabled)</span>
          </h3>
          <DeliveryRouteMap
            restaurantName={order?.restaurantName || 'Spice Garden'}
            customerAddress={order?.deliveryAddress.street || 'Dantan, West Bengal'}
            orderStatus={order?.status || 'Out for Delivery'}
            height="340px"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Order Progress Stepper */}
          <div className="md:col-span-7 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-5 uppercase tracking-wider text-xs">
              Order Timeline
            </h3>

            <div className="space-y-6 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200">
              {STATUS_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStatusIndex;
                const isCurrent = idx === currentStatusIndex;

                return (
                  <div key={step} className="flex items-start gap-4 relative">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
                        isPassed
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-white border-2 border-gray-300 text-gray-300'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 size={16} /> : <CircleDot size={14} />}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`text-sm ${
                            isCurrent
                              ? 'font-bold text-orange-600'
                              : isPassed
                              ? 'font-semibold text-gray-900'
                              : 'text-gray-400 font-medium'
                          }`}
                        >
                          {step === 'Placed' && 'Order Placed'}
                          {step === 'Confirmed' && 'Restaurant Confirmed'}
                          {step === 'Preparing' && 'Food Being Prepared'}
                          {step === 'Out for Delivery' && 'Out for Delivery'}
                          {step === 'Delivered' && 'Delivered'}
                        </h4>
                        {isPassed && (
                          <span className="text-[10px] text-gray-400 font-medium">Completed</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {step === 'Placed' && 'Your order was successfully sent to the restaurant.'}
                        {step === 'Confirmed' && 'Restaurant accepted and verified kitchen capacity.'}
                        {step === 'Preparing' && 'Fresh ingredients are being cooked with care.'}
                        {step === 'Out for Delivery' && 'Courier has picked up your sealed order bag.'}
                        {step === 'Delivered' && 'Order handed over safely at your doorstep.'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Partner & Order Details Card */}
          <div className="md:col-span-5 space-y-6">
            {/* Delivery Partner Contact Card */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-3">
                Assigned Delivery Partner
              </span>

              <div className="flex items-center gap-3 mb-4">
                <img
                  src={
                    order?.deliveryPartner?.avatar ||
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
                  }
                  alt="Delivery partner"
                  className="w-12 h-12 rounded-2xl object-cover border border-orange-200"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-gray-900">
                      {order?.deliveryPartner?.name || 'Rajesh Kumar'}
                    </h4>
                    <span className="flex items-center gap-0.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                      <Star size={11} className="fill-emerald-600 text-emerald-600" />
                      {order?.deliveryPartner?.rating || '4.9'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {order?.deliveryPartner?.vehicle || 'Hero Splendor (WB 34 AD 8219)'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => setShowCallModal(true)}
                  className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Phone size={14} />
                  <span>Call Rider</span>
                </button>
                <button
                  onClick={() => setShowChatModal(true)}
                  className="py-2.5 px-3 bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageSquare size={14} />
                  <span>Chat</span>
                </button>
              </div>
            </div>

            {/* Order Items Snapshot */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="font-bold text-gray-900">{order?.restaurantName || 'Spice Garden'}</span>
                <span className="font-extrabold text-orange-600">
                  {order ? formatPrice(order.grandTotal) : '₹450'}
                </span>
              </div>

              <div className="py-3 space-y-2 max-h-40 overflow-y-auto">
                {order?.items.map((i) => (
                  <div key={i.cartItemId} className="flex justify-between text-gray-700">
                    <span>{i.quantity}x {i.menuItem.name}</span>
                    <span className="font-semibold">{formatPrice(i.totalPrice)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-gray-500">
                <span>Address</span>
                <span className="font-medium text-gray-800 truncate max-w-[170px]">
                  {order?.deliveryAddress.street}, {order?.deliveryAddress.city}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Call Modal */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 animate-pulse">
              <Phone size={32} />
            </div>
            <h4 className="text-base font-bold text-gray-900">Calling Delivery Partner</h4>
            <p className="text-xs text-gray-500 mt-1">Connecting to Rajesh Kumar ({order?.deliveryPartner?.phone || '+91 94331 12345'})...</p>

            <button
              onClick={() => setShowCallModal(false)}
              className="mt-6 w-full py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold"
            >
              End Call
            </button>
          </div>
        </div>
      )}

      {/* Simulated Chat Modal */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col h-[480px]">
            <div className="p-4 bg-orange-500 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bike size={18} />
                <span className="text-sm font-bold">Chat with Rajesh Kumar</span>
              </div>
              <button onClick={() => setShowChatModal(false)} className="text-white/80 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
              {chatMessages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[75%] p-3 rounded-2xl text-xs ${
                      m.sender === 'user'
                        ? 'bg-orange-500 text-white rounded-br-none'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-2xs'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-0.5 px-1">{m.time}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="p-3 bg-white border-t border-gray-100 flex gap-2">
              <input
                type="text"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder="Type your message to rider..."
                className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="p-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
