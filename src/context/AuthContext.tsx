import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USER } from '../data/mockData';
import { authApi, LoginCredentials, RegisterPayload } from '../api/authApi';
import { getAuthToken, setAuthToken } from '../api/client';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register' | 'otp';
  openAuthModal: (tab?: 'login' | 'register' | 'otp') => void;
  closeAuthModal: () => void;
  login: (creds: LoginCredentials) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  sendOtp: (phoneOrEmail: string) => Promise<boolean>;
  verifyOtp: (phoneOrEmail: string, otp: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('foodiego_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'otp'>('login');

  useEffect(() => {
    if (user) {
      localStorage.setItem('foodiego_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('foodiego_current_user');
    }
  }, [user]);

  const openAuthModal = (tab: 'login' | 'register' | 'otp' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (creds: LoginCredentials): Promise<boolean> => {
    try {
      const res = await authApi.login(creds);
      setUser(res.user);
      closeAuthModal();
      return true;
    } catch {
      return false;
    }
  };

  const loginWithGoogle = async () => {
    const googleUser: User = {
      id: 'usr-google-' + Date.now(),
      name: 'Avijit Jana',
      email: 'avijit93326@gmail.com',
      phone: '+91 98765 43210',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      addresses: INITIAL_USER.addresses,
    };
    setAuthToken('google_jwt_simulated_token');
    setUser(googleUser);
    closeAuthModal();
  };

  const register = async (payload: RegisterPayload): Promise<boolean> => {
    try {
      const res = await authApi.register(payload);
      setUser(res.user);
      closeAuthModal();
      return true;
    } catch {
      return false;
    }
  };

  const sendOtp = async (phoneOrEmail: string): Promise<boolean> => {
    try {
      const res = await authApi.sendOtp(phoneOrEmail);
      return res.success;
    } catch {
      return false;
    }
  };

  const verifyOtp = async (phoneOrEmail: string, otp: string): Promise<boolean> => {
    try {
      const res = await authApi.verifyOtp(phoneOrEmail, otp);
      setUser(res.user);
      closeAuthModal();
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    if (user) {
      setUser({ ...user, role: newRole });
    } else {
      setUser({ ...INITIAL_USER, role: newRole });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && !!getAuthToken(),
        role: user?.role || 'customer',
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        login,
        loginWithGoogle,
        register,
        sendOtp,
        verifyOtp,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
