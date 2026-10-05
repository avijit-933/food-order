import React, { useEffect, useState } from 'react';
import { Bike, MapPin, Store, Navigation } from 'lucide-react';

interface DeliveryRouteMapProps {
  restaurantName: string;
  customerAddress: string;
  orderStatus: string;
  height?: string;
}

export const DeliveryRouteMap: React.FC<DeliveryRouteMapProps> = ({
  restaurantName,
  customerAddress,
  orderStatus,
  height = '320px',
}) => {
  // Rider position from 0 (at restaurant) to 100 (at customer)
  const [riderProgress, setRiderProgress] = useState(65);

  useEffect(() => {
    if (orderStatus === 'Placed' || orderStatus === 'Confirmed') {
      setRiderProgress(10);
    } else if (orderStatus === 'Preparing') {
      setRiderProgress(25);
    } else if (orderStatus === 'Out for Delivery') {
      const interval = setInterval(() => {
        setRiderProgress((prev) => {
          if (prev >= 88) return 50;
          return prev + 1;
        });
      }, 800);
      return () => clearInterval(interval);
    } else if (orderStatus === 'Delivered') {
      setRiderProgress(100);
    }
  }, [orderStatus]);

  // Coordinates on SVG curve from (80, 240) to (520, 80)
  // Simple cubic bezier curve approximation for visual beauty
  const t = riderProgress / 100;
  // Start: (100, 240) -> Control 1: (200, 80) -> Control 2: (400, 260) -> End: (520, 90)
  const p0 = { x: 100, y: 240 };
  const p1 = { x: 220, y: 70 };
  const p2 = { x: 380, y: 240 };
  const p3 = { x: 520, y: 90 };

  const cx =
    Math.pow(1 - t, 3) * p0.x +
    3 * Math.pow(1 - t, 2) * t * p1.x +
    3 * (1 - t) * Math.pow(t, 2) * p2.x +
    Math.pow(t, 3) * p3.x;

  const cy =
    Math.pow(1 - t, 3) * p0.y +
    3 * Math.pow(1 - t, 2) * t * p1.y +
    3 * (1 - t) * Math.pow(t, 2) * p2.y +
    Math.pow(t, 3) * p3.y;

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-gray-200 select-none shadow-sm group"
      style={{ height }}
    >
      {/* Background Cartography */}
      <div className="absolute inset-0 bg-[#eef1eb] overflow-hidden">
        {/* River */}
        <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 600 320" preserveAspectRatio="none">
          <path
            d="M -20 180 Q 140 220 280 160 T 620 140"
            fill="none"
            stroke="#b3dcfa"
            strokeWidth="34"
          />
        </svg>

        {/* Parks */}
        <div className="absolute top-10 left-12 w-32 h-24 bg-[#c8e6a5]/60 rounded-3xl -rotate-6"></div>
        <div className="absolute bottom-6 right-20 w-40 h-28 bg-[#c8e6a5]/50 rounded-full"></div>

        {/* City Blocks Grid */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 320" preserveAspectRatio="none">
          {/* Arterial Roads */}
          <line x1="0" y1="90" x2="600" y2="90" stroke="#ffffff" strokeWidth="8" />
          <line x1="0" y1="90" x2="600" y2="90" stroke="#fcd34d" strokeWidth="3" />

          <line x1="0" y1="240" x2="600" y2="240" stroke="#ffffff" strokeWidth="8" />
          <line x1="0" y1="240" x2="600" y2="240" stroke="#fcd34d" strokeWidth="3" />

          <line x1="160" y1="0" x2="160" y2="320" stroke="#ffffff" strokeWidth="7" />
          <line x1="440" y1="0" x2="440" y2="320" stroke="#ffffff" strokeWidth="7" />

          {/* Delivery Route Polyline */}
          <path
            d="M 100 240 C 220 70, 380 240, 520 90"
            fill="none"
            stroke="#ea580c"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="8 6"
            className="animate-pulse"
          />
        </svg>
      </div>

      {/* Floating Info Overlay */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-20 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-md border border-gray-100 flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <div>
            <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Live ETA</div>
            <div className="text-xs font-bold text-gray-900">18–22 mins away • 2.4 km</div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-gray-100 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
          <Navigation size={14} className="text-orange-500" />
          <span>Real-time GPS</span>
        </div>
      </div>

      {/* Restaurant Pin (Origin) */}
      <div
        className="absolute z-10 flex flex-col items-center pointer-events-none"
        style={{ left: '100px', top: '240px', transform: 'translate(-50%, -100%)' }}
      >
        <div className="bg-white px-2 py-0.5 rounded-md shadow text-[10px] font-bold text-gray-800 whitespace-nowrap mb-1 border border-gray-100">
          {restaurantName}
        </div>
        <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
          <Store size={16} />
        </div>
      </div>

      {/* Moving Delivery Partner Bike (Courier) */}
      <div
        className="absolute z-20 flex flex-col items-center pointer-events-none transition-all duration-300"
        style={{
          left: `${(cx / 600) * 100}%`,
          top: `${(cy / 320) * 100}%`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-xl border-2 border-white animate-bounce">
            <Bike size={18} />
          </div>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white"></span>
        </div>
      </div>

      {/* Customer Home Pin (Destination) */}
      <div
        className="absolute z-10 flex flex-col items-center pointer-events-none"
        style={{ left: '520px', top: '90px', transform: 'translate(-50%, -100%)' }}
      >
        <div className="bg-white px-2 py-0.5 rounded-md shadow text-[10px] font-bold text-gray-800 whitespace-nowrap mb-1 border border-gray-100">
          Your Location
        </div>
        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
          <MapPin size={16} />
        </div>
      </div>

      {/* Footer attribution */}
      <div className="absolute bottom-2 left-3 text-[10px] text-gray-500 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded">
        Route optimized via FoodieGo Fleet Engine
      </div>
    </div>
  );
};
