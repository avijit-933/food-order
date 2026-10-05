import React from 'react';
import { useApp } from '../../context/AppContext';
import { Heart, ShieldCheck, Clock, Award, PhoneCall, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-24 md:pb-12 mt-20 text-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value proposition badges */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-gray-100">
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-orange-50/50">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">Express Delivery</h4>
              <p className="text-[11px] text-gray-500">Average 25 min doorstep arrival</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-emerald-50/50">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">100% Hygienic Food</h4>
              <p className="text-[11px] text-gray-500">Rigorous kitchen safety audits</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-amber-50/50">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <Award size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">Curated Flavors</h4>
              <p className="text-[11px] text-gray-500">Top rated local culinary legends</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-blue-50/50">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <PhoneCall size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">24/7 Live Support</h4>
              <p className="text-[11px] text-gray-500">Instant resolution via support team</p>
            </div>
          </div>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-12">
          {/* Brand */}
          <div className="col-span-2">
            <div
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2 cursor-pointer mb-3"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-400 flex items-center justify-center text-white font-bold text-sm font-display">
                FG
              </div>
              <span className="text-xl font-black text-gray-900 font-display">
                Foodie<span className="text-orange-500">Go</span>
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed max-w-sm mb-4">
              Good food. Great mood. Discover authentic flavors, chef specials, and rapid delivery from the finest restaurants in your town.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <MapPin size={14} className="text-orange-500" />
              <span>Dantan, Paschim Medinipur, West Bengal 721426</span>
            </div>
          </div>

          {/* Column 1 */}
          <div>
            <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Company</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigateTo('home')} className="hover:text-orange-600">About Us</button>
              </li>
              <li>
                <button onClick={() => navigateTo('admin')} className="hover:text-orange-600">Admin Console</button>
              </li>
              <li>
                <button onClick={() => navigateTo('delivery-panel')} className="hover:text-orange-600">Delivery Partner</button>
              </li>
              <li>
                <button onClick={() => navigateTo('support')} className="hover:text-orange-600">Help & Support</button>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Popular Cuisines</h5>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => navigateTo('search')} className="hover:text-orange-600">Dum Biryani</button></li>
              <li><button onClick={() => navigateTo('search')} className="hover:text-orange-600">Artisan Pizzas</button></li>
              <li><button onClick={() => navigateTo('search')} className="hover:text-orange-600">Gourmet Burgers</button></li>
              <li><button onClick={() => navigateTo('search')} className="hover:text-orange-600">Hakka Chinese</button></li>
              <li><button onClick={() => navigateTo('search')} className="hover:text-orange-600">North Indian Curries</button></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">We Deliver To</h5>
            <ul className="space-y-2 text-xs">
              <li className="text-gray-600">Dantan Central</li>
              <li className="text-gray-600">Station Bazar</li>
              <li className="text-gray-600">Greenfield Enclave</li>
              <li className="text-gray-600">College Link Road</li>
              <li className="text-gray-600">Kolkata Sector V</li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© 2026 FoodieGo Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart size={12} className="text-rose-500 fill-rose-500" />
            <span>for passionate food lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
