'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Bot, ShieldCheck, Star, Heart, Droplets, Sun, Smile, Flame } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Product, Category, Brand } from '@/lib/types';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedSkinType, setSelectedSkinType] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [resFeatured, resBest, resCats, resBrands] = await Promise.all([
          fetch('/api/products?featured=true').then((r) => r.json()),
          fetch('/api/products?bestseller=true').then((r) => r.json()),
          fetch('/api/categories').then((r) => r.json()),
          fetch('/api/brands').then((r) => r.json()),
        ]);
        setFeaturedProducts(Array.isArray(resFeatured) ? resFeatured : []);
        setBestSellers(Array.isArray(resBest) ? resBest : []);
        setCategories(Array.isArray(resCats) ? resCats : []);
        setBrands(Array.isArray(resBrands) ? resBrands : []);
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredFeatured = selectedSkinType === 'all'
    ? featuredProducts
    : featuredProducts.filter((p) => p.skinType.toLowerCase().includes(selectedSkinType.toLowerCase()));

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Banner Section (Swiss Beauty 2-Column Studio Banner with 3D Cosmetics Cutout) */}
      <section className="relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-100 via-rose-50 to-pink-200 text-gray-900 overflow-hidden py-10 sm:py-16 border-b border-rose-200/60 shadow-xs w-full min-h-[calc(100vh-130px)] flex items-center">
        {/* Soft Decorative Ambient Circles */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-300/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pink-300/25 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-[1700px] mx-auto px-6 sm:px-12 lg:px-16 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Left-Aligned Typography & Promotion Details */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            
            {/* Elegant Tag Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100/80 border border-rose-200 text-rose-800 text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-2xs">
              <Sparkles size={16} className="text-rose-600 animate-pulse" />
              <span>Mỹ Phẩm & Trang Điểm Cao Cấp • Chính Hãng 100%</span>
            </div>

            {/* Main Headline */}
            <div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none text-gray-900 drop-shadow-xs">
                GIẢM ĐẾN <span className="text-rose-600">50%</span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-gray-600 max-w-xl leading-relaxed font-semibold">
              Khám phá bộ sưu tập Dưỡng Da & Trang Điểm cao cấp từ 3CE, MAC, Laneige, Innisfree, La Roche-Posay, Estée Lauder. Nhận tư vấn cá nhân hóa cùng Trợ Lý AI.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/products"
                className="bg-black hover:bg-rose-600 text-white font-black px-9 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all text-sm sm:text-base tracking-widest uppercase cursor-pointer transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                MUA SẮM NGAY <ArrowRight size={18} />
              </Link>

              <button
                onClick={() => {
                  document.getElementById('best-sellers')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white hover:bg-rose-50 text-rose-700 font-black px-9 py-4 rounded-xl border-2 border-rose-300 shadow-sm transition-all text-sm sm:text-base tracking-wider uppercase cursor-pointer transform hover:-translate-y-0.5"
              >
                TOP BÁN CHẠY 🔥
              </button>
            </div>

            {/* Key Features Mini Banner */}
            <div className="pt-8 w-full border-t border-rose-200/80 flex flex-wrap items-center gap-6 sm:gap-10 text-xs sm:text-sm font-extrabold text-gray-700">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span>🚚 Miễn phí giao từ 200k</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>🛡️ Cam kết đền 200%</span>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Cosmetics PNG Showcase */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end items-center group">
            <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
              <img
                src="/hero-cosmetics.png"
                alt="GlowBeauty Luxury 3D Cosmetics Collection"
                className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(244,63,94,0.25)] group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Categories Bar */}
      <section className="max-w-[1700px] mx-auto px-6 sm:px-10 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Danh Mục Mỹ Phẩm Nổi Bật</h2>
          <p className="text-sm text-gray-500 mt-2 font-medium">Lựa chọn giải pháp chăm sóc da phù hợp nhất với nhu cầu của bạn</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {[
            { name: 'Trang Điểm (Makeup)', slug: 'trang-diem-makeup', icon: Sparkles, color: 'bg-pink-50 text-pink-600' },
            { name: 'Sữa Rửa Mặt', slug: 'sua-rua-mat-tay-trang', icon: Droplets, color: 'bg-blue-50 text-blue-600' },
            { name: 'Serum Dưỡng Da', slug: 'serum-tinh-chat', icon: Sparkles, color: 'bg-purple-50 text-purple-600' },
            { name: 'Kem Chống Nắng', slug: 'kem-chong-nang', icon: Sun, color: 'bg-amber-50 text-amber-600' },
            { name: 'Kem Dưỡng Ẩm', slug: 'kem-duong-am', icon: Heart, color: 'bg-rose-50 text-rose-600' },
            { name: 'Mặt Nạ & Toner', slug: 'mat-na-toner', icon: Smile, color: 'bg-emerald-50 text-emerald-600' },
          ].map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="bg-white p-6 rounded-3xl border border-rose-100 hover:border-rose-300 shadow-sm hover:shadow-xl transition text-center group flex flex-col items-center justify-center space-y-4"
              >
                <div className={`w-16 h-16 rounded-2xl ${cat.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs`}>
                  <Icon size={32} />
                </div>
                <span className="text-sm sm:text-base font-extrabold text-gray-900 group-hover:text-rose-600 transition">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Skin Type Filter & Featured Products */}
      <section className="max-w-[1700px] mx-auto px-6 sm:px-10 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 text-sm font-extrabold text-rose-600 uppercase tracking-widest">
              <Sparkles size={18} /> Mỹ Phẩm Được Khuyên Dùng
            </div>
            <div className="flex flex-wrap items-center gap-3.5 mt-2">
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Sản Phẩm Nổi Bật Theo Loại Da</h2>
              <Link
                href={selectedSkinType === 'all' ? '/products' : `/products?skinType=${encodeURIComponent(selectedSkinType)}`}
                className="inline-flex items-center gap-1.5 text-sm font-extrabold text-rose-600 hover:text-rose-700 hover:underline transition whitespace-nowrap bg-rose-50 px-3.5 py-1.5 rounded-full border border-rose-200"
              >
                Xem tất cả <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Skin Type Filter Chips */}
          <div className="flex flex-wrap gap-2.5">
            {[
              { id: 'all', label: 'Tất Cả Loại Da' },
              { id: 'dầu', label: 'Da Dầu' },
              { id: 'khô', label: 'Da Khô' },
              { id: 'nhạy cảm', label: 'Da Nhạy Cảm' },
              { id: 'mụn', label: 'Da Mụn' },
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => setSelectedSkinType(chip.id)}
                className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer ${
                  selectedSkinType === chip.id
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-rose-50 border border-gray-200'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-3xl h-96 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : filteredFeatured.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-rose-100">
            <p className="text-base text-gray-500 font-medium">Chưa có sản phẩm phù hợp với bộ lọc này.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredFeatured.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Best Sellers Section */}
      <section id="best-sellers" className="bg-gradient-to-b from-rose-50/60 to-white py-16 border-y border-rose-100 scroll-mt-24">
        <div className="max-w-[1700px] mx-auto px-6 sm:px-10 lg:px-12">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 text-sm font-extrabold text-amber-600 uppercase tracking-widest">
                <Flame size={20} className="fill-amber-500 text-amber-500 animate-pulse" /> Sức Hút Không Thể Cưỡng
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2">Top Mỹ Phẩm Bán Chạy Nhất</h2>
            </div>
            <Link
              href="/products?bestseller=true"
              className="text-sm font-extrabold text-rose-600 hover:text-rose-700 flex items-center gap-1.5"
            >
              Xem tất cả <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Top Brands Spotlight */}
      <section className="max-w-[1700px] mx-auto px-6 sm:px-10 lg:px-12 text-center">
        <h3 className="text-xs sm:text-sm font-extrabold text-gray-400 uppercase tracking-widest mb-8">
          Thương Hiệu Mỹ Phẩm Hàng Đầu Phân Phối Chính Hãng
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14 opacity-90">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/products?brand=${brand.slug}`}
              className="group flex flex-col items-center"
            >
              <div className="px-7 py-4 bg-white rounded-2xl border border-gray-200 group-hover:border-rose-400 shadow-xs group-hover:shadow-lg transition duration-300">
                <span className="font-black text-base sm:text-lg text-gray-800 group-hover:text-rose-600">
                  {brand.name}
                </span>
                {brand.country && (
                  <span className="block text-xs text-gray-400 font-semibold mt-0.5">
                    {brand.country}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
