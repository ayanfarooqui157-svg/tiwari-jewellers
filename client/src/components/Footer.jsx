import React from 'react';
import { 
  Phone, Mail, MapPin, ShieldCheck, Heart, Sparkles, CreditCard, Lock
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

// Clean SVG Brand Icons
const InstagramIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const YoutubeIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
    <polygon points="10 15 15 12 10 9 10 15" fill="currentColor"/>
  </svg>
);

const TwitterIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.733 16h4.267l-11.733 -16z"/>
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>
  </svg>
);

export const Footer = () => {
  const { navigateTo, navigateToCategory } = useShop();

  return (
    <footer className="bg-charcoal text-ivory/80 pt-16 pb-12 border-t-2 border-gold/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-ivory/10">
          
          {/* Brand Info (2 cols wide on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('home')}>
              <span className="w-2.5 h-2.5 bg-gold rounded-full rotate-45" />
              <h2 className="text-2xl font-serif font-bold tracking-widest text-white uppercase">
                TIWARI JWELLERS
              </h2>
            </div>
            <p className="text-[10px] tracking-[0.25em] text-gold-400 uppercase font-sans font-semibold">
              Elegance That Lasts Forever
            </p>
            <p className="text-xs text-ivory/70 leading-relaxed font-sans max-w-sm pt-2">
              For over three generations, Tiwari Jewellers has stood as an enduring symbol of authentic Indian heritage, purity, and master jewellery craftsmanship. Handcrafting memories in pure gold, certified solitaires and heirloom polki.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href="#instagram" aria-label="Instagram" className="w-9 h-9 rounded-full bg-white/5 hover:bg-gold hover:text-burgundy-950 flex items-center justify-center transition-colors">
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a href="#facebook" aria-label="Facebook" className="w-9 h-9 rounded-full bg-white/5 hover:bg-gold hover:text-burgundy-950 flex items-center justify-center transition-colors">
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a href="#youtube" aria-label="YouTube" className="w-9 h-9 rounded-full bg-white/5 hover:bg-gold hover:text-burgundy-950 flex items-center justify-center transition-colors">
                <YoutubeIcon className="w-4 h-4" />
              </a>
              <a href="#twitter" aria-label="X Twitter" className="w-9 h-9 rounded-full bg-white/5 hover:bg-gold hover:text-burgundy-950 flex items-center justify-center transition-colors">
                <TwitterIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-serif font-bold text-white tracking-widest uppercase mb-4 text-gold">
              Collections
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => navigateToCategory('gold')} className="hover:text-gold transition-colors">
                  22K Gold Jewellery
                </button>
              </li>
              <li>
                <button onClick={() => navigateToCategory('rings')} className="hover:text-gold transition-colors">
                  Solitaire Rings
                </button>
              </li>
              <li>
                <button onClick={() => navigateToCategory('necklaces')} className="hover:text-gold transition-colors">
                  Bridal Chokers & Haar
                </button>
              </li>
              <li>
                <button onClick={() => navigateToCategory('earrings')} className="hover:text-gold transition-colors">
                  Royal Jhumkas & Chandbalis
                </button>
              </li>
              <li>
                <button onClick={() => navigateToCategory('silver')} className="hover:text-gold transition-colors">
                  925 Sterling Silver
                </button>
              </li>
              <li>
                <button onClick={() => navigateToCategory('bracelets')} className="hover:text-gold transition-colors">
                  Kada & Diamond Bracelets
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-xs font-serif font-bold text-white tracking-widest uppercase mb-4 text-gold">
              Patron Services
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-gold transition-colors">
                  Book Boutique Appointment
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-gold transition-colors">
                  Our Ancestral Heritage
                </button>
              </li>
              <li>
                <a href="#purity" className="hover:text-gold transition-colors">
                  BIS Hallmark & Purity Assurance
                </a>
              </li>
              <li>
                <a href="#exchange" className="hover:text-gold transition-colors">
                  Lifetime Exchange & Buyback
                </a>
              </li>
              <li>
                <a href="#tracking" className="hover:text-gold transition-colors">
                  Insured Vault Dispatch & Tracking
                </a>
              </li>
              <li>
                <a href="#custom" className="hover:text-gold transition-colors">
                  Bespoke Jewellery Concierge
                </a>
              </li>
            </ul>
          </div>

          {/* Boutiques & Direct Line */}
          <div>
            <h3 className="text-xs font-serif font-bold text-white tracking-widest uppercase mb-4 text-gold">
              Flagship Boutiques
            </h3>
            <div className="space-y-3.5 text-xs text-ivory/70">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>Zaveri Bazaar, Mumbai • South Extension, New Delhi</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <span className="text-white font-medium">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <span>concierge@tiwarijewellers.com</span>
              </div>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-[10px] text-gold font-semibold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Certified Purity
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-ivory/50">
          <p>© {new Date().getFullYear()} TIWARI JWELLERS PVT. LTD. All rights reserved. Handcrafted with royal pride in India.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-ivory transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-ivory transition-colors">Terms of Heritage</a>
            <a href="#hallmark" className="hover:text-ivory transition-colors">BIS Certification</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
