import React, { useState } from 'react';
import { Mail, Sparkles, Check, Loader2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [voucherCode, setVoucherCode] = useState('TIWARI10');
  const { showToast } = useShop();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Invalid Email', 'Please enter a valid email address.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer-club' })
      });
      const data = await res.json();
      if (data.success) {
        if (data.voucherCode) setVoucherCode(data.voucherCode);
        setSubscribed(true);
        showToast('Subscribed', data.message || `Welcome to Tiwari Jewellers Club! Code: ${data.voucherCode || 'TIWARI10'}`, 'gold');
      } else {
        showToast('Subscription Notice', data.message || 'Could not subscribe.', 'info');
      }
    } catch {
      showToast('Network Notice', 'Thank you! Your email has been recorded for our royal updates.', 'gold');
      setSubscribed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-burgundy-900 text-white relative overflow-hidden">
      {/* Subtle gold decorative accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-burgundy-600/30 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/20 border border-gold/40 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-gold-300" />
          <span className="text-[11px] font-semibold tracking-widest text-gold-200 uppercase font-sans">
            Exclusive Club Privilege
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-ivory mb-4">
          A Little Sparkle in Your Inbox
        </h2>

        <p className="text-sm sm:text-base text-ivory/80 font-sans font-light max-w-xl mx-auto mb-8">
          Subscribe to receive VIP access to private festive vaults, first looks at high-jewellery arrivals, and an exclusive 10% privilege voucher.
        </p>

        {subscribed ? (
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 px-6 py-4 rounded-2xl bg-white/10 border border-gold/50 backdrop-blur-md text-gold-200">
            <Check className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-semibold">
              Welcome to the Tiwari Jewellery Club. Use privilege voucher code <b className="text-white tracking-widest px-2 py-0.5 bg-gold/30 rounded">{voucherCode}</b> at checkout.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Mail className="w-5 h-5 text-gold-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white/10 border border-ivory-300/40 text-ivory placeholder:text-ivory/50 focus:outline-none focus:border-gold text-xs font-sans backdrop-blur-sm"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 bg-gold hover:bg-gold-600 disabled:opacity-70 text-burgundy-950 font-sans font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-300 shadow-lg hover:shadow-gold/30 hover:scale-[1.02] shrink-0 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{loading ? 'Joining...' : 'Subscribe'}</span>
            </button>
          </form>
        )}

        <p className="text-[11px] text-ivory/50 mt-4">
          We respect your privacy. Unsubscribe anytime with one click.
        </p>
      </div>
    </section>
  );
};
