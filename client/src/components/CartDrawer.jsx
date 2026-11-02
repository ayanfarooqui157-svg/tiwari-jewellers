import React, { useState } from 'react';
import { 
  X, Trash2, ShoppingBag, ArrowRight, Sparkles, 
  Tag, Gift, Check
} from 'lucide-react';
import { useShop } from '../context/useShop';

export const CartDrawer = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    cartSubtotal, 
    freeShippingThreshold,
    deliveryCharge, 
    discountAmount, 
    finalTotal,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    navigateTo,
    formatPrice,
    includeGiftBox,
    setIncludeGiftBox
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    await applyCouponCode(couponInput.trim());
    setCouponLoading(false);
    setCouponInput('');
  };

  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col z-50">
        
        {/* Header */}
        <div className="p-5 border-b border-ivory-200 flex items-center justify-between bg-ivory/50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-burgundy" />
            <h2 className="font-serif text-lg font-bold text-burgundy">
              Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full hover:bg-ivory text-charcoal-400 hover:text-charcoal transition-colors"
            aria-label="Close bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="px-5 py-3 bg-burgundy-50 border-b border-burgundy-100 text-xs">
          {amountNeededForFreeShipping > 0 ? (
            <p className="text-burgundy font-medium mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              Add <span className="font-bold">{formatPrice(amountNeededForFreeShipping)}</span> more for Free Insured Delivery!
            </p>
          ) : (
            <p className="text-emerald-800 font-bold mb-1.5 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              Congratulations! You've unlocked Free Insured Delivery across India.
            </p>
          )}
          <div className="w-full bg-ivory-300 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gold h-full rounded-full transition-all duration-500" 
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-ivory-200">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <div className="w-20 h-20 rounded-full bg-ivory flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-charcoal-300" />
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal mb-2">
                Your Shopping Bag is Empty
              </h3>
              <p className="text-xs text-charcoal-400 max-w-xs mb-6 font-sans">
                Explore our hallmarked gold, solitaire diamond and silver jewellery creations to add to your bag.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigateTo('shop');
                }}
                className="px-6 py-3 bg-burgundy hover:bg-burgundy-600 text-gold-200 rounded-full text-xs font-bold uppercase tracking-widest transition-all"
              >
                Explore Jewellery
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.cartItemId} className="py-4 flex gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl border border-ivory-300 shrink-0 bg-ivory-100"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-xs sm:text-sm font-serif font-bold text-charcoal line-clamp-2">
                      {item.name}
                    </h4>
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-charcoal-400 hover:text-red-600 transition-colors p-1"
                      title="Remove Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] text-charcoal-500 mt-0.5">
                    Size: <span className="font-medium text-charcoal-700">{item.selectedSize}</span> | 
                    Metal: <span className="font-medium text-charcoal-700">{item.selectedMetal}</span>
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-ivory-300 rounded-lg overflow-hidden bg-ivory">
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                        className="px-2.5 py-0.5 text-charcoal hover:bg-ivory-300 text-xs font-bold"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-xs font-bold text-charcoal">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                        className="px-2.5 py-0.5 text-charcoal hover:bg-ivory-300 text-xs font-bold"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-serif font-bold text-sm text-burgundy">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      {item.originalPrice > item.price && (
                        <p className="text-[10px] text-charcoal-400 line-through">
                          {formatPrice(item.originalPrice * item.quantity)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Area */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-ivory-200 bg-ivory/30 space-y-4">
            
            {/* Promo Code Input */}
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2.5 bg-gold/15 rounded-xl border border-gold/40 text-xs">
                <div className="flex items-center gap-2 text-gold-900 font-medium">
                  <Tag className="w-4 h-4 text-gold-700" />
                  <span>Code <b>{appliedCoupon.code}</b> applied (-{formatPrice(discountAmount)})</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-burgundy font-bold hover:underline text-[11px]"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Enter code (e.g. TIWARI10)"
                  className="flex-1 px-3 py-2 text-xs border border-ivory-300 rounded-lg outline-none uppercase font-mono placeholder:normal-case placeholder:font-sans"
                />
                <button
                  type="submit"
                  disabled={couponLoading}
                  className="px-4 py-2 bg-charcoal hover:bg-burgundy text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Apply
                </button>
              </form>
            )}

            {/* Gift Box Toggle */}
            <label className="flex items-center gap-2 cursor-pointer text-xs text-charcoal-600 select-none">
              <input
                type="checkbox"
                checked={includeGiftBox}
                onChange={(e) => setIncludeGiftBox(e.target.checked)}
                className="w-4 h-4 rounded text-burgundy focus:ring-burgundy"
              />
              <Gift className="w-4 h-4 text-burgundy" />
              <span>Complimentary Luxury Gift Packaging & Satin Ribbon</span>
            </label>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-charcoal-600 pt-2 border-t border-ivory-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-charcoal">{formatPrice(cartSubtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Insured Vault Delivery</span>
                <span>{deliveryCharge === 0 ? <b className="text-emerald-700 uppercase">FREE</b> : formatPrice(deliveryCharge)}</span>
              </div>
              <div className="flex justify-between text-base font-serif font-bold text-burgundy pt-2 border-t border-ivory-300">
                <span>Total Amount</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
              <p className="text-[10px] text-charcoal-400">Inclusive of all taxes & insurance</p>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                navigateTo('checkout');
              }}
              className="w-full py-4 bg-burgundy hover:bg-burgundy-600 text-gold-200 font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
            >
              <span>Proceed to Checkout (COD)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-[10px] text-center text-charcoal-400">
              Pay upon arrival via Cash or UPI • Open-Box Inspection Guaranteed
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
