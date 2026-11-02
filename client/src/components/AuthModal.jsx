import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';
import { useShop } from '../context/useShop';

export const AuthModal = () => {
  const { isAuthOpen, setIsAuthOpen, login, showToast } = useShop();

  const [mode, setMode] = useState('login'); // 'login', 'signup', 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), password })
        });
        const data = await res.json();
        if (data.success) {
          login(data.user, data.token);
          showToast('Welcome', `Signed in as ${data.user.name}`, 'gold');
        } else {
          setErrorMsg(data.message || 'Login failed. Please check credentials.');
        }
      } else if (mode === 'signup') {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name.trim(), email: email.trim(), password, phone: phone.trim() })
        });
        const data = await res.json();
        if (data.success) {
          login(data.user, data.token);
          showToast('Account Created', `Welcome to Tiwari Jewellers, ${data.user.name}`, 'gold');
        } else {
          setErrorMsg(data.message || 'Registration failed. Please check inputs.');
        }
      } else if (mode === 'forgot') {
        showToast('Password Reset', `If an account exists for ${email}, a reset link has been dispatched.`, 'gold');
        setMode('login');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-ivory-300 relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsAuthOpen(false)}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-ivory flex items-center justify-center text-charcoal-400 hover:text-burgundy transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Bar */}
        <div className="bg-burgundy text-white p-6 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="font-serif text-2xl font-bold text-ivory tracking-wide">
              TIWARI JWELLERS
            </h2>
            <p className="text-[10px] tracking-widest text-gold-300 uppercase mt-0.5">
              Patron Portal & Privilege Access
            </p>
          </div>
          <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-gold/15 rounded-full blur-xl pointer-events-none"></div>
        </div>

        {/* Tab Toggle */}
        {mode !== 'forgot' && (
          <div className="flex border-b border-ivory-200 bg-ivory/40">
            <button
              onClick={() => { setMode('login'); setErrorMsg(''); }}
              className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
                mode === 'login'
                  ? 'border-b-2 border-burgundy text-burgundy bg-white'
                  : 'text-charcoal-400 hover:text-charcoal'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setErrorMsg(''); }}
              className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
                mode === 'signup'
                  ? 'border-b-2 border-burgundy text-burgundy bg-white'
                  : 'text-charcoal-400 hover:text-charcoal'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-semibold text-charcoal uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Radhika Kapoor"
                    className="w-full pl-9 pr-3 py-2.5 text-xs border border-ivory-300 rounded-xl outline-none focus:border-burgundy"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-charcoal uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patron@example.com"
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-ivory-300 rounded-xl outline-none focus:border-burgundy"
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-semibold text-charcoal uppercase tracking-wider mb-1">
                  Contact Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2.5 text-xs border border-ivory-300 rounded-xl outline-none focus:border-burgundy"
                  />
                </div>
              </div>
            )}

            {mode !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[11px] font-semibold text-charcoal uppercase tracking-wider">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] text-burgundy hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-xs border border-ivory-300 rounded-xl outline-none focus:border-burgundy"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-burgundy hover:bg-burgundy-600 text-gold-200 font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span>Please wait...</span>
              ) : mode === 'login' ? (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              ) : mode === 'signup' ? (
                <>Create Patron Account <ArrowRight className="w-4 h-4" /></>
              ) : (
                <>Send Reset Link <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {mode === 'forgot' && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setMode('login')}
                className="text-xs text-burgundy hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
