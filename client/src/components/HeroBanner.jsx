import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Shield, Award, Truck, RefreshCw } from 'lucide-react';
import { useShop } from '../context/useShop';

export const HeroBanner = () => {
  const { navigateToCategory } = useShop();

  const slides = [
    {
      id: 1,
      tag: "THE ROYAL HERITAGE EDIT",
      title: "Timeless Beauty.\nUnforgettable Elegance.",
      subtitle: "Discover masterfully handcrafted 22K gold, certified diamonds and royal polki jewellery crafted to celebrate every precious moment.",
      ctaPrimary: "Explore Collection",
      ctaSecondary: "Shop Bestsellers",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1800&q=85",
      accent: "Handcrafted 22K Hallmarked Gold"
    },
    {
      id: 2,
      tag: "THE SOLITAIRE DIAMOND SUITE",
      title: "Pure Brilliance.\nCrafted for Eternity.",
      subtitle: "IGI-certified conflict-free solitaires set in 18K gold. Designed to shimmer with unmatched fire and clarity.",
      ctaPrimary: "Explore Solitaires",
      ctaSecondary: "View Diamond Bands",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1800&q=85",
      accent: "VVS-VS Triple Excellent Cut Diamonds"
    }
  ];

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[activeSlide];

  return (
    <section className="relative overflow-hidden bg-burgundy-900 text-white">
      {/* Background Hero Image with Deep Burgundy Vignette Gradient */}
      <div className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src={slide.image}
            alt="Tiwari Jewellers Luxury Jewellery"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Multi-layered luxury gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-burgundy-950 via-burgundy-900/85 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-burgundy-950/80"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-28">
          <div className="max-w-2xl">
            {/* Royal Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-gold/20 border border-gold/40 backdrop-blur-md mb-4 sm:mb-6 animate-in fade-in slide-in-from-bottom-2">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold-300" />
              <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-widest text-gold-200 uppercase">
                {slide.tag}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-ivory tracking-tight leading-[1.2] sm:leading-[1.15] mb-4 sm:mb-6 whitespace-pre-line drop-shadow-md">
              {slide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-lg text-ivory/85 font-sans font-light leading-relaxed mb-6 sm:mb-8 max-w-xl">
              {slide.subtitle}
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <button
                onClick={() => navigateToCategory('all')}
                className="px-6 sm:px-8 py-3.5 sm:py-4 bg-gold hover:bg-gold-600 text-burgundy-950 font-sans font-semibold text-xs uppercase tracking-widest rounded-full transition-all duration-300 shadow-lg hover:shadow-gold/30 hover:scale-[1.02] flex items-center justify-center gap-2 group"
              >
                <span>{slide.ctaPrimary}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigateToCategory('all')}
                className="px-6 sm:px-8 py-3.5 sm:py-4 bg-white/10 hover:bg-white/20 text-ivory border border-gold/40 hover:border-gold font-sans font-semibold text-xs uppercase tracking-widest rounded-full backdrop-blur-sm transition-all duration-300 flex items-center justify-center"
              >
                {slide.ctaSecondary}
              </button>
            </div>

            {/* Small Accent highlight */}
            <div className="mt-10 flex items-center gap-3 text-xs text-gold-200/90 font-medium">
              <span className="w-8 h-[1px] bg-gold/60"></span>
              <span>{slide.accent}</span>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 right-8 z-20 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                activeSlide === i ? 'w-8 bg-gold' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Trust Badges Bar below Hero */}
      <div className="bg-white border-y border-ivory-300/80 py-4 sm:py-5 text-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-burgundy/10 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-burgundy" />
              </div>
              <div>
                <h4 className="text-[11px] sm:text-xs font-bold text-charcoal uppercase tracking-wider">100% BIS Hallmarked</h4>
                <p className="text-[10px] sm:text-[11px] text-charcoal-400">Government Certified Purity</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-gold-700" />
              </div>
              <div>
                <h4 className="text-[11px] sm:text-xs font-bold text-charcoal uppercase tracking-wider">IGI Certified Diamonds</h4>
                <p className="text-[10px] sm:text-[11px] text-charcoal-400">Natural & Conflict-Free</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-burgundy/10 flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-burgundy" />
              </div>
              <div>
                <h4 className="text-[11px] sm:text-xs font-bold text-charcoal uppercase tracking-wider">Insured Fast Delivery</h4>
                <p className="text-[10px] sm:text-[11px] text-charcoal-400">Pan-India Tamper-Proof Vault</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-gold-700" />
              </div>
              <div>
                <h4 className="text-[11px] sm:text-xs font-bold text-charcoal uppercase tracking-wider">Lifetime Exchange</h4>
                <p className="text-[10px] sm:text-[11px] text-charcoal-400">15-Day Hassle-Free Returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
