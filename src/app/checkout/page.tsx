'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, ShieldCheck, CreditCard, Truck, Check, ArrowLeft, Lock, AlertCircle, Ticket, Sparkles, Zap, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { formatVND, parseImages } from '@/lib/formatters';
import { CartItem } from '@/lib/types';

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl text-center space-y-4 shadow-sm border border-rose-100 animate-pulse">
          <div className="w-12 h-12 rounded-full bg-rose-100 mx-auto" />
          <div className="h-4 bg-rose-100 rounded-full w-3/4 mx-auto" />
          <div className="h-3 bg-rose-50 rounded-full w-1/2 mx-auto" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const buyNowId = searchParams.get('buyNow');
  const buyNowQty = Number(searchParams.get('qty')) || 1;

  const { selectedItems, clearSelectedItems } = useCart();
  const { user, isLoading } = useAuth();

  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);
  const [loadingBuyNow, setLoadingBuyNow] = useState(!!buyNowId);

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState(user?.city || 'TP. Hồ Chí Minh');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Unique Order Code per checkout session
  const [orderCode, setOrderCode] = useState(() => `GB${Math.floor(100000 + Math.random() * 900000)}`);

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number } | null>(null);
  const [couponMsg, setCouponMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);

  // Fetch Buy Now item if query param is present
  useEffect(() => {
    if (buyNowId) {
      setLoadingBuyNow(true);
      fetch(`/api/products/${buyNowId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.product) {
            setBuyNowItem({ product: data.product, quantity: buyNowQty, selected: true });
          }
        })
        .catch((err) => console.error('Failed to fetch buyNow product:', err))
        .finally(() => setLoadingBuyNow(false));
    } else {
      setLoadingBuyNow(false);
    }
  }, [buyNowId, buyNowQty]);

  // Determine items for this specific checkout session
  const checkoutItems: CartItem[] = buyNowId
    ? (buyNowItem ? [buyNowItem] : [])
    : selectedItems;

  const checkoutSubtotal = checkoutItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalItemsCount = checkoutItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // Cleanup after successful order completion
  const handleOrderSuccessCleanup = () => {
    if (!buyNowId) {
      clearSelectedItems();
    }
  };

  // Auto pre-fill user info from profile
  useEffect(() => {
    if (user) {
      setCustomerName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setCity(user.city || 'TP. Hồ Chí Minh');
    }
  }, [user]);

  // Fetch available coupons list
  useEffect(() => {
    async function fetchCoupons() {
      try {
        const res = await fetch('/api/coupons', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setAvailableCoupons(Array.isArray(data) ? data.filter((c: any) => c.isActive) : []);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchCoupons();
  }, []);

  // Redirect guest if trying to checkout without login
  useEffect(() => {
    if (!isLoading && !user) {
      const redirectPath = buyNowId
        ? `/checkout?buyNow=${buyNowId}&qty=${buyNowQty}`
        : '/checkout';
      router.push(`/login?redirect=${encodeURIComponent(redirectPath)}`);
    }
  }, [user, isLoading, router, buyNowId, buyNowQty]);

  if (isLoading || loadingBuyNow) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl text-center space-y-4 shadow-sm border border-rose-100 animate-pulse">
        <div className="w-12 h-12 rounded-full bg-rose-100 mx-auto" />
        <div className="h-4 bg-rose-100 rounded-full w-3/4 mx-auto" />
        <div className="h-3 bg-rose-50 rounded-full w-1/2 mx-auto" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-rose-100 text-center shadow-sm space-y-4">
        <Lock size={40} className="mx-auto text-rose-500" />
        <h2 className="text-lg font-bold text-gray-800">Yêu Cầu Đăng Nhập Mua Hàng</h2>
        <p className="text-xs text-gray-500">
          Bạn cần đăng nhập tài khoản khách hàng để tiến hành thanh toán đơn hàng.
        </p>
        <Link
          href={`/login?redirect=${encodeURIComponent(
            buyNowId ? `/checkout?buyNow=${buyNowId}&qty=${buyNowQty}` : '/checkout'
          )}`}
          className="inline-block bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-2.5 rounded-full text-xs transition"
        >
          Đăng Nhập Ngay
        </Link>
      </div>
    );
  }

  // Shipping calculation (Free ship for orders >= 200,000 VND)
  const discountVal = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const subtotalAfterDiscount = Math.max(0, checkoutSubtotal - discountVal);
  const shippingFee = subtotalAfterDiscount >= 200000 || checkoutItems.length === 0 ? 0 : 30000;
  const finalTotal = subtotalAfterDiscount + shippingFee;

  const handleApplyCouponCode = async (codeToApply: string) => {
    if (!codeToApply.trim()) return;

    setIsApplyingCoupon(true);
    setCouponMsg(null);
    setCouponInput(codeToApply.toUpperCase().trim());

    try {
      const res = await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: codeToApply.trim(),
          orderTotal: checkoutSubtotal,
          cartTotal: checkoutSubtotal,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setAppliedCoupon({
          code: data.code,
          discountAmount: data.discountAmount,
        });
        setCouponMsg({
          type: 'success',
          text: `Áp dụng mã ${data.code} thành công! Đã giảm ${formatVND(data.discountAmount)}.`,
        });
      } else {
        setCouponMsg({
          type: 'error',
          text: data.error || 'Mã giảm giá không hợp lệ',
        });
      }
    } catch (err) {
      console.error(err);
      setCouponMsg({ type: 'error', text: 'Lỗi kết nối máy chủ.' });
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleApplyCouponForm = (e: React.FormEvent) => {
    e.preventDefault();
    handleApplyCouponCode(couponInput);
  };

  const validateShippingFields = () => {
    if (!phone.trim()) {
      setErrorMsg('⚠️ Bạn chưa nhập Số điện thoại nhận hàng. Vui lòng bổ sung bên dưới để hoàn tất đơn!');
      return false;
    }
    if (!address.trim()) {
      setErrorMsg('⚠️ Bạn chưa có Địa chỉ giao hàng. Vui lòng nhập Địa chỉ chi tiết bên dưới để tiếp tục!');
      return false;
    }
    return true;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (checkoutItems.length === 0) return;
    setErrorMsg('');

    if (!validateShippingFields()) {
      return;
    }

    executeCreateOrder();
  };

  const executeCreateOrder = async () => {
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const orderPayload = {
        userId: user.id,
        customerName,
        email,
        phone,
        address,
        city,
        notes,
        paymentMethod: 'COD',
        isPaid: false,
        couponCode: appliedCoupon?.code || null,
        discountAmount: appliedCoupon?.discountAmount || 0,
        customCode: orderCode,
        items: checkoutItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (res.ok) {
        const order = await res.json();
        handleOrderSuccessCleanup();
        router.push(`/orders/${order.code}`);
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Có lỗi xảy ra khi tạo đơn hàng');
      }
    } catch (error) {
      console.error(error);
      setErrorMsg('Lỗi kết nối tới máy chủ. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (checkoutItems.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-rose-100 text-center shadow-sm space-y-4">
        <ShoppingBag size={48} className="mx-auto text-rose-300" />
        <h2 className="text-lg font-bold text-gray-800">Không Có Sản Phẩm Để Thanh Toán</h2>
        <p className="text-xs text-gray-500">
          Hãy chọn các sản phẩm mỹ phẩm hoặc tick chọn sản phẩm trong giỏ hàng trước khi thanh toán.
        </p>
        <Link
          href="/products"
          className="inline-block bg-rose-600 text-white font-bold px-6 py-2.5 rounded-full text-xs hover:bg-rose-700 transition"
        >
          Khám Phá Sản Phẩm Ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 py-10 space-y-8">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm font-extrabold text-rose-600 hover:underline mb-2"
      >
        <ArrowLeft size={18} /> Tiếp tục chọn thêm mỹ phẩm
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Xác Nhận & Thanh Toán Đơn Hàng
        </h1>

        {buyNowId && (
          <span className="bg-gradient-to-r from-amber-500 to-rose-600 text-white text-xs font-black px-4 py-2 rounded-full shadow-md flex items-center gap-1.5">
            <Zap size={16} /> Mua Ngay Trực Tiếp (1 Sản Phẩm)
          </span>
        )}
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-300 text-amber-900 rounded-2xl text-xs font-bold flex items-center gap-2">
          <AlertCircle size={20} className="text-amber-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Form & Payment Method */}
        <div className="lg:col-span-2 space-y-6">
          {/* Address Section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Truck size={18} className="text-rose-600" /> Thông Tin Giao Hàng Đơn Hàng
              </h2>
              <Link href="/profile" className="text-xs text-rose-600 font-bold hover:underline">
                ✏️ Cập nhật Profile
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Họ và tên người nhận *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nhập họ và tên..."
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Email nhận thông báo *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Số điện thoại nhận hàng *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ví dụ: 0393104054"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full px-3.5 py-2.5 text-xs border rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none ${
                    !phone.trim() ? 'border-rose-400 bg-rose-50/50' : 'border-gray-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Tỉnh / Thành phố *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Địa chỉ giao hàng chi tiết *
              </label>
              <textarea
                rows={2}
                required
                placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện (Ví dụ: Bà Điểm, TP HCM)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`w-full px-3.5 py-2.5 text-xs border rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none ${
                  !address.trim() ? 'border-rose-400 bg-rose-50/50' : 'border-gray-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Ghi chú cho shipper (Tùy chọn)
              </label>
              <textarea
                rows={2}
                placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Payment Method Section (COD Only) */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-100 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b border-rose-100 pb-3 flex items-center gap-2">
              <CreditCard size={18} className="text-rose-600" /> Phương Thức Thanh Toán
            </h2>

            <div className="p-4 rounded-2xl border-2 border-rose-500 bg-rose-50/40 flex items-center gap-3.5 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                💵
              </div>
              <div>
                <div className="text-sm font-extrabold text-gray-900 flex items-center gap-2">
                  Thanh Toán Khi Nhận Hàng (COD)
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-200">
                    Áp Dụng Tận Nơi
                  </span>
                </div>
                <div className="text-xs text-gray-500 font-semibold mt-0.5">
                  Bạn trả tiền mặt trực tiếp cho nhân viên giao hàng (Shipper) khi nhận mỹ phẩm và kiểm tra hàng.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary & Voucher */}
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-100 shadow-sm space-y-6 sticky top-24">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <ShoppingBag size={18} className="text-rose-600" /> Tóm Tắt Đơn Hàng ({totalItemsCount} SP)
              </h2>

              {buyNowId && (
                <span className="text-[11px] font-extrabold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  ⚡ Mua Ngay
                </span>
              )}
            </div>

            {/* Items list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 text-xs">
              {checkoutItems.map((item) => {
                const imgs = parseImages(item.product.images);
                return (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <img
                      src={imgs[0]}
                      alt=""
                      className="w-12 h-12 object-cover rounded-xl bg-rose-50 border border-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800 truncate">{item.product.name}</h4>
                      <span className="text-gray-500">
                        {item.quantity} x {formatVND(item.product.price)}
                      </span>
                    </div>
                    <span className="font-bold text-gray-900">
                      {formatVND(item.product.price * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Coupon Application & Interactive Voucher List */}
            <div className="border-t border-rose-100 pt-4 space-y-3">
              <label className="block text-xs font-bold text-gray-800 flex items-center gap-1">
                <Ticket size={14} className="text-rose-600" /> Mã Giảm Giá / Voucher Ưu Đãi
              </label>

              {/* Input field */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nhập mã (VD: GLOW2026)..."
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-xl uppercase font-bold focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyCouponForm}
                  disabled={isApplyingCoupon || !couponInput.trim()}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition shadow cursor-pointer"
                >
                  {isApplyingCoupon ? '...' : 'Áp Dụng'}
                </button>
              </div>

              {couponMsg && (
                <p
                  className={`text-[11px] font-bold ${
                    couponMsg.type === 'success' ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {couponMsg.text}
                </p>
              )}

              {/* Interactive Voucher List */}
              {availableCoupons.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider block flex items-center gap-1">
                    <Sparkles size={12} className="text-rose-500" /> Danh sách Mã Khuyến Mãi Khả Dụng:
                  </span>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {availableCoupons.map((c) => {
                      const isEligible = checkoutSubtotal >= c.minSpend;
                      const isCurrentApplied = appliedCoupon?.code === c.code;

                      return (
                        <div
                          key={c.id}
                          className={`p-3 rounded-2xl border transition flex items-center justify-between gap-2 ${
                            isCurrentApplied
                              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-100'
                              : isEligible
                              ? 'bg-rose-50/50 border-rose-200 hover:border-rose-400'
                              : 'bg-gray-50 border-gray-200 opacity-60'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-black text-rose-600 text-xs tracking-wider bg-white px-2 py-0.5 rounded-md border border-rose-200">
                                {c.code}
                              </span>
                              <span className="font-extrabold text-xs text-gray-900">
                                {c.type === 'PERCENT' ? `Giảm ${c.discount}%` : `Giảm ${formatVND(c.discount)}`}
                              </span>
                            </div>
                            <p className="text-[10px] font-semibold text-gray-500 mt-1">
                              {c.minSpend > 0 ? `Đơn tối thiểu ${formatVND(c.minSpend)}` : 'Áp dụng mọi đơn hàng'}
                            </p>
                          </div>

                          <button
                            type="button"
                            disabled={!isEligible || isApplyingCoupon || isCurrentApplied}
                            onClick={() => handleApplyCouponCode(c.code)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex-shrink-0 ${
                              isCurrentApplied
                                ? 'bg-emerald-600 text-white'
                                : isEligible
                                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            {isCurrentApplied ? 'Đã dùng ✓' : 'Áp Dụng'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="border-t border-rose-100 pt-4 space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Tạm tính ({totalItemsCount} SP):</span>
                <span className="font-bold text-gray-800">{formatVND(checkoutSubtotal)}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Giảm giá ({appliedCoupon.code}):</span>
                  <span>-{formatVND(appliedCoupon.discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">Miễn phí</span>
                  ) : (
                    formatVND(shippingFee)
                  )}
                </span>
              </div>

              <div className="pt-2 border-t border-rose-100 flex justify-between text-sm font-bold text-gray-900">
                <span>Tổng cộng thanh toán:</span>
                <span className="text-rose-600 text-lg font-black">{formatVND(finalTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-extrabold py-4 rounded-2xl shadow-lg transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check size={20} /> {isSubmitting ? 'Đang tạo đơn hàng...' : 'Xác Nhận Đặt Hàng COD'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
