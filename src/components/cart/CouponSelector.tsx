import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Tag, Check, ArrowRight, AlertCircle } from 'lucide-react';

interface CouponSelectorProps {
  onApplied?: () => void;
}

export const CouponSelector: React.FC<CouponSelectorProps> = ({ onApplied }) => {
  const { availableCoupons, appliedCoupon, applyCoupon, removeCoupon, itemTotal } = useCart();
  const [customCode, setCustomCode] = useState('');
  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  const handleApply = (code: string) => {
    const res = applyCoupon(code);
    setFeedback({
      message: res.message,
      isError: !res.success,
    });
    if (res.success && onApplied) {
      setTimeout(onApplied, 600);
    }
  };

  return (
    <div className="space-y-4">
      {/* Manual Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (customCode.trim()) handleApply(customCode.trim());
        }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <Tag size={16} className="absolute left-3 top-3 text-orange-500" />
          <input
            type="text"
            placeholder="Enter promo coupon code"
            value={customCode}
            onChange={(e) => {
              setCustomCode(e.target.value.toUpperCase());
              setFeedback(null);
            }}
            className="w-full pl-9 pr-3 py-2 text-xs uppercase font-bold tracking-wider bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-orange-500"
          />
        </div>
        <button
          type="submit"
          disabled={!customCode.trim()}
          className="px-4 py-2 bg-gray-900 hover:bg-black disabled:bg-gray-200 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          Apply
        </button>
      </form>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
            feedback.isError
              ? 'bg-rose-50 text-rose-700 border border-rose-100'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-100'
          }`}
        >
          {feedback.isError ? <AlertCircle size={14} /> : <Check size={14} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Available Coupons List */}
      <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
        {availableCoupons.map((coupon) => {
          const isApplied = appliedCoupon?.code === coupon.code;
          const isEligible = itemTotal >= coupon.minOrder && !coupon.isExpired;

          return (
            <div
              key={coupon.code}
              className={`p-3 rounded-2xl border transition-all ${
                isApplied
                  ? 'border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500'
                  : coupon.isExpired
                  ? 'border-gray-200 bg-gray-50/50 opacity-60'
                  : 'border-gray-200 hover:border-orange-300 bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs font-mono px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 border border-orange-200">
                      {coupon.code}
                    </span>
                    <span className="text-xs font-bold text-gray-900">{coupon.title}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">{coupon.description}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Valid on orders above ₹{coupon.minOrder} • Exp: {coupon.expiresAt}
                  </p>
                </div>

                <div>
                  {isApplied ? (
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs text-rose-600 font-bold hover:underline"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={!isEligible}
                      onClick={() => handleApply(coupon.code)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        isEligible
                          ? 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer shadow-xs'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {coupon.isExpired ? 'Expired' : 'Apply'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
