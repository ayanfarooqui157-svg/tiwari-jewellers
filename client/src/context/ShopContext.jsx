import React, { useState, useEffect } from 'react';
import { ShopContext } from './shop-context';

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cart State (stored in localStorage)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('tj_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist State (stored in localStorage)
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('tj_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // User Auth State
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('tj_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Clean out any lingering demo account
        if (parsed && parsed.email !== 'priya@example.com' && parsed.id !== 'usr-01') {
          return parsed;
        }
        localStorage.removeItem('tj_user');
      }
      return null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('tj_token') || null;
    } catch {
      return null;
    }
  });

  // Navigation / Active View
  const [currentView, setCurrentView] = useState('home'); // 'home', 'shop', 'product', 'cart', 'checkout', 'profile', 'admin', 'about', 'contact'
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // UI Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Coupon / Promo State
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('tj_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('tj_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('tj_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('tj_user');
    }
  }, [user]);

  const requestProducts = async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`/api/products?${queryParams}`);
    return response.json();
  };

  const requestCategories = async () => {
    const response = await fetch('/api/categories');
    return response.json();
  };

  const fetchProducts = async (params = {}) => {
    try {
      setLoading(true);
      const json = await requestProducts(params);
      if (json.success) setProducts(json.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const json = await requestCategories();
      if (json.success) setCategories(json.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    let active = true;
    requestProducts()
      .then(json => {
        if (active && json.success) setProducts(json.data);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    requestCategories()
      .then(json => {
        if (active && json.success) setCategories(json.data);
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
      });

    return () => {
      active = false;
    };
  }, []);

  // Show Toast
  const showToast = (title, message, type = 'success') => {
    setToastMessage({ title, message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  // Cart operations
  const addToCart = (product, selectedSize = null, selectedMetal = null, quantity = 1) => {
    const size = selectedSize || (product.availableSizes && product.availableSizes[0]) || 'Standard';
    const metal = selectedMetal || product.metal || 'Standard';
    const cartItemId = `${product.id}-${size}-${metal}`;
    const safeImage = Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : (typeof product.images === 'string' ? product.images : 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80');

    setCart(prev => {
      const existing = prev.find(item => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prev,
          {
            cartItemId,
            id: product.id,
            name: product.name,
            sku: product.sku,
            price: product.price,
            originalPrice: product.originalPrice,
            image: safeImage,
            selectedSize: size,
            selectedMetal: metal,
            category: product.category,
            quantity
          }
        ];
      }
    });

    showToast('Added to Shopping Bag', `${product.name} (${size}) added.`, 'gold');
    setIsCartOpen(true);
  };

  const updateCartQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
    showToast('Item Removed', 'The item was removed from your bag.', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Wishlist toggle
  const toggleWishlist = async (productId) => {
    const isWishlisted = wishlist.includes(productId);
    const prod = products.find(p => p.id === productId);

    setWishlist(prev =>
      isWishlisted ? prev.filter(id => id !== productId) : [...prev, productId]
    );

    if (user) {
      try {
        await fetch('/api/auth/wishlist/toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, productId })
        });
      } catch (err) {
        console.error('Wishlist sync error:', err);
      }
    }

    if (isWishlisted) {
      showToast('Removed from Wishlist', prod?.name || 'Item removed', 'info');
    } else {
      showToast('Saved to Wishlist', `${prod?.name || 'Item'} added to your wishlist.`, 'burgundy');
    }
  };

  // Cart Totals Calculation
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = 1999;
  const deliveryCharge = cartSubtotal >= freeShippingThreshold || cartSubtotal === 0 ? 0 : 250;
  
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountAmount) {
      discountAmount = appliedCoupon.discountAmount;
    }
  }

  const finalTotal = Math.max(0, cartSubtotal - discountAmount + deliveryCharge);
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Apply Coupon
  const applyCouponCode = async (code) => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal: cartSubtotal })
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon(data);
        showToast('Coupon Applied', `Code ${data.code} applied: -₹${data.discountAmount.toLocaleString('en-IN')}`, 'gold');
        return { success: true };
      } else {
        showToast('Invalid Coupon', data.message, 'error');
        return { success: false, message: data.message };
      }
    } catch (err) {
      showToast('Error', 'Could not apply coupon.', 'error');
      return { success: false, message: err.message };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon Removed', 'Coupon discount removed from total.', 'info');
  };

  // Navigation helpers
  const navigateToProduct = (productId) => {
    setSelectedProductId(productId);
    setCurrentView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCategory = (catSlug) => {
    setSelectedCategory(catSlug);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateTo = (view) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth helpers
  const login = (userData, userToken = null) => {
    setUser(userData);
    if (userToken) {
      setToken(userToken);
      localStorage.setItem('tj_token', userToken);
    }
    setIsAuthOpen(false);
    showToast('Welcome Back', `Logged in as ${userData.name}`, 'gold');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('tj_token');
    showToast('Logged Out', 'You have been signed out successfully.', 'info');
    if (currentView === 'admin' || currentView === 'profile') {
      setCurrentView('home');
    }
  };

  // Format currency in Indian Rupees
  const formatPrice = (val) => {
    if (val === undefined || val === null) return '₹0';
    return `₹${Number(val).toLocaleString('en-IN')}`;
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        categories,
        loading,
        error,
        fetchProducts,
        fetchCategories,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        freeShippingThreshold,
        deliveryCharge,
        discountAmount,
        finalTotal,
        totalCartCount,
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
        wishlist,
        toggleWishlist,
        user,
        token,
        login,
        logout,
        currentView,
        setCurrentView,
        navigateTo,
        navigateToProduct,
        navigateToCategory,
        selectedProductId,
        setSelectedProductId,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        isCartOpen,
        setIsCartOpen,
        isAuthOpen,
        setIsAuthOpen,
        quickViewProduct,
        setQuickViewProduct,
        toastMessage,
        showToast,
        formatPrice
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
