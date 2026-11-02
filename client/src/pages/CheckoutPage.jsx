import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Lock, ArrowRight,
  MapPin, User, Sparkles, Printer, PackageCheck,
  Banknote, Award, AlertCircle, Gift
} from 'lucide-react';
import { useShop } from '../context/useShop';

export const CheckoutPage = () => {
  const { 
    cart, 
    cartSubtotal, 
    deliveryCharge, 
    discountAmount, 
    finalTotal, 
    appliedCoupon, 
    clearCart, 
    user, 
    token,
    setIsAuthOpen,
    navigateTo, 
    showToast,
    formatPrice,
    includeGiftBox
  } = useShop();

  // Address pre-population from user
  const defaultAddr = user?.addresses?.[0];

  // Form State
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(defaultAddr?.street || '');
  const [city, setCity] = useState(defaultAddr?.city || '');
  const [state, setState] = useState(defaultAddr?.state || 'Maharashtra');
  const [pincode, setPincode] = useState(defaultAddr?.pincode || '');

  // Loading & Flow State
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  useEffect(() => {
    if (user) {
      if (user.name) setFullName(user.name);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
      if (user.addresses && user.addresses.length > 0) {
        const addr = user.addresses[0];
        if (addr.street) setStreet(addr.street);
        if (addr.city) setCity(addr.city);
        if (addr.state) setState(addr.state);
        if (addr.pincode) setPincode(addr.pincode);
      }
    }
  }, [user]);

  if (cart.length === 0 && !confirmedOrder) {
    return (
      <div className="min-h-[60vh] bg-ivory flex flex-col items-center justify-center p-8 text-center">
        <Sparkles className="w-12 h-12 text-gold mb-3" />
        <h2 className="font-serif text-2xl font-bold text-burgundy mb-2">No Items in Checkout</h2>
        <p className="text-xs text-charcoal-500 mb-6 font-sans">
          Your shopping bag is empty. Please select jewellery pieces before proceeding to checkout.
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="px-6 py-3 bg-burgundy hover:bg-burgundy-600 text-gold-200 rounded-full text-xs font-bold uppercase tracking-widest transition-all"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  // Handle Place Order via Cash on Delivery
  const handleInitiateOrder = async (e) => {
    e.preventDefault();

    if (!user) {
      showToast('Login Required', 'Please sign in or register to place your jewellery order.', 'error');
      setIsAuthOpen(true);
      return;
    }

    if (!fullName || !email || !phone || !street || !city || !pincode) {
      showToast('Incomplete Address', 'Please provide complete delivery details.', 'error');
      return;
    }

    if (!/^\d{6}$/.test(pincode.trim())) {
      showToast('Invalid PIN', 'Please enter a valid 6-digit Indian PIN code.', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      const orderPayload = {
        customer: {
          name: fullName,
          email,
          phone
        },
        shippingAddress: {
          fullName,
          street,
          city,
          state,
          pincode,
          phone
        },
        items: cart,
        pricing: {
          subtotal: cartSubtotal,
          discount: discountAmount,
          couponCode: appliedCoupon?.code || null,
          deliveryCharge,
          total: finalTotal
        },
        includeGiftBox,
        paymentMethod: 'Cash on Delivery (COD)',
        paymentStatus: 'Pending (Pay on Delivery)'
      };

      const headers = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      if (res.status === 401) {
        showToast('Session Expired', 'Please sign in again to place your order.', 'error');
        setIsAuthOpen(true);
        return;
      }
      if (data.success) {
        setConfirmedOrder(data.data);
        clearCart();
        showToast('Order Confirmed', `Royal Order ${data.data.id} placed with Cash on Delivery!`, 'gold');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        showToast('Order Error', data.message || 'Could not record order.', 'error');
      }
    } catch {
      showToast('Error', 'Could not communicate with vault order registry.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Print Invoice
  const handlePrint = () => {
    window.print();
  };

  // ============================================
  // CONFIRMED ORDER SCREEN (RECEIPT & TRACKING)
  // ============================================
  if (confirmedOrder) {
    return (
      <div className="bg-ivory min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-ivory-300 shadow-xl relative overflow-hidden">
            
            {/* Header Badge */}
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
              <PackageCheck className="w-8 h-8" />
            </div>

            <div className="text-center mb-8">
              <span className="text-xs uppercase font-bold tracking-widest text-gold-700">
                Order Confirmed • Cash on Delivery
              </span>
              <h1 className="text-3xl font-serif font-bold text-burgundy mt-1 mb-2">
                Thank You for Your Royal Patronage
              </h1>
              <p className="text-xs text-charcoal-500 font-sans max-w-lg mx-auto">
                Your heirloom jewellery order is registered in our private vault ledger. Insured dispatch notification has been transmitted to <b>{confirmedOrder.customer?.email || email}</b>.
              </p>
            </div>

            {/* COD Handover Notice Alert */}
            <div className="p-4 rounded-2xl bg-gold/10 border border-gold/30 text-xs text-gold-950 mb-8 flex items-start gap-3">
              <Banknote className="w-5 h-5 text-gold-800 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-burgundy">Cash / UPI on Delivery Handover</p>
                <p className="mt-0.5 text-charcoal-700">
                  Please keep exact payable amount of <b className="text-burgundy">{formatPrice(confirmedOrder.pricing?.total || finalTotal)}</b> ready. You can pay via <b>Cash</b> or scan the delivery executive's <b>UPI QR code (GPay / PhonePe / Paytm)</b> upon verifying the tamper-proof vault seal.
                </p>
              </div>
            </div>

            {/* Order Details Card */}
            <div className="bg-ivory/60 rounded-2xl p-6 border border-ivory-300 mb-8 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pb-4 border-b border-ivory-300">
                <div>
                  <span className="text-charcoal-400 block text-[10px] uppercase font-bold">Order ID</span>
                  <span className="font-mono font-bold text-burgundy text-sm">{confirmedOrder.id}</span>
                </div>
                <div>
                  <span className="text-charcoal-400 block text-[10px] uppercase font-bold">Date</span>
                  <span className="font-medium text-charcoal">{new Date(confirmedOrder.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-charcoal-400 block text-[10px] uppercase font-bold">Payable on Delivery</span>
                  <span className="font-serif font-bold text-burgundy text-sm">{formatPrice(confirmedOrder.pricing?.total || finalTotal)}</span>
                </div>
                <div>
                  <span className="text-charcoal-400 block text-[10px] uppercase font-bold">Payment Mode</span>
                  <span className="inline-block px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                    Cash on Delivery
                  </span>
                </div>
              </div>

              {/* Courier Tracking */}
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-2">
                <div>
                  <p className="text-charcoal-500 font-medium">
                    Tamper-Proof Armoured Courier Vault Tracking:
                  </p>
                  <p className="font-mono font-bold text-charcoal text-sm">{confirmedOrder.trackingNumber}</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-semibold">
                    Estimated Delivery: 2-3 Business Days
                  </span>
                </div>
              </div>

              {/* Items summary */}
              <div className="pt-4 border-t border-ivory-300 divide-y divide-ivory-200">
                {confirmedOrder.items && confirmedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800'} 
                        alt={item.name} 
                        className="w-10 h-10 object-cover rounded-lg border border-ivory-300" 
                      />
                      <div>
                        <p className="font-serif font-bold text-charcoal">{item.name}</p>
                        <p className="text-[10px] text-charcoal-400">Qty: {item.quantity} | Size: {item.selectedSize} | {item.selectedMetal}</p>
                      </div>
                    </div>
                    <span className="font-serif font-bold text-burgundy">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address Recap */}
            <div className="bg-white rounded-2xl p-4 border border-ivory-300 text-xs mb-8">
              <h4 className="font-serif font-bold text-burgundy uppercase text-[11px] tracking-wider mb-2">
                Delivering To
              </h4>
              <p className="font-semibold text-charcoal">{confirmedOrder.shippingAddress?.fullName || fullName}</p>
              <p className="text-charcoal-600">{confirmedOrder.shippingAddress?.street || street}</p>
              <p className="text-charcoal-600">{confirmedOrder.shippingAddress?.city || city}, {confirmedOrder.shippingAddress?.state || state} - {confirmedOrder.shippingAddress?.pincode || pincode}</p>
              <p className="text-charcoal-500 mt-1">Contact: {confirmedOrder.shippingAddress?.phone || phone}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handlePrint}
                className="flex-1 py-3 px-4 border border-ivory-300 hover:bg-ivory rounded-xl text-xs font-bold text-charcoal flex items-center justify-center gap-2 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Invoice</span>
              </button>

              <button
                onClick={() => navigateTo('profile')}
                className="flex-1 py-3 px-4 bg-burgundy hover:bg-burgundy-600 text-gold-200 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <span>Track in Patron Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // CHECKOUT FORM SCREEN
  // ============================================
  return (
    <div className="bg-ivory min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs uppercase font-bold tracking-widest text-gold-700">
            Secure Insured Checkout
          </span>
          <h1 className="text-3xl font-serif font-bold text-burgundy mt-1">
            Complete Your Fine Jewellery Order
          </h1>
          <p className="text-xs text-charcoal-500 font-sans mt-1">
            Insured vault courier with tamper-evident seal and Cash / UPI on Delivery.
          </p>
        </div>

        {/* Authentication Notice if Guest */}
        {!user && (
          <div className="max-w-4xl mx-auto mb-8 p-6 rounded-3xl bg-amber-50/70 border border-amber-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-burgundy text-gold-200 flex items-center justify-center shrink-0 shadow-sm">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <p className="font-serif font-bold text-sm text-burgundy">Account Login Required to Place Order</p>
                <p className="text-xs text-charcoal-600 mt-0.5">Please sign in or register to attach your bespoke warranty and track your shipment.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsAuthOpen(true)}
              className="px-6 py-2.5 bg-burgundy hover:bg-burgundy-600 text-gold-200 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap shadow"
            >
              Sign In / Register
            </button>
          </div>
        )}

        <form onSubmit={handleInitiateOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          
          {/* LEFT: SHIPPING & PAYMENT FORMS (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Contact Information */}
            <div className="bg-white rounded-3xl p-4 sm:p-8 border border-ivory-300 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-ivory-200">
                <User className="w-4 h-4 text-burgundy" />
                <h3 className="font-serif font-bold text-base text-burgundy">
                  1. Patron Contact Details
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-charcoal uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-ivory-300 rounded-xl outline-none focus:border-burgundy"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-charcoal uppercase tracking-wider mb-1">
                    Phone (for Delivery Courier OTP) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-ivory-300 rounded-xl outline-none focus:border-burgundy"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-charcoal uppercase tracking-wider mb-1">
                    Email Address (for Certificate & Invoice) *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-ivory-300 rounded-xl outline-none focus:border-burgundy"
                  />
                </div>
              </div>
            </div>

            {/* 2. Delivery Address */}
            <div className="bg-white rounded-3xl p-4 sm:p-8 border border-ivory-300 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-ivory-200">
                <MapPin className="w-4 h-4 text-burgundy" />
                <h3 className="font-serif font-bold text-base text-burgundy">
                  2. Shipping & Vault Delivery Address
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-charcoal uppercase tracking-wider mb-1">
                    House / Flat No., Apartment, Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-ivory-300 rounded-xl outline-none focus:border-burgundy"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-charcoal uppercase tracking-wider mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs border border-ivory-300 rounded-xl outline-none focus:border-burgundy"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-charcoal uppercase tracking-wider mb-1">
                      State *
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs border border-ivory-300 rounded-xl outline-none focus:border-burgundy bg-white"
                    >
                      {['Delhi NCR', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Gujarat', 'West Bengal', 'Uttar Pradesh', 'Rajasthan', 'Kerala', 'Punjab'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-charcoal uppercase tracking-wider mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3.5 py-2.5 text-xs border border-ivory-300 rounded-xl outline-none focus:border-burgundy font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Payment Method: Cash on Delivery (COD Only) */}
            <div className="bg-white rounded-3xl p-4 sm:p-8 border border-ivory-300 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-ivory-200">
                <Lock className="w-4 h-4 text-burgundy" />
                <h3 className="font-serif font-bold text-base text-burgundy">
                  3. Payment Mode: Cash on Delivery
                </h3>
              </div>

              <div className="space-y-4">
                {/* Active COD Highlight Card */}
                <div className="p-5 rounded-2xl border-2 border-burgundy bg-burgundy-50/40 relative">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-burgundy text-gold-200 flex items-center justify-center shrink-0 mt-0.5">
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-charcoal">
                            Cash / Pay on Delivery (COD)
                          </h4>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                            Active Mode
                          </span>
                        </div>
                        <p className="text-xs text-charcoal-600 mt-1 leading-relaxed">
                          Zero advance payment required. Inspect the tamper-evident luxury vault seal upon arrival and pay via <b>Cash</b> or scan the courier's <b>UPI QR code (GPay / PhonePe / Paytm)</b>.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-burgundy/10 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-charcoal-600">
                    <span className="flex items-center gap-1.5 text-emerald-800 font-medium">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% Insured Armoured Transit
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-800 font-medium">
                      <Award className="w-4 h-4 text-emerald-600" /> Open-box Seal Inspection
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-ivory rounded-xl border border-ivory-200 flex items-center gap-2 text-xs text-charcoal-500">
                  <AlertCircle className="w-4 h-4 text-gold-700 shrink-0" />
                  <span>Online card gateway is under scheduled maintenance. Cash on Delivery is 100% operational across India.</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: ORDER SUMMARY (5 COLS) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-4 sm:p-8 border border-ivory-300 shadow-sm sticky top-28 space-y-6">
              
              <h3 className="font-serif font-bold text-lg text-burgundy pb-3 border-b border-ivory-200">
                Order Summary ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
              </h3>

              {/* Items List */}
              <div className="max-h-60 overflow-y-auto divide-y divide-ivory-200 pr-1">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="py-3 flex gap-3">
                    <img 
                      src={item.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800'} 
                      alt={item.name} 
                      className="w-14 h-14 object-cover rounded-xl border border-ivory-200 shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-serif font-bold text-charcoal truncate">{item.name}</p>
                      <p className="text-[10px] text-charcoal-400">Qty: {item.quantity} | Size: {item.selectedSize}</p>
                      <p className="text-xs font-serif font-bold text-burgundy mt-1">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Breakdown */}
              <div className="space-y-2 pt-4 border-t border-ivory-200 text-xs text-charcoal-600">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-charcoal">{formatPrice(cartSubtotal)}</span>
                </div>

                {includeGiftBox && (
                  <div className="flex justify-between text-gold-800 font-medium">
                    <span className="flex items-center gap-1.5"><Gift className="w-3.5 h-3.5" /> Luxury Gift Box & Ribbon</span>
                    <span className="font-bold uppercase text-[10px] bg-gold/15 px-1.5 py-0.5 rounded text-gold-900">Complimentary</span>
                  </div>
                )}

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Privilege Discount ({appliedCoupon?.code})</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Insured Express Vault Shipping</span>
                  <span className="font-semibold text-emerald-800">
                    {deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}
                  </span>
                </div>

                <div className="flex justify-between text-lg font-serif font-bold text-burgundy pt-3 border-t border-ivory-300">
                  <span>Payable at Handover</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
                <p className="text-[10px] text-charcoal-400">All applicable GST & transit insurance included.</p>
              </div>

              {/* Place Order CTA */}
              {!user ? (
                <button
                  type="button"
                  onClick={() => setIsAuthOpen(true)}
                  className="w-full py-4 bg-burgundy hover:bg-burgundy-600 text-gold-200 font-sans font-bold text-xs uppercase tracking-widest rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                >
                  <Lock className="w-4 h-4 text-gold-200" />
                  <span>Sign In to Place Order</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 bg-burgundy hover:bg-burgundy-600 text-gold-200 font-sans font-bold text-xs uppercase tracking-widest rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                >
                  {isProcessing ? (
                    <span>Dispatching to Vault Logistics...</span>
                  ) : (
                    <>
                      <Banknote className="w-4 h-4 text-gold-200" />
                      <span>Confirm Order with COD • {formatPrice(finalTotal)}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              )}

              <div className="p-3 rounded-xl bg-ivory text-[10px] text-charcoal-500 space-y-1">
                <p className="flex items-center gap-1.5 font-semibold text-charcoal">
                  <ShieldCheck className="w-3.5 h-3.5 text-burgundy" /> 100% Insured Delivery Guarantee
                </p>
                <p>If anything happens in transit, Tiwari Jewellers replaces or cancels the order with zero liability to you.</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
