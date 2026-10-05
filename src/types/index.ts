export type UserRole = 'customer' | 'admin' | 'delivery' | 'restaurant_manager';

export interface Address {
  id: string;
  name: string;
  phone: string;
  houseFlat: string;
  street: string;
  landmark: string;
  city: string;
  state: string;
  pinCode: string;
  type: 'Home' | 'Work' | 'Other';
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  addresses: Address[];
}

export interface FoodCustomizationOption {
  name: string;
  price: number;
}

export interface FoodCustomizationGroup {
  id: string;
  title: string;
  type: 'radio' | 'checkbox';
  required?: boolean;
  options: FoodCustomizationOption[];
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  ratingCount: number;
  isVeg: boolean;
  isBestseller: boolean;
  isRecommended: boolean;
  category: string;
  customization?: FoodCustomizationGroup[];
}

export interface SelectedOption {
  groupTitle: string;
  option: FoodCustomizationOption;
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  restaurantId: string;
  restaurantName: string;
  quantity: number;
  selectedOptions: SelectedOption[];
  specialInstructions?: string;
  unitPrice: number;
  totalPrice: number;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  coverImage?: string;
  logo?: string;
  rating: number;
  ratingCount: number;
  cuisine: string[];
  priceForTwo: number;
  deliveryTime: string;
  distance: string;
  discount?: string;
  isVeg: boolean;
  isFavorite?: boolean;
  isOpen: boolean;
  address: string;
  tags: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Coupon {
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountAmount: number;
  maxDiscount?: number;
  minOrder: number;
  expiresAt: string;
  isExpired?: boolean;
}

export type OrderStatus =
  | 'Placed'
  | 'Confirmed'
  | 'Preparing'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  rating: number;
  vehicle: string;
  avatar: string;
  currentCoords: {
    lat: number;
    lng: number;
  };
}

export interface OrderRating {
  restaurantRating: number;
  foodRating: number;
  comment: string;
  reviewDate: string;
  photos?: string[];
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  items: CartItem[];
  itemTotal: number;
  deliveryFee: number;
  taxes: number;
  discount: number;
  appliedCoupon?: string;
  grandTotal: number;
  deliveryType: 'Standard' | 'Priority';
  deliveryAddress: Address;
  paymentMethod: 'UPI' | 'Card' | 'Net Banking' | 'Wallet' | 'Cash on Delivery';
  paymentStatus: 'Paid' | 'Pending';
  status: OrderStatus;
  createdAt: string;
  estimatedDeliveryTime: string;
  deliveryPartner?: DeliveryPartner;
  rating?: OrderRating;
  otp?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
}

export interface ComplaintTicket {
  id: string;
  orderId?: string;
  category: string;
  subject: string;
  message: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'order' | 'promo' | 'system';
  link?: string;
}
