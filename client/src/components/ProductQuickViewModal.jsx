import React, { useState } from 'react';
import { X, Star, ShoppingBag, ShieldCheck, Heart, ArrowRight, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ProductQuickViewModal = () => {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    addToCart, 
    navigateToProduct, 
    wishlist, 
    toggleWishlist,
    formatPrice 
  } = useShop();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedMetal, setSelectedMetal] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isWishlisted = wishlist.includes(product.id);
  const currentSize = selectedSize || (product.availableSizes && product.availableSizes[0]) || 'Standard';
  const currentMetal = selectedMetal || product.metal;

  const handleAdd = () => {
    addToCart(product, currentSize, currentMetal, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setQuickViewProduct(null);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-ivory-300 relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-ivory border border-ivory-300 flex items-center justify-center text-charcoal hover:text-burgundy transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
          {/* Gallery Column */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-ivory-100 border border-ivory-200 relative">
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-burgundy text-gold-100 shadow">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === i ? 'border-burgundy ring-2 ring-burgundy/20' : 'border-ivory-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-charcoal-400 mb-2">
                <span className="text-gold-700 font-semibold uppercase tracking-wider">
                  {product.category} • {product.metal}
                </span>
                <div className="flex items-center gap-1 text-gold-600">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold text-charcoal text-xs">{product.rating}</span>
                  <span className="text-charcoal-400">({product.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-serif font-bold text-burgundy mb-3">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-serif font-bold text-burgundy">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-charcoal-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Save {product.discount}%
                  </span>
                )}
              </div>

              {/* Description excerpt */}
              <p className="text-xs text-charcoal-600 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Available Sizes selector */}
              {product.availableSizes && product.availableSizes.length > 0 && (
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-charcoal uppercase tracking-wider">
                      Select Size:
                    </label>
                    <span className="text-[11px] text-burgundy underline cursor-pointer">
                      Size Guide
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                          currentSize === size
                            ? 'bg-burgundy text-white border-burgundy shadow-sm'
                            : 'bg-white text-charcoal border-ivory-300 hover:border-burgundy'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <label className="text-xs font-semibold text-charcoal uppercase tracking-wider">
                  Quantity:
                </label>
                <div className="flex items-center border border-ivory-300 rounded-lg overflow-hidden bg-ivory">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-charcoal hover:bg-ivory-300 text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-charcoal">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-charcoal hover:bg-ivory-300 text-sm font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Trust Tag */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-ivory border border-ivory-300 text-[11px] text-charcoal-600 mb-6">
                <ShieldCheck className="w-4 h-4 text-burgundy shrink-0" />
                <span>100% Certified & BIS Hallmarked with Lifetime Buyback.</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-ivory-200">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAdd}
                  disabled={isAdded}
                  className={`flex-1 py-3.5 px-6 rounded-full font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow flex items-center justify-center gap-2 ${
                    isAdded
                      ? 'bg-emerald-700 text-white'
                      : 'bg-burgundy hover:bg-burgundy-600 text-gold-200'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Shopping Bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Add to Cart • {formatPrice(product.price * quantity)}
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3.5 rounded-full border transition-colors ${
                    isWishlisted
                      ? 'bg-burgundy text-white border-burgundy'
                      : 'border-ivory-300 text-charcoal-400 hover:text-burgundy hover:bg-ivory'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              <button
                onClick={() => {
                  setQuickViewProduct(null);
                  navigateToProduct(product.id);
                }}
                className="w-full text-center text-xs text-burgundy hover:text-burgundy-700 font-semibold hover:underline flex items-center justify-center gap-1 py-1"
              >
                View Full Specifications & Certificate Details <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
