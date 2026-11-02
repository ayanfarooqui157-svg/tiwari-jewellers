import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useShop } from '../context/useShop';
import { HeroBanner } from '../components/HeroBanner';
import { CategoryGrid } from '../components/CategoryGrid';
import { ProductCard } from '../components/ProductCard';
import { PromotionalBanner } from '../components/PromotionalBanner';
import { TrustElements } from '../components/TrustElements';
import { CustomerReviews } from '../components/CustomerReviews';
import { Newsletter } from '../components/Newsletter';

export const HomePage = () => {
  const { products, navigateToCategory } = useShop();

  const bestsellers = products.filter(p => p.badge === 'Bestseller' || p.rating >= 4.9).slice(0, 4);
  const newArrivals = products.filter(p => p.isNew || p.badge === 'New Arrival' || p.badge === 'Festive Special').slice(0, 4);

  return (
    <div className="bg-ivory min-h-screen">
      {/* 1. HERO SECTION */}
      <HeroBanner />

      {/* 2. SHOP BY CATEGORY */}
      <CategoryGrid />

      {/* 3. BESTSELLING COLLECTION */}
      <section className="py-20 bg-white border-t border-ivory-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="w-6 h-[1px] bg-gold" />
                <span className="text-xs uppercase font-semibold tracking-widest text-gold-700">
                  Most Coveted
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-burgundy">
                Bestselling Masterpieces
              </h2>
              <p className="text-sm text-charcoal-500 font-sans mt-2">
                Pieces celebrated for their ethereal design, unmatched luster and daily luxury.
              </p>
            </div>

            <button
              onClick={() => navigateToCategory('all')}
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest text-burgundy hover:text-burgundy-700 pb-1 border-b border-burgundy hover:border-gold transition-colors"
            >
              <span>View All Bestsellers</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. PROMOTIONAL BANNER */}
      <PromotionalBanner />

      {/* 5. NEW ARRIVALS */}
      <section className="py-20 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="w-6 h-[1px] bg-gold" />
                <span className="text-xs uppercase font-semibold tracking-widest text-gold-700">
                  Fresh from Our Karigars
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-burgundy">
                The New Arrivals Suite
              </h2>
              <p className="text-sm text-charcoal-500 font-sans mt-2">
                Contemporary statements blending timeless royal heritage with modern silhouettes.
              </p>
            </div>

            <button
              onClick={() => navigateToCategory('all')}
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest text-burgundy hover:text-burgundy-700 pb-1 border-b border-burgundy hover:border-gold transition-colors"
            >
              <span>Explore Latest Releases</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE US (TRUST ELEMENTS) */}
      <TrustElements />

      {/* 7. CUSTOMER TESTIMONIALS */}
      <CustomerReviews />

      {/* 8. NEWSLETTER */}
      <Newsletter />
    </div>
  );
};
