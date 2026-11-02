import React from 'react';
import { ShieldCheck, Award, Gem, Check } from 'lucide-react';
import { useShop } from '../context/useShop';

export const AboutPage = () => {
  const { navigateTo } = useShop();

  return (
    <div className="bg-ivory min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Editorial */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold tracking-widest text-gold-700">
            Our Ancestral Heritage
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-burgundy mt-2 mb-4">
            Elegance That Lasts Forever
          </h1>
          <p className="text-sm sm:text-base text-charcoal-600 font-sans leading-relaxed">
            Founded with an unwavering pledge to absolute purity and master craftsmanship, Tiwari Jewellers blends generations of royal Indian goldsmithing with contemporary high-jewellery aesthetics.
          </p>
        </div>

        {/* Narrative Section with Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 bg-white rounded-3xl p-8 sm:p-12 border border-ivory-300 shadow-sm">
          <div className="space-y-4 text-xs sm:text-sm text-charcoal-600 leading-relaxed font-sans">
            <span className="text-xs uppercase font-bold tracking-wider text-burgundy">The Tiwari Legacy</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">
              From Royal Courts to Modern Heirlooms
            </h2>
            <p>
              Every masterpiece that leaves our atelier carries the soul of Indian artisanship. We source only certified, ethical natural diamonds and conflict-free precious metals, subjecting each piece to rigorous spectroscopic purity assays.
            </p>
            <p>
              Unlike mass commercial jewelry, our karigars spend weeks on intricate Jadau kundan, meenakari vitreous enamelling, and precision micropave diamond settings. The result is an heirloom designed to be cherished across generations.
            </p>
            <div className="pt-2 flex flex-col gap-2 font-medium text-charcoal">
              <span className="flex items-center gap-2 text-emerald-800">
                <Check className="w-4 h-4 text-emerald-600" /> 100% BIS Hallmarked Purity Guarantee
              </span>
              <span className="flex items-center gap-2 text-emerald-800">
                <Check className="w-4 h-4 text-emerald-600" /> IGI & SGL Laboratory Certified Natural Diamonds
              </span>
              <span className="flex items-center gap-2 text-emerald-800">
                <Check className="w-4 h-4 text-emerald-600" /> Lifetime Exchange & Buyback Assurance
              </span>
            </div>
          </div>

          <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-ivory-300 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80"
              alt="Craftsmanship"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Four Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white rounded-3xl p-8 border border-ivory-300 shadow-sm text-center">
            <div className="w-14 h-14 rounded-2xl bg-burgundy/10 text-burgundy flex items-center justify-center mx-auto mb-4">
              <Gem className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-lg font-bold text-burgundy mb-2">Uncompromising Purity</h3>
            <p className="text-xs text-charcoal-500 leading-relaxed font-sans">
              Every milligram of gold is verified with state-of-the-art XRF spectrometers and government BIS Hallmarking.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-ivory-300 shadow-sm text-center">
            <div className="w-14 h-14 rounded-2xl bg-gold/15 text-gold-800 flex items-center justify-center mx-auto mb-4">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-lg font-bold text-burgundy mb-2">Master Karigars</h3>
            <p className="text-xs text-charcoal-500 leading-relaxed font-sans">
              Hand-sculpted by third-generation goldsmiths preserving Jaipur, Bengal and Rajkot ancestral techniques.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-ivory-300 shadow-sm text-center">
            <div className="w-14 h-14 rounded-2xl bg-burgundy/10 text-burgundy flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-lg font-bold text-burgundy mb-2">Transparent Pricing</h3>
            <p className="text-xs text-charcoal-500 leading-relaxed font-sans">
              Clear itemization of gold weight, diamond carat weight, gemstone value and minimal making charges.
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center">
          <button
            onClick={() => navigateTo('shop')}
            className="px-8 py-4 bg-burgundy hover:bg-burgundy-600 text-gold-200 text-xs font-bold uppercase tracking-widest rounded-full shadow-lg transition-all"
          >
            Explore the Tiwari Jewellery Vault
          </button>
        </div>
      </div>
    </div>
  );
};
