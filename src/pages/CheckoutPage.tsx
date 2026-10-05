import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatters';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { orderApi } from '../api/orderApi';
import { paymentApi } from '../api/paymentApi';
import {
  MapPin,
  Clock,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  Zap,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    items,
    restaurantId,
    restaurantName,
    restaurantImage,
    itemTotal,
    deliveryFee,
    taxes,
    discount,
    grandTotal,
    deliveryType,
    setDeliveryType,
    appliedCoupon,
    cookingInstructions,
    clearCart,
  } = useCart();

  const {
    selectedAddress,
    setIsLocationPickerOpen,
    navigateTo,
    showToast,
    setActiveOrderId,
  } = useApp();

  const { user } = useAuth();

  // Multi-step tracker
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState<
    'UPI' | 'Card' | 'Net Banking' | 'Wallet' | 'Cash on Delivery'
  >('UPI');

  const [upiId, setUpiId] = useState('avijit@okaxis');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('•••');
  const [isProcessing, setIsProcessing] = useState(false);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-sm border border-gray-100">
          <ShoppingBag size={40} className="text-orange-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900">Your cart is empty</h3>
          <p className="text-xs text-gray-500 mt-1 mb-5">
            Please add items to your cart before proceeding to checkout.
          </p>
          <button
            onClick={() => navigateTo('home')}
            className="w-full py-3 bg-orange-500 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20"
          >
            Explore Restaurants
          </button>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    try {
      // 1. Create simulated payment session with backend integration point
      await paymentApi.createPaymentSession({
        amount: grandTotal,
        currency: 'INR',
        paymentMethod,
        metadata: {
          restaurantName: restaurantName || 'Restaurant',
          customerName: selectedAddress.name,
        },
      });

      // 2. Create Order in backend
      const createdOrder = await orderApi.create({
        userId: user?.id || 'usr-guest',
        restaurantId: restaurantId || 'rest-1',
        restaurantName: restaurantName || 'Spice Garden',
        restaurantImage:
          restaurantImage ||
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=80',
        items,
        itemTotal,
        deliveryFee,
        taxes,
        discount,
        appliedCoupon: appliedCoupon?.code,
        grandTotal,
        deliveryType,
        deliveryAddress: selectedAddress,
        paymentMethod,
        paymentStatus: 'Paid',
        status: 'Confirmed',
        estimatedDeliveryTime: deliveryType === 'Priority' ? '15–20 min' : '25–30 min',
        deliveryPartner: {
          id: 'del-1',
          name: 'Rajesh Kumar',
          phone: '+91 94331 12345',
          rating: 4.9,
          vehicle: 'Hero Splendor (WB 34 AD 8219)',
          avatar:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
          currentCoords: { lat: 21.965, lng: 87.275 },
        },
      });

      // Clear cart
      clearCart();

      // Set active order ID and route to confirmation page
      setActiveOrderId(createdOrder.id);
      showToast('Order placed successfully!', `Order #${createdOrder.id}`, 'success');
      navigateTo('confirmation', { orderId: createdOrder.id });
    } catch {
      showToast('Order error', 'Failed to place order. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      {/* Checkout Navbar */}
      <div className="bg-white border-b border-gray-100 py-3.5 sticky top-14 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-orange-600"
          >
            <ArrowLeft size={16} />
            <span>Cancel</span>
          </button>
          <div className="text-center">
            <h2 className="text-base font-bold text-gray-900 font-display">Secure Checkout</h2>
            <p className="text-[11px] text-gray-500">{restaurantName}</p>
          </div>
          <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
            <ShieldCheck size={16} />
            <span className="hidden sm:inline">256-bit Encrypted</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Multi-Step Flow */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Delivery Address */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 font-bold text-xs flex items-center justify-center">
                    1
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Delivery Address</h3>
                    <p className="text-[11px] text-gray-500">Confirmed via Google Maps Geocoding</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsLocationPickerOpen(true)}
                  className="text-xs font-bold text-orange-600 hover:underline"
                >
                  Change Address
                </button>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200/80 mb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-xl text-orange-500 shadow-2xs mt-0.5">
                    <MapPin size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900">{selectedAddress.type}</span>
                      <span className="text-[10px] text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                        {selectedAddress.name} ({selectedAddress.phone})
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 mt-1 font-medium">
                      {selectedAddress.houseFlat}, {selectedAddress.street}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {selectedAddress.landmark ? `${selectedAddress.landmark}, ` : ''}
                      {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pinCode}
                    </p>
                  </div>
                </div>
              </div>

              {/* Embedded Google Map preview */}
              <InteractiveMap
                lat={selectedAddress.coordinates.lat}
                lng={selectedAddress.coordinates.lng}
                height="160px"
                label={`Deliver to ${selectedAddress.type}`}
                isDraggable={false}
              />
            </div>

            {/* Step 2: Delivery Speed Options */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 font-bold text-xs flex items-center justify-center">
                  2
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Delivery Options</h3>
                  <p className="text-[11px] text-gray-500">Choose your delivery urgency</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Standard */}
                <div
                  onClick={() => setDeliveryType('Standard')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    deliveryType === 'Standard'
                      ? 'border-orange-500 bg-orange-50/20 ring-1 ring-orange-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-gray-900">Standard Delivery</span>
                    <span className="text-xs font-bold text-gray-700">₹30</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-gray-500">
                    <Clock size={12} className="text-orange-500" />
                    <span>25–30 minutes arrival</span>
                  </div>
                </div>

                {/* Priority */}
                <div
                  onClick={() => setDeliveryType('Priority')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    deliveryType === 'Priority'
                      ? 'border-orange-500 bg-orange-50/20 ring-1 ring-orange-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-gray-900">Priority Express</span>
                      <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold px-1.5 py-0.2 rounded">
                        FAST
                      </span>
                    </div>
                    <span className="text-xs font-bold text-gray-700">₹50</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-amber-700 font-semibold">
                    <Zap size={12} className="text-amber-500" />
                    <span>Direct route (15–20 min)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Payment Options */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 font-bold text-xs flex items-center justify-center">
                  3
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Payment Method</h3>
                  <p className="text-[11px] text-gray-500">Ready for Razorpay &amp; Stripe Gateways</p>
                </div>
              </div>

              {/* Payment selector tabs */}
              <div className="space-y-3">
                {/* UPI Option */}
                <label
                  onClick={() => setPaymentMethod('UPI')}
                  className={`flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'UPI'
                      ? 'border-orange-500 bg-orange-50/20 ring-1 ring-orange-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-4 h-4 rounded-full border border-gray-300 mt-1 flex items-center justify-center">
                      {paymentMethod === 'UPI' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900">UPI / QR (Google Pay, PhonePe, Paytm)</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                          Instant
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">Pay directly via any UPI application</p>

                      {paymentMethod === 'UPI' && (
                        <div className="mt-3 pt-2 border-t border-gray-200">
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="Enter UPI ID (e.g. mobile@upi)"
                            className="px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs w-full max-w-xs focus:ring-1 focus:ring-orange-500"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </label>

                {/* Card Option */}
                <label
                  onClick={() => setPaymentMethod('Card')}
                  className={`flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'Card'
                      ? 'border-orange-500 bg-orange-50/20 ring-1 ring-orange-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-4 h-4 rounded-full border border-gray-300 mt-1 flex items-center justify-center">
                      {paymentMethod === 'Card' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-900">Credit / Debit Card (Stripe Verified)</span>
                      <p className="text-[11px] text-gray-500 mt-0.5">Visa, Mastercard, RuPay, Amex</p>

                      {paymentMethod === 'Card' && (
                        <div className="mt-3 space-y-2 pt-2 border-t border-gray-200">
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="Card Number"
                            className="px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs w-full max-w-xs"
                          />
                          <div className="flex gap-2 max-w-xs">
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="MM/YY"
                              className="px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs w-1/2"
                            />
                            <input
                              type="password"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              placeholder="CVV"
                              className="px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs w-1/2"
                            />
                          </div>
                          <p className="text-[10px] text-gray-400">Card details are securely verified via tokenization.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </label>

                {/* Net Banking */}
                <label
                  onClick={() => setPaymentMethod('Net Banking')}
                  className={`flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'Net Banking'
                      ? 'border-orange-500 bg-orange-50/20 ring-1 ring-orange-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-4 h-4 rounded-full border border-gray-300 mt-1 flex items-center justify-center">
                      {paymentMethod === 'Net Banking' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-900">Net Banking</span>
                      <p className="text-[11px] text-gray-500 mt-0.5">All major Indian banks supported</p>
                    </div>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label
                  onClick={() => setPaymentMethod('Cash on Delivery')}
                  className={`flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'border-orange-500 bg-orange-50/20 ring-1 ring-orange-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-4 h-4 rounded-full border border-gray-300 mt-1 flex items-center justify-center">
                      {paymentMethod === 'Cash on Delivery' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-900">Cash on Delivery</span>
                      <p className="text-[11px] text-gray-500 mt-0.5">Pay via cash or QR upon courier delivery</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order CTA */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md">
              <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100 font-display">
                Order Summary
              </h3>

              {/* Items List */}
              <div className="py-4 space-y-3 max-h-56 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.cartItemId} className="flex justify-between items-start text-xs">
                    <div className="flex-1 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-gray-900">{item.quantity}x</span>
                        <span className="font-semibold text-gray-800">{item.menuItem.name}</span>
                      </div>
                      {item.selectedOptions.length > 0 && (
                        <div className="text-[10px] text-gray-400 pl-5">
                          {item.selectedOptions.map((o) => o.option.name).join(', ')}
                        </div>
                      )}
                    </div>
                    <span className="font-bold text-gray-900">{formatPrice(item.totalPrice)}</span>
                  </div>
                ))}
              </div>

              {/* Bill Details */}
              <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Item Total</span>
                  <span className="font-semibold text-gray-900">{formatPrice(itemTotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Fee ({deliveryType})</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      formatPrice(deliveryFee)
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Taxes (5% GST)</span>
                  <span className="font-semibold text-gray-900">{formatPrice(taxes)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-200 flex justify-between items-center text-base font-black text-gray-900">
                  <span>Total Payable</span>
                  <span className="text-orange-600 font-display">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={handlePlaceOrder}
                className="w-full mt-6 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <span>Securing Order...</span>
                ) : (
                  <>
                    <span>Place Order • {formatPrice(grandTotal)}</span>
                    <ChevronRight size={18} />
                  </>
                )}
              </button>

              <div className="mt-3 text-center text-[10px] text-gray-400">
                By placing order, you agree to FoodieGo Terms of Service
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
