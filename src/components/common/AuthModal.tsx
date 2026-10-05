import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { X, Mail, Lock, Phone, User as UserIcon, ArrowRight, ShieldCheck, Check } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalTab,
    openAuthModal,
    closeAuthModal,
    login,
    loginWithGoogle,
    register,
    sendOtp,
    verifyOtp,
    switchRole,
  } = useAuth();
  const { showToast } = useApp();

  // Login form states
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState('avijit93326@gmail.com');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Register form states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // OTP form states
  const [otpPhone, setOtpPhone] = useState('+91 98765 43210');
  const [otpCode, setOtpCode] = useState(['1', '2', '3', '4', '5', '6']);
  const [otpStep, setOtpStep] = useState<'request' | 'verify'>('request');
  const [otpTimer, setOtpTimer] = useState(30);

  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await login({ emailOrPhone: loginEmailOrPhone, password: loginPassword });
    setLoading(false);
    if (ok) {
      showToast('Welcome back!', 'Logged in successfully as Customer', 'success');
    } else {
      showToast('Login failed', 'Please check your credentials', 'error');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      showToast('Password mismatch', 'Passwords do not match', 'error');
      return;
    }
    setLoading(true);
    const ok = await register({
      name: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
    });
    setLoading(false);
    if (ok) {
      showToast('Account created!', 'Welcome to FoodieGo', 'success');
    } else {
      showToast('Registration failed', 'Please check your inputs', 'error');
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await sendOtp(otpPhone);
    setLoading(false);
    if (ok) {
      setOtpStep('verify');
      showToast('OTP Sent', `Verification code sent to ${otpPhone}`, 'info');
      setOtpTimer(30);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpCode.join('');
    setLoading(true);
    const ok = await verifyOtp(otpPhone, fullOtp);
    setLoading(false);
    if (ok) {
      showToast('Phone verified!', 'Welcome to FoodieGo', 'success');
    } else {
      showToast('Invalid OTP', 'Please enter the 6 digit code', 'error');
    }
  };

  const handleOtpInput = (val: string, index: number) => {
    if (val.length <= 1) {
      const copy = [...otpCode];
      copy[index] = val;
      setOtpCode(copy);
      if (val && index < 5) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100 relative">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="pt-8 px-8 pb-4 text-center">
          <div className="w-12 h-12 bg-gradient-to-tr from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md shadow-orange-500/20 text-white font-bold text-xl">
            FG
          </div>
          <h3 className="text-2xl font-bold text-gray-900 font-display">
            {authModalTab === 'login' && 'Welcome to FoodieGo'}
            {authModalTab === 'register' && 'Create your account'}
            {authModalTab === 'otp' && 'Instant OTP Login'}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {authModalTab === 'login' && 'Discover the best restaurants and delicious food'}
            {authModalTab === 'register' && 'Sign up to unlock member discounts & fast delivery'}
            {authModalTab === 'otp' && 'Fast and secure passwordless access'}
          </p>

          {/* Tab Switcher */}
          <div className="flex bg-gray-100 p-1 rounded-xl mt-5">
            <button
              onClick={() => openAuthModal('login')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                authModalTab === 'login'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => openAuthModal('register')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                authModalTab === 'register'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => {
                setOtpStep('request');
                openAuthModal('otp');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                authModalTab === 'otp'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              OTP Login
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="px-8 pb-8">
          {/* LOGIN VIEW */}
          {authModalTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email or Phone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    value={loginEmailOrPhone}
                    onChange={(e) => setLoginEmailOrPhone(e.target.value)}
                    placeholder="name@example.com or +91 98765..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-gray-700">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      openAuthModal('otp');
                      showToast('Use OTP', 'We recommend quick OTP sign in', 'info');
                    }}
                    className="text-xs text-orange-600 hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Signing in...' : 'Sign In'}
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* REGISTER VIEW */}
          {authModalTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <UserIcon size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Avijit Jana"
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Phone size={16} />
                  </div>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm</label>
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Confirm"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Creating Account...' : 'Agree & Create Account'}
              </button>
            </form>
          )}

          {/* OTP VIEW */}
          {authModalTab === 'otp' && (
            <div className="space-y-4">
              {otpStep === 'request' ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Mobile Number or Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Phone size={16} />
                      </div>
                      <input
                        type="text"
                        required
                        value={otpPhone}
                        onChange={(e) => setOtpPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? 'Sending OTP...' : 'Send 6-Digit Code'}
                    <ShieldCheck size={16} />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <p className="text-xs text-gray-500 text-center">
                    Enter the 6-digit code sent to <span className="font-semibold text-gray-800">{otpPhone}</span>
                  </p>
                  <div className="flex justify-between gap-1.5">
                    {otpCode.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-input-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpInput(e.target.value, idx)}
                        className="w-11 h-12 text-center text-lg font-bold bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                      />
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Code hint: 1 2 3 4 5 6</span>
                    <button
                      type="button"
                      onClick={() => setOtpTimer(30)}
                      className="text-orange-600 font-medium hover:underline"
                    >
                      Resend ({otpTimer}s)
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? 'Verifying...' : 'Verify & Continue'}
                    <Check size={16} />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Social Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-gray-400 font-medium">Or continue with</span>
            </div>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={loginWithGoogle}
            className="w-full py-2.5 px-4 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Quick Demo Switcher */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Quick Demo Role:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  switchRole('customer');
                  closeAuthModal();
                  showToast('Role: Customer', 'Browsing as standard user', 'info');
                }}
                className="text-orange-600 font-semibold hover:underline"
              >
                Customer
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => {
                  switchRole('delivery');
                  closeAuthModal();
                  showToast('Role: Delivery Partner', 'Access delivery console in navigation', 'info');
                }}
                className="text-emerald-600 font-semibold hover:underline"
              >
                Delivery
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => {
                  switchRole('admin');
                  closeAuthModal();
                  showToast('Role: Admin', 'Access admin console in navigation', 'info');
                }}
                className="text-blue-600 font-semibold hover:underline"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
