import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../utils/formatters';
import { CouponSelector } from './CouponSelector';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  AlertTriangle,
  FileText,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    items,
    restaurantName,
    restaurantId,
    itemCount,
    itemTotal,
    deliveryFee,
    taxes,
    discount,
    grandTotal,
    appliedCoupon,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    clearCart,
    cookingInstructions,
    setCookingInstructions,
    restaurantChangePrompt,
    dismissRestaurantChangePrompt,
    confirmRestaurantChange,
  } = useCart();

  const { navigateTo } = useApp();
  const [showCoupons, setShowCoupons] = useState(false);

  if (!isCartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200 relative">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <div>
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-orange-500" />
                <h3 className="text-lg font-bold text-gray-900 font-display">Your Cart</h3>
                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </span>
              </div>
              {restaurantName && (
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  Ordering from <span className="text-gray-900 font-semibold">{restaurantName}</span>
                </p>
              )}
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
            {items.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag size={36} />
                </div>
                <h4 className="text-base font-bold text-gray-900">Your cart is empty</h4>
                <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                  Good food is waiting for you! Explore top-rated dishes and add your favorites.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    navigateTo('home');
                  }}
                  className="mt-6 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                >
                  Explore Restaurants
                </button>
              </div>
            ) : (
              <>
                {/* Items List */}
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="p-3.5 bg-gray-50/70 rounded-2xl border border-gray-100 flex items-start justify-between gap-3"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span
                            className={`w-3.5 h-3.5 rounded-sm border ${
                              item.menuItem.isVeg ? 'border-emerald-600' : 'border-rose-600'
                            } flex items-center justify-center`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                item.menuItem.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                              }`}
                            ></span>
                          </span>
                          <h4 className="text-xs font-bold text-gray-900">{item.menuItem.name}</h4>
                        </div>

                        {/* Selected customizations */}
                        {item.selectedOptions.length > 0 && (
                          <div className="text-[10px] text-gray-500 space-y-0.5 ml-5 mb-1.5">
                            {item.selectedOptions.map((opt, i) => (
                              <div key={i}>
                                • {opt.option.name} {opt.option.price > 0 && `(+₹${opt.option.price})`}
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="text-xs font-bold text-gray-900 ml-5">
                          {formatPrice(item.totalPrice)}
                        </div>
                      </div>

                      {/* Quantity Controller */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartItemId, -1)}
                            className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-orange-600 rounded"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2 text-xs font-extrabold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartItemId, 1)}
                            className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-orange-600 rounded"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.cartItemId)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add more items button */}
                  {restaurantId && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsCartOpen(false);
                        navigateTo('restaurant', { restaurantId });
                      }}
                      className="w-full py-2.5 border border-dashed border-gray-300 rounded-xl text-xs font-bold text-orange-600 hover:border-orange-500 hover:bg-orange-50/50 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Plus size={14} /> Add more items from {restaurantName}
                    </button>
                  )}
                </div>

                {/* Special Cooking / Delivery Instructions */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5">
                    <FileText size={14} className="text-gray-400" />
                    <span>Special instructions for kitchen / delivery</span>
                  </div>
                  <input
                    type="text"
                    value={cookingInstructions}
                    onChange={(e) => setCookingInstructions(e.target.value)}
                    placeholder="e.g. Please ring bell twice, keep food hot"
                    className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                {/* Coupon Section */}
                <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag size={16} className="text-orange-600" />
                      <span className="text-xs font-bold text-gray-900">
                        {appliedCoupon ? `Applied: ${appliedCoupon.code}` : 'Apply Coupon'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCoupons(!showCoupons)}
                      className="text-xs font-bold text-orange-600 hover:underline cursor-pointer"
                    >
                      {showCoupons ? 'Close' : appliedCoupon ? 'Change' : 'View Offers'}
                    </button>
                  </div>

                  {showCoupons && (
                    <div className="mt-3 pt-3 border-t border-orange-100">
                      <CouponSelector onApplied={() => setShowCoupons(false)} />
                    </div>
                  )}
                </div>

                {/* Bill Breakdown */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-2 text-xs">
                  <h4 className="font-bold text-gray-900 pb-1 border-b border-gray-200 uppercase tracking-wider text-[10px]">
                    Bill Summary
                  </h4>

                  <div className="flex justify-between text-gray-600">
                    <span>Item Total</span>
                    <span className="font-semibold text-gray-900">{formatPrice(itemTotal)}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-600 font-bold">FREE</span>
                      ) : (
                        formatPrice(deliveryFee)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Taxes &amp; Restaurant Charges (5% GST)</span>
                    <span className="font-semibold text-gray-900">{formatPrice(taxes)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-sm font-black text-gray-900">
                    <span>Grand Total</span>
                    <span className="text-base text-orange-600">{formatPrice(grandTotal)}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sticky Footer Checkout CTA */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-gray-100 bg-white sticky bottom-0 z-10 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  navigateTo('checkout');
                }}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-orange-500/25 transition-all flex items-center justify-between cursor-pointer"
              >
                <div>
                  <span className="text-xs uppercase tracking-wider block opacity-90">To Pay</span>
                  <span className="text-base font-black">{formatPrice(grandTotal)}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/10 px-3 py-1.5 rounded-xl font-extrabold text-xs">
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={16} />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Restaurant Conflict Alert Modal */}
      {restaurantChangePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 text-center animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <AlertTriangle size={24} />
            </div>
            <h4 className="text-base font-bold text-gray-900">Replace items in cart?</h4>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Your cart already contains dishes from{' '}
              <span className="font-bold text-gray-800">
                {restaurantChangePrompt.previousRestaurantName}
              </span>
              . Would you like to reset your cart and add dishes from{' '}
              <span className="font-bold text-gray-800">
                {restaurantChangePrompt.newItem.restaurantName}
              </span>
              ?
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={dismissRestaurantChangePrompt}
                className="py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl text-xs hover:bg-gray-50"
              >
                Keep Current
              </button>
              <button
                type="button"
                onClick={confirmRestaurantChange}
                className="py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-md shadow-orange-500/20"
              >
                Yes, Reset &amp; Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
