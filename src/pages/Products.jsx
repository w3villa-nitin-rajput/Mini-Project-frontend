import React, { useState, useEffect } from 'react';
import { productService } from '../api/api';
import ProductCard from '../components/ProductCard';
import { useAppContext } from '../context/AppContext';
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

import { useNavigate, useSearchParams } from 'react-router-dom';

const Products = () => {
  const { categories, currency } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const perPage = 10;

  const fetchProductsData = async (currentPage, currentSearch, currentCategory) => {
    setLoading(true);
    try {
      const res = await productService.getAll(currentCategory, currentPage, perPage, currentSearch);
      setProducts(res.data.products);
      setTotalPages(res.data.meta.total_pages);
      setPage(res.data.meta.current_page);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const s = searchParams.get('search') || '';
    const c = searchParams.get('category') || '';
    setSearch(s);
    setSelectedCategory(c);
  }, [searchParams]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProductsData(page, search, selectedCategory);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [page, search, selectedCategory]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    setPage(1);

    const params = Object.fromEntries([...searchParams]);
    if (val) {
      params.search = val;
    } else {
      delete params.search;
    }
    setSearchParams(params);
  };

  const handleCategoryChange = (cat) => {
    const newCat = cat === selectedCategory ? '' : cat;
    setSelectedCategory(newCat);
    setPage(1);

    // Update URL while preserving search
    const params = Object.fromEntries([...searchParams]);
    if (newCat) {
      params.category = newCat;
    } else {
      delete params.category;
    }
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen py-10 animate-fade-in mb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Fresh Collection</h1>
          <p className="text-gray-500">Discover fresh produce delivered from Farm to Table.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search fresh products..."
              value={search}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none w-full sm:w-80 transition-all text-gray-700"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 sticky top-24 shadow-sm">
            <div className="flex items-center gap-2 mb-6 font-semibold text-gray-900">
              <SlidersHorizontal className="w-5 h-5 text-primary" />
              <span>Filters</span>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-700 uppercase tracking-wider text-xs">Categories</p>
              <div className="flex flex-wrap lg:flex-col gap-2">
                <button
                  onClick={() => handleCategoryChange('')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === '' ? 'bg-primary text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.path)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === cat.path ? 'bg-primary text-white shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-96">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500 font-medium">Picking the freshest items for you...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <div className="bg-gray-50 p-6 rounded-full mb-4 text-gray-400">
                <Search className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No match found</h3>
              <p className="text-gray-500">Try adjusting your filters or search keywords.</p>
              <button
                onClick={() => { setSearch(''); setSelectedCategory(''); }}
                className="mt-4 text-primary font-semibold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              <ProductCard products={products} />

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 py-8">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <div className="flex items-center gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setPage(i + 1)}
                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${page === i + 1 ? 'bg-primary text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary/50'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
