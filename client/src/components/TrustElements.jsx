import React from 'react';
import { Gem, ShieldCheck, Lock, HeadphonesIcon, Award, Sparkles } from 'lucide-react';

export const TrustElements = () => {
  const trustItems = [
    {
      icon: Gem,
      title: "Quality Craftsmanship",
      description: "Each heirloom is sculpted by master karigars with over three decades of ancestral jewellery design mastery.",
      badge: "Master Artisans"
    },
    {
      icon: ShieldCheck,
      title: "Authentic Products",
      description: "100% BIS Hallmarked gold and certified conflict-free natural diamonds with verifiable government HUID codes.",
      badge: "BIS Hallmarked"
    },
    {
      icon: Lock,
      title: "Cash on Delivery",
      description: "Insured Cash & UPI on Delivery across India with zero advance deposit and open-box seal verification.",
      badge: "Zero Risk"
    },
    {
      icon: HeadphonesIcon,
      title: "Reliable Customer Support",
      description: "Dedicated personal jewellery concierge available 7 days a week for sizing advice, video consultations and queries.",
      badge: "7 Days a Week"
    }
  ];

  return (
    <section className="py-20 bg-white border-t border-ivory-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-6 h-[1px] bg-gold" />
            <span className="text-xs uppercase font-semibold tracking-widest text-gold-700">
              The Tiwari Assurance
            </span>
            <span className="w-6 h-[1px] bg-gold" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-burgundy mb-3">
            Why Choose Tiwari Jewellers?
          </h2>
          <p className="text-sm text-charcoal-500 font-sans">
            Built upon four pillars of unshakeable trust, authentic purity and enduring excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group p-8 rounded-2xl bg-ivory/50 border border-ivory-300 hover:border-gold/50 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-burgundy/10 text-burgundy group-hover:bg-burgundy group-hover:text-gold-200 flex items-center justify-center mb-6 transition-colors shadow-sm">
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gold-700 bg-gold/10 px-2.5 py-1 rounded-full mb-3 inline-block">
                    {item.badge}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-charcoal mb-2 group-hover:text-burgundy transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-charcoal-500 leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
