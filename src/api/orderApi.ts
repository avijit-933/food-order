import { apiClient } from './client';
import { Order, OrderRating, OrderStatus } from '../types';
import { INITIAL_ORDERS } from '../data/mockData';

const ORDERS_KEY = 'foodiego_orders';

function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_ORDERS;
  } catch {
    return INITIAL_ORDERS;
  }
}

function persistOrders(orders: Order[]): void {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to persist orders', e);
  }
}

export const orderApi = {
  async getAll(): Promise<Order[]> {
    try {
      const res = await apiClient<Order[]>('/orders');
      return res.data;
    } catch {
      return getStoredOrders();
    }
  },

  async getById(orderId: string): Promise<Order | undefined> {
    try {
      const res = await apiClient<Order>(`/orders/${orderId}`);
      return res.data;
    } catch {
      const orders = getStoredOrders();
      return orders.find((o) => o.id === orderId);
    }
  },

  async create(orderPayload: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    const newId = `FG-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      ...orderPayload,
      id: newId,
      createdAt: new Date().toISOString(),
      otp: String(Math.floor(1000 + Math.random() * 9000)),
      status: 'Placed',
    };

    try {
      const res = await apiClient<Order>('/orders', {
        method: 'POST',
        body: JSON.stringify(newOrder),
      });
      return res.data;
    } catch {
      const orders = getStoredOrders();
      const updated = [newOrder, ...orders];
      persistOrders(updated);
      return newOrder;
    }
  },

  async updateStatus(orderId: string, status: OrderStatus): Promise<Order | undefined> {
    try {
      const res = await apiClient<Order>(`/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      return res.data;
    } catch {
      const orders = getStoredOrders();
      const idx = orders.findIndex((o) => o.id === orderId);
      if (idx !== -1) {
        orders[idx].status = status;
        persistOrders(orders);
        return orders[idx];
      }
      return undefined;
    }
  },

  async rateOrder(orderId: string, rating: OrderRating): Promise<Order | undefined> {
    try {
      const res = await apiClient<Order>(`/orders/${orderId}/rating`, {
        method: 'POST',
        body: JSON.stringify(rating),
      });
      return res.data;
    } catch {
      const orders = getStoredOrders();
      const idx = orders.findIndex((o) => o.id === orderId);
      if (idx !== -1) {
        orders[idx].rating = rating;
        persistOrders(orders);
        return orders[idx];
      }
      return undefined;
    }
  },
};
