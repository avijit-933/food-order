import React, { useState } from 'react';
import { MapPin, Navigation, ZoomIn, ZoomOut, Compass } from 'lucide-react';

interface InteractiveMapProps {
  lat: number;
  lng: number;
  height?: string;
  zoom?: number;
  label?: string;
  isDraggable?: boolean;
  onLocationChange?: (lat: number, lng: number) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  lat,
  lng,
  height = '240px',
  zoom = 15,
  label = 'Delivery Location',
  isDraggable = true,
  onLocationChange,
}) => {
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [pinOffset, setPinOffset] = useState({ x: 0, y: 0 });

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggable) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPinOffset({ x, y });

    // Approximate lat/lng delta based on offset
    const deltaLat = -(y / 200) * 0.005;
    const deltaLng = (x / 200) * 0.005;
    if (onLocationChange) {
      onLocationChange(Number((lat + deltaLat).toFixed(4)), Number((lng + deltaLng).toFixed(4)));
    }
  };

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-gray-200 select-none shadow-inner group"
      style={{ height }}
      onClick={handleMapClick}
    >
      {/* Map Vector / Stylized Street Background */}
      <div className="absolute inset-0 bg-[#e8ece9] overflow-hidden">
        {/* River */}
        <svg className="absolute inset-0 w-full h-full opacity-70" preserveAspectRatio="none">
          <path
            d="M -50 80 Q 150 140 300 110 T 600 170 T 900 120"
            fill="none"
            stroke="#aadaff"
            strokeWidth="38"
          />
          <path
            d="M -50 80 Q 150 140 300 110 T 600 170 T 900 120"
            fill="none"
            stroke="#c8e4fc"
            strokeWidth="32"
          />
        </svg>

        {/* Parks & Greens */}
        <div className="absolute top-4 left-6 w-28 h-24 bg-[#cbe6a3]/70 rounded-3xl -rotate-6"></div>
        <div className="absolute bottom-6 right-10 w-36 h-28 bg-[#cbe6a3]/60 rounded-full"></div>
        <div className="absolute top-20 right-28 w-20 h-20 bg-[#cbe6a3]/50 rounded-2xl rotate-12"></div>

        {/* Roads Grid */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          {/* Main Avenues */}
          <line x1="0" y1="35%" x2="100%" y2="35%" stroke="#ffffff" strokeWidth="8" />
          <line x1="0" y1="35%" x2="100%" y2="35%" stroke="#fed7aa" strokeWidth="4" />

          <line x1="0" y1="70%" x2="100%" y2="70%" stroke="#ffffff" strokeWidth="7" />
          <line x1="0" y1="70%" x2="100%" y2="70%" stroke="#fed7aa" strokeWidth="3" />

          <line x1="28%" y1="0" x2="28%" y2="100%" stroke="#ffffff" strokeWidth="8" />
          <line x1="28%" y1="0" x2="28%" y2="100%" stroke="#fed7aa" strokeWidth="4" />

          <line x1="68%" y1="0" x2="68%" y2="100%" stroke="#ffffff" strokeWidth="7" />
          <line x1="68%" y1="0" x2="68%" y2="100%" stroke="#e2e8f0" strokeWidth="3" />

          {/* Cross Streets */}
          <line x1="10%" y1="0" x2="90%" y2="100%" stroke="#ffffff" strokeWidth="4" opacity="0.8" />
          <line x1="85%" y1="0" x2="15%" y2="100%" stroke="#ffffff" strokeWidth="3" opacity="0.6" />
        </svg>

        {/* Street Labels */}
        <span className="absolute top-[32%] left-[12%] text-[10px] font-semibold text-gray-500 tracking-wider uppercase bg-white/70 px-1 rounded pointer-events-none">
          Grand Trunk Rd
        </span>
        <span className="absolute bottom-[28%] right-[16%] text-[10px] font-semibold text-gray-500 tracking-wider uppercase bg-white/70 px-1 rounded pointer-events-none">
          Station Link Way
        </span>
      </div>

      {/* Target Marker Pin */}
      <div
        className="absolute z-10 flex flex-col items-center pointer-events-none transition-transform duration-150"
        style={{
          top: `calc(50% + ${pinOffset.y}px)`,
          left: `calc(50% + ${pinOffset.x}px)`,
          transform: 'translate(-50%, -100%)',
        }}
      >
        <div className="bg-gray-900 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap mb-1 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping"></span>
          {label}
        </div>
        <div className="relative">
          <MapPin size={34} className="text-orange-600 fill-orange-500 drop-shadow-lg" />
        </div>
        <div className="w-3 h-1 bg-black/30 rounded-full blur-[1px]"></div>
      </div>

      {/* Map Control Buttons */}
      <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 z-20">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setCurrentZoom((z) => Math.min(z + 1, 20));
          }}
          className="w-7 h-7 bg-white rounded-lg shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 text-xs font-bold"
          title="Zoom In"
        >
          <ZoomIn size={14} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setCurrentZoom((z) => Math.max(z - 1, 10));
          }}
          className="w-7 h-7 bg-white rounded-lg shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 text-xs font-bold"
          title="Zoom Out"
        >
          <ZoomOut size={14} />
        </button>
      </div>

      {/* Compass / Recenter */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm border border-gray-200 text-[11px] font-medium text-gray-700">
        <Navigation size={12} className="text-orange-500" />
        <span>{lat.toFixed(4)}, {lng.toFixed(4)}</span>
        {isDraggable && <span className="text-[10px] text-gray-400 font-normal">· Click to move pin</span>}
      </div>

      {/* Google Maps / OpenStreetMap Attribution watermark */}
      <div className="absolute bottom-1 left-2 text-[9px] text-gray-400 pointer-events-none select-none">
        Map data © FoodieGo Maps • Google Maps API Ready
      </div>
    </div>
  );
};
