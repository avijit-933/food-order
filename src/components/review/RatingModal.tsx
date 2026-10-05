import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { orderApi } from '../../api/orderApi';
import { Star, X, Camera, Check } from 'lucide-react';

export const RatingModal: React.FC = () => {
  const { ratingModalOrder, closeRatingModal, showToast } = useApp();

  const [restaurantStars, setRestaurantStars] = useState(5);
  const [foodStars, setFoodStars] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!ratingModalOrder) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await orderApi.rateOrder(ratingModalOrder.id, {
      restaurantRating: restaurantStars,
      foodRating: foodStars,
      comment,
      reviewDate: 'Just now',
    });
    setSubmitting(false);
    showToast('Review submitted!', 'Thank you for helping the foodie community!', 'success');
    closeRatingModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-gray-100 p-6 relative">
        <button
          onClick={closeRatingModal}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-800 rounded-full hover:bg-gray-100"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 font-display">Rate Your Experience</h3>
          <p className="text-xs text-gray-500 mt-1">
            Order #{ratingModalOrder.id} • {ratingModalOrder.restaurantName}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Restaurant Rating */}
          <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 text-center">
            <h4 className="text-xs font-bold text-gray-700 mb-2">Rate Restaurant Experience</h4>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRestaurantStars(star)}
                  className="p-1 cursor-pointer transition-transform hover:scale-125"
                >
                  <Star
                    size={28}
                    className={
                      star <= restaurantStars
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }
                  />
                </button>
              ))}
            </div>
            <span className="text-[11px] text-gray-400 font-medium block mt-1">
              {restaurantStars === 5 ? 'Exceptional! 🌟' : `${restaurantStars} / 5 Stars`}
            </span>
          </div>

          {/* Food Rating */}
          <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 text-center">
            <h4 className="text-xs font-bold text-gray-700 mb-2">Rate Food Taste &amp; Quality</h4>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setFoodStars(star)}
                  className="p-1 cursor-pointer transition-transform hover:scale-125"
                >
                  <Star
                    size={28}
                    className={
                      star <= foodStars
                        ? 'fill-orange-500 text-orange-500'
                        : 'text-gray-300'
                    }
                  />
                </button>
              ))}
            </div>
            <span className="text-[11px] text-gray-400 font-medium block mt-1">
              {foodStars === 5 ? 'Delicious & Fresh! 🍲' : `${foodStars} / 5 Stars`}
            </span>
          </div>

          {/* Written review */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              How was your experience?
            </label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about the food flavor, packaging, portion size, and delivery time..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
            ></textarea>
          </div>

          {/* Optional photo tag */}
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-xl border border-dashed border-gray-300">
            <Camera size={16} className="text-orange-500" />
            <span>Add food photo preview (optional)</span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
            <Check size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
