import { apiClient } from './client';
import { User, Address } from '../types';
import { INITIAL_USER } from '../data/mockData';

const USER_KEY = 'foodiego_current_user';

function getStoredUser(): User {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : INITIAL_USER;
  } catch {
    return INITIAL_USER;
  }
}

function persistUser(user: User): void {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to persist user profile', e);
  }
}

export const userApi = {
  async getProfile(): Promise<User> {
    try {
      const res = await apiClient<User>('/user/profile');
      return res.data;
    } catch {
      return getStoredUser();
    }
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    try {
      const res = await apiClient<User>('/user/profile', {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      return res.data;
    } catch {
      const current = getStoredUser();
      const updated = { ...current, ...updates };
      persistUser(updated);
      return updated;
    }
  },

  async addAddress(address: Omit<Address, 'id'>): Promise<Address> {
    const newAddress: Address = {
      ...address,
      id: `addr-${Date.now()}`,
    };

    try {
      const res = await apiClient<Address>('/user/addresses', {
        method: 'POST',
        body: JSON.stringify(newAddress),
      });
      return res.data;
    } catch {
      const current = getStoredUser();
      const updatedAddresses = [...current.addresses, newAddress];
      persistUser({ ...current, addresses: updatedAddresses });
      return newAddress;
    }
  },

  async deleteAddress(addressId: string): Promise<boolean> {
    try {
      await apiClient(`/user/addresses/${addressId}`, { method: 'DELETE' });
      return true;
    } catch {
      const current = getStoredUser();
      const updatedAddresses = current.addresses.filter((a) => a.id !== addressId);
      persistUser({ ...current, addresses: updatedAddresses });
      return true;
    }
  },
};
