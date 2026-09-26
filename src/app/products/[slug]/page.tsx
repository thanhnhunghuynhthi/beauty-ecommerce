'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Star, ShoppingBag, ShieldCheck, Truck, RefreshCw, Heart, Check, Sparkles, MessageSquare } from 'lucide-react';
import { Product, Review } from '@/lib/types';
import { formatVND, parseImages } from '@/lib/formatters';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const { slug } = use(params);
  const { addToCart } = useCart();

  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isAdded, setIsAdded] = useState(false);

  // Review form state
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    if (user) {
      setUserName(user.name);
    }
  }, [user]);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data.product);
          setRelatedProducts(data.relatedProducts || []);
          const imgs = parseImages(data.product.images);
          setSelectedImage(imgs[0] || '');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      if (!user) {
        router.push(`/login?redirect=/checkout?buyNow=${product.id}&qty=${quantity}`);
        return;
      }
      router.push(`/checkout?buyNow=${product.id}&qty=${quantity}`);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !comment) return;

    if (!user) {
      setReviewError('🔒 Vui lòng đăng nhập bằng tài khoản đã từng mua sản phẩm này để gửi đánh giá!');
      return;
    }

    setSubmittingReview(true);
    setReviewError('');
    try {
      const res = await fetch(`/api/products/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          rating,
          comment,
          userId: user.id,
          email: user.email,
          phone: user.phone || '',
        }),
      });

      if (res.ok) {
        const newRev = await res.json();
        setProduct((prev) =>
          prev
            ? {
                ...prev,
                reviewCount: prev.reviewCount + 1,
                reviews: [newRev, ...(prev.reviews || [])],
              }
            : null
        );
        setComment('');
        setReviewSuccess(true);
        setTimeout(() => setReviewSuccess(false), 4000);
      } else {
        const errData = await res.json();
        setReviewError(errData.error || 'Gửi đánh giá thất bại.');
      }
    } catch (err) {
      console.error(err);
      setReviewError('Lỗi kết nối tới hệ thống.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1700px] mx-auto px-6 py-24 text-center text-xl font-bold text-gray-500 animate-pulse">
        Đang tải thông tin chi tiết sản phẩm mỹ phẩm...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-[1700px] mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-black text-gray-800">Không tìm thấy sản phẩm</h2>
        <p className="text-sm font-semibold text-gray-500 mt-2">Sản phẩm có thể đã bị xóa hoặc không tồn tại.</p>
        <Link
          href="/products"
          className="mt-6 inline-block px-8 py-3.5 bg-rose-600 text-white rounded-full text-base font-extrabold shadow-md hover:bg-rose-700 transition"
        >
          Quay lại danh mục sản phẩm
        </Link>
      </div>
    );
  }

  const images = parseImages(product.images);
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 py-10 space-y-14">
      {/* Breadcrumbs */}
      <nav className="text-sm font-semibold text-gray-500 flex items-center space-x-3">
        <Link href="/" className="hover:text-rose-600 transition">Trang chủ</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-rose-600 transition">Sản phẩm</Link>
        <span>/</span>
        <span className="text-gray-900 font-extrabold truncate max-w-md">{product.name}</span>
      </nav>

      {/* Main Product Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 sm:p-12 rounded-3xl border border-rose-100 shadow-md">
        {/* Left: Image Gallery */}
        <div className="space-y-6">
          <div className="aspect-square bg-rose-50/40 rounded-3xl overflow-hidden border border-rose-100 relative shadow-inner">
            <img
              src={selectedImage || images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {discountPercent > 0 && (
              <span className="absolute top-6 left-6 bg-rose-500 text-white font-black text-sm px-4 py-1.5 rounded-full shadow-lg">
                Giảm -{discountPercent}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition cursor-pointer flex-shrink-0 ${
                    selectedImage === img ? 'border-rose-500 ring-4 ring-rose-200' : 'border-gray-200 hover:border-rose-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase */}
        <div className="space-y-8 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-rose-100 text-rose-800 text-sm font-black px-3.5 py-1 rounded-lg">
                {product.brand?.name}
              </span>
              <span className="text-sm text-gray-500 font-bold">
                Xuất xứ: {product.brand?.country || 'Chính hãng'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-snug tracking-tight">
              {product.name}
            </h1>

            {/* Rating summary */}
            <div className="flex items-center gap-4 text-base pt-1">
              <div className="flex items-center text-amber-400">
                <Star size={22} className="fill-amber-400" />
                <span className="ml-1.5 font-black text-gray-900">{product.rating}</span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-gray-600 font-bold">{product.reviewCount} Đánh giá người dùng</span>
              <span className="text-gray-300">|</span>
              <span className="text-emerald-600 font-black">Còn hàng ({product.stock} SP)</span>
            </div>

            {/* Price Box */}
            <div className="bg-rose-50/70 p-6 rounded-3xl flex items-baseline space-x-4 border border-rose-100">
              <span className="text-4xl sm:text-5xl font-black text-rose-600">
                {formatVND(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through font-semibold">
                  {formatVND(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Specifications */}
            <div className="grid grid-cols-2 gap-4 text-sm pt-2">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <span className="text-gray-400 block font-bold text-xs">Loại da phù hợp:</span>
                <span className="font-extrabold text-gray-800 text-base">{product.skinType}</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <span className="text-gray-400 block font-bold text-xs">Dung tích / Trọng lượng:</span>
                <span className="font-extrabold text-gray-800 text-base">{product.volume || 'Tiêu chuẩn'}</span>
              </div>
            </div>

            {/* Description Short */}
            <p className="text-base text-gray-600 leading-relaxed font-medium pt-2">
              {product.description}
            </p>
          </div>

          {/* Action Area */}
          <div className="space-y-6 border-t border-rose-100 pt-6">
            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-base font-extrabold text-gray-800">Số lượng:</span>
              <div className="flex items-center border-2 border-gray-200 rounded-2xl overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2 text-lg font-black text-gray-600 hover:bg-rose-50 transition cursor-pointer"
                >
                  -
                </button>
                <span className="px-6 py-2 font-black text-base text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-4 py-2 text-lg font-black text-gray-600 hover:bg-rose-50 transition cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleAddToCart}
                className={`py-4 px-6 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition shadow-md cursor-pointer ${
                  isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-rose-500 hover:bg-rose-600 text-white hover:shadow-lg'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check size={22} /> Đã Thêm Giỏ Hàng!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={22} /> + Thêm Vào Giỏ Hàng
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="py-4 px-6 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white rounded-2xl font-black text-base flex items-center justify-center gap-3 transition shadow-md hover:shadow-xl cursor-pointer"
              >
                ⚡ Mua Ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-rose-100 shadow-md space-y-8">
        <h3 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-3">
          <MessageSquare className="text-rose-500" size={28} /> Đánh Giá Từ Khách Hàng ({product.reviews?.length || 0})
        </h3>

        {/* Review Form */}
        <form onSubmit={handleReviewSubmit} className="bg-rose-50/50 p-6 sm:p-8 rounded-3xl border border-rose-100 space-y-4">
          <h4 className="text-base font-extrabold text-gray-800">Gửi đánh giá của bạn</h4>
          
          {reviewSuccess && (
            <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl font-bold text-sm">
              Cảm ơn bạn! Đánh giá đã được gửi thành công.
            </div>
          )}

          {reviewError && (
            <div className="p-4 bg-amber-50 border border-amber-300 text-amber-900 rounded-2xl font-extrabold text-sm flex items-center gap-2">
              <ShieldCheck size={20} className="text-rose-600 flex-shrink-0" />
              <span>{reviewError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Tên của bạn *</label>
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Nhập tên người đánh giá..."
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Đánh giá sao *</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-400"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 Sao - Rất Hài Lòng)</option>
                <option value={4}>⭐⭐⭐⭐ (4 Sao - Tốt)</option>
                <option value={3}>⭐⭐⭐ (3 Sao - Bình Thường)</option>
                <option value={2}>⭐⭐ (2 Sao - Chưa Hài Lòng)</option>
                <option value={1}>⭐ (1 Sao - Rất Tệ)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Nội dung đánh giá *</label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm sử dụng sản phẩm mỹ phẩm này..."
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          <button
            type="submit"
            disabled={submittingReview}
            className="px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl text-sm transition shadow cursor-pointer"
          >
            {submittingReview ? 'Đang gửi...' : 'Gửi Đánh Giá Sản Phẩm'}
          </button>
        </form>

        {/* Reviews List */}
        <div className="space-y-4">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((rev) => (
              <div key={rev.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-gray-900 text-base">{rev.userName}</span>
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-700 font-medium">{rev.comment}</p>
                <span className="text-xs text-gray-400 block pt-1">
                  {new Date(rev.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 font-medium text-sm text-center py-4">Chưa có đánh giá nào. Hãy là người đầu tiên trải nghiệm và đánh giá!</p>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6">
          <h3 className="text-2xl sm:text-3xl font-black text-gray-900">
            Sản Phẩm Mỹ Phẩm Liên Quan
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
