import React, { useState, useEffect } from 'react';
import { 
  Star, Heart, ShoppingBag, Zap, ShieldCheck, 
  Truck, RefreshCw, Award, Check, ChevronRight, 
  MapPin, Sparkles, MessageSquarePlus
} from 'lucide-react';
import { useShop } from '../context/useShop';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailPage = () => {
  const { 
    selectedProductId, 
    products, 
    addToCart, 
    navigateTo, 
    wishlist, 
    toggleWishlist, 
    showToast,
    formatPrice 
  } = useShop();

  const [fetchedProduct, setFetchedProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedMetal, setSelectedMetal] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs', 'description', 'hallmark', 'care'
  const [justAdded, setJustAdded] = useState(false);
  
  // Pincode checker state
  const [pincode, setPincode] = useState('110001');
  const [pincodeResult, setPincodeResult] = useState(null);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState('');

  // Review submission state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewText, setNewReviewText] = useState('');

  // Sizing guide modal
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const product = (fetchedProduct?.id === selectedProductId ? fetchedProduct : null)
    || (products || []).find(item => item.id === selectedProductId);

  const availableSizes = product?.availableSizes && product.availableSizes.length > 0
    ? product.availableSizes
    : ['Standard'];
  const currentSize = selectedSize || availableSizes[0];

  const availableMetals = [
    product?.metal || '18K Yellow Gold',
    '18K Rose Gold',
    '14K White Gold'
  ].filter((v, i, a) => a.indexOf(v) === i);
  const currentMetal = selectedMetal || product?.metal || availableMetals[0];

  const images = (Array.isArray(product?.images) && product.images.length > 0)
    ? product.images
    : [product?.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800'];
  const safeImageIdx = activeImageIndex < images.length ? activeImageIndex : 0;

  useEffect(() => {
    if (!selectedProductId) return;

    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/products/${selectedProductId}`);
        const data = await res.json();
        if (data.success) {
          setFetchedProduct(data.data);
          setRelatedProducts(data.related || []);
          setActiveImageIndex(0);
          setSelectedSize(null);
          setSelectedMetal(null);
        }
      } catch (err) {
        console.error('Error loading product details:', err);
      }
    };

    fetchDetail();
  }, [selectedProductId]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-ivory">
        <Sparkles className="w-10 h-10 text-gold animate-spin mb-4" />
        <p className="font-serif text-lg text-burgundy font-bold">Unveiling Jewellery Masterpiece...</p>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);

  // Pincode check
  const handleCheckPincode = async (e) => {
    e.preventDefault();
    setPincodeError('');
    if (!/^\d{6}$/.test(pincode.trim())) {
      setPincodeError('Please enter a valid 6-digit Indian PIN code');
      return;
    }
    setPincodeLoading(true);
    try {
      const res = await fetch(`/api/delivery/pincode/${pincode.trim()}`);
      const data = await res.json();
      if (data.success) {
        setPincodeResult(data);
      } else {
        setPincodeError(data.message || 'Location currently unserviceable');
      }
    } catch {
      setPincodeError('Could not verify PIN code. Please retry.');
    } finally {
      setPincodeLoading(false);
    }
  };

  // Add to cart
  const handleAddToCart = () => {
    addToCart(product, currentSize, currentMetal, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  // Buy now: adds to cart & proceeds straight to checkout
  const handleBuyNow = () => {
    addToCart(product, currentSize, currentMetal, quantity);
    navigateTo('checkout');
  };

  // Submit Review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReviewAuthor || !newReviewTitle || !newReviewText) {
      showToast('Missing Fields', 'Please fill all review details.', 'error');
      return;
    }

    try {
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: newReviewAuthor,
          rating: newReviewRating,
          title: newReviewTitle,
          text: newReviewText
        })
      });
      const data = await res.json();
      if (data.success) {
        setFetchedProduct(currentProduct => {
          const reviewProduct = currentProduct?.id === product.id ? currentProduct : product;
          const reviews = [data.data, ...(reviewProduct.reviews || [])];
          return {
            ...reviewProduct,
            reviews,
            reviewCount: reviews.length
          };
        });
        setIsReviewModalOpen(false);
        setNewReviewAuthor('');
        setNewReviewTitle('');
        setNewReviewText('');
        showToast('Review Published', 'Thank you for sharing your experience!', 'gold');
      }
    } catch {
      showToast('Error', 'Could not post review.', 'error');
    }
  };

  return (
    <div className="bg-ivory min-h-screen py-6 sm:py-8 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-charcoal-400 mb-4 sm:mb-6 font-sans overflow-x-auto whitespace-nowrap pb-1">
          <button onClick={() => navigateTo('home')} className="hover:text-burgundy transition-colors shrink-0">Home</button>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <button onClick={() => navigateTo('shop')} className="hover:text-burgundy transition-colors shrink-0">Jewellery</button>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="text-charcoal-600 shrink-0">{product.category}</span>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="text-burgundy font-semibold truncate max-w-[150px] sm:max-w-[200px]">{product.name}</span>
        </nav>

        {/* MAIN PRODUCT DETAIL GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 bg-white rounded-3xl p-4 sm:p-8 lg:p-10 border border-ivory-300 shadow-sm mb-10 sm:mb-14">
          
          {/* LEFT: GALLERY (7 COLS) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:w-24 shrink-0 pb-2 sm:pb-0">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-18 h-18 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-ivory-100 ${
                      safeImageIdx === idx 
                        ? 'border-burgundy ring-2 ring-burgundy/20 scale-[1.02]' 
                        : 'border-ivory-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Zoomable Image */}
            <div className="flex-1 relative aspect-square rounded-3xl overflow-hidden bg-ivory-100 border border-ivory-300 group">
              <img
                src={images[safeImageIdx]}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110 cursor-crosshair"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.badge && (
                  <span className="text-xs uppercase font-bold tracking-wider px-3.5 py-1 rounded-full bg-burgundy text-gold-100 shadow-md">
                    {product.badge}
                  </span>
                )}
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-gold/90 text-burgundy-950 shadow-sm backdrop-blur-md">
                  100% BIS Hallmarked
                </span>
              </div>

              {/* Wishlist Floating Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md ${
                  isWishlisted 
                    ? 'bg-burgundy text-white scale-110' 
                    : 'bg-white/90 text-charcoal-400 hover:text-burgundy hover:bg-white'
                }`}
                title="Save to Wishlist"
                aria-label="Toggle wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO & PURCHASING (5 COLS) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Category & SKU */}
              <div className="flex items-center justify-between text-xs text-charcoal-400 mb-2 font-medium">
                <span className="text-gold-700 font-bold uppercase tracking-wider">
                  {currentMetal} • {product.category}
                </span>
                <span className="font-mono text-[11px]">SKU: {product.sku || 'TJ-ROYAL'}</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-burgundy mb-3 leading-snug">
                {product.name}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center gap-1 bg-burgundy text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-current text-gold" />
                  <span>{product.rating || 4.9}</span>
                </div>
                <span className="text-xs text-charcoal-500 font-medium">
                  {product.reviewCount || (product.reviews?.length) || 0} Verified Patron Reviews
                </span>
                <span className="text-ivory-400">•</span>
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> In Stock & Ready to Dispatch
                </span>
              </div>

              {/* Pricing */}
              <div className="p-4 rounded-2xl bg-ivory/60 border border-ivory-300 mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-serif font-bold text-burgundy">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-base text-charcoal-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  {product.discount > 0 && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                      Save {product.discount}%
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-charcoal-500 mt-1">
                  Inclusive of all taxes (GST) & free insured pan-India express courier.
                </p>
              </div>

              {/* Metal & Purity Selector */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                  Metal Purity: <span className="text-burgundy font-serif font-bold normal-case text-sm">{currentMetal}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableMetals.map((metal) => (
                    <button
                      key={metal}
                      onClick={() => setSelectedMetal(metal)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                        currentMetal === metal
                          ? 'bg-burgundy text-gold-100 border-burgundy shadow-sm'
                          : 'bg-white text-charcoal-700 border-ivory-300 hover:border-burgundy'
                      }`}
                    >
                      {metal}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizing Selector */}
              {availableSizes && availableSizes.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-charcoal uppercase tracking-wider">
                      Select Size: <span className="text-burgundy font-serif font-bold normal-case text-sm">{currentSize}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="text-xs text-burgundy font-semibold underline hover:text-burgundy-700 cursor-pointer"
                    >
                      Ring & Jewellery Size Guide
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-10 px-3 py-2 text-xs font-bold rounded-xl border transition-all ${
                          currentSize === size
                            ? 'bg-burgundy text-white border-burgundy shadow-sm scale-105'
                            : 'bg-white text-charcoal-700 border-ivory-300 hover:border-burgundy'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <label className="text-xs font-bold text-charcoal uppercase tracking-wider">
                  Quantity:
                </label>
                <div className="flex items-center border border-ivory-300 rounded-xl overflow-hidden bg-ivory">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-1.5 text-charcoal hover:bg-ivory-300 font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-bold text-charcoal">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-1.5 text-charcoal hover:bg-ivory-300 font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* PRIMARY ACTION BUTTONS: ADD TO CART & BUY NOW */}
              <div className="space-y-3 mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    className={`py-4 px-6 rounded-2xl font-sans font-bold text-xs uppercase tracking-widest transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${
                      justAdded 
                        ? 'bg-emerald-700 text-white' 
                        : 'bg-burgundy hover:bg-burgundy-600 text-gold-200'
                    }`}
                  >
                    {justAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Bag!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-gold-300" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="py-4 px-6 rounded-2xl bg-gold hover:bg-gold-600 text-burgundy-950 font-sans font-bold text-xs uppercase tracking-widest transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 fill-current text-burgundy-900" />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>

              {/* PINCODE DELIVERY CHECKER */}
              <div className="p-4 rounded-2xl bg-ivory/60 border border-ivory-300 mb-6">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-charcoal">
                  <MapPin className="w-4 h-4 text-burgundy" />
                  <span>Delivery Availability & Estimated Date</span>
                </div>

                <form onSubmit={handleCheckPincode} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit PIN code"
                    className="flex-1 px-3 py-2 text-xs border border-ivory-300 rounded-xl outline-none focus:border-burgundy font-mono"
                  />
                  <button
                    type="submit"
                    disabled={pincodeLoading}
                    className="px-4 py-2 bg-charcoal hover:bg-burgundy text-white text-xs font-bold rounded-xl transition-colors shrink-0"
                  >
                    {pincodeLoading ? 'Checking...' : 'Check'}
                  </button>
                </form>

                {pincodeError && (
                  <p className="text-xs text-red-600 font-medium">{pincodeError}</p>
                )}

                {pincodeResult && (
                  <div className="text-xs text-charcoal-700 space-y-1 pt-1">
                    <p className="text-emerald-800 font-semibold flex items-center gap-1">
                      <Check className="w-4 h-4 text-emerald-600" /> Serviceable in {pincodeResult.city}!
                    </p>
                    <p className="text-charcoal-600">
                      Estimated Delivery by <b className="text-charcoal font-bold">{pincodeResult.estimatedDeliveryDate}</b> via {pincodeResult.courierPartner}.
                    </p>
                    <div className="flex items-center gap-3 pt-1 text-[11px] text-emerald-800 font-semibold">
                      <span>✓ Cash / UPI on Delivery Available</span>
                      <span>✓ Zero Advance Required</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 4 Guarantee Badges */}
              <div className="grid grid-cols-2 gap-3 text-[11px] text-charcoal-600 pt-2 border-t border-ivory-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-burgundy shrink-0" />
                  <span>BIS 916 Hallmarked</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-gold-700 shrink-0" />
                  <span>IGI Certified Diamond</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-burgundy shrink-0" />
                  <span>15-Day Exchange Policy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gold-700 shrink-0" />
                  <span>Insured Tamper-Proof Vault</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TABS: SPECIFICATIONS, DESCRIPTION, CERTIFICATE, CARE */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-ivory-300 shadow-sm mb-14">
          <div className="flex flex-wrap border-b border-ivory-200 gap-4 sm:gap-8 mb-6">
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 text-xs sm:text-sm font-serif font-bold uppercase tracking-wider transition-all relative ${
                activeTab === 'specs' ? 'text-burgundy' : 'text-charcoal-400 hover:text-charcoal'
              }`}
            >
              Gold & Diamond Specifications
              {activeTab === 'specs' && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-gold" />}
            </button>

            <button
              onClick={() => setActiveTab('description')}
              className={`pb-3 text-xs sm:text-sm font-serif font-bold uppercase tracking-wider transition-all relative ${
                activeTab === 'description' ? 'text-burgundy' : 'text-charcoal-400 hover:text-charcoal'
              }`}
            >
              Artisan Design Story
              {activeTab === 'description' && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-gold" />}
            </button>

            <button
              onClick={() => setActiveTab('hallmark')}
              className={`pb-3 text-xs sm:text-sm font-serif font-bold uppercase tracking-wider transition-all relative ${
                activeTab === 'hallmark' ? 'text-burgundy' : 'text-charcoal-400 hover:text-charcoal'
              }`}
            >
              Hallmark & Certification
              {activeTab === 'hallmark' && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-gold" />}
            </button>

            <button
              onClick={() => setActiveTab('care')}
              className={`pb-3 text-xs sm:text-sm font-serif font-bold uppercase tracking-wider transition-all relative ${
                activeTab === 'care' ? 'text-burgundy' : 'text-charcoal-400 hover:text-charcoal'
              }`}
            >
              Jewellery Care Guide
              {activeTab === 'care' && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-gold" />}
            </button>
          </div>

          {/* TAB 1: SPECIFICATIONS */}
          {activeTab === 'specs' && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <tbody>
                  <tr className="border-b border-ivory-200">
                    <td className="py-3 font-semibold text-charcoal-500 w-1/3">Gross Metal Weight</td>
                    <td className="py-3 font-bold text-charcoal">{product.specifications?.grossWeight || "3.42 g"}</td>
                  </tr>
                  <tr className="border-b border-ivory-200">
                    <td className="py-3 font-semibold text-charcoal-500">Net Gold Weight</td>
                    <td className="py-3 font-bold text-charcoal">{product.specifications?.netGoldWeight || "3.20 g"}</td>
                  </tr>
                  <tr className="border-b border-ivory-200">
                    <td className="py-3 font-semibold text-charcoal-500">Metal Purity</td>
                    <td className="py-3 font-bold text-burgundy">{product.specifications?.purity || product.purity || "18K (750)"}</td>
                  </tr>
                  <tr className="border-b border-ivory-200">
                    <td className="py-3 font-semibold text-charcoal-500">Diamond / Gemstone Weight</td>
                    <td className="py-3 font-bold text-charcoal">{product.specifications?.diamondWeight || "0.70 ct"}</td>
                  </tr>
                  <tr className="border-b border-ivory-200">
                    <td className="py-3 font-semibold text-charcoal-500">Diamond Clarity & Color</td>
                    <td className="py-3 font-bold text-charcoal">{product.specifications?.diamondClarity || "VVS1 - E/F"}</td>
                  </tr>
                  <tr className="border-b border-ivory-200">
                    <td className="py-3 font-semibold text-charcoal-500">Government Certification</td>
                    <td className="py-3 font-bold text-emerald-800">{product.specifications?.certification || "BIS Hallmarked & IGI Authenticated"}</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-charcoal-500">Dimensions & Setting</td>
                    <td className="py-3 font-bold text-charcoal">{product.specifications?.dimensions || "Ring Width: 2.1mm | Head: 5.8mm"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: ARTISAN STORY */}
          {activeTab === 'description' && (
            <div className="prose max-w-none text-xs sm:text-sm text-charcoal-600 leading-relaxed space-y-3 font-sans">
              <p>{product.description}</p>
              <p>
                Each creation from Tiwari Jewellers is sculpted under the meticulous supervision of senior jewellery masters. The gold undergoes rigorous fire assay testing to ensure uncompromising metal purity, while each natural diamond is individually inspected for symmetrical brilliance and scintillation.
              </p>
            </div>
          )}

          {/* TAB 3: HALLMARK */}
          {activeTab === 'hallmark' && (
            <div className="space-y-4 text-xs text-charcoal-600 leading-relaxed font-sans">
              <div className="p-4 rounded-2xl bg-ivory border border-ivory-300 flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-burgundy shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif font-bold text-charcoal text-sm mb-1">
                    Bureau of Indian Standards (BIS) Hallmarked
                  </h4>
                  <p>
                    Every gold item carries the official BIS hallmark along with a unique 6-digit alphanumeric HUID (Hallmark Unique Identification) code laser engraved onto the inner band or clasp, assuring 100% legal purity verification on the BIS CARE mobile app.
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-ivory border border-ivory-300 flex items-start gap-3">
                <Award className="w-6 h-6 text-gold-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif font-bold text-charcoal text-sm mb-1">
                    IGI / SGL Diamond Authenticity Certificate
                  </h4>
                  <p>
                    All diamonds are accompanied by an individual laboratory gemological grading certificate detailing the exact 4Cs: Carat, Color, Clarity and Cut.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CARE GUIDE */}
          {activeTab === 'care' && (
            <div className="text-xs text-charcoal-600 leading-relaxed font-sans space-y-2">
              <p className="font-semibold text-charcoal">
                Preserve the eternal sparkle of your Tiwari Jewellers pieces with these professional tips:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Store individually in the provided luxury velvet jewelry box or soft ziplock pouch to prevent scratches.</li>
                <li>Avoid applying perfumes, lotions, sanitizers or hairspray directly onto gemstone or gold surfaces.</li>
                <li>Clean gold and diamond jewellery periodically using a soft toothbrush and warm soapy water, then pat dry with a lint-free cloth.</li>
                <li>Complimentary annual ultrasonic cleaning and prong inspection available at all Tiwari Jewellers flagship boutiques.</li>
              </ul>
            </div>
          )}
        </div>

        {/* CUSTOMER REVIEWS SECTION WITH SUBMISSION */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-ivory-300 shadow-sm mb-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-ivory-200 gap-4 mb-6">
            <div>
              <h3 className="font-serif text-2xl font-bold text-burgundy">
                Patron Reviews & Ratings
              </h3>
              <p className="text-xs text-charcoal-500 font-sans mt-0.5">
                Verified feedback from clients across India who own this design.
              </p>
            </div>

            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="px-5 py-2.5 rounded-full bg-burgundy hover:bg-burgundy-600 text-gold-200 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 self-start sm:self-auto"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-ivory/50 border border-ivory-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-charcoal text-sm">{rev.author}</span>
                      {rev.verifiedBuyer && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          Verified Buyer
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-charcoal-400">{rev.date}</span>
                  </div>

                  <div className="flex items-center gap-1 text-gold mb-1.5">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>

                  <h4 className="font-bold text-xs text-charcoal mb-1">
                    "{rev.title}"
                  </h4>
                  <p className="text-xs text-charcoal-600 leading-relaxed font-sans">
                    {rev.text}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-charcoal-400 italic">Be the first to share a review for this design!</p>
            )}
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-gold-700">
                  You May Also Admire
                </span>
                <h3 className="text-2xl font-serif font-bold text-burgundy mt-0.5">
                  Complementary Creations
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* MODAL: WRITE A REVIEW */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-ivory-300 relative animate-in fade-in zoom-in-95">
            <h3 className="font-serif text-xl font-bold text-burgundy mb-4">
              Write a Review for {product.name}
            </h3>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  placeholder="e.g. Radhika Kapoor"
                  className="w-full px-3 py-2 text-xs border border-ivory-300 rounded-xl outline-none focus:border-burgundy"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewReviewRating(star)}
                      className="p-1 text-gold hover:scale-110 transition-transform"
                    >
                      <Star className={`w-6 h-6 ${star <= newReviewRating ? 'fill-current' : 'text-ivory-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                  Review Headline
                </label>
                <input
                  type="text"
                  required
                  value={newReviewTitle}
                  onChange={(e) => setNewReviewTitle(e.target.value)}
                  placeholder="e.g. Outstanding luster and swift delivery"
                  className="w-full px-3 py-2 text-xs border border-ivory-300 rounded-xl outline-none focus:border-burgundy"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                  Detailed Feedback
                </label>
                <textarea
                  rows={4}
                  required
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  placeholder="Tell us about the craftsmanship, finish, weight, and wearing experience..."
                  className="w-full px-3 py-2 text-xs border border-ivory-300 rounded-xl outline-none focus:border-burgundy"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-ivory-300 text-xs font-semibold text-charcoal hover:bg-ivory"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-burgundy hover:bg-burgundy-600 text-gold-100 text-xs font-bold uppercase tracking-wider"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SIZE GUIDE */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-ivory-300 relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-ivory-200 mb-4">
              <h3 className="font-serif text-lg font-bold text-burgundy">Standard Indian Ring & Bangle Sizing</h3>
              <button onClick={() => setIsSizeGuideOpen(false)} className="p-1" aria-label="Close size guide">
                <span className="text-charcoal-400 font-bold">✕</span>
              </button>
            </div>

            <div className="space-y-4 text-xs text-charcoal-600 leading-relaxed font-sans">
              <p>Indian ring sizes measure inner circumference in millimeters:</p>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 bg-ivory rounded-lg border border-ivory-200">Size 10: 50.0 mm (Small)</div>
                <div className="p-2 bg-ivory rounded-lg border border-ivory-200">Size 12: 52.0 mm (Medium)</div>
                <div className="p-2 bg-ivory rounded-lg border border-ivory-200">Size 14: 54.0 mm (Standard)</div>
                <div className="p-2 bg-ivory rounded-lg border border-ivory-200">Size 16: 56.0 mm (Comfort)</div>
                <div className="p-2 bg-ivory rounded-lg border border-ivory-200">Size 18: 58.0 mm (Large)</div>
              </div>
              <p className="text-[11px] text-charcoal-400">
                Need customized resizing? Our concierge will resize your ring with complimentary return pick-up.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE-ONLY STICKY BOTTOM ACTION BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-ivory-300 p-3 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-charcoal-500 uppercase tracking-wider block">Total Price</span>
          <span className="text-base font-serif font-bold text-burgundy">{formatPrice(product.price)}</span>
        </div>
        <div className="flex items-center gap-2 flex-1 max-w-[240px]">
          <button
            onClick={handleAddToCart}
            className={`flex-1 py-2.5 px-3 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 shadow transition-all ${
              justAdded
                ? 'bg-emerald-700 text-white'
                : 'bg-burgundy hover:bg-burgundy-600 text-gold-200'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-gold-200" />
            <span>{justAdded ? 'Added' : 'Add to Bag'}</span>
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 py-2.5 px-3 rounded-xl bg-gold hover:bg-gold-600 text-burgundy-950 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 shadow transition-all"
          >
            <Zap className="w-3.5 h-3.5 fill-current text-burgundy-900" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
