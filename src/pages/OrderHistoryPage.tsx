import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useCart } from '../context/CartContext';
import { orderApi } from '../api/orderApi';
import { Order } from '../types';
import { formatPrice, formatDate } from '../utils/formatters';
import {
  Package,
  RotateCcw,
  Star,
  FileDown,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const OrderHistoryPage: React.FC = () => {
  const { navigateTo, openRatingModal, showToast } = useApp();
  const { addItem } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  useEffect(() => {
    orderApi.getAll().then(setOrders);
  }, []);

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      addItem({
        menuItem: item.menuItem,
        restaurantId: item.restaurantId,
        restaurantName: item.restaurantName,
        quantity: item.quantity,
        selectedOptions: item.selectedOptions,
        unitPrice: item.unitPrice,
      });
    });
    showToast('Items added to cart', `Reordered from ${order.restaurantName}`, 'success');
    navigateTo('checkout');
  };

  const downloadInvoice = (order: Order) => {
    setSelectedInvoiceOrder(order);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      <div className="bg-white border-b border-gray-100 py-6 mb-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Package size={24} className="text-orange-500" />
            <h1 className="text-2xl font-black text-gray-900 font-display">My Orders</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Track current deliveries, reorder previous favorites, and download tax invoices
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-5">
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs">
            <Package size={40} className="text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900">No past orders yet</h3>
            <p className="text-xs text-gray-500 mt-1 mb-5">
              Explore your favorite local dishes and satisfy your cravings today.
            </p>
            <button
              onClick={() => navigateTo('home')}
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20"
            >
              Order Now
            </button>
          </div>
        ) : (
          orders.map((order) => {
            const isLive = order.status !== 'Delivered' && order.status !== 'Cancelled';

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={order.restaurantImage}
                      alt={order.restaurantName}
                      className="w-12 h-12 rounded-2xl object-cover border border-gray-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-gray-900">{order.restaurantName}</h3>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : isLive
                              ? 'bg-orange-100 text-orange-800 animate-pulse'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Order #{order.id} • {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-extrabold text-gray-900 font-display">
                      {formatPrice(order.grandTotal)}
                    </span>
                    <span className="text-[10px] text-gray-400 block uppercase">
                      {order.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="py-4 space-y-2">
                  {order.items.map((item) => (
                    <div key={item.cartItemId} className="flex justify-between text-xs text-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{item.quantity}x</span>
                        <span>{item.menuItem.name}</span>
                      </div>
                      <span className="font-medium text-gray-900">{formatPrice(item.totalPrice)}</span>
                    </div>
                  ))}
                </div>

                {/* Rating if available */}
                {order.rating && (
                  <div className="mb-4 p-3 bg-amber-50/60 rounded-2xl border border-amber-100 text-xs">
                    <div className="flex items-center gap-1.5 text-amber-700 font-bold mb-1">
                      <Star size={13} className="fill-amber-500 text-amber-500" />
                      <span>You rated this order {order.rating.foodRating}★</span>
                    </div>
                    {order.rating.comment && (
                      <p className="text-gray-600 italic">&quot;{order.rating.comment}&quot;</p>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReorder(order)}
                      className="px-4 py-2 bg-orange-50 hover:bg-orange-500 text-orange-600 hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw size={13} />
                      <span>Reorder</span>
                    </button>

                    <button
                      onClick={() => downloadInvoice(order)}
                      className="px-3.5 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <FileDown size={13} />
                      <span>Invoice</span>
                    </button>

                    {!order.rating && order.status === 'Delivered' && (
                      <button
                        onClick={() => openRatingModal(order)}
                        className="px-3.5 py-2 border border-amber-200 text-amber-700 hover:bg-amber-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Star size={13} />
                        <span>Rate Order</span>
                      </button>
                    )}
                  </div>

                  {isLive ? (
                    <button
                      onClick={() => navigateTo('tracking', { orderId: order.id })}
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-orange-500/20"
                    >
                      <span>Track Live</span>
                      <ArrowRight size={13} />
                    </button>
                  ) : (
                    <button
                      onClick={() => navigateTo('restaurant', { restaurantId: order.restaurantId })}
                      className="text-xs font-bold text-gray-500 hover:text-orange-600"
                    >
                      View Restaurant
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Invoice Modal Simulator */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-200">
            <div className="flex justify-between items-start pb-4 border-b border-gray-200">
              <div>
                <span className="text-xl font-black font-display">
                  Foodie<span className="text-orange-500">Go</span>
                </span>
                <p className="text-[10px] text-gray-400">TAX INVOICE / BILL OF SUPPLY</p>
              </div>
              <div className="text-right text-xs">
                <p className="font-bold text-gray-900 font-mono">#{selectedInvoiceOrder.id}</p>
                <p className="text-[11px] text-gray-500">{formatDate(selectedInvoiceOrder.createdAt)}</p>
              </div>
            </div>

            <div className="py-4 text-xs space-y-1">
              <p className="font-bold text-gray-800">{selectedInvoiceOrder.restaurantName}</p>
              <p className="text-gray-500">{selectedInvoiceOrder.deliveryAddress.street}, {selectedInvoiceOrder.deliveryAddress.city}</p>
              <p className="text-gray-500">GSTIN: 19AAECF4921Q1ZG</p>
            </div>

            <div className="py-3 border-y border-gray-100 text-xs space-y-2">
              {selectedInvoiceOrder.items.map((it) => (
                <div key={it.cartItemId} className="flex justify-between">
                  <span>{it.quantity}x {it.menuItem.name}</span>
                  <span className="font-bold">{formatPrice(it.totalPrice)}</span>
                </div>
              ))}
              <div className="flex justify-between text-gray-500 pt-2 border-t border-gray-100">
                <span>Delivery Charge</span>
                <span>{formatPrice(selectedInvoiceOrder.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>CGST (2.5%) + SGST (2.5%)</span>
                <span>{formatPrice(selectedInvoiceOrder.taxes)}</span>
              </div>
              {selectedInvoiceOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Promo Discount ({selectedInvoiceOrder.appliedCoupon})</span>
                  <span>-{formatPrice(selectedInvoiceOrder.discount)}</span>
                </div>
              )}
            </div>

            <div className="py-3 flex justify-between items-center text-sm font-black text-gray-900">
              <span>Total Paid via {selectedInvoiceOrder.paymentMethod}</span>
              <span className="text-orange-600 text-base">{formatPrice(selectedInvoiceOrder.grandTotal)}</span>
            </div>

            <div className="pt-4 flex gap-2">
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 bg-orange-500 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20"
              >
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
