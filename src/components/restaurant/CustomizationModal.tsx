import React, { useState } from 'react';
import { MenuItem, FoodCustomizationOption, SelectedOption } from '../../types';
import { useCart } from '../../context/CartContext';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../utils/formatters';
import { X, Plus, Minus, Check } from 'lucide-react';

interface CustomizationModalProps {
  item: MenuItem | null;
  restaurantId: string;
  restaurantName: string;
  onClose: () => void;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  item,
  restaurantId,
  restaurantName,
  onClose,
}) => {
  const { addItem } = useCart();
  const { showToast } = useApp();

  if (!item) return null;

  // Selected radio options: map group.id -> FoodCustomizationOption
  const [radioSelections, setRadioSelections] = useState<Record<string, FoodCustomizationOption>>(() => {
    const initial: Record<string, FoodCustomizationOption> = {};
    item.customization?.forEach((group) => {
      if (group.type === 'radio' && group.options.length > 0) {
        initial[group.id] = group.options[0]; // select first by default
      }
    });
    return initial;
  });

  // Selected checkbox options: map group.id -> FoodCustomizationOption[]
  const [checkboxSelections, setCheckboxSelections] = useState<Record<string, FoodCustomizationOption[]>>({});

  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Calculate unit price based on base price + selections
  let extraTotal = 0;
  Object.values(radioSelections).forEach((opt) => {
    extraTotal += opt.price;
  });
  Object.values(checkboxSelections).forEach((opts) => {
    opts.forEach((o) => {
      extraTotal += o.price;
    });
  });

  const unitPrice = item.price + extraTotal;
  const totalPrice = unitPrice * quantity;

  const toggleCheckbox = (groupId: string, option: FoodCustomizationOption) => {
    setCheckboxSelections((prev) => {
      const currentList = prev[groupId] || [];
      const exists = currentList.some((o) => o.name === option.name);
      if (exists) {
        return {
          ...prev,
          [groupId]: currentList.filter((o) => o.name !== option.name),
        };
      } else {
        return {
          ...prev,
          [groupId]: [...currentList, option],
        };
      }
    });
  };

  const handleAddToCart = () => {
    // Collect all selected options
    const allSelected: SelectedOption[] = [];

    item.customization?.forEach((group) => {
      if (group.type === 'radio') {
        const sel = radioSelections[group.id];
        if (sel) {
          allSelected.push({ groupTitle: group.title, option: sel });
        }
      } else {
        const list = checkboxSelections[group.id] || [];
        list.forEach((opt) => {
          allSelected.push({ groupTitle: group.title, option: opt });
        });
      }
    });

    const success = addItem({
      menuItem: item,
      restaurantId,
      restaurantName,
      quantity,
      selectedOptions: allSelected,
      specialInstructions: specialInstructions.trim() || undefined,
      unitPrice,
    });

    if (success) {
      showToast('Added to cart', `${quantity}x ${item.name} (${formatPrice(totalPrice)})`, 'success');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col justify-between">
        {/* Header */}
        <div className="relative">
          <div className="h-40 w-full overflow-hidden bg-gray-100">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors"
          >
            <X size={18} />
          </button>

          <div className="absolute bottom-3 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-3.5 h-3.5 rounded-sm border ${item.isVeg ? 'border-emerald-400' : 'border-rose-400'} flex items-center justify-center`}>
                <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
              </span>
              <span className="text-xs text-orange-200 font-semibold">{restaurantName}</span>
            </div>
            <h3 className="text-xl font-bold font-display">{item.name}</h3>
            <p className="text-xs text-white/80 line-clamp-1">{item.description}</p>
          </div>
        </div>

        {/* Customization Groups */}
        <div className="p-6 space-y-6 flex-1">
          {item.customization && item.customization.length > 0 ? (
            item.customization.map((group) => (
              <div key={group.id} className="border-b border-gray-100 pb-5 last:border-b-0">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-gray-900">{group.title}</h4>
                  <span className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">
                    {group.type === 'radio' ? 'Select 1 option' : 'Optional extras'}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {group.options.map((opt) => {
                    const isRadioSelected = radioSelections[group.id]?.name === opt.name;
                    const isCheckboxSelected =
                      checkboxSelections[group.id]?.some((o) => o.name === opt.name) || false;

                    if (group.type === 'radio') {
                      return (
                        <label
                          key={opt.name}
                          onClick={() => setRadioSelections({ ...radioSelections, [group.id]: opt })}
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                            isRadioSelected
                              ? 'border-orange-500 bg-orange-50/40 text-orange-900'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-3 text-xs font-semibold">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isRadioSelected ? 'border-orange-600' : 'border-gray-300'
                            }`}>
                              {isRadioSelected && <div className="w-2 h-2 rounded-full bg-orange-600"></div>}
                            </div>
                            <span>{opt.name}</span>
                          </div>
                          <span className="text-xs font-bold">
                            {opt.price > 0 ? `+${formatPrice(opt.price)}` : 'Included'}
                          </span>
                        </label>
                      );
                    } else {
                      return (
                        <label
                          key={opt.name}
                          onClick={() => toggleCheckbox(group.id, opt)}
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                            isCheckboxSelected
                              ? 'border-orange-500 bg-orange-50/40 text-orange-900'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-3 text-xs font-semibold">
                            <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                              isCheckboxSelected ? 'border-orange-600 bg-orange-600 text-white' : 'border-gray-300'
                            }`}>
                              {isCheckboxSelected && <Check size={12} />}
                            </div>
                            <span>{opt.name}</span>
                          </div>
                          <span className="text-xs font-bold">
                            +{formatPrice(opt.price)}
                          </span>
                        </label>
                      );
                    }
                  })}
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-500">Standard chef recipe portion with no alterations needed.</p>
          )}

          {/* Cooking Instructions Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Special instructions for kitchen (Optional)
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Less spicy, extra tissues, cutlery required"
              className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Sticky Modal Bottom Bar with Quantity & CTA */}
        <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-orange-600 rounded-lg hover:bg-gray-100"
            >
              <Minus size={14} />
            </button>
            <span className="px-3 font-extrabold text-sm text-gray-900">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-orange-600 rounded-lg hover:bg-gray-100"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 py-3 px-5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-bold text-sm shadow-md shadow-orange-500/20 transition-all flex items-center justify-between cursor-pointer"
          >
            <span>Add to Cart</span>
            <span>{formatPrice(totalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
