'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PackageSearch, Search, ArrowLeft, ShieldCheck, Clock, CheckCircle, Truck, AlertCircle, ShoppingBag, ChevronRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Order } from '@/lib/types';
import { formatVND, parseImages } from '@/lib/formatters';

export default function MyOrdersPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();

  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderCodeInput, setOrderCodeInput] = useState('');

  useEffect(() => {
    async function fetchUserOrders() {
      if (isAuthLoading) return;
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/orders?email=${encodeURIComponent(user.email)}&phone=${encodeURIComponent(user.phone || '')}`);
        if (res.ok) {
          const data = await res.json();
          setMyOrders(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Error fetching user orders:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchUserOrders();
  }, [user, isAuthLoading]);

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderCodeInput.trim()) {
      router.push(`/orders/${orderCodeInput.trim()}`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 text-sm font-black px-4 py-1.5 rounded-full border border-emerald-200">
            <CheckCircle size={16} /> Giao Hàng Thành Công
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-900 text-sm font-black px-4 py-1.5 rounded-full border border-blue-200 animate-pulse">
            <Truck size={16} /> Đang Đóng Gói & Vận Chuyển
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-900 text-sm font-black px-4 py-1.5 rounded-full border border-red-200">
            <AlertCircle size={16} /> Đã Hủy Đơn
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-sm font-black px-4 py-1.5 rounded-full border border-amber-200">
            <Clock size={16} /> Đang Chờ Phê Duyệt
          </span>
        );
    }
  };

  return (
    <div className="max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 py-10 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-extrabold text-rose-600 hover:underline"
      >
        <ArrowLeft size={18} /> Quay về trang chủ
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-rose-100 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 flex items-center gap-3 tracking-tight">
            <PackageSearch size={36} className="text-rose-600" />
            {user ? `Danh Sách Đơn Hàng Của ${user.name}` : 'Tra Cứu Tiến Trình Đơn Hàng'}
          </h1>
          <p className="text-sm font-semibold text-gray-500 mt-2">
            {user
              ? 'Theo dõi trực tiếp danh sách và trạng thái giao nhận các đơn hàng mỹ phẩm của bạn'
              : 'Nhập mã đơn hàng hoặc đăng nhập để xem lịch sử mua hàng'}
          </p>
        </div>

        {!user && (
          <Link
            href="/login"
            className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm rounded-2xl shadow transition text-center"
          >
            🔑 Đăng Nhập Để Xem Đơn Hàng
          </Link>
        )}
      </div>

      {/* Manual Search Box */}
      <form onSubmit={handleManualSearch} className="bg-rose-50/70 p-5 rounded-3xl border border-rose-100 flex flex-col sm:flex-row gap-3 shadow-xs">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Tra cứu nhanh bằng Mã Đơn Hàng (Ví dụ: GB-2026-9812)..."
            value={orderCodeInput}
            onChange={(e) => setOrderCodeInput(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 text-base font-semibold bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
          />
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <button
          type="submit"
          className="px-8 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-base rounded-2xl shadow transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Search size={18} /> Tra Cứu
        </button>
      </form>

      {/* Customer Orders List */}
      {loading ? (
        <div className="text-center py-20 text-gray-500 animate-pulse text-base font-bold">
          Đang tải danh sách đơn hàng mỹ phẩm...
        </div>
      ) : user ? (
        myOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-rose-100 space-y-6 shadow-sm">
            <ShoppingBag size={56} className="mx-auto text-rose-300" />
            <h3 className="text-2xl font-black text-gray-900">Bạn Chưa Có Đơn Hàng Nào</h3>
            <p className="text-sm font-semibold text-gray-500 max-w-md mx-auto">
              Hãy chọn mua các sản phẩm mỹ phẩm chính hãng chất lượng cao để trải nghiệm dịch vụ của GlowBeauty nhé!
            </p>
            <Link
              href="/products"
              className="inline-block px-8 py-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-black text-base rounded-2xl shadow hover:from-rose-700 hover:to-pink-700 transition"
            >
              Khám Phá Mỹ Phẩm Ngay
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {myOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition space-y-6"
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-black text-xl text-gray-900">Mã đơn: #{order.code}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-xs font-semibold text-gray-400 mt-1">
                      Ngày đặt: {new Date(order.createdAt).toLocaleString('vi-VN')}
                    </p>
                  </div>

                  <Link
                    href={`/orders/${order.code}`}
                    className="inline-flex items-center gap-1.5 text-sm font-black text-rose-600 hover:text-rose-700 hover:underline"
                  >
                    Xem chi tiết tiến trình <ChevronRight size={18} />
                  </Link>
                </div>

                {/* Items List */}
                <div className="space-y-4">
                  {order.items?.map((item) => {
                    const imgs = parseImages(item.product?.images);
                    return (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-200 overflow-hidden flex-shrink-0">
                          <img
                            src={imgs[0] || ''}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 text-base truncate">
                            {item.product?.name || 'Sản phẩm mỹ phẩm'}
                          </h4>
                          <p className="text-xs font-semibold text-gray-500 mt-0.5">
                            Số lượng: {item.quantity} x {formatVND(item.price)}
                          </p>
                        </div>
                        <span className="font-extrabold text-base text-gray-900">
                          {formatVND(item.price * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Footer total info */}
                <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-sm font-semibold text-gray-600">
                    Hình thức: <span className="font-black text-gray-900">{order.paymentMethod === 'MOMO' ? '🍇 Ví MoMo' : '💵 COD (Tiền mặt)'}</span> ({order.status === 'COMPLETED' ? 'Đã thanh toán' : 'Chờ thanh toán / Nhận hàng'})
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-500 mr-2">Tổng giá trị đơn hàng:</span>
                    <span className="text-2xl font-black text-rose-600">
                      {formatVND(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-rose-100 space-y-4 shadow-sm">
          <p className="text-sm font-semibold text-gray-600">
            Vui lòng nhập mã đơn hàng của bạn vào ô tìm kiếm ở trên hoặc Đăng Nhập để xem lịch sử đơn hàng.
          </p>
        </div>
      )}
    </div>
  );
}
