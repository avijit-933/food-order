import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  HelpCircle,
  MessageSquare,
  Package,
  CreditCard,
  Bike,
  Sparkles,
  Send,
  ChevronDown,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';

export const SupportPage: React.FC = () => {
  const { showToast } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('Order issue');
  const [complaintSubject, setComplaintSubject] = useState('');
  const [complaintMessage, setComplaintMessage] = useState('');
  const [tickets, setTickets] = useState<{ id: string; subject: string; status: string }[]>([
    { id: 'TKT-8419', subject: 'Previous delivery late by 15 mins (Resolved with ₹50 credit)', status: 'Resolved' },
  ]);

  // Live Chat Assistant
  const [chatMessages, setChatMessages] = useState<{ sender: 'bot' | 'user'; text: string }[]>([
    { sender: 'bot', text: 'Hello Avijit! How can FoodieGo Support assist your culinary journey today?' },
  ]);
  const [chatInput, setChatInput] = useState('');

  // FAQ open state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const categories = [
    { title: 'Order issue', icon: Package, desc: 'Wrong item, missing dish, cancelled order' },
    { title: 'Payment issue', icon: CreditCard, desc: 'Double charged, UPI pending, refund status' },
    { title: 'Delivery issue', icon: Bike, desc: 'Rider delayed, wrong delivery address' },
    { title: 'Food quality', icon: Sparkles, desc: 'Spillages, taste grievance, cold food' },
  ];

  const faqs = [
    {
      q: 'How long does a refund take to reflect in my bank account?',
      a: 'UPI refunds are processed instantly. For debit/credit cards, banks usually take 2 to 4 business days to reflect the refunded amount.',
    },
    {
      q: 'Can I change my delivery address after placing an order?',
      a: 'If your order is still in "Placed" or "Confirmed" state, our support team can redirect the courier if the new address is within 2 km of the restaurant radius.',
    },
    {
      q: 'How do promo coupons work on FoodieGo?',
      a: 'Enter valid coupon codes such as SAVE50, WELCOME100, or FEAST20 during checkout. The discount is calculated directly from your subtotal before taxes.',
    },
    {
      q: 'What should I do if my food arrived cold or damaged?',
      a: 'Please use the "Raise a Complaint" form on this page with your order details. Our team immediately issues full credits or meal replacements.',
    },
  ];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintSubject || !complaintMessage) return;

    const newTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: complaintSubject,
      status: 'Open (Agent reviewing)',
    };
    setTickets([newTicket, ...tickets]);
    setComplaintSubject('');
    setComplaintMessage('');
    showToast('Complaint ticket logged', `Ticket #${newTicket.id} created`, 'success');
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');

    setTimeout(() => {
      let reply = "Thanks for letting us know! We have connected our priority support agent to your case.";
      if (userText.toLowerCase().includes('refund')) {
        reply = "Refunds on FoodieGo are dispatched within 2 hours. Your reference ID has been verified.";
      } else if (userText.toLowerCase().includes('late') || userText.toLowerCase().includes('time')) {
        reply = "We monitor traffic in real-time. If your order exceeds 35 minutes, you receive ₹50 wallet cashback automatically!";
      } else if (userText.toLowerCase().includes('order')) {
        reply = "You can view your active live courier route anytime on the Live Tracking screen.";
      }

      setChatMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-8 mb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
              <HelpCircle size={24} />
            </div>
            <h1 className="text-2xl font-black text-gray-900 font-display">Help &amp; Support</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            24/7 dedicated customer assistance, issue resolution, and instant live chat
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Support Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.title;

            return (
              <div
                key={cat.title}
                onClick={() => setActiveCategory(cat.title)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50/30 shadow-md ring-1 ring-orange-500'
                    : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${
                  isSelected ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-600'
                }`}>
                  <Icon size={20} />
                </div>
                <h3 className="text-sm font-bold text-gray-900">{cat.title}</h3>
                <p className="text-[11px] text-gray-500 mt-1">{cat.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Complaint form & Tickets */}
          <div className="lg:col-span-7 space-y-6">
            {/* Raise Complaint Form */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
              <h3 className="text-base font-bold text-gray-900 mb-1 font-display">
                Raise an Issue: {activeCategory}
              </h3>
              <p className="text-xs text-gray-500 mb-5">
                Our operations team reviews submissions within 15 minutes
              </p>

              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={complaintSubject}
                    onChange={(e) => setComplaintSubject(e.target.value)}
                    placeholder="e.g. Missing extra sauce and cheese dip in Order #FG-10254"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Detailed Explanation</label>
                  <textarea
                    rows={4}
                    required
                    value={complaintMessage}
                    onChange={(e) => setComplaintMessage(e.target.value)}
                    placeholder="Please provide details about what happened with your meal or delivery..."
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 cursor-pointer"
                >
                  Submit Complaint Ticket
                </button>
              </form>
            </div>

            {/* Past Tickets */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FileCheck size={16} className="text-orange-500" />
                <span>Recent Support Tickets</span>
              </h3>

              <div className="space-y-2.5">
                {tickets.map((t) => (
                  <div key={t.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-200/60 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-gray-800">{t.id}</span>
                      <p className="text-gray-600 mt-0.5">{t.subject}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs Accordion */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
              <h3 className="text-base font-bold text-gray-900 mb-4 font-display">
                Frequently Asked Questions
              </h3>

              <div className="space-y-3">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={idx} className="border border-gray-100 rounded-2xl p-3.5">
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between text-left text-xs font-bold text-gray-900 cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          size={16}
                          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180 text-orange-500' : ''}`}
                        />
                      </button>
                      {isOpen && (
                        <p className="text-xs text-gray-600 mt-2 leading-relaxed pt-2 border-t border-gray-100">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: 24/7 Live Chat Assistant */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-100 shadow-md overflow-hidden flex flex-col h-[520px]">
            <div className="p-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <MessageSquare size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold">FoodieGo Instant Concierge</h4>
                <span className="text-[10px] text-white/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online Now
                </span>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/50">
              {chatMessages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-orange-500 text-white rounded-br-none'
                        : 'bg-white text-gray-800 border border-gray-200/80 rounded-bl-none shadow-2xs'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="p-3 bg-white border-t border-gray-100 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about refunds, order delay, delivery..."
                className="flex-1 px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="p-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-xs"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
