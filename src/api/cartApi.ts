import { CartItem } from '../types';

/**
 * Cart API interface for syncing cart with FastAPI backend
 * and persisting across browser sessions in localStorage.
 */
export const cartApi = {
  getStoredCart(): CartItem[] {
    try {
      const data = localStorage.getItem('foodiego_cart');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveCart(items: CartItem[]): void {
    try {
      localStorage.setItem('foodiego_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  },

  clearCart(): void {
    localStorage.removeItem('foodiego_cart');
  },
};
