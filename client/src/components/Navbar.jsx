import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, Heart, ShoppingBag, User, Menu, X, 
  Sparkles, ShieldCheck, ChevronDown, ArrowRight,
  LogOut, Package, Settings
} from 'lucide-react';
import { useShop } from '../context/useShop';

export const Navbar = () => {
  const { 
    totalCartCount, 
    wishlist, 
    user, 
    logout, 
    navigateTo, 
    navigateToCategory, 
    navigateToProduct,
    setProfileTab,
    currentView, 
    setIsCartOpen, 
    setIsAuthOpen,
    products,
    formatPrice
  } = useShop();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  const searchInputRef = useRef(null);
  const userMenuRef = useRef(null);

  const announcements = [
    "✨ Festive Sparkle: Enjoy 10% Off with code TIWARI10 on your first order",
    "🛡️ 100% BIS Hallmarked Gold & IGI Certified Natural Diamonds",
    "🚚 Complimentary Insured Express Shipping Across All Pincodes in India",
    "💎 Lifetime Exchange & Buyback Guarantee on all fine jewellery"
  ];

  // Rotate announcement bar every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex(prev => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [announcements.length]);

  const searchResults = useMemo(() => {
    if (searchTerm.trim().length <= 1) return [];

    const query = searchTerm.toLowerCase().trim();
    return (products || []).filter(product =>
      (product.name || '').toLowerCase().includes(query) ||
      (product.category || '').toLowerCase().includes(query) ||
      (product.material || '').toLowerCase().includes(query) ||
      (product.metal || '').toLowerCase().includes(query)
    ).slice(0, 5);
  }, [searchTerm, products]);

  // Focus search input when modal opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile drawer or search modal is open
  useEffect(() => {
    if (isMobileMenuOpen || isSearchOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isMobileMenuOpen, isSearchOpen]);

  // Close overlays on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { label: 'Home', view: 'home' },
    { label: 'All Jewellery', action: () => navigateToCategory('all') },
    { label: 'Gold', action: () => navigateToCategory('gold') },
    { label: 'Silver', action: () => navigateToCategory('silver') },
    { label: 'Rings', action: () => navigateToCategory('rings') },
    { label: 'Earrings', action: () => navigateToCategory('earrings') },
    { label: 'Necklaces', action: () => navigateToCategory('necklaces') },
    { label: 'Bracelets', action: () => navigateToCategory('bracelets') },
    { label: 'About Us', view: 'about' },
    { label: 'Contact Us', view: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm transition-all duration-300">
      {/* 1. ANNOUNCEMENT BAR */}
      <div className="bg-burgundy text-gold-200 py-1.5 px-4 text-xs font-medium tracking-wide flex items-center justify-between border-b border-burgundy-700/50">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="hidden md:flex items-center space-x-4 text-[11px] text-ivory/80">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-gold" /> BIS Hallmarked
            </span>
            <span className="text-burgundy-300">|</span>
            <span>Insured Vault Shipping</span>
          </div>

          {/* Rotating Text */}
          <div className="flex-1 text-center transition-all duration-500 ease-in-out text-ivory/95 font-medium text-xs">
            {announcements[announcementIndex]}
          </div>

          <div className="hidden md:flex items-center space-x-4 text-[11px] text-ivory/80">
            <button 
              onClick={() => {
                if (user?.role === 'admin') navigateTo('admin');
                else navigateTo('contact');
              }}
              className="hover:text-gold transition-colors"
            >
              Concierge: +91 98765 43210
            </button>
            {user?.role === 'admin' && (
              <span className="bg-gold text-burgundy-900 font-bold px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider">
                Admin Mode
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 sm:p-2 -ml-1 text-charcoal hover:text-burgundy focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>

          {/* Brand Logo & Tagline */}
          <div 
            onClick={() => navigateTo('home')} 
            className="flex flex-col items-center cursor-pointer select-none group min-w-0 px-1"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="hidden sm:inline-block w-2.5 h-2.5 bg-gold rounded-full rotate-45 transform group-hover:scale-125 transition-transform" />
              <h1 className="text-base sm:text-2xl md:text-3xl font-serif font-bold tracking-wider sm:tracking-widest text-burgundy uppercase group-hover:text-burgundy-600 transition-colors whitespace-nowrap">
                TIWARI JWELLERS
              </h1>
              <span className="hidden sm:inline-block w-2.5 h-2.5 bg-gold rounded-full rotate-45 transform group-hover:scale-125 transition-transform" />
            </div>
            <p className="text-[7.5px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.28em] text-gold-600 uppercase font-sans font-medium -mt-0.5 whitespace-nowrap">
              Elegance That Lasts Forever
            </p>
          </div>

          {/* Right Action Icons: Search, Wishlist, Account, Shopping Bag */}
          <div className="flex items-center space-x-1 sm:space-x-4">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 sm:p-2 text-charcoal hover:text-burgundy transition-colors hover:bg-ivory rounded-full relative"
              title="Search jewellery"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => {
                if (user) {
                  if (setProfileTab) setProfileTab('wishlist');
                  navigateTo('profile', 'wishlist');
                } else {
                  setIsAuthOpen(true);
                }
              }}
              className="p-1.5 sm:p-2 text-charcoal hover:text-burgundy transition-colors hover:bg-ivory rounded-full relative"
              title="Saved items"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-burgundy text-white text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* User Account / Profile Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => {
                  if (!user) {
                    setIsAuthOpen(true);
                  } else {
                    setIsUserMenuOpen(!isUserMenuOpen);
                  }
                }}
                className="flex items-center gap-1 p-1.5 sm:p-2 text-charcoal hover:text-burgundy transition-colors hover:bg-ivory rounded-full"
                title={user ? `Signed in as ${user.name}` : "Sign In / Register"}
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
                {user && (
                  <span className="hidden md:inline-block text-xs font-medium text-charcoal-700 max-w-[80px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                )}
                {user && <ChevronDown className="w-3.5 h-3.5 text-charcoal-400 hidden md:inline-block" />}
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && user && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-ivory-300 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2.5 border-b border-ivory-200">
                    <p className="text-xs text-charcoal-400 font-medium">Signed in as</p>
                    <p className="text-sm font-semibold text-charcoal truncate">{user.name}</p>
                    <span className="inline-block mt-0.5 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-gold/15 text-gold-800">
                      {user.role === 'admin' ? 'Administrator' : 'Valued Patron'}
                    </span>
                  </div>

                  {user.role === 'admin' && (
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigateTo('admin');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-burgundy flex items-center gap-2.5 hover:bg-burgundy-50 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-burgundy" /> Admin Dashboard
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      if (setProfileTab) setProfileTab('orders');
                      navigateTo('profile', 'orders');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-charcoal-700 flex items-center gap-2.5 hover:bg-ivory transition-colors"
                  >
                    <Package className="w-4 h-4 text-gold-600" /> My Orders & History
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      if (setProfileTab) setProfileTab('wishlist');
                      navigateTo('profile', 'wishlist');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-charcoal-700 flex items-center gap-2.5 hover:bg-ivory transition-colors"
                  >
                    <Heart className="w-4 h-4 text-burgundy" /> Wishlist ({wishlist.length})
                  </button>

                  <div className="border-t border-ivory-200 my-1"></div>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-red-600 flex items-center gap-2.5 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-red-500" /> Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Shopping Bag / Live Cart Counter */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 bg-burgundy hover:bg-burgundy-600 text-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full transition-all duration-200 shadow-sm hover:shadow"
              title="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-gold-200" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 sm:-top-2 sm:-right-2.5 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-gold text-burgundy-900 text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline-block text-xs font-semibold tracking-wide text-ivory">
                Bag
              </span>
            </button>
          </div>
        </div>

        {/* 3. DESKTOP NAVIGATION MENU */}
        <nav className="hidden lg:flex items-center justify-center space-x-7 py-3 border-t border-ivory-200/80">
          {navLinks.map((link, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (link.action) link.action();
                else if (link.view) navigateTo(link.view);
              }}
              className={`text-xs uppercase tracking-wider font-medium transition-all duration-200 py-1 relative group hover:text-burgundy ${
                (link.view && currentView === link.view) ? 'text-burgundy font-bold' : 'text-charcoal-600'
              }`}
            >
              {link.label}
              <span className={`absolute bottom-0 left-0 h-0.5 bg-gold transition-all duration-300 ${
                (link.view && currentView === link.view) ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </button>
          ))}
        </nav>
      </div>

      {/* 4. MOBILE DRAWER MENU (Portalled to document.body with z-[99999] to guarantee it covers the entire website) */}
      {isMobileMenuOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[99999]">
          {/* Background overlay */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu backdrop"
          />

          {/* Navigation drawer */}
          <div className="absolute left-0 top-0 h-full w-[85vw] max-w-xs sm:w-80 bg-white shadow-2xl z-10 overflow-y-auto flex flex-col p-5 sm:p-6 animate-in slide-in-from-left duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-ivory-200 shrink-0">
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xl text-burgundy">TIWARI JWELLERS</span>
                <span className="text-[9px] tracking-widest text-gold-600 uppercase">Elegance That Lasts Forever</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 -mr-2 text-charcoal hover:text-burgundy rounded-full hover:bg-ivory transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="py-4 space-y-1 flex-1">
              {navLinks.map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (link.action) link.action();
                    else if (link.view) navigateTo(link.view);
                  }}
                  className="w-full text-left py-2.5 px-3 text-sm font-medium text-charcoal hover:bg-ivory hover:text-burgundy rounded-lg transition-colors flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gold-500 opacity-60" />
                </button>
              ))}
            </div>

            {/* Patron Account / Admin / Sign In */}
            <div className="mt-auto pt-5 border-t border-ivory-200 shrink-0">
              {user ? (
                <div className="space-y-2.5">
                  <div className="bg-ivory p-3 rounded-lg">
                    <p className="text-xs text-charcoal-400">Signed in as</p>
                    <p className="text-sm font-bold text-burgundy truncate">{user.name}</p>
                    <p className="text-xs text-charcoal-500 truncate">{user.email}</p>
                  </div>
                  {user.role === 'admin' && (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigateTo('admin');
                      }}
                      className="w-full py-2 px-3 bg-burgundy text-gold-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-2"
                    >
                      <Settings className="w-4 h-4" /> Open Admin Portal
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (setProfileTab) setProfileTab('orders');
                      navigateTo('profile', 'orders');
                    }}
                    className="w-full py-2 px-3 border border-burgundy text-burgundy rounded-lg text-xs font-semibold"
                  >
                    My Orders
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (setProfileTab) setProfileTab('wishlist');
                      navigateTo('profile', 'wishlist');
                    }}
                    className="w-full py-2 px-3 border border-burgundy text-burgundy rounded-lg text-xs font-semibold"
                  >
                    My Wishlist ({wishlist.length})
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full py-2 px-3 text-red-600 text-xs font-semibold text-center hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsAuthOpen(true);
                  }}
                  className="w-full py-2.5 px-4 bg-burgundy hover:bg-burgundy-600 text-white rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors"
                >
                  Sign In / Create Account
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 5. LIVE SEARCH POPUP MODAL (Rendered via Portal to document.body) */}
      {isSearchOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/70 backdrop-blur-sm flex items-start justify-center pt-4 sm:pt-20 px-3 sm:px-4 overflow-y-auto animate-in fade-in duration-200">
          <div 
            className="fixed inset-0" 
            onClick={() => {
              setIsSearchOpen(false);
              setSearchTerm('');
            }}
            aria-label="Close search backdrop"
          />
          <div className="relative z-10 bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-ivory-300 overflow-hidden animate-in zoom-in-95 duration-200 my-auto sm:my-0">
            {/* Search Input Bar */}
            <div className="p-4 border-b border-ivory-200 flex items-center gap-3">
              <Search className="w-5 h-5 text-burgundy shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search diamond rings, 22K gold necklaces, silver studs, bangles..."
                className="w-full text-sm sm:text-base outline-none placeholder:text-charcoal-400 font-sans"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="text-xs text-charcoal-400 hover:text-charcoal px-2 py-1 bg-ivory rounded"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchTerm('');
                }}
                className="p-1.5 text-charcoal-400 hover:text-charcoal rounded-full hover:bg-ivory shrink-0"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Categories chips */}
            <div className="px-5 py-3 bg-ivory/60 border-b border-ivory-200 flex items-center gap-2 overflow-x-auto text-xs">
              <span className="text-charcoal-400 whitespace-nowrap">Popular:</span>
              {['Diamond Rings', 'Polki Choker', '22K Gold', '925 Silver', 'Jhumkas', 'Tennis Bracelet'].map((tag, i) => (
                <button
                  key={i}
                  onClick={() => setSearchTerm(tag)}
                  className="px-2.5 py-1 bg-white hover:bg-burgundy hover:text-white rounded-full border border-ivory-300 text-charcoal-600 transition-colors whitespace-nowrap"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Live Search Results */}
            <div className="p-4 max-h-[60vh] sm:max-h-[360px] overflow-y-auto">
              {searchTerm.trim().length > 1 ? (
                searchResults.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-xs text-charcoal-400 font-medium px-2">
                      Found {searchResults.length} matching pieces:
                    </p>
                    {searchResults.map((product) => {
                      const thumb = (product.images && product.images[0]) || product.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800';
                      return (
                        <div
                          key={product.id}
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchTerm('');
                            navigateToProduct(product.id);
                          }}
                          className="flex items-center gap-4 p-2.5 hover:bg-ivory rounded-xl cursor-pointer transition-colors group"
                        >
                          <img
                            src={thumb}
                            alt={product.name}
                            className="w-14 h-14 object-cover rounded-lg border border-ivory-200 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-charcoal group-hover:text-burgundy truncate">
                              {product.name}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-charcoal-500 mt-0.5">
                              <span className="bg-gold-50 text-gold-800 px-1.5 py-0.5 rounded font-medium">
                                {product.metal}
                              </span>
                              <span>•</span>
                              <span>{product.category}</span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-serif font-bold text-burgundy">
                              {formatPrice(product.price)}
                            </p>
                            {product.originalPrice > product.price && (
                              <p className="text-[11px] text-charcoal-400 line-through">
                                {formatPrice(product.originalPrice)}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    <button
                      onClick={() => {
                        setIsSearchOpen(false);
                        navigateToCategory('all');
                      }}
                      className="w-full mt-2 py-2 text-xs text-center font-semibold text-burgundy hover:underline flex items-center justify-center gap-1"
                    >
                      View all jewellery collections <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="py-10 text-center">
                    <Sparkles className="w-8 h-8 text-gold mx-auto mb-2 opacity-70" />
                    <p className="text-sm font-medium text-charcoal">No exact jewellery matches found</p>
                    <p className="text-xs text-charcoal-400 mt-1">Try searching for "Solitaire", "Gold", "Necklace", or "Silver"</p>
                  </div>
                )
              ) : (
                <div className="py-8 text-center text-charcoal-400 text-xs">
                  Type at least 2 characters to search across our luxury catalog.
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};
