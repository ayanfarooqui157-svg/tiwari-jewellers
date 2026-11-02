import React, { useState, useMemo } from 'react';
import { 
  Filter, SlidersHorizontal, ChevronRight, X, 
  RotateCcw, Sparkles, Check, ChevronDown
} from 'lucide-react';
import { useShop } from '../context/useShop';
import { ProductCard } from '../components/ProductCard';

const priceBrackets = [
  { label: 'All Prices', value: 'all' },
  { label: 'Under ₹5,000', value: 'under-5k', min: 0, max: 5000 },
  { label: '₹5,000 - ₹25,000', value: '5k-25k', min: 5000, max: 25000 },
  { label: '₹25,000 - ₹75,000', value: '25k-75k', min: 25000, max: 75000 },
  { label: 'Above ₹75,000', value: 'above-75k', min: 75000, max: Infinity }
];

export const ShopPage = () => {
  const { 
    products, 
    selectedCategory, 
    setSelectedCategory, 
    navigateTo
  } = useShop();

  // Filter States
  const activeCategory = selectedCategory || 'all';
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [selectedMetal, setSelectedMetal] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('featured');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const categoriesList = [
    { label: 'All Jewellery', value: 'all' },
    { label: 'Gold Jewellery', value: 'gold' },
    { label: 'Silver Jewellery', value: 'silver' },
    { label: 'Rings', value: 'rings' },
    { label: 'Earrings', value: 'earrings' },
    { label: 'Necklaces', value: 'necklaces' },
    { label: 'Pendants', value: 'pendants' },
    { label: 'Bracelets', value: 'bracelets' },
    { label: 'Bangles', value: 'bangles' },
  ];

  const materialsList = [
    { label: 'All Materials', value: 'all' },
    { label: 'Gold', value: 'Gold' },
    { label: 'Silver', value: 'Silver' },
    { label: 'Diamond', value: 'Diamond' },
    { label: 'Rose Gold', value: 'Rose Gold' }
  ];

  const metalsList = [
    { label: 'All Purity Types', value: 'all' },
    { label: '22K Gold', value: '22K' },
    { label: '18K Gold', value: '18K' },
    { label: '925 Sterling Silver', value: '925' }
  ];

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    let result = [...(products || [])];

    // Category
    if (activeCategory !== 'all') {
      const cat = activeCategory.toLowerCase();
      if (cat === 'gold') {
        result = result.filter(p => 
          (p.material || '').toLowerCase() === 'gold' || 
          (p.metal || '').toLowerCase().includes('gold')
        );
      } else if (cat === 'silver') {
        result = result.filter(p => 
          (p.material || '').toLowerCase() === 'silver' || 
          (p.metal || '').toLowerCase().includes('silver')
        );
      } else {
        result = result.filter(p => (p.category || '').toLowerCase() === cat);
      }
    }

    // Material
    if (selectedMaterial !== 'all') {
      result = result.filter(p => (p.material || '').toLowerCase() === selectedMaterial.toLowerCase());
    }

    // Metal / Purity
    if (selectedMetal !== 'all') {
      result = result.filter(p => 
        (p.metal || '').toLowerCase().includes(selectedMetal.toLowerCase()) || 
        (p.purity || '').toLowerCase().includes(selectedMetal.toLowerCase())
      );
    }

    // Price bracket
    if (priceRange !== 'all') {
      const bracket = priceBrackets.find(b => b.value === priceRange);
      if (bracket) {
        result = result.filter(p => (p.price || 0) >= bracket.min && (p.price || 0) <= bracket.max);
      }
    }

    // In Stock
    if (onlyInStock) {
      result = result.filter(p => p.inStock && (p.stockQuantity || 0) > 0);
    }

    // Minimum Rating
    if (minRating > 0) {
      result = result.filter(p => (p.rating || 0) >= minRating);
    }

    // Sorting
    switch (sortBy) {
      case 'bestselling':
        result.sort((a, b) => (b.badge === 'Bestseller' ? 1 : 0) - (a.badge === 'Bestseller' ? 1 : 0));
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'price-asc':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        // 'featured'
        break;
    }

    return result;
  }, [products, activeCategory, selectedMaterial, selectedMetal, priceRange, onlyInStock, minRating, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedMaterial('all');
    setSelectedMetal('all');
    setPriceRange('all');
    setOnlyInStock(false);
    setMinRating(0);
  };

  const hasActiveFilters = 
    activeCategory !== 'all' || 
    selectedMaterial !== 'all' || 
    selectedMetal !== 'all' || 
    priceRange !== 'all' || 
    onlyInStock || 
    minRating > 0;

  return (
    <div className="bg-ivory min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. BREADCRUMB NAVIGATION */}
        <nav className="flex items-center gap-2 text-xs text-charcoal-400 mb-6">
          <button onClick={() => navigateTo('home')} className="hover:text-burgundy transition-colors">
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button onClick={() => setSelectedCategory('all')} className="hover:text-burgundy transition-colors">
            Jewellery
          </button>
          {activeCategory !== 'all' && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-burgundy font-semibold capitalize">{activeCategory}</span>
            </>
          )}
        </nav>

        {/* 2. COLLECTION BANNER & HEADER */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-ivory-300 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="relative z-10 max-w-xl">
            <span className="text-xs uppercase font-bold tracking-widest text-gold-700">
              Tiwari Jewellers Collection
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-burgundy mt-1 mb-2 capitalize">
              {activeCategory === 'all' ? 'All Fine Jewellery' : `${activeCategory} Collection`}
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-500 font-sans leading-relaxed">
              Explore 100% BIS Hallmarked gold, certified diamonds and sterling silver master creations, handcrafted with ancestral artistry and modern luxury.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <div className="px-5 py-3 rounded-2xl bg-ivory border border-ivory-300 text-center">
              <span className="block text-2xl font-serif font-bold text-burgundy">{filteredProducts.length}</span>
              <span className="text-[10px] text-charcoal-400 uppercase tracking-wider font-semibold">Designs Found</span>
            </div>
          </div>

          {/* Decorative backdrop */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10"></div>
        </div>

        {/* 3. CONTROLS BAR (Mobile filter trigger, active tags & Sorting) */}
        <div className="bg-white rounded-2xl p-4 border border-ivory-300 shadow-sm mb-8 flex flex-wrap items-center justify-between gap-4">
          
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-burgundy text-white rounded-xl text-xs font-semibold"
          >
            <Filter className="w-4 h-4 text-gold-200" />
            <span>Filters ({hasActiveFilters ? 'Active' : 'All'})</span>
          </button>

          {/* Active Filter Chips */}
          <div className="flex-1 hidden sm:flex flex-wrap items-center gap-2">
            {activeCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ivory border border-ivory-300 text-xs text-charcoal-700">
                Category: <b className="capitalize">{activeCategory}</b>
                <X className="w-3.5 h-3.5 cursor-pointer text-charcoal-400 hover:text-burgundy" onClick={() => setSelectedCategory('all')} />
              </span>
            )}
            {selectedMaterial !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ivory border border-ivory-300 text-xs text-charcoal-700">
                Material: <b>{selectedMaterial}</b>
                <X className="w-3.5 h-3.5 cursor-pointer text-charcoal-400 hover:text-burgundy" onClick={() => setSelectedMaterial('all')} />
              </span>
            )}
            {selectedMetal !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ivory border border-ivory-300 text-xs text-charcoal-700">
                Purity: <b>{selectedMetal}</b>
                <X className="w-3.5 h-3.5 cursor-pointer text-charcoal-400 hover:text-burgundy" onClick={() => setSelectedMetal('all')} />
              </span>
            )}
            {priceRange !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ivory border border-ivory-300 text-xs text-charcoal-700">
                Price: <b>{priceBrackets.find(b => b.value === priceRange)?.label}</b>
                <X className="w-3.5 h-3.5 cursor-pointer text-charcoal-400 hover:text-burgundy" onClick={() => setPriceRange('all')} />
              </span>
            )}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-burgundy font-semibold hover:underline flex items-center gap-1 ml-1"
              >
                <RotateCcw className="w-3 h-3" /> Clear All
              </button>
            )}
          </div>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-xs text-charcoal-400 font-medium">Sort By:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-ivory border border-ivory-300 rounded-xl px-4 py-2 pr-8 text-xs font-semibold text-charcoal focus:outline-none focus:border-burgundy cursor-pointer"
              >
                <option value="featured">Featured Collections</option>
                <option value="bestselling">Bestselling First</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-charcoal-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 4. MAIN LAYOUT: SIDEBAR FILTERS + PRODUCT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* DESKTOP FILTER SIDEBAR */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 border border-ivory-300 shadow-sm sticky top-28 space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-ivory-200">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-burgundy" />
                  <h3 className="font-serif font-bold text-sm text-charcoal uppercase tracking-wider">
                    Filters
                  </h3>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-[11px] text-burgundy hover:underline font-semibold"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div>
                <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-3">
                  Category
                </h4>
                <div className="space-y-1.5">
                  {categoriesList.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`w-full text-left px-3 py-1.5 text-xs rounded-lg transition-colors flex items-center justify-between ${
                        activeCategory === cat.value
                          ? 'bg-burgundy text-white font-semibold'
                          : 'text-charcoal-600 hover:bg-ivory'
                      }`}
                    >
                      <span>{cat.label}</span>
                      {activeCategory === cat.value && <Check className="w-3.5 h-3.5 text-gold-200" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Material Filter */}
              <div className="pt-4 border-t border-ivory-200">
                <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-3">
                  Material
                </h4>
                <div className="space-y-1.5">
                  {materialsList.map((mat) => (
                    <button
                      key={mat.value}
                      onClick={() => setSelectedMaterial(mat.value)}
                      className={`w-full text-left px-3 py-1.5 text-xs rounded-lg transition-colors flex items-center justify-between ${
                        selectedMaterial === mat.value
                          ? 'bg-burgundy text-white font-semibold'
                          : 'text-charcoal-600 hover:bg-ivory'
                      }`}
                    >
                      <span>{mat.label}</span>
                      {selectedMaterial === mat.value && <Check className="w-3.5 h-3.5 text-gold-200" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Metal & Purity Filter */}
              <div className="pt-4 border-t border-ivory-200">
                <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-3">
                  Metal & Purity
                </h4>
                <div className="space-y-1.5">
                  {metalsList.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setSelectedMetal(m.value)}
                      className={`w-full text-left px-3 py-1.5 text-xs rounded-lg transition-colors flex items-center justify-between ${
                        selectedMetal === m.value
                          ? 'bg-burgundy text-white font-semibold'
                          : 'text-charcoal-600 hover:bg-ivory'
                      }`}
                    >
                      <span>{m.label}</span>
                      {selectedMetal === m.value && <Check className="w-3.5 h-3.5 text-gold-200" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="pt-4 border-t border-ivory-200">
                <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-3">
                  Price Range
                </h4>
                <div className="space-y-1.5">
                  {priceBrackets.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPriceRange(p.value)}
                      className={`w-full text-left px-3 py-1.5 text-xs rounded-lg transition-colors flex items-center justify-between ${
                        priceRange === p.value
                          ? 'bg-burgundy text-white font-semibold'
                          : 'text-charcoal-600 hover:bg-ivory'
                      }`}
                    >
                      <span>{p.label}</span>
                      {priceRange === p.value && <Check className="w-3.5 h-3.5 text-gold-200" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* In Stock Toggle */}
              <div className="pt-4 border-t border-ivory-200">
                <label className="flex items-center justify-between cursor-pointer text-xs font-semibold text-charcoal select-none">
                  <span>In Stock Only</span>
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="w-4 h-4 text-burgundy rounded focus:ring-burgundy"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* PRODUCT GRID */}
          <div className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-16 text-center border border-ivory-300">
                <Sparkles className="w-12 h-12 text-gold mx-auto mb-4 opacity-60" />
                <h3 className="font-serif text-2xl font-bold text-burgundy mb-2">
                  No Matching Jewellery Designs
                </h3>
                <p className="text-xs text-charcoal-400 max-w-sm mx-auto mb-6 font-sans">
                  We couldn't find pieces matching all selected filter criteria. Try resetting filters to explore our full royal collection.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-burgundy hover:bg-burgundy-600 text-gold-200 text-xs font-bold uppercase tracking-widest rounded-full transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE FILTERS MODAL */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden flex justify-end">
          <div className="bg-white w-full max-w-xs h-full p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-ivory-200 mb-6">
                <h3 className="font-serif font-bold text-base text-burgundy">Filters</h3>
                <button onClick={() => setIsMobileFiltersOpen(false)} className="p-1" aria-label="Close filters">
                  <X className="w-5 h-5 text-charcoal" />
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-2">Category</h4>
                <div className="space-y-1">
                  {categoriesList.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`w-full text-left px-3 py-1.5 text-xs rounded-lg ${
                        activeCategory === cat.value ? 'bg-burgundy text-white font-bold' : 'text-charcoal-700'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-2">Price Bracket</h4>
                <div className="space-y-1">
                  {priceBrackets.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPriceRange(p.value)}
                      className={`w-full text-left px-3 py-1.5 text-xs rounded-lg ${
                        priceRange === p.value ? 'bg-burgundy text-white font-bold' : 'text-charcoal-700'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-ivory-200 space-y-2">
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full py-3 bg-burgundy text-white rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                Apply Filters ({filteredProducts.length})
              </button>
              <button
                onClick={clearAllFilters}
                className="w-full py-2 text-xs text-charcoal-500 font-medium"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
