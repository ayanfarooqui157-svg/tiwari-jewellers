import React, { useEffect } from 'react';
import { ShopProvider } from './context/ShopContext';
import { useShop } from './context/useShop';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { Toast } from './components/Toast';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

const MainLayout = () => {
  const { currentView } = useShop();

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-ivory text-charcoal font-sans selection:bg-gold-200 selection:text-burgundy-950">
      {/* 1. Global Navigation Bar */}
      <Navbar />

      {/* 2. Main Page View Content */}
      <main className="flex-1">
        {currentView === 'home' && <HomePage />}
        {currentView === 'shop' && <ShopPage />}
        {currentView === 'product' && <ProductDetailPage />}
        {currentView === 'checkout' && <CheckoutPage />}
        {currentView === 'profile' && <UserProfilePage />}
        {currentView === 'admin' && <AdminDashboard />}
        {currentView === 'about' && <AboutPage />}
        {currentView === 'contact' && <ContactPage />}
      </main>

      {/* 3. Global Luxury Footer */}
      <Footer />

      {/* 4. Global Modals and Drawers */}
      <CartDrawer />
      <AuthModal />
      <ProductQuickViewModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainLayout />
    </ShopProvider>
  );
}
