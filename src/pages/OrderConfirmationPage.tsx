import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { orderApi } from '../api/orderApi';
import { Order } from '../types';
import confetti from 'canvas-confetti';
import { CheckCircle2, Clock, MapPin, ArrowRight, Package, Utensils } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

export const OrderConfirmationPage: React.FC = () => {
  const { activeOrderId, navigateTo } = useApp();
  const [order, setOrder] = React.useState<Order | null>(null);

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ea580c', '#f59e0b', '#10b981', '#6366f1'],
      });
    } catch {
      // ignore
    }

    if (activeOrderId) {
      orderApi.getById(activeOrderId).then((o) => {
        if (o) setOrder(o);
      });
    }
  }, [activeOrderId]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4 py-12">
      <div className="bg-white rounded-3xl p-6 sm:p-10 max-w-lg w-full shadow-2xl border border-gray-100 text-center animate-in zoom-in-95 duration-200">
        {/* Animated Check Icon */}
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/10 ring-8 ring-emerald-50 animate-bounce">
          <CheckCircle2 size={44} className="stroke-[2.5]" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
          Payment Successful
        </span>

        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2 font-display">
          Order Confirmed!
        </h2>

        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Your order <span className="font-extrabold text-gray-900 font-mono">#{activeOrderId || 'FG-10254'}</span> has been received and sent to the kitchen.
        </p>

        {/* Order Quick Card */}
        <div className="my-6 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-left space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200">
            <div>
              <span className="text-[10px] text-gray-400 font-semibold uppercase block">Restaurant</span>
              <h4 className="text-sm font-bold text-gray-900">{order?.restaurantName || 'Spice Garden'}</h4>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-gray-400 font-semibold uppercase block">Amount Paid</span>
              <span className="text-sm font-extrabold text-orange-600">
                {order ? formatPrice(order.grandTotal) : '₹450'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-orange-500" />
              <span>Estimated Delivery:</span>
            </div>
            <span className="font-bold text-gray-900">
              {order?.estimatedDeliveryTime || '25–30 minutes'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-blue-500" />
              <span>Delivery Address:</span>
            </div>
            <span className="font-medium text-gray-800 truncate max-w-[200px]">
              {order?.deliveryAddress.street || 'Greenfield Heights, Dantan'}
            </span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigateTo('tracking', { orderId: activeOrderId || 'FG-10254' })}
            className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Live Track Order</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={() => navigateTo('orders')}
            className="w-full py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-2xl font-semibold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <Package size={14} />
            <span>View All Order History</span>
          </button>

          <button
            onClick={() => navigateTo('home')}
            className="text-xs text-gray-400 hover:text-gray-700 font-medium pt-2 block mx-auto"
          >
            Back to Home Feed
          </button>
        </div>
      </div>
    </div>
  );
};
