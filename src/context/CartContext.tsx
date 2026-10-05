import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Coupon, MenuItem, SelectedOption } from '../types';
import { cartApi } from '../api/cartApi';
import { INITIAL_COUPONS } from '../data/coupons';

interface RestaurantChangePrompt {
  newItem: {
    menuItem: MenuItem;
    restaurantId: string;
    restaurantName: string;
    quantity: number;
    selectedOptions: SelectedOption[];
    specialInstructions?: string;
    unitPrice: number;
  };
  previousRestaurantName: string;
}

interface CartContextType {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  restaurantImage: string | null;
  itemCount: number;
  itemTotal: number;
  deliveryFee: number;
  taxes: number;
  discount: number;
  grandTotal: number;
  deliveryType: 'Standard' | 'Priority';
  setDeliveryType: (type: 'Standard' | 'Priority') => void;
  appliedCoupon: Coupon | null;
  availableCoupons: Coupon[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cookingInstructions: string;
  setCookingInstructions: (val: string) => void;
  restaurantChangePrompt: RestaurantChangePrompt | null;
  dismissRestaurantChangePrompt: () => void;
  confirmRestaurantChange: () => void;
  addItem: (item: {
    menuItem: MenuItem;
    restaurantId: string;
    restaurantName: string;
    quantity: number;
    selectedOptions: SelectedOption[];
    specialInstructions?: string;
    unitPrice: number;
  }) => boolean;
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => cartApi.getStoredCart());
  const [deliveryType, setDeliveryType] = useState<'Standard' | 'Priority'>('Standard');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cookingInstructions, setCookingInstructions] = useState('');
  const [restaurantChangePrompt, setRestaurantChangePrompt] = useState<RestaurantChangePrompt | null>(null);

  useEffect(() => {
    cartApi.saveCart(items);
  }, [items]);

  const restaurantId = items.length > 0 ? items[0].restaurantId : null;
  const restaurantName = items.length > 0 ? items[0].restaurantName : null;
  const restaurantImage = items.length > 0 ? items[0].menuItem.image : null;

  const itemCount = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const itemTotal = items.reduce((acc, curr) => acc + curr.totalPrice, 0);

  // Delivery fee logic
  const isFreeDeliveryEligible = itemTotal >= 499 || appliedCoupon?.code === 'FREEDEL';
  const baseDeliveryFee = deliveryType === 'Priority' ? 50 : 30;
  const deliveryFee = items.length === 0 ? 0 : isFreeDeliveryEligible ? 0 : baseDeliveryFee;

  // 5% standard GST
  const taxes = items.length === 0 ? 0 : Math.round(itemTotal * 0.05);

  // Discount calculation
  let discount = 0;
  if (appliedCoupon && itemTotal >= appliedCoupon.minOrder) {
    if (appliedCoupon.discountType === 'fixed') {
      discount = appliedCoupon.discountAmount;
    } else {
      const pctDiscount = Math.round((itemTotal * appliedCoupon.discountAmount) / 100);
      discount = appliedCoupon.maxDiscount ? Math.min(pctDiscount, appliedCoupon.maxDiscount) : pctDiscount;
    }
  }

  const grandTotal = Math.max(0, itemTotal + deliveryFee + taxes - discount);

  const addItemInternal = (itemPayload: {
    menuItem: MenuItem;
    restaurantId: string;
    restaurantName: string;
    quantity: number;
    selectedOptions: SelectedOption[];
    specialInstructions?: string;
    unitPrice: number;
  }) => {
    // Generate unique identifier based on itemId and selected option combinations
    const optionsKey = itemPayload.selectedOptions
      .map((o) => `${o.groupTitle}:${o.option.name}`)
      .sort()
      .join('|');
    const cartItemId = `${itemPayload.menuItem.id}__${optionsKey}`;

    setItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.cartItemId === cartItemId);
      if (existingIdx !== -1) {
        const next = [...prev];
        const newQty = next[existingIdx].quantity + itemPayload.quantity;
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: newQty,
          totalPrice: newQty * next[existingIdx].unitPrice,
        };
        return next;
      } else {
        const newItem: CartItem = {
          cartItemId,
          menuItem: itemPayload.menuItem,
          restaurantId: itemPayload.restaurantId,
          restaurantName: itemPayload.restaurantName,
          quantity: itemPayload.quantity,
          selectedOptions: itemPayload.selectedOptions,
          specialInstructions: itemPayload.specialInstructions,
          unitPrice: itemPayload.unitPrice,
          totalPrice: itemPayload.quantity * itemPayload.unitPrice,
        };
        return [...prev, newItem];
      }
    });
  };

  const addItem = (itemPayload: {
    menuItem: MenuItem;
    restaurantId: string;
    restaurantName: string;
    quantity: number;
    selectedOptions: SelectedOption[];
    specialInstructions?: string;
    unitPrice: number;
  }): boolean => {
    // Check if adding from different restaurant
    if (items.length > 0 && items[0].restaurantId !== itemPayload.restaurantId) {
      setRestaurantChangePrompt({
        newItem: itemPayload,
        previousRestaurantName: items[0].restaurantName,
      });
      return false;
    }

    addItemInternal(itemPayload);
    return true;
  };

  const confirmRestaurantChange = () => {
    if (restaurantChangePrompt) {
      setItems([]);
      setAppliedCoupon(null);
      addItemInternal(restaurantChangePrompt.newItem);
      setRestaurantChangePrompt(null);
    }
  };

  const dismissRestaurantChangePrompt = () => {
    setRestaurantChangePrompt(null);
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null;
            return {
              ...item,
              quantity: nextQty,
              totalPrice: nextQty * item.unitPrice,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeItem = (cartItemId: string) => {
    setItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    cartApi.clearCart();
  };

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const coupon = INITIAL_COUPONS.find(
      (c) => c.code.toUpperCase() === code.trim().toUpperCase()
    );

    if (!coupon) {
      return { success: false, message: 'Invalid coupon code. Try SAVE50 or WELCOME100' };
    }

    if (coupon.isExpired) {
      return { success: false, message: 'This coupon has expired.' };
    }

    if (itemTotal < coupon.minOrder) {
      return {
        success: false,
        message: `Add items worth ₹${coupon.minOrder - itemTotal} more to apply this coupon.`,
      };
    }

    setAppliedCoupon(coupon);
    return { success: true, message: `Coupon ${coupon.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        restaurantId,
        restaurantName,
        restaurantImage,
        itemCount,
        itemTotal,
        deliveryFee,
        taxes,
        discount,
        grandTotal,
        deliveryType,
        setDeliveryType,
        appliedCoupon,
        availableCoupons: INITIAL_COUPONS,
        isCartOpen,
        setIsCartOpen,
        cookingInstructions,
        setCookingInstructions,
        restaurantChangePrompt,
        dismissRestaurantChangePrompt,
        confirmRestaurantChange,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
