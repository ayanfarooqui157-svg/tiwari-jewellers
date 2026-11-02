import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, Eye, Check } from 'lucide-react';
import { useShop } from '../context/useShop';

export const ProductCard = ({ product }) => {
  const { 
    wishlist, 
    toggleWishlist, 
    addToCart, 
    navigateToProduct, 
    setQuickViewProduct,
    formatPrice 
  } = useShop();

  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isWishlisted = wishlist.includes(product.id);
  const hasSecondaryImage = product.images && product.images.length > 1;

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => navigateToProduct(product.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-white rounded-2xl overflow-hidden border border-ivory-300 hover:border-gold/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer relative"
    >
      {/* 1. IMAGE CONTAINER */}
      <div className="relative aspect-square overflow-hidden bg-ivory-100">
        {/* Primary Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          className={`w-full h-full object-cover object-center transition-all duration-700 ease-out ${
            isHovered && hasSecondaryImage ? 'opacity-0 scale-105' : 'opacity-100 group-hover:scale-105'
          }`}
          loading="lazy"
        />

        {/* Secondary Hover Image */}
        {hasSecondaryImage && (
          <img
            src={product.images[1]}
            alt={`${product.name} alternate view`}
            className={`w-full h-full object-cover object-center absolute inset-0 transition-all duration-700 ease-out ${
              isHovered ? 'opacity-100 scale-105' : 'opacity-0 pointer-events-none'
            }`}
            loading="lazy"
          />
        )}

        {/* Badges: Bestseller / New Arrival / Festive Special */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className={`text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm backdrop-blur-md ${
              product.badge === 'Bestseller' 
                ? 'bg-burgundy text-gold-100 border border-gold/30'
                : product.badge === 'New Arrival'
                ? 'bg-gold-500 text-burgundy-950 font-bold'
                : 'bg-burgundy-800 text-white'
            }`}>
              {product.badge}
            </span>
          )}
          {product.discount > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
              {product.discount}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10 ${
            isWishlisted 
              ? 'bg-burgundy text-white shadow-md scale-110' 
              : 'bg-white/80 hover:bg-white text-charcoal-400 hover:text-burgundy shadow-sm'
          }`}
          title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-white' : ''}`} />
        </button>

        {/* Quick View Hover Button */}
        <button
          onClick={handleQuickView}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white/90 hover:bg-white text-charcoal-700 hover:text-burgundy text-xs font-medium shadow-md backdrop-blur-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-1.5 z-10"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Quick View</span>
        </button>
      </div>

      {/* 2. CARD BODY */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metal & Purity Tag */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-charcoal-400 mb-1 sm:mb-1.5 font-medium">
            <span className="text-gold-700 tracking-wide uppercase font-semibold truncate max-w-[65%]">
              {product.metal}
            </span>
            <div className="flex items-center gap-1 text-gold-600 shrink-0">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
              <span className="font-bold text-charcoal-700 text-[11px] sm:text-xs">{product.rating}</span>
              <span className="text-charcoal-400 text-[9px] sm:text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-serif text-xs sm:text-base font-bold text-charcoal group-hover:text-burgundy transition-colors line-clamp-1 sm:line-clamp-2 mb-1 sm:mb-2">
            {product.name}
          </h3>
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-ivory-200">
          <div className="flex items-baseline gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            <span className="font-serif text-sm sm:text-lg font-bold text-burgundy">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-[10px] sm:text-xs text-charcoal-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Quick Add To Bag Button */}
          <button
            onClick={handleQuickAdd}
            className={`w-full py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl font-sans text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 ${
              justAdded
                ? 'bg-emerald-700 text-white'
                : 'bg-ivory-200 hover:bg-burgundy text-burgundy-900 hover:text-white border border-ivory-300'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Added
              </>
            ) : (
              <>
                <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold-600 group-hover:text-gold-200" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
