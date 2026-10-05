import { apiClient } from './client';
import { Restaurant } from '../types';
import { RESTAURANTS } from '../data/mockData';

export interface RestaurantFilterParams {
  search?: string;
  cuisine?: string;
  sortBy?: 'recommended' | 'rating' | 'deliveryTime' | 'priceAsc' | 'priceDesc' | 'distance';
  isVeg?: boolean;
  offersOnly?: boolean;
  maxDistance?: number;
}

export const restaurantApi = {
  async getAll(params?: RestaurantFilterParams): Promise<Restaurant[]> {
    try {
      const query = new URLSearchParams();
      if (params?.search) query.append('q', params.search);
      if (params?.cuisine) query.append('cuisine', params.cuisine);
      if (params?.sortBy) query.append('sort', params.sortBy);
      if (params?.isVeg !== undefined) query.append('veg', String(params.isVeg));
      if (params?.offersOnly) query.append('offers', 'true');

      const res = await apiClient<Restaurant[]>(`/restaurants?${query.toString()}`);
      return res.data;
    } catch {
      // Local fallback with real filtering logic
      let result = [...RESTAURANTS];

      if (params?.search) {
        const q = params.search.toLowerCase();
        result = result.filter(
          (r) =>
            r.name.toLowerCase().includes(q) ||
            r.cuisine.some((c) => c.toLowerCase().includes(q)) ||
            r.tags.some((t) => t.toLowerCase().includes(q))
        );
      }

      if (params?.cuisine && params.cuisine !== 'All') {
        const c = params.cuisine.toLowerCase();
        result = result.filter((r) =>
          r.cuisine.some((item) => item.toLowerCase().includes(c))
        );
      }

      if (params?.isVeg) {
        result = result.filter((r) => r.isVeg);
      }

      if (params?.offersOnly) {
        result = result.filter((r) => Boolean(r.discount));
      }

      if (params?.sortBy) {
        if (params.sortBy === 'rating') {
          result.sort((a, b) => b.rating - a.rating);
        } else if (params.sortBy === 'deliveryTime') {
          result.sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
        } else if (params.sortBy === 'priceAsc') {
          result.sort((a, b) => a.priceForTwo - b.priceForTwo);
        } else if (params.sortBy === 'priceDesc') {
          result.sort((a, b) => b.priceForTwo - a.priceForTwo);
        } else if (params.sortBy === 'distance') {
          result.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        }
      }

      return result;
    }
  },

  async getById(id: string): Promise<Restaurant | undefined> {
    try {
      const res = await apiClient<Restaurant>(`/restaurants/${id}`);
      return res.data;
    } catch {
      return RESTAURANTS.find((r) => r.id === id);
    }
  },

  async toggleFavorite(restaurantId: string): Promise<boolean> {
    try {
      const res = await apiClient<{ isFavorite: boolean }>(`/restaurants/${restaurantId}/favorite`, {
        method: 'POST',
      });
      return res.data.isFavorite;
    } catch {
      return true;
    }
  },
};
