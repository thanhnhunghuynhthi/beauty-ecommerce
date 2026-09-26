'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Filter, SlidersHorizontal, Search, RefreshCcw } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Product, Category, Brand } from '@/lib/types';

function ProductCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state from URL
  const selectedCategory = searchParams.get('category') || '';
  const selectedBrand = searchParams.get('brand') || '';
  const selectedSkinType = searchParams.get('skinType') || '';
  const searchQuery = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'newest';

  useEffect(() => {
    async function loadFilterData() {
      try {
        const [resCats, resBrands] = await Promise.all([
          fetch('/api/categories').then((r) => r.json()),
          fetch('/api/brands').then((r) => r.json()),
        ]);
        setCategories(Array.isArray(resCats) ? resCats : []);
        setBrands(Array.isArray(resBrands) ? resBrands : []);
      } catch (err) {
        console.error(err);
      }
    }
    loadFilterData();
  }, []);

  useEffect(() => {
    async function fetchFilteredProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.set('category', selectedCategory);
        if (selectedBrand) params.set('brand', selectedBrand);
        if (selectedSkinType) params.set('skinType', selectedSkinType);
        if (searchQuery) params.set('search', searchQuery);
        if (currentSort) params.set('sort', currentSort);

        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchFilteredProducts();
  }, [selectedCategory, selectedBrand, selectedSkinType, searchQuery, currentSort]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push('/products');
  };

  return (
    <div className="max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 py-10 space-y-10">
      {/* Header Title */}
      <div className="border-b border-rose-100 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            {searchQuery ? `Kết quả tìm kiếm cho "${searchQuery}"` : 'Tất Cả Sản Phẩm Mỹ Phẩm Chính Hãng'}
          </h1>
          <p className="text-sm font-semibold text-gray-500 mt-2">
            Hiển thị <span className="text-rose-600 font-extrabold">{products.length}</span> sản phẩm phù hợp với nhu cầu làn da của bạn
          </p>
        </div>

        {/* Sort Select */}
        <div className="flex items-center space-x-3 text-base">
          <SlidersHorizontal size={20} className="text-rose-500" />
          <span className="text-gray-700 font-extrabold">Sắp xếp theo:</span>
          <select
            value={currentSort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="bg-white border-2 border-rose-200 rounded-xl px-4 py-2.5 text-sm font-extrabold text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer shadow-xs"
          >
            <option value="newest">Mới nhất</option>
            <option value="price_asc">Giá: Thấp đến Cao</option>
            <option value="price_desc">Giá: Cao đến Thấp</option>
            <option value="rating">Đánh giá cao nhất</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-8 bg-white p-6 sm:p-7 rounded-3xl border border-rose-100 h-fit shadow-md">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <h3 className="font-black text-base text-gray-900 flex items-center gap-2">
              <Filter size={20} className="text-rose-500" /> Bộ Lọc Thông Minh
            </h3>
            {(selectedCategory || selectedBrand || selectedSkinType || searchQuery) && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCcw size={14} /> Xóa lọc
              </button>
            )}
          </div>

          {/* Filter by Category */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
              Danh Mục Sản Phẩm
            </h4>
            <div className="space-y-1.5 text-sm">
              <button
                onClick={() => updateFilter('category', '')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                  !selectedCategory ? 'bg-rose-500 text-white shadow-sm' : 'text-gray-700 hover:bg-rose-50'
                }`}
              >
                Tất cả danh mục
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => updateFilter('category', cat.slug)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold transition flex justify-between items-center cursor-pointer ${
                    selectedCategory === cat.slug ? 'bg-rose-500 text-white shadow-sm' : 'text-gray-700 hover:bg-rose-50'
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Filter by Skin Type */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
              Phù Hợp Loại Da
            </h4>
            <div className="space-y-1.5 text-sm">
              {['Dầu', 'Khô', 'Nhạy Cảm', 'Mụn'].map((type) => (
                <button
                  key={type}
                  onClick={() =>
                    updateFilter('skinType', selectedSkinType === type ? '' : type)
                  }
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                    selectedSkinType === type
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-rose-50'
                  }`}
                >
                  Da {type}
                </button>
              ))}
            </div>
          </div>

          {/* Filter by Brand */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
              Thương Hiệu Mỹ Phẩm
            </h4>
            <div className="space-y-1.5 text-sm">
              <button
                onClick={() => updateFilter('brand', '')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                  !selectedBrand ? 'bg-rose-500 text-white shadow-sm' : 'text-gray-700 hover:bg-rose-50'
                }`}
              >
                Tất cả thương hiệu
              </button>
              {brands.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => updateFilter('brand', brand.slug)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                    selectedBrand === brand.slug ? 'bg-rose-500 text-white shadow-sm' : 'text-gray-700 hover:bg-rose-50'
                  }`}
                >
                  {brand.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Products Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-96 bg-gray-100 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white p-16 rounded-3xl border border-rose-100 text-center shadow-sm space-y-4">
              <Search size={56} className="mx-auto text-rose-300" />
              <h3 className="text-2xl font-black text-gray-900">Không tìm thấy sản phẩm nào</h3>
              <p className="text-sm font-semibold text-gray-500 max-w-md mx-auto">
                Rất tiếc, không có sản phẩm mỹ phẩm nào khớp với bộ lọc bạn đã chọn. Vui lòng thử lại bộ lọc khác!
              </p>
              <button
                onClick={clearAllFilters}
                className="inline-block mt-4 bg-rose-600 text-white font-extrabold px-8 py-3.5 rounded-full text-sm hover:bg-rose-700 transition cursor-pointer shadow-md"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductCatalogPage() {
  return (
    <Suspense fallback={<div className="max-w-[1700px] mx-auto p-12 text-center text-lg font-bold text-gray-500">Đang tải danh mục mỹ phẩm...</div>}>
      <ProductCatalogContent />
    </Suspense>
  );
}
