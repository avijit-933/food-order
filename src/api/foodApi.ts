import { apiClient } from './client';
import { MenuItem } from '../types';
import { MENU_ITEMS } from '../data/mockData';

export const foodApi = {
  async getByRestaurant(restaurantId: string): Promise<MenuItem[]> {
    try {
      const res = await apiClient<MenuItem[]>(`/restaurants/${restaurantId}/menu`);
      return res.data;
    } catch {
      return MENU_ITEMS.filter((item) => item.restaurantId === restaurantId);
    }
  },

  async searchFood(query: string): Promise<MenuItem[]> {
    try {
      const res = await apiClient<MenuItem[]>(`/foods/search?q=${encodeURIComponent(query)}`);
      return res.data;
    } catch {
      const q = query.toLowerCase();
      return MENU_ITEMS.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }
  },

  async getRecommendations(): Promise<MenuItem[]> {
    try {
      const res = await apiClient<MenuItem[]>('/foods/recommendations');
      return res.data;
    } catch {
      return MENU_ITEMS.filter((m) => m.isRecommended || m.isBestseller).slice(0, 6);
    }
  },
};
