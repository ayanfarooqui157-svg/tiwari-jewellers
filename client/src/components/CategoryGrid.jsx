import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useShop } from '../context/useShop';

export const CategoryGrid = () => {
  const { categories, navigateToCategory } = useShop();

  // If backend categories aren't loaded yet, provide rich defaults
  const displayCategories = categories.length > 0 ? categories : [
    {
      id: "cat-rings",
      name: "Rings",
      slug: "rings",
      description: "Solitaires, eternity bands & royal cocktail rings",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=700&q=80",
      itemCount: 4
    },
    {
      id: "cat-earrings",
      name: "Earrings",
      slug: "earrings",
      description: "Heritage jhumkas, diamond chandeliers & studs",
      image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=700&q=80",
      itemCount: 3
    },
    {
      id: "cat-necklaces",
      name: "Necklaces",
      slug: "necklaces",
      description: "Polki chokers, bridal sets & delicate chains",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80",
      itemCount: 3
    },
    {
      id: "cat-pendants",
      name: "Pendants",
      slug: "pendants",
      description: "Sacred talismans, solitaires & floral drops",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=700&q=80",
      itemCount: 3
    },
    {
      id: "cat-bracelets",
      name: "Bracelets",
      slug: "bracelets",
      description: "Diamond tennis bracelets & Italian charm chains",
      image: "https://images.unsplash.com/photo-1611591475879-11c5e6d62888?auto=format&fit=crop&w=700&q=80",
      itemCount: 2
    },
    {
      id: "cat-bangles",
      name: "Bangles",
      slug: "bangles",
      description: "Royal 22K gold filigree kadas & bridal pairs",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=80",
      itemCount: 2
    },
    {
      id: "cat-silver",
      name: "Silver Jewellery",
      slug: "silver",
      description: "Certified 925 sterling silver anti-tarnish fine pieces",
      image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=700&q=80",
      itemCount: 4
    },
    {
      id: "cat-gold",
      name: "Gold Jewellery",
      slug: "gold",
      description: "BIS 916 hallmarked pure 22K yellow & 18K rose gold",
      image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=700&q=80",
      itemCount: 7
    }
  ];

  return (
    <section className="py-20 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-6 h-[1px] bg-gold" />
            <span className="text-xs uppercase font-semibold tracking-widest text-gold-700">
              Curated Collections
            </span>
            <span className="w-6 h-[1px] bg-gold" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-burgundy mb-3">
            Shop By Category
          </h2>
          <p className="text-sm text-charcoal-500 font-sans">
            Explore masterpieces crafted with uncompromised precision, pure gold and certified diamonds.
          </p>
        </div>

        {/* Categories Grid (8 Cards) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {displayCategories.map((category) => (
            <div
              key={category.id}
              onClick={() => navigateToCategory(category.slug)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white border border-ivory-300 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1.5"
            >
              {/* Category Image with Zoom Effect */}
              <div className="relative aspect-[4/5] overflow-hidden bg-ivory-200">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                />
                {/* Luxury Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950/85 via-burgundy-950/20 to-transparent group-hover:from-burgundy-950/90 transition-colors" />

                {/* Arrow Icon */}
                <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:rotate-45">
                  <ArrowUpRight className="w-4 h-4 text-gold-200" />
                </div>

                {/* Bottom Content Inside Image */}
                <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-white">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-serif text-lg sm:text-xl font-bold tracking-wide text-ivory group-hover:text-gold-200 transition-colors">
                      {category.name}
                    </h3>
                  </div>
                  <p className="text-[11px] text-ivory/70 line-clamp-1 font-sans hidden sm:block">
                    {category.description}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-gold font-medium tracking-wider uppercase">
                    <span>Explore Collection</span>
                    <span className="text-xs transform group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
