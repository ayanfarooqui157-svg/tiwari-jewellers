import React, { useState } from 'react';
import { Sparkles, ArrowRight, Copy, Check } from 'lucide-react';
import { useShop } from '../context/useShop';

export const PromotionalBanner = () => {
  const { navigateToCategory, showToast } = useShop();
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText('TIWARI10');
    setCopied(true);
    showToast('Code Copied', 'Promo code TIWARI10 copied to clipboard!', 'gold');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 sm:py-20 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-burgundy text-white shadow-2xl">
          {/* Background image & gradient overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1600&q=80"
              alt="Promotional background"
              className="w-full h-full object-cover object-right opacity-30 mix-blend-luminosity scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-burgundy via-burgundy/90 to-transparent"></div>
          </div>

          <div className="relative z-10 px-8 py-16 sm:px-14 sm:py-20 lg:py-24 max-w-2xl">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/20 border border-gold/40 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-gold-300" />
              <span className="text-[11px] font-semibold tracking-widest text-gold-200 uppercase font-sans">
                Festive Splendour Offer
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-ivory tracking-tight mb-4 leading-tight">
              Make Every Moment Special
            </h2>

            {/* Subtext */}
            <p className="text-sm sm:text-base text-ivory/80 font-sans font-light leading-relaxed mb-8">
              Celebrate weddings, festivals and milestones with handcrafted pure gold and natural solitaire jewellery. Receive up to 15% off on making charges plus complimentary insurance.
            </p>

            {/* Promo Code Box */}
            <div className="inline-flex items-center gap-3 p-2 pr-4 bg-white/10 backdrop-blur-md rounded-2xl border border-gold/40 mb-8">
              <div className="px-3.5 py-1.5 rounded-xl bg-gold text-burgundy-950 font-mono font-bold text-xs tracking-wider">
                TIWARI10
              </div>
              <span className="text-xs text-ivory/90 font-medium">
                Get 10% Off Your Purchase
              </span>
              <button
                onClick={copyCode}
                className="ml-2 text-gold-300 hover:text-white p-1 transition-colors"
                title="Copy Code"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigateToCategory('all')}
                className="px-8 py-4 bg-gold hover:bg-gold-600 text-burgundy-950 font-sans font-semibold text-xs uppercase tracking-widest rounded-full transition-all duration-300 shadow-lg hover:shadow-gold/30 flex items-center gap-2 group"
              >
                <span>Shop the Festive Edit</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
