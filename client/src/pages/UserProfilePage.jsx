import React, { useState, useEffect } from 'react';
import {
  User, Package, Heart, MapPin,
  Trash2, ShoppingBag, CheckCircle2, Plus
} from 'lucide-react';
import { useShop } from '../context/useShop';

export const UserProfilePage = () => {
  const {
    user,
    token,
    logout,
    wishlist,
    toggleWishlist,
    addToCart,
    products,
    navigateTo,
    showToast,
    formatPrice,
    profileTab,
    setProfileTab,
    setIsAuthOpen
  } = useShop();

  const [activeTab, setActiveTab] = useState(profileTab || 'orders'); // 'orders', 'wishlist', 'addresses'
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Synchronize activeTab when profileTab changes (e.g. from Navbar wishlist link)
  useEffect(() => {
    if (profileTab) {
      setActiveTab(profileTab);
    }
  }, [profileTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (setProfileTab) setProfileTab(tab);
  };

  // Address state
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('Maharashtra');
  const [newPincode, setNewPincode] = useState('400001');

  // Fetch user profile and orders
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.email) return;
      try {
        setLoadingOrders(true);
        const headers = {
          'Content-Type': 'application/json'
        };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const [ordersRes, userRes] = await Promise.all([
          fetch(`/api/orders?email=${encodeURIComponent(user.email)}`, { headers }),
          fetch(`/api/auth/me?email=${encodeURIComponent(user.email)}`, { headers })
        ]);
        const ordersData = await ordersRes.json();
        const userData = await userRes.json();

        if (ordersData.success) {
          setOrders(ordersData.data);
        }
        if (userData.success && userData.user?.addresses) {
          setAddresses(userData.user.addresses);
        }
      } catch (err) {
        console.error('Error fetching user profile data:', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchUserData();
  }, [user, token]);

  const wishlistedProducts = (products || []).filter(p => wishlist.includes(p.id));

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newStreet || !newCity || !newPincode) return;
    const addressPayload = {
      fullName: user?.name || 'Patron',
      street: newStreet,
      city: newCity,
      state: newState,
      pincode: newPincode,
      phone: user?.phone || '',
      isDefault: addresses.length === 0
    };

    try {
      if (user?.email) {
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch('/api/auth/addresses', {
          method: 'POST',
          headers,
          body: JSON.stringify({ email: user.email, address: addressPayload })
        });
        const data = await res.json();
        if (data.success) {
          setAddresses(data.data);
          setIsAddingAddress(false);
          setNewStreet('');
          setNewCity('');
          showToast('Address Saved', 'New delivery address added successfully.', 'gold');
          return;
        }
      }
    } catch (err) {
      console.warn('Backend address sync failed, saving locally:', err);
    }

    // Fallback local update
    const newAddr = {
      id: `addr-${Date.now()}`,
      ...addressPayload
    };
    setAddresses(prev => [...prev, newAddr]);
    setIsAddingAddress(false);
    setNewStreet('');
    setNewCity('');
    showToast('Address Saved', 'New delivery address added successfully.', 'gold');
  };

  const handleRemoveAddress = async (id) => {
    try {
      if (user?.email) {
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`/api/auth/addresses/${id}?email=${encodeURIComponent(user.email)}`, {
          method: 'DELETE',
          headers
        });
        const data = await res.json();
        if (data.success) {
          setAddresses(data.data);
          showToast('Address Removed', 'Delivery address removed.', 'info');
          return;
        }
      }
    } catch (err) {
      console.warn('Backend delete address failed, removing locally:', err);
    }
    setAddresses(prev => prev.filter(a => a.id !== id));
    showToast('Address Removed', 'Delivery address removed.', 'info');
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] bg-ivory flex flex-col items-center justify-center p-8 text-center">
        <User className="w-12 h-12 text-burgundy mb-3 opacity-60" />
        <h2 className="font-serif text-2xl font-bold text-burgundy mb-2">Sign in to Access Your Vault</h2>
        <p className="text-xs text-charcoal-500 mb-6 font-sans max-w-sm">
          Track orders, access saved heirloom wishlist pieces and manage verified delivery addresses.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setIsAuthOpen(true)}
            className="px-6 py-3 bg-burgundy hover:bg-burgundy-600 text-gold-200 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow"
          >
            Sign In / Register
          </button>
          <button
            onClick={() => navigateTo('home')}
            className="px-6 py-3 bg-ivory-100 hover:bg-ivory-200 text-charcoal-700 rounded-full text-xs font-bold uppercase tracking-widest transition-all"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ivory min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Patron Banner Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-300 shadow-sm mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-burgundy text-gold-200 font-serif font-bold text-2xl flex items-center justify-center border-2 border-gold/40 shadow-md">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-serif font-bold text-burgundy">{user.name}</h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-gold/20 text-gold-900 border border-gold/40">
                  {user.role === 'admin' ? 'Store Administrator' : 'Royal Patron Tier'}
                </span>
              </div>
              <p className="text-xs text-charcoal-500 font-sans mt-0.5">{user.email} • {user.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.role === 'admin' && (
              <button
                onClick={() => navigateTo('admin')}
                className="px-4 py-2 bg-burgundy text-gold-200 rounded-xl text-xs font-bold uppercase tracking-wider shadow"
              >
                Open Admin Portal
              </button>
            )}
            <button
              onClick={logout}
              className="px-4 py-2 border border-ivory-300 hover:bg-red-50 text-red-600 rounded-xl text-xs font-semibold transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-ivory-300 gap-6 sm:gap-10 mb-8 overflow-x-auto">
          <button
            onClick={() => handleTabChange('orders')}
            className={`pb-3 text-xs sm:text-sm font-serif font-bold uppercase tracking-wider transition-all relative flex items-center gap-2 ${
              activeTab === 'orders' ? 'text-burgundy' : 'text-charcoal-400 hover:text-charcoal'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History ({orders.length})</span>
            {activeTab === 'orders' && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-gold" />}
          </button>

          <button
            onClick={() => handleTabChange('wishlist')}
            className={`pb-3 text-xs sm:text-sm font-serif font-bold uppercase tracking-wider transition-all relative flex items-center gap-2 ${
              activeTab === 'wishlist' ? 'text-burgundy' : 'text-charcoal-400 hover:text-charcoal'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Wishlist ({wishlist.length})</span>
            {activeTab === 'wishlist' && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-gold" />}
          </button>

          <button
            onClick={() => handleTabChange('addresses')}
            className={`pb-3 text-xs sm:text-sm font-serif font-bold uppercase tracking-wider transition-all relative flex items-center gap-2 ${
              activeTab === 'addresses' ? 'text-burgundy' : 'text-charcoal-400 hover:text-charcoal'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses ({addresses.length})</span>
            {activeTab === 'addresses' && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-gold" />}
          </button>
        </div>

        {/* TAB 1: ORDER HISTORY WITH TRACKING */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {loadingOrders ? (
              <p className="text-xs text-charcoal-400">Loading order records...</p>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-ivory-300">
                <Package className="w-12 h-12 text-charcoal-300 mx-auto mb-3" />
                <h3 className="font-serif text-xl font-bold text-charcoal mb-1">No Orders Yet</h3>
                <p className="text-xs text-charcoal-400 mb-6">Explore our curated collections and place your first royal order.</p>
                <button
                  onClick={() => navigateTo('shop')}
                  className="px-6 py-2.5 bg-burgundy text-gold-200 text-xs font-bold uppercase tracking-widest rounded-full"
                >
                  Shop Jewellery
                </button>
              </div>
            ) : (
              orders.map((ord) => (
                <div key={ord.id} className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-300 shadow-sm space-y-6">
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-ivory-200 gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-charcoal-400 tracking-wider">Order Reference</span>
                      <p className="font-mono font-bold text-burgundy text-base">{ord.id}</p>
                      <span className="text-xs text-charcoal-400">
                        Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        ord.orderStatus === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.orderStatus === 'Shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ord.orderStatus}
                      </span>
                      <span className="text-sm font-serif font-bold text-burgundy">
                        {formatPrice(ord.pricing?.total || 0)}
                      </span>
                    </div>
                  </div>

                  {/* Visual Status Progress Stepper */}
                  <div className="py-2">
                    <p className="text-xs font-bold text-charcoal mb-3 uppercase tracking-wider text-[10px]">
                      Vault Transit Stepper
                    </p>
                    <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                      {['Order Placed', 'Crafting / Processing', 'Shipped in Vault', 'Delivered'].map((step, idx) => {
                        const isDone =
                          (ord.orderStatus === 'Processing' && idx <= 1) ||
                          (ord.orderStatus === 'Shipped' && idx <= 2) ||
                          (ord.orderStatus === 'Delivered' && idx <= 3) ||
                          (idx === 0);

                        return (
                          <div key={idx} className="flex flex-col items-center">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center mb-1 text-xs font-bold transition-all ${
                              isDone ? 'bg-burgundy text-gold-200 shadow' : 'bg-ivory-200 text-charcoal-400'
                            }`}>
                              {idx + 1}
                            </div>
                            <span className={`text-[10px] ${isDone ? 'font-bold text-charcoal' : 'text-charcoal-400'}`}>
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Items in order */}
                  <div className="divide-y divide-ivory-200 pt-2 border-t border-ivory-200">
                    {ord.items && ord.items.map((item, i) => (
                      <div key={i} className="py-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <img 
                            src={item.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800'} 
                            alt={item.name} 
                            className="w-12 h-12 object-cover rounded-xl border border-ivory-200" 
                          />
                          <div>
                            <h4 className="font-serif font-bold text-charcoal">{item.name}</h4>
                            <p className="text-[10px] text-charcoal-400">Qty: {item.quantity} | Size: {item.selectedSize} | {item.selectedMetal}</p>
                          </div>
                        </div>
                        <span className="font-serif font-bold text-burgundy">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Tracking reference */}
                  <div className="p-3 rounded-2xl bg-ivory/60 border border-ivory-200 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-2">
                    <span className="text-charcoal-500">
                      Tracking: <b className="font-mono text-charcoal">{ord.trackingNumber}</b> ({ord.paymentMethod})
                    </span>
                    <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Tamper-Proof Insurance Active
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: WISHLIST */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlistedProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-ivory-300">
                <Heart className="w-12 h-12 text-charcoal-300 mx-auto mb-3" />
                <h3 className="font-serif text-xl font-bold text-charcoal mb-1">Your Wishlist is Empty</h3>
                <p className="text-xs text-charcoal-400 mb-6">Save your favorite earrings, solitaires and necklaces for special occasions.</p>
                <button
                  onClick={() => navigateTo('shop')}
                  className="px-6 py-2.5 bg-burgundy text-gold-200 text-xs font-bold uppercase tracking-widest rounded-full"
                >
                  Discover Collections
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlistedProducts.map((p) => {
                  const thumb = (p.images && p.images[0]) || p.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800';
                  return (
                    <div key={p.id} className="bg-white rounded-3xl overflow-hidden border border-ivory-300 shadow-sm flex flex-col justify-between group">
                      <div className="relative aspect-square overflow-hidden bg-ivory-100">
                        <img src={thumb} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <button
                          onClick={() => toggleWishlist(p.id)}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-burgundy flex items-center justify-center shadow"
                          title="Remove from wishlist"
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] text-gold-700 uppercase font-bold tracking-wider">{p.metal}</span>
                          <h4 className="font-serif font-bold text-sm text-charcoal line-clamp-1 mt-1 mb-2">{p.name}</h4>
                          <p className="font-serif font-bold text-burgundy">{formatPrice(p.price)}</p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-ivory-200">
                          <button
                            onClick={() => {
                              addToCart(p);
                              toggleWishlist(p.id);
                            }}
                            className="w-full py-2 bg-burgundy hover:bg-burgundy-600 text-gold-200 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-1.5"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 text-gold-200" />
                            <span>Move to Bag</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SAVED ADDRESSES */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-serif font-bold text-lg text-burgundy">Saved Vault Delivery Locations</h3>
              <button
                onClick={() => setIsAddingAddress(!isAddingAddress)}
                className="px-4 py-2 bg-burgundy text-gold-200 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add New Address
              </button>
            </div>

            {/* Add Address Form */}
            {isAddingAddress && (
              <form onSubmit={handleAddAddress} className="bg-white rounded-3xl p-6 border border-ivory-300 shadow-sm space-y-4 animate-in fade-in">
                <h4 className="font-serif font-bold text-sm text-burgundy">New Address Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-bold text-charcoal uppercase mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      placeholder="e.g. 104, Regency Tower, Colaba"
                      className="w-full px-3 py-2 text-xs border border-ivory-300 rounded-xl outline-none focus:border-burgundy"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-charcoal uppercase mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      placeholder="Mumbai"
                      className="w-full px-3 py-2 text-xs border border-ivory-300 rounded-xl outline-none focus:border-burgundy"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-charcoal uppercase mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={newState}
                      onChange={(e) => setNewState(e.target.value)}
                      placeholder="Maharashtra"
                      className="w-full px-3 py-2 text-xs border border-ivory-300 rounded-xl outline-none focus:border-burgundy"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-charcoal uppercase mb-1">PIN Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={newPincode}
                      onChange={(e) => setNewPincode(e.target.value)}
                      placeholder="400001"
                      className="w-full px-3 py-2 text-xs border border-ivory-300 rounded-xl outline-none focus:border-burgundy font-mono"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="px-5 py-2 bg-burgundy text-white rounded-xl text-xs font-bold">
                    Save Address
                  </button>
                  <button type="button" onClick={() => setIsAddingAddress(false)} className="px-4 py-2 border border-ivory-300 rounded-xl text-xs text-charcoal-600">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div key={addr.id} className="bg-white rounded-3xl p-6 border border-ivory-300 shadow-sm relative flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-serif font-bold text-charcoal text-sm">{addr.fullName}</h4>
                      {addr.isDefault && (
                        <span className="text-[10px] bg-gold/20 text-gold-900 font-bold px-2 py-0.5 rounded-full">
                          Default Address
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-charcoal-600 leading-relaxed font-sans">{addr.street}</p>
                    <p className="text-xs text-charcoal-600 font-sans">{addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className="text-[11px] text-charcoal-400 mt-1 font-mono">Mobile: {addr.phone}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-ivory-200 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified PIN
                    </span>
                    {!addr.isDefault && (
                      <button
                        onClick={() => handleRemoveAddress(addr.id)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
