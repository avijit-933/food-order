import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Address } from '../../types';
import { InteractiveMap } from '../map/InteractiveMap';
import { X, Navigation, Home, Briefcase, MapPin, Plus, Check, Loader2 } from 'lucide-react';

export const LocationPickerModal: React.FC = () => {
  const {
    isLocationPickerOpen,
    setIsLocationPickerOpen,
    selectedAddress,
    setSelectedAddress,
    savedAddresses,
    addNewAddress,
    detectLocation,
    isDetectingLocation,
    showToast,
  } = useApp();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Avijit Jana',
    phone: '+91 98765 43210',
    houseFlat: '',
    street: '',
    landmark: '',
    city: 'Dantan',
    state: 'West Bengal',
    pinCode: '721426',
    type: 'Home' as 'Home' | 'Work' | 'Other',
    lat: 21.9622,
    lng: 87.2711,
  });

  if (!isLocationPickerOpen) return null;

  const handleSubmitNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.houseFlat || !formData.street) {
      showToast('Missing details', 'Please enter your flat/house and street', 'error');
      return;
    }

    await addNewAddress({
      name: formData.name,
      phone: formData.phone,
      houseFlat: formData.houseFlat,
      street: formData.street,
      landmark: formData.landmark,
      city: formData.city,
      state: formData.state,
      pinCode: formData.pinCode,
      type: formData.type,
      coordinates: {
        lat: formData.lat,
        lng: formData.lng,
      },
    });

    setIsAddingNew(false);
    setIsLocationPickerOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 relative">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex items-center justify-between z-10">
          <div>
            <h3 className="text-xl font-bold text-gray-900 font-display">Select Delivery Address</h3>
            <p className="text-xs text-gray-500">Pick where your delicious food will be delivered</p>
          </div>
          <button
            onClick={() => {
              setIsLocationPickerOpen(false);
              setIsAddingNew(false);
            }}
            className="p-2 text-gray-400 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {!isAddingNew ? (
            <>
              {/* Use current location button */}
              <button
                type="button"
                onClick={detectLocation}
                disabled={isDetectingLocation}
                className="w-full p-4 rounded-2xl border border-orange-200 bg-orange-50/60 hover:bg-orange-50 transition-colors flex items-center justify-between group cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                    {isDetectingLocation ? <Loader2 size={18} className="animate-spin" /> : <Navigation size={18} />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Use current location</h4>
                    <p className="text-xs text-gray-500">Using high accuracy GPS & Google Geocoding</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-orange-600">Detect</span>
              </button>

              {/* Saved Addresses list */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Saved Addresses</h4>
                <div className="space-y-3">
                  {savedAddresses.map((addr) => {
                    const isSelected = selectedAddress.id === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => {
                          setSelectedAddress(addr);
                          showToast('Delivery address updated', `${addr.type} selected`, 'info');
                          setIsLocationPickerOpen(false);
                        }}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50/20 ring-1 ring-orange-500'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center mt-0.5 ${
                            addr.type === 'Home' ? 'bg-blue-100 text-blue-600' :
                            addr.type === 'Work' ? 'bg-purple-100 text-purple-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {addr.type === 'Home' ? <Home size={18} /> :
                             addr.type === 'Work' ? <Briefcase size={18} /> :
                             <MapPin size={18} />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-gray-900">{addr.type}</span>
                              {isSelected && (
                                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Check size={10} /> Active
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-700 font-medium mt-0.5">{addr.houseFlat}, {addr.street}</p>
                            <p className="text-xs text-gray-500">{addr.landmark ? `${addr.landmark}, ` : ''}{addr.city}, {addr.state} - {addr.pinCode}</p>
                            <p className="text-[11px] text-gray-400 mt-1">Contact: {addr.phone}</p>
                          </div>
                        </div>

                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-orange-500 bg-orange-500 text-white' : 'border-gray-300'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Add New Address Button */}
              <button
                type="button"
                onClick={() => setIsAddingNew(true)}
                className="w-full py-3.5 border-2 border-dashed border-gray-300 rounded-2xl text-sm font-semibold text-gray-700 hover:border-orange-500 hover:text-orange-600 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus size={18} />
                Add New Delivery Address
              </button>
            </>
          ) : (
            /* NEW ADDRESS FORM */
            <form onSubmit={handleSubmitNewAddress} className="space-y-4">
              <div className="flex items-center justify-between pb-1">
                <h4 className="text-sm font-bold text-gray-900">Pinpoint on Google Map</h4>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="text-xs text-orange-600 font-semibold hover:underline"
                >
                  Back to list
                </button>
              </div>

              {/* Interactive Map Picker */}
              <InteractiveMap
                lat={formData.lat}
                lng={formData.lng}
                height="180px"
                label="Selected Location"
                isDraggable={true}
                onLocationChange={(newLat, newLng) => {
                  setFormData((prev) => ({ ...prev, lat: newLat, lng: newLng }));
                }}
              />

              {/* Address Type Selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Save Address As</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Home', 'Work', 'Other'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, type }))}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                        formData.type === type
                          ? 'border-orange-500 bg-orange-50 text-orange-600 font-bold'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {type === 'Home' && <Home size={14} />}
                      {type === 'Work' && <Briefcase size={14} />}
                      {type === 'Other' && <MapPin size={14} />}
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Receiver Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">House / Flat / Floor / Building *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 302, Royal Palms Apartment"
                  value={formData.houseFlat}
                  onChange={(e) => setFormData({ ...formData, houseFlat: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Street / Area / Locality *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Station Road, Greenfield Zone"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Landmark</label>
                  <input
                    type="text"
                    placeholder="Near temple"
                    value={formData.landmark}
                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">PIN Code</label>
                  <input
                    type="text"
                    required
                    value={formData.pinCode}
                    onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20"
                >
                  Save & Deliver Here
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
