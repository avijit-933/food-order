import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RESTAURANTS, MENU_ITEMS } from '../data/mockData';
import { INITIAL_COUPONS } from '../data/coupons';
import { Restaurant, MenuItem, Coupon, OrderStatus } from '../types';
import { formatPrice } from '../utils/formatters';
import {
  TrendingUp,
  DollarSign,
  Users,
  Store,
  Clock,
  Package,
  Plus,
  Trash2,
  Edit,
  Tag,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Search,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { showToast, navigateTo } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'restaurants' | 'menu' | 'orders' | 'users' | 'coupons'
  >('overview');

  // State collections
  const [restaurantsList, setRestaurantsList] = useState<Restaurant[]>(RESTAURANTS);
  const [menuList, setMenuList] = useState<MenuItem[]>(MENU_ITEMS);
  const [couponsList, setCouponsList] = useState<Coupon[]>(INITIAL_COUPONS);

  // New restaurant modal / state
  const [newRestName, setNewRestName] = useState('');
  const [newRestCuisine, setNewRestCuisine] = useState('');
  const [newRestPrice, setNewRestPrice] = useState(300);

  // New food modal / state
  const [newFoodName, setNewFoodName] = useState('');
  const [newFoodPrice, setNewFoodPrice] = useState(199);
  const [newFoodCat, setNewFoodCat] = useState('Biryani');
  const [newFoodVeg, setNewFoodVeg] = useState(false);

  // New coupon modal / state
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(50);
  const [newCouponMin, setNewCouponMin] = useState(299);

  // Admin simulated orders
  const [adminOrders, setAdminOrders] = useState([
    { id: 'FG-10254', customer: 'Avijit Jana', restaurant: 'Spice Garden', amount: 492, status: 'Out for Delivery' as OrderStatus, time: '11:35 AM' },
    { id: 'FG-10253', customer: 'Priya Sharma', restaurant: 'The Burger Hub', amount: 340, status: 'Preparing' as OrderStatus, time: '11:42 AM' },
    { id: 'FG-10252', customer: 'Rahul Sen', restaurant: 'Biryani House', amount: 698, status: 'Confirmed' as OrderStatus, time: '11:48 AM' },
    { id: 'FG-10251', customer: 'Ananya Roy', restaurant: 'Pizza Romano', amount: 520, status: 'Delivered' as OrderStatus, time: '11:15 AM' },
    { id: 'FG-10250', customer: 'Debjit Bose', restaurant: 'Green Bowl', amount: 280, status: 'Placed' as OrderStatus, time: '11:52 AM' },
  ]);

  // Admin user directory
  const [userList, setUserList] = useState([
    { id: 'usr-1', name: 'Avijit Jana', email: 'avijit93326@gmail.com', role: 'Customer', orders: 18, status: 'Active' },
    { id: 'usr-2', name: 'Rajesh Kumar', email: 'rajesh.rider@foodiego.com', role: 'Delivery Partner', orders: 142, status: 'Active' },
    { id: 'usr-3', name: 'Kabir Khan', email: 'kabir@spicegarden.com', role: 'Restaurant Manager', orders: 480, status: 'Active' },
    { id: 'usr-4', name: 'Siddharth Roy', email: 'sid.admin@foodiego.com', role: 'Admin', orders: 0, status: 'Active' },
  ]);

  // Handlers
  const handleAddRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRestName) return;

    const newRest: Restaurant = {
      id: `rest-${Date.now()}`,
      name: newRestName,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80',
      rating: 4.5,
      ratingCount: 1,
      cuisine: newRestCuisine ? newRestCuisine.split(',').map((c) => c.trim()) : ['Multicuisine'],
      priceForTwo: newRestPrice,
      deliveryTime: '25–30 min',
      distance: '2.0 km',
      isVeg: false,
      isOpen: true,
      address: 'Main Street Corridor, Dantan',
      tags: ['New Opening', 'Chef Special'],
      coordinates: { lat: 21.962, lng: 87.271 },
    };

    setRestaurantsList([newRest, ...restaurantsList]);
    setNewRestName('');
    setNewRestCuisine('');
    showToast('Restaurant Added', `${newRest.name} added to platform`, 'success');
  };

  const toggleRestaurantStatus = (id: string) => {
    setRestaurantsList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isOpen: !r.isOpen } : r))
    );
    showToast('Restaurant Status', 'Visibility updated on consumer feed', 'info');
  };

  const handleAddFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFoodName) return;

    const newFood: MenuItem = {
      id: `food-${Date.now()}`,
      restaurantId: restaurantsList[0].id,
      name: newFoodName,
      description: 'Handcrafted recipe prepared with farm-fresh spices and premium ingredients.',
      price: newFoodPrice,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
      rating: 4.8,
      ratingCount: 1,
      isVeg: newFoodVeg,
      isBestseller: true,
      isRecommended: true,
      category: newFoodCat,
    };

    setMenuList([newFood, ...menuList]);
    setNewFoodName('');
    showToast('Dish Added to Menu', `${newFood.name} added for ${formatPrice(newFood.price)}`, 'success');
  };

  const handleDeleteFood = (id: string) => {
    setMenuList((prev) => prev.filter((i) => i.id !== id));
    showToast('Dish removed', 'Item removed from catalog', 'info');
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;

    const newCoupon: Coupon = {
      code: newCouponCode.toUpperCase(),
      title: `Flat ₹${newCouponDiscount} OFF`,
      description: `Special promotional discount of ₹${newCouponDiscount} on orders above ₹${newCouponMin}`,
      discountType: 'fixed',
      discountAmount: newCouponDiscount,
      minOrder: newCouponMin,
      expiresAt: '2026-12-31',
    };

    setCouponsList([newCoupon, ...couponsList]);
    setNewCouponCode('');
    showToast('Coupon Created', `Code ${newCoupon.code} is now live`, 'success');
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setAdminOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast('Order Status Updated', `Order #${orderId} set to ${status}`, 'success');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white py-5 sticky top-14 z-20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <Shield size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold font-display">FoodieGo Master Admin Console</h1>
                <span className="text-[10px] bg-blue-500/30 text-blue-300 font-mono px-2 py-0.5 rounded">
                  Superuser
                </span>
              </div>
              <p className="text-xs text-slate-400">Operations, Catalog, Financials &amp; Dispatch</p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('home')}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
          >
            Switch to Customer View
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1.5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: BarChart3 },
            { id: 'restaurants', label: 'Restaurants (128)', icon: Store },
            { id: 'menu', label: 'Menu Catalog', icon: Layers },
            { id: 'orders', label: 'Live Orders (84)', icon: Package },
            { id: 'users', label: 'User Directory', icon: Users },
            { id: 'coupons', label: 'Offers & Coupons', icon: Tag },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW METRICS & SVG CHARTS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 5 Core Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Total Orders</span>
                <span className="text-2xl font-black text-slate-900 font-display">12,450</span>
                <span className="text-[10px] text-emerald-600 font-bold block mt-1">+14.2% this month</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Gross Revenue</span>
                <span className="text-2xl font-black text-blue-600 font-display">₹8.4 Lakh</span>
                <span className="text-[10px] text-emerald-600 font-bold block mt-1">+18.8% growth</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Active Customers</span>
                <span className="text-2xl font-black text-slate-900 font-display">6,240</span>
                <span className="text-[10px] text-blue-600 font-bold block mt-1">92% repeat rate</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Partner Kitchens</span>
                <span className="text-2xl font-black text-slate-900 font-display">128</span>
                <span className="text-[10px] text-slate-500 font-bold block mt-1">Across 8 zones</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Pending Orders</span>
                <span className="text-2xl font-black text-amber-600 font-display">84</span>
                <span className="text-[10px] text-amber-600 font-bold block mt-1">Dispatching now</span>
              </div>
            </div>

            {/* SVG Analytic Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Orders Trend Chart */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Weekly Order Volume</h3>
                    <p className="text-xs text-slate-400">Peak dining orders across lunch and dinner</p>
                  </div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                    Avg 1,780 / day
                  </span>
                </div>

                <div className="h-44 w-full flex items-end gap-3 pt-6 pb-2">
                  {[
                    { day: 'Mon', count: 1240, h: '55%' },
                    { day: 'Tue', count: 1390, h: '62%' },
                    { day: 'Wed', count: 1580, h: '70%' },
                    { day: 'Thu', count: 1650, h: '75%' },
                    { day: 'Fri', count: 2150, h: '95%' },
                    { day: 'Sat', count: 2420, h: '100%' },
                    { day: 'Sun', count: 2310, h: '92%' },
                  ].map((bar) => (
                    <div key={bar.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                      <div className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        {bar.count}
                      </div>
                      <div
                        className="w-full bg-blue-500 hover:bg-blue-600 rounded-t-xl transition-all duration-300 shadow-2xs"
                        style={{ height: bar.h }}
                      ></div>
                      <span className="text-[10px] font-semibold text-slate-400">{bar.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revenue & Category Share */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Revenue Contribution by Cuisine</h3>
                    <p className="text-xs text-slate-400">Top revenue generating cuisines</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    High Margin
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  {[
                    { cuisine: 'Royal Biryani & Mughlai', share: 38, revenue: '₹3.19L', color: 'bg-orange-500' },
                    { cuisine: 'Pizzas & Italian Pastas', share: 24, revenue: '₹2.01L', color: 'bg-amber-500' },
                    { cuisine: 'Burgers & Fast Food', share: 18, revenue: '₹1.51L', color: 'bg-blue-500' },
                    { cuisine: 'Chinese & Asian Noodles', share: 12, revenue: '₹1.01L', color: 'bg-emerald-500' },
                    { cuisine: 'Desserts, Cafe & Bakery', share: 8, revenue: '₹0.67L', color: 'bg-purple-500' },
                  ].map((row) => (
                    <div key={row.cuisine} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-800">{row.cuisine}</span>
                        <span className="text-slate-500">{row.revenue} ({row.share}%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${row.color} rounded-full`} style={{ width: `${row.share}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RESTAURANT MANAGEMENT */}
        {activeTab === 'restaurants' && (
          <div className="space-y-6">
            {/* Add Restaurant Form */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Add New Restaurant Partner</h3>
              <form onSubmit={handleAddRestaurant} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Restaurant Name (e.g. Tandoor Express)"
                  value={newRestName}
                  onChange={(e) => setNewRestName(e.target.value)}
                  className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
                <input
                  type="text"
                  placeholder="Cuisines (e.g. North Indian, Kebab)"
                  value={newRestCuisine}
                  onChange={(e) => setNewRestCuisine(e.target.value)}
                  className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
                <input
                  type="number"
                  placeholder="Cost for two (₹)"
                  value={newRestPrice}
                  onChange={(e) => setNewRestPrice(Number(e.target.value))}
                  className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus size={14} /> Add Partner
                </button>
              </form>
            </div>

            {/* Restaurant List */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Partner Restaurants Directory
                </h4>
                <span className="text-xs text-slate-400">{restaurantsList.length} Active Kitchens</span>
              </div>

              <div className="divide-y divide-slate-100">
                {restaurantsList.map((r) => (
                  <div key={r.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <img src={r.image} alt={r.name} className="w-12 h-12 rounded-2xl object-cover" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-slate-900">{r.name}</h5>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            r.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {r.isOpen ? 'Open' : 'Deactivated'}
                          </span>
                        </div>
                        <p className="text-slate-500 mt-0.5">{r.cuisine.join(', ')} • ₹{r.priceForTwo} for two</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleRestaurantStatus(r.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                          r.isOpen
                            ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        }`}
                      >
                        {r.isOpen ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => navigateTo('restaurant', { restaurantId: r.id })}
                        className="px-3 py-1.5 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50"
                      >
                        View Menu
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FOOD MENU MANAGEMENT */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            {/* Add Dish Form */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Add New Food Item</h3>
              <form onSubmit={handleAddFood} className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Dish Name"
                  value={newFoodName}
                  onChange={(e) => setNewFoodName(e.target.value)}
                  className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
                <input
                  type="number"
                  placeholder="Price (₹)"
                  value={newFoodPrice}
                  onChange={(e) => setNewFoodPrice(Number(e.target.value))}
                  className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
                <select
                  value={newFoodCat}
                  onChange={(e) => setNewFoodCat(e.target.value)}
                  className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Biryani">Biryani</option>
                  <option value="Burgers">Burgers</option>
                  <option value="Pizza">Pizza</option>
                  <option value="Main Course">Main Course</option>
                  <option value="Starters">Starters</option>
                  <option value="Desserts">Desserts</option>
                </select>
                <label className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newFoodVeg}
                    onChange={(e) => setNewFoodVeg(e.target.checked)}
                  />
                  <span>Pure Veg Item</span>
                </label>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus size={14} /> Add Item
                </button>
              </form>
            </div>

            {/* Menu List */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Menu Items Catalog ({menuList.length})
                </h4>
              </div>

              <div className="divide-y divide-slate-100">
                {menuList.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-xs border ${item.isVeg ? 'border-emerald-600' : 'border-rose-600'} flex items-center justify-center`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`}></span>
                          </span>
                          <span className="font-bold text-slate-900">{item.name}</span>
                          <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-slate-500 mt-0.5 line-clamp-1">{item.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-extrabold text-slate-900">{formatPrice(item.price)}</span>
                      <button
                        onClick={() => handleDeleteFood(item.id)}
                        className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50"
                        title="Delete item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ORDER MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Live Customer Orders Feed
              </h4>
            </div>

            <div className="divide-y divide-slate-100">
              {adminOrders.map((ord) => (
                <div key={ord.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">#{ord.id}</span>
                      <span className="text-slate-400">•</span>
                      <span className="font-semibold text-slate-800">{ord.customer}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-600">{ord.restaurant}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">Placed at {ord.time}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-slate-900">{formatPrice(ord.amount)}</span>

                    {/* Status updater dropdown */}
                    <select
                      value={ord.status}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs border ${
                        ord.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : ord.status === 'Out for Delivery'
                          ? 'bg-orange-50 text-orange-800 border-orange-200'
                          : 'bg-blue-50 text-blue-800 border-blue-200'
                      }`}
                    >
                      <option value="Placed">Placed</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                User Accounts &amp; Role Management
              </h4>
            </div>

            <div className="divide-y divide-slate-100">
              {userList.map((u) => (
                <div key={u.id} className="p-4 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{u.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {u.role}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">{u.email}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">{u.orders} orders</span>
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      {u.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: OFFERS & COUPONS */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Create New Promo Voucher</h3>
              <form onSubmit={handleAddCoupon} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Coupon Code (e.g. FLASH50)"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl uppercase font-mono font-bold"
                />
                <input
                  type="number"
                  placeholder="Discount Amount (₹)"
                  value={newCouponDiscount}
                  onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                  className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
                <input
                  type="number"
                  placeholder="Min Order (₹)"
                  value={newCouponMin}
                  onChange={(e) => setNewCouponMin(Number(e.target.value))}
                  className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus size={14} /> Launch Coupon
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {couponsList.map((c) => (
                <div key={c.code} className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
                  <span className="font-mono text-xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {c.code}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mt-2">{c.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1">{c.description}</p>
                  <span className="text-[10px] text-slate-400 block mt-2">
                    Min Order: ₹{c.minOrder} • Exp: {c.expiresAt}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
