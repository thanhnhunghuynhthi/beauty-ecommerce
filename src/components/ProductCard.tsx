'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, ShoppingBag, Check, Lock, X, LogIn, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import { formatVND, parseImages } from '@/lib/formatters';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [isAdded, setIsAdded] = useState(false);
  const [showLoginNotice, setShowLoginNotice] = useState(false);

  const images = parseImages(product.images);
  const mainImage = images[0] || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500';

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is logged in
    if (!user) {
      setShowLoginNotice(true);
      return;
    }

    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setShowLoginNotice(true);
      return;
    }

    router.push(`/checkout?buyNow=${product.id}&qty=1`);
  };

  return (
    <>
      <div className="group bg-white rounded-2xl border border-rose-100/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
        {/* Badges */}
        <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5">
          {discountPercent > 0 && (
            <span className="bg-rose-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md">
              -{discountPercent}%
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-amber-500 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-md">
              Bán Chạy 🔥
            </span>
          )}
        </div>

        {/* Image Container */}
        <Link href={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-rose-50/30">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {/* Brand & Skin Type */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span className="font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100">
              {product.brand?.name || 'Mỹ phẩm'}
            </span>
            <span className="text-xs text-slate-500 font-semibold truncate max-w-[130px]" title={product.skinType}>
              {product.skinType}
            </span>
          </div>

          {/* Name */}
          <Link href={`/products/${product.slug}`} className="block group-hover:text-rose-600 transition-colors">
            <h3 className="text-base font-bold text-gray-900 line-clamp-2 h-12 mb-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-4 text-xs font-bold">
            <div className="flex items-center text-amber-400">
              <Star size={16} className="fill-amber-400" />
              <span className="ml-1 text-gray-800 font-extrabold">{product.rating}</span>
            </div>
            <span className="text-gray-400 font-normal">({product.reviewCount} đánh giá)</span>
          </div>

          {/* Price & Action Buttons */}
          <div className="mt-auto pt-3 border-t border-rose-100 space-y-2.5">
            <div className="flex items-baseline justify-between">
              <div className="text-lg sm:text-xl font-black text-rose-600">
                {formatVND(product.price)}
              </div>
              {product.originalPrice && (
                <div className="text-xs sm:text-sm text-gray-400 line-through font-semibold">
                  {formatVND(product.originalPrice)}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleAddToCart}
                className={`py-2.5 px-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                  isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                }`}
                title={user ? 'Thêm vào giỏ hàng' : 'Đăng nhập để mua hàng'}
              >
                {isAdded ? <Check size={16} /> : <ShoppingBag size={16} />} + Giỏ Hàng
              </button>

              <button
                onClick={handleBuyNow}
                className="py-2.5 px-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition flex items-center justify-center cursor-pointer"
                title={user ? 'Mua ngay lập tức' : 'Đăng nhập để mua hàng'}
              >
                Mua Ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Login Required Modal */}
      {showLoginNotice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl relative text-center space-y-4 animate-in fade-in zoom-in">
            <button
              onClick={() => setShowLoginNotice(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Lock size={30} />
            </div>

            <h3 className="text-lg font-bold text-gray-900">
              Yêu Cầu Đăng Nhập Mua Hàng
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Khách vãng lai chỉ có thể xem sản phẩm. Bạn cần **Đăng Nhập** hoặc **Tạo Tài Khoản** khách hàng để thêm mỹ phẩm vào giỏ và tiến hành thanh toán!
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/login"
                onClick={() => setShowLoginNotice(false)}
                className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow"
              >
                <LogIn size={16} /> Đăng Nhập Ngay
              </Link>
              <Link
                href="/register"
                onClick={() => setShowLoginNotice(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <UserPlus size={16} /> Tạo Tài Khoản Mới
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
