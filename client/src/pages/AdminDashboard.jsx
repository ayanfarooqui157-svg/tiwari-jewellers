import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Package, ShoppingCart, AlertTriangle,
  Plus, Edit, Trash2, X, Eye,
  ArrowUpRight, ShieldCheck, Search, MessageSquare, Upload, Lock
} from 'lucide-react';
import { useShop } from '../context/useShop';

export const AdminDashboard = () => {
  const { user, token, setIsAuthOpen, products, fetchProducts, showToast, formatPrice, navigateTo } = useShop();

  const isAdmin = Boolean(user && user.role === 'admin');

  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'products', 'orders', 'inquiries'
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Helper for admin authorization headers
  const getAdminHeaders = (includeContentType = true) => {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (includeContentType) headers['Content-Type'] = 'application/json';
    return headers;
  };

  // Product modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Rings');
  const [formMetal, setFormMetal] = useState('18K Yellow Gold');
  const [formMaterial, setFormMaterial] = useState('Diamond');
  const [formPurity, setFormPurity] = useState('18K (750)');
  const [formPrice, setFormPrice] = useState('');
  const [formOriginalPrice, setFormOriginalPrice] = useState('');
  const [formDiscount, setFormDiscount] = useState('15');
  const [formStock, setFormStock] = useState('10');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formBadge, setFormBadge] = useState('New Arrival');
  const [formDescription, setFormDescription] = useState('');
  const [formGrossWeight, setFormGrossWeight] = useState('3.5 g');
  const [formDiamondWeight, setFormDiamondWeight] = useState('0.50 ct');
  const [uploadingImage, setUploadingImage] = useState(false);

  // File upload handler for product photographs
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploadingImage(true);
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers,
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        setFormImageUrl(data.url);
        showToast('Image Uploaded', 'Product photograph uploaded to vault storage.', 'gold');
      } else {
        showToast('Upload Failed', data.message || 'Could not upload image', 'error');
      }
    } catch (err) {
      showToast('Error', err.message || 'Image upload failed', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  // Product search filter
  const [adminSearch, setAdminSearch] = useState('');

  const fetchAdminData = async () => {
    const headers = getAdminHeaders();
    const responses = await Promise.all([
      fetch('/api/admin/stats', { headers }),
      fetch('/api/orders', { headers }),
      fetch('/api/admin/inquiries', { headers })
    ]);
    const [statsData, ordersData, inqData] = await Promise.all(
      responses.map(response => response.json())
    );
    return { statsData, ordersData, inqData };
  };

  const applyAdminData = ({ statsData, ordersData, inqData }) => {
    if (statsData?.success) setStats(statsData.data);
    if (ordersData?.success) setOrders(ordersData.data);
    if (inqData?.success) setInquiries(inqData.data);
  };

  const loadAdminData = async () => {
    try {
      applyAdminData(await fetchAdminData());
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;
    let active = true;
    fetchAdminData()
      .then(data => {
        if (active) applyAdminData(data);
      })
      .catch(err => {
        console.error('Error fetching admin data:', err);
      });

    return () => {
      active = false;
    };
  }, [isAdmin, token]);

  // Update Inquiry Status
  const handleUpdateInquiryStatus = async (inquiryId, newStatus) => {
    try {
      const res = await fetch(`/api/contact/${inquiryId}/status`, {
        method: 'PATCH',
        headers: getAdminHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setInquiries(prev => prev.map(i => i.id === inquiryId ? { ...i, status: newStatus } : i));
        showToast('Inquiry Updated', `Inquiry ${inquiryId} marked as ${newStatus}`, 'gold');
        loadAdminData();
      }
    } catch {
      showToast('Error', 'Failed to update inquiry status.', 'error');
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: getAdminHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
        showToast('Order Updated', `Order ${orderId} status set to ${newStatus}`, 'gold');
        loadAdminData();
      }
    } catch {
      showToast('Error', 'Failed to update order status.', 'error');
    }
  };

  // Open Add Product Modal
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('Rings');
    setFormMetal('18K Yellow Gold');
    setFormMaterial('Diamond');
    setFormPurity('18K (750)');
    setFormPrice('45000');
    setFormOriginalPrice('52000');
    setFormDiscount('13');
    setFormStock('12');
    setFormImageUrl('https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80');
    setFormBadge('New Arrival');
    setFormDescription('Artisanal fine jewelry created with 100% BIS hallmarked gold and certified conflict-free diamonds.');
    setFormGrossWeight('3.80 g');
    setFormDiamondWeight('0.55 ct');
    setIsProductModalOpen(true);
  };

  // Open Edit Product Modal
  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setFormName(prod.name || '');
    setFormCategory(prod.category || 'Rings');
    setFormMetal(prod.metal || '18K Yellow Gold');
    setFormMaterial(prod.material || 'Diamond');
    setFormPurity(prod.purity || '18K (750)');
    setFormPrice(String(prod.price || ''));
    setFormOriginalPrice(String(prod.originalPrice || prod.price || ''));
    setFormDiscount(String(prod.discount || 0));
    setFormStock(String(prod.stockQuantity || 10));
    setFormImageUrl((prod.images && prod.images[0]) || prod.image || '');
    setFormBadge(prod.badge || 'New Arrival');
    setFormDescription(prod.description || '');
    setFormGrossWeight(prod.specifications?.grossWeight || '3.5 g');
    setFormDiamondWeight(prod.specifications?.diamondWeight || '0.50 ct');
    setIsProductModalOpen(true);
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formName || !formPrice) return;

    const payload = {
      name: formName,
      category: formCategory,
      metal: formMetal,
      material: formMaterial,
      purity: formPurity,
      price: Number(formPrice),
      originalPrice: Number(formOriginalPrice) || Number(formPrice),
      discount: Number(formDiscount),
      stockQuantity: Number(formStock),
      inStock: Number(formStock) > 0,
      images: [formImageUrl],
      badge: formBadge,
      description: formDescription,
      grossWeight: formGrossWeight,
      diamondWeight: formDiamondWeight
    };

    try {
      if (editingProduct) {
        // Update
        const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: getAdminHeaders(),
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          showToast('Product Updated', `${data.data.name} modified successfully.`, 'gold');
        }
      } else {
        // Create
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: getAdminHeaders(),
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          showToast('Product Added', `${data.data.name} added to catalog!`, 'gold');
        }
      }
      setIsProductModalOpen(false);
      fetchProducts();
      loadAdminData();
    } catch {
      showToast('Error', 'Could not save product.', 'error');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from Tiwari Jewellers catalog?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: getAdminHeaders(false)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Product Removed', `${name} deleted from active catalog.`, 'info');
        fetchProducts();
        loadAdminData();
      }
    } catch {
      showToast('Error', 'Could not delete product.', 'error');
    }
  };

  const filteredAdminProducts = (products || []).filter(p => 
    (p.name || '').toLowerCase().includes(adminSearch.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(adminSearch.toLowerCase()) ||
    (p.sku || '').toLowerCase().includes(adminSearch.toLowerCase())
  );

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] bg-ivory flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-ivory-300 shadow-xl text-center">
          <div className="w-16 h-16 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center mx-auto mb-4 border border-burgundy/20">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-burgundy mb-2">Restricted Access</h2>
          <p className="text-xs text-charcoal-600 font-sans leading-relaxed mb-6">
            This administrative vault is reserved exclusively for Tiwari Jewellers store administrators. Please sign in with authorized administrator credentials.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setIsAuthOpen(true)}
              className="w-full py-3.5 bg-burgundy hover:bg-burgundy-600 text-gold-200 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-md"
            >
              Sign In as Administrator
            </button>
            <button
              onClick={() => navigateTo('home')}
              className="w-full py-3.5 bg-ivory-100 hover:bg-ivory-200 text-charcoal-700 rounded-full text-xs font-bold uppercase tracking-widest transition-all"
            >
              Return to Boutique Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ivory min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Executive Header */}
        <div className="bg-burgundy text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-[10px] font-bold text-gold-200 uppercase tracking-widest mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> High-Jewellery Executive Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ivory">
              TIWARI JWELLERS – Administration Suite
            </h1>
            <p className="text-xs text-ivory/80 font-sans mt-1">
              Active Executive: <b>{user?.name || 'Administrator'}</b> • Zaveri Bazaar Flagship & Pan-India Registry
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <button
              onClick={handleOpenAddModal}
              className="px-5 py-3 rounded-full bg-gold hover:bg-gold-600 text-burgundy-950 font-bold text-xs uppercase tracking-widest shadow-lg flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" /> Add New Jewellery Design
            </button>
            <button
              onClick={() => navigateTo('home')}
              className="px-4 py-3 rounded-full bg-white/10 hover:bg-white/20 text-ivory text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Storefront
            </button>
          </div>

          <div className="absolute right-0 bottom-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-ivory-300 gap-6 sm:gap-10 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-xs sm:text-sm font-serif font-bold uppercase tracking-wider transition-all relative flex items-center gap-2 ${
              activeTab === 'overview' ? 'text-burgundy' : 'text-charcoal-400 hover:text-charcoal'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Overview & Sales Analytics</span>
            {activeTab === 'overview' && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-gold" />}
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 text-xs sm:text-sm font-serif font-bold uppercase tracking-wider transition-all relative flex items-center gap-2 ${
              activeTab === 'products' ? 'text-burgundy' : 'text-charcoal-400 hover:text-charcoal'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Catalog ({(products || []).length})</span>
            {activeTab === 'products' && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-gold" />}
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-xs sm:text-sm font-serif font-bold uppercase tracking-wider transition-all relative flex items-center gap-2 ${
              activeTab === 'orders' ? 'text-burgundy' : 'text-charcoal-400 hover:text-charcoal'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Orders & Dispatch ({orders.length})</span>
            {activeTab === 'orders' && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-gold" />}
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`pb-3 text-xs sm:text-sm font-serif font-bold uppercase tracking-wider transition-all relative flex items-center gap-2 ${
              activeTab === 'inquiries' ? 'text-burgundy' : 'text-charcoal-400 hover:text-charcoal'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>VIP Inquiries ({inquiries.length})</span>
            {inquiries.some(i => i.status === 'pending') && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            )}
            {activeTab === 'inquiries' && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-gold" />}
          </button>
        </div>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-ivory-300 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-charcoal-400 tracking-wider">Total Sales Volume</span>
                  <h3 className="text-2xl font-serif font-bold text-burgundy mt-1">
                    {formatPrice(stats?.totalSales || 185599)}
                  </h3>
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                    <ArrowUpRight className="w-3.5 h-3.5" /> +24% Festive Spike
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gold/15 text-gold-800 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-ivory-300 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-charcoal-400 tracking-wider">Vault Orders Placed</span>
                  <h3 className="text-2xl font-serif font-bold text-burgundy mt-1">
                    {stats?.totalOrders || orders.length}
                  </h3>
                  <span className="text-[11px] text-charcoal-400 mt-1 block">
                    Pan-India Insured Dispatch
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-burgundy/10 text-burgundy flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-ivory-300 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-charcoal-400 tracking-wider">Active Catalog Designs</span>
                  <h3 className="text-2xl font-serif font-bold text-burgundy mt-1">
                    {(products || []).length}
                  </h3>
                  <span className="text-[11px] text-charcoal-400 mt-1 block">
                    Gold, Diamond & Silver
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gold/15 text-gold-800 flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-ivory-300 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-charcoal-400 tracking-wider">Low Stock Alerts</span>
                  <h3 className="text-2xl font-serif font-bold text-amber-700 mt-1">
                    {stats?.lowStockCount || (products || []).filter(p => p.stockQuantity < 5).length}
                  </h3>
                  <span className="text-[11px] text-amber-700 font-semibold mt-1 block">
                    Restock karigar batches
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Category Breakdown Visual Chart */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-300 shadow-sm">
              <h3 className="font-serif font-bold text-lg text-burgundy mb-4">
                Jewellery Category Distribution
              </h3>

              <div className="space-y-4">
                {['Rings', 'Earrings', 'Necklaces', 'Pendants', 'Bracelets', 'Bangles'].map((cat) => {
                  const count = (products || []).filter(p => p.category === cat).length;
                  const pct = Math.round((count / ((products || []).length || 1)) * 100);

                  return (
                    <div key={cat} className="space-y-1.5 text-xs">
                      <div className="flex justify-between font-semibold text-charcoal">
                        <span>{cat}</span>
                        <span>{count} Designs ({pct}%)</span>
                      </div>
                      <div className="w-full bg-ivory-200 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-burgundy h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCT MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-300 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  placeholder="Search design, SKU, metal..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-ivory-300 rounded-xl outline-none focus:border-burgundy"
                />
              </div>

              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2.5 bg-burgundy hover:bg-burgundy-600 text-gold-200 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" /> Add New Piece
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-ivory-300 text-charcoal-400 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-2">Design Piece</th>
                    <th className="py-3 px-2">Category</th>
                    <th className="py-3 px-2">Metal Purity</th>
                    <th className="py-3 px-2">Price (INR)</th>
                    <th className="py-3 px-2">Stock</th>
                    <th className="py-3 px-2">Badge</th>
                    <th className="py-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-200">
                  {filteredAdminProducts.map((prod) => {
                    const thumb = (prod.images && prod.images[0]) || prod.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800';
                    return (
                      <tr key={prod.id} className="hover:bg-ivory/50">
                        <td className="py-3 px-2 flex items-center gap-3">
                          <img src={thumb} alt={prod.name} className="w-12 h-12 object-cover rounded-xl border border-ivory-200 shrink-0" />
                          <div>
                            <p className="font-serif font-bold text-charcoal">{prod.name}</p>
                            <p className="font-mono text-[10px] text-charcoal-400">{prod.sku || 'TJ-ROYAL'}</p>
                          </div>
                        </td>
                        <td className="py-3 px-2 font-medium text-charcoal">{prod.category}</td>
                        <td className="py-3 px-2">
                          <span className="px-2 py-0.5 rounded bg-gold/15 text-gold-900 font-bold text-[10px]">
                            {prod.metal}
                          </span>
                        </td>
                        <td className="py-3 px-2 font-serif font-bold text-burgundy">
                          {formatPrice(prod.price)}
                        </td>
                        <td className="py-3 px-2">
                          <span className={`font-bold ${prod.stockQuantity < 5 ? 'text-red-600' : 'text-charcoal'}`}>
                            {prod.stockQuantity} units
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          {prod.badge ? (
                            <span className="px-2 py-0.5 rounded bg-burgundy text-gold-100 font-bold text-[9px]">
                              {prod.badge}
                            </span>
                          ) : (
                            <span className="text-charcoal-300">-</span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditModal(prod)}
                              className="p-1.5 text-charcoal-500 hover:text-burgundy rounded-lg hover:bg-ivory"
                              title="Edit Product"
                              aria-label="Edit product"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id, prod.name)}
                              className="p-1.5 text-charcoal-500 hover:text-red-600 rounded-lg hover:bg-red-50"
                              title="Delete Product"
                              aria-label="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDER MANAGEMENT & STATUS UPDATES */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-300 shadow-sm space-y-6">
            <h3 className="font-serif font-bold text-lg text-burgundy">
              Order Fulfillment & Courier Dispatch
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-ivory-300 text-charcoal-400 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-2">Order ID</th>
                    <th className="py-3 px-2">Patron Details</th>
                    <th className="py-3 px-2">Items</th>
                    <th className="py-3 px-2">Total (₹)</th>
                    <th className="py-3 px-2">Payment Mode</th>
                    <th className="py-3 px-2">Current Status</th>
                    <th className="py-3 px-2">Change Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-200">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-ivory/50">
                      <td className="py-3 px-2 font-mono font-bold text-burgundy">{ord.id}</td>
                      <td className="py-3 px-2">
                        <p className="font-bold text-charcoal">{ord.customer?.name}</p>
                        <p className="text-[10px] text-charcoal-400">{ord.shippingAddress?.city}, {ord.shippingAddress?.pincode}</p>
                        <button
                          type="button"
                          aria-expanded={expandedOrderId === ord.id}
                          onClick={() => setExpandedOrderId(expandedOrderId === ord.id ? null : ord.id)}
                          className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-burgundy hover:text-gold-800"
                        >
                          <Eye className="w-3 h-3" />
                          {expandedOrderId === ord.id ? 'Hide details' : 'View contact & address'}
                        </button>
                        {expandedOrderId === ord.id && (
                          <div className="mt-2 space-y-1 rounded-lg bg-ivory p-2 text-[10px] text-charcoal-600">
                            <p><span className="font-semibold">Email:</span> {ord.customer?.email || 'Not provided'}</p>
                            <p><span className="font-semibold">Phone:</span> {ord.shippingAddress?.phone || ord.customer?.phone || 'Not provided'}</p>
                            <p>
                              <span className="font-semibold">Shipping address:</span>{' '}
                              {[
                                ord.shippingAddress?.street,
                                ord.shippingAddress?.city,
                                ord.shippingAddress?.state,
                                ord.shippingAddress?.pincode
                              ].filter(Boolean).join(', ') || 'Not provided'}
                            </p>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-2">
                        <span className="font-medium text-charcoal">{ord.items?.length || 1} Item(s)</span>
                      </td>
                      <td className="py-3 px-2 font-serif font-bold text-burgundy">
                        {formatPrice(ord.pricing?.total || 0)}
                      </td>
                      <td className="py-3 px-2 text-[11px] text-charcoal-600">{ord.paymentMethod}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          ord.orderStatus === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.orderStatus === 'Shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : ord.orderStatus === 'Processing'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-charcoal-100 text-charcoal-700'
                        }`}>
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className="px-2 py-1 bg-ivory border border-ivory-300 rounded-lg text-xs font-semibold text-charcoal cursor-pointer"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: INQUIRIES & CONCIERGE REQUESTS */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-300 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-ivory-200 mb-6 gap-4">
              <div>
                <h3 className="font-serif font-bold text-xl text-burgundy">
                  VIP Patron Consultation Inquiries
                </h3>
                <p className="text-xs text-charcoal-400 font-sans mt-0.5">
                  Direct requests submitted via Contact & Concierge page.
                </p>
              </div>
              <span className="px-3 py-1 bg-burgundy/10 text-burgundy font-serif font-bold text-xs rounded-full">
                Total Inquiries: {inquiries.length}
              </span>
            </div>

            {inquiries.length === 0 ? (
              <div className="text-center py-12 text-charcoal-400 text-xs">
                No inquiries submitted yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs">
                  <thead>
                    <tr className="border-b border-ivory-200 text-charcoal-400 font-bold uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-2">Ticket ID</th>
                      <th className="py-3 px-2">Patron Details</th>
                      <th className="py-3 px-2">Subject</th>
                      <th className="py-3 px-2">Inquiry Message</th>
                      <th className="py-3 px-2">Date</th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ivory-100">
                    {inquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-ivory/50 transition-colors">
                        <td className="py-3 px-2 font-mono font-bold text-burgundy">{inq.id}</td>
                        <td className="py-3 px-2">
                          <p className="font-bold text-charcoal">{inq.name}</p>
                          <p className="text-charcoal-400 text-[11px]">{inq.email}</p>
                          <p className="text-charcoal-400 text-[11px]">{inq.phone}</p>
                        </td>
                        <td className="py-3 px-2 font-medium text-charcoal">{inq.subject}</td>
                        <td className="py-3 px-2 text-charcoal-600 max-w-xs">{inq.message}</td>
                        <td className="py-3 px-2 text-charcoal-400 text-[11px]">
                          {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString('en-IN') : 'Recent'}
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            inq.status === 'resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : inq.status === 'contacted'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {inq.status}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <select
                            value={inq.status}
                            onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                            className="px-2 py-1 bg-ivory border border-ivory-300 rounded-lg text-xs font-semibold text-charcoal cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="contacted">Contacted</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-ivory-300 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-ivory-200 mb-6">
              <h3 className="font-serif font-bold text-xl text-burgundy">
                {editingProduct ? 'Edit Jewellery Piece' : 'Add New Jewellery Design'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="p-1" aria-label="Close modal">
                <X className="w-5 h-5 text-charcoal-400" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-charcoal uppercase mb-1">Design Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Royal Solitaire Harmony Ring"
                    className="w-full px-3 py-2 text-xs border border-ivory-300 rounded-xl outline-none focus:border-burgundy"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-charcoal uppercase mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-ivory-300 rounded-xl outline-none focus:border-burgundy bg-white"
                  >
                    {['Rings', 'Earrings', 'Necklaces', 'Pendants', 'Bracelets', 'Bangles'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-charcoal uppercase mb-1">Metal & Purity</label>
                  <input
                    type="text"
                    required
                    value={formMetal}
                    onChange={(e) => setFormMetal(e.target.value)}
                    placeholder="e.g. 22K Yellow Gold"
                    className="w-full px-3 py-2 text-xs border border-ivory-300 rounded-xl outline-none focus:border-burgundy"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-charcoal uppercase mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="48000"
                    className="w-full px-3 py-2 text-xs border border-ivory-300 rounded-xl outline-none focus:border-burgundy"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-charcoal uppercase mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(e.target.value)}
                    placeholder="58000"
                    className="w-full px-3 py-2 text-xs border border-ivory-300 rounded-xl outline-none focus:border-burgundy"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-charcoal uppercase mb-1">Inventory Units in Stock</label>
                  <input
                    type="number"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    placeholder="10"
                    className="w-full px-3 py-2 text-xs border border-ivory-300 rounded-xl outline-none focus:border-burgundy"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-charcoal uppercase mb-1">Badge Tag</label>
                  <select
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-ivory-300 rounded-xl outline-none focus:border-burgundy bg-white"
                  >
                    <option value="Bestseller">Bestseller</option>
                    <option value="New Arrival">New Arrival</option>
                    <option value="Festive Special">Festive Special</option>
                    <option value="">None</option>
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold text-charcoal uppercase">Product Photograph</label>
                    <span className="text-[10px] text-charcoal-400">Upload from device or enter URL</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    {/* Device Upload Input */}
                    <div>
                      <label className={`flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                        uploadingImage ? 'border-gold bg-gold/5 opacity-70' : 'border-ivory-300 hover:border-burgundy hover:bg-ivory'
                      }`}>
                        <Upload className="w-4 h-4 text-burgundy" />
                        <span className="text-xs font-semibold text-charcoal">
                          {uploadingImage ? 'Uploading...' : 'Choose File from PC'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingImage}
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Direct Image URL input */}
                    <div>
                      <input
                        type="text"
                        value={formImageUrl}
                        onChange={(e) => setFormImageUrl(e.target.value)}
                        placeholder="Or paste image URL..."
                        className="w-full px-3 py-2.5 text-xs border border-ivory-300 rounded-xl outline-none focus:border-burgundy"
                      />
                    </div>
                  </div>

                  {/* Image Preview */}
                  {formImageUrl && (
                    <div className="flex items-center gap-3 p-2 bg-ivory rounded-xl border border-ivory-200">
                      <img 
                        src={formImageUrl} 
                        alt="Preview" 
                        className="w-12 h-12 object-cover rounded-lg border border-ivory-300"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <div className="flex-1 min-w-0 text-xs">
                        <p className="font-semibold text-charcoal truncate">{formImageUrl}</p>
                        <p className="text-[10px] text-emerald-800 font-medium">Ready for publication</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormImageUrl('')}
                        className="text-xs text-red-600 hover:underline px-2 py-1"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-charcoal uppercase mb-1">Artisan Description</label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Describe the craftsmanship, hallmarking, and gemstones..."
                    className="w-full px-3 py-2 text-xs border border-ivory-300 rounded-xl outline-none focus:border-burgundy"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-ivory-200">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-ivory-300 text-xs font-semibold text-charcoal hover:bg-ivory"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-burgundy hover:bg-burgundy-600 text-gold-200 text-xs font-bold uppercase tracking-wider"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
