import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';

export const CustomerReviews = () => {
  const reviews = [
    {
      id: 1,
      author: "Aditi Rao Hydari",
      location: "Bandra, Mumbai",
      rating: 5,
      date: "October 2026",
      title: "Unrivalled craftsmanship & brilliance",
      comment: "Purchased the Maharani Polki Choker for our family wedding. The weight, the lustrous 22K gold finish and the certified polki stones left everyone spellbound. Tiwari Jewellers sets a new benchmark in fine jewellery.",
      productBought: "Maharani Polki Kundan Choker",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 2,
      author: "Rohan & Sneha Singhal",
      location: "Indiranagar, Bengaluru",
      rating: 5,
      date: "September 2026",
      title: "Our dream engagement solitaire",
      comment: "We compared with top luxury brands, but the clarity and price transparency at Tiwari Jewellers made our decision effortless. The IGI certification and hallmark engraving were flawless.",
      productBought: "The Solitaire Harmony Diamond Ring",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 3,
      author: "Meenakshi Sundaram",
      location: "Alwarpet, Chennai",
      rating: 5,
      date: "October 2026",
      title: "Exquisite silver collection",
      comment: "The 925 sterling silver jewelry feels just like platinum! The rhodium plating has retained its mirror gloss for months. Highly recommend their prompt insured delivery.",
      productBought: "Celeste Halo 925 Silver Ring",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
    }
  ];

  return (
    <section className="py-20 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-6 h-[1px] bg-gold" />
            <span className="text-xs uppercase font-semibold tracking-widest text-gold-700">
              Patron Testimonials
            </span>
            <span className="w-6 h-[1px] bg-gold" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-burgundy mb-3">
            Words of Love & Trust
          </h2>
          <p className="text-sm text-charcoal-500 font-sans">
            Hear from our discerning patrons across India who celebrate life's most precious chapters with us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-8 border border-ivory-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group"
            >
              <div>
                {/* Quote Icon */}
                <Quote className="w-10 h-10 text-gold-200 group-hover:text-gold-300 transition-colors mb-4 opacity-70" />

                {/* Stars */}
                <div className="flex items-center gap-1 text-gold mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Title */}
                <h3 className="font-serif text-lg font-bold text-charcoal mb-2">
                  "{rev.title}"
                </h3>

                {/* Feedback */}
                <p className="text-xs text-charcoal-600 leading-relaxed font-sans mb-6">
                  {rev.comment}
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-ivory-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.avatar}
                    alt={rev.author}
                    className="w-11 h-11 rounded-full object-cover border border-gold/40"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-charcoal flex items-center gap-1">
                      {rev.author}
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" title="Verified Patron" />
                    </h4>
                    <p className="text-[10px] text-charcoal-400">{rev.location}</p>
                  </div>
                </div>
                <span className="text-[10px] text-gold-700 bg-gold/10 px-2 py-0.5 rounded-full font-medium">
                  Verified Buyer
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
