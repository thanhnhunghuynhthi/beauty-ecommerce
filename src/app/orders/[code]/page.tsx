'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock, Truck, Package, ArrowLeft, Printer } from 'lucide-react';
import { Order } from '@/lib/types';
import { formatVND, parseImages } from '@/lib/formatters';

export default function OrderTrackingPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${code}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [code]);

  if (loading) {
    return (
      <div className="max-w-[1700px] mx-auto px-6 py-24 text-center text-xl font-bold text-gray-500 animate-pulse">
        Đang tải thông tin chi tiết đơn hàng...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto my-20 p-10 bg-white rounded-3xl border border-rose-100 text-center shadow-md space-y-4">
        <h2 className="text-2xl font-black text-gray-900">Không tìm thấy đơn hàng</h2>
        <p className="text-sm font-semibold text-gray-500">Mã đơn hàng &quot;{code}&quot; không chính xác.</p>
        <Link
          href="/"
          className="mt-6 inline-block bg-rose-600 text-white font-extrabold px-8 py-3.5 rounded-full text-sm shadow hover:bg-rose-700 transition"
        >
          Quay về Trang chủ
        </Link>
      </div>
    );
  }

  // Timeline Steps
  const getStepStatus = (step: string) => {
    const statusMap: Record<string, number> = {
      PENDING: 1,
      PROCESSING: 2,
      COMPLETED: 3,
      CANCELLED: 0,
    };
    const currentLevel = statusMap[order.status] || 1;
    const targetLevel = statusMap[step] || 1;
    return currentLevel >= targetLevel;
  };

  return (
    <div className="max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 py-10 space-y-8">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-sm font-extrabold text-rose-600 hover:underline"
        >
          <ArrowLeft size={18} /> Danh sách đơn hàng của tôi
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 text-sm font-extrabold text-gray-700 hover:text-gray-900 bg-white border border-gray-200 px-4 py-2.5 rounded-xl shadow-xs cursor-pointer"
        >
          <Printer size={18} /> In Hóa Đơn
        </button>
      </div>

      {/* Main Success Header Card */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white p-8 sm:p-12 rounded-3xl shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-black">
          <CheckCircle2 size={18} className="text-emerald-300" /> Đặt Hàng Thành Công
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          Mã Đơn Hàng: <span className="underline decoration-pink-300">{order.code}</span>
        </h1>
        <p className="text-sm font-bold text-rose-100 max-w-2xl">
          Cảm ơn khách hàng <span className="text-white font-black">{order.customerName}</span> đã tin tưởng lựa chọn mỹ phẩm chính hãng tại GlowBeauty! Đơn hàng đang được chuẩn bị cẩn thận.
        </p>
      </div>

      {/* Visual Timeline Tracker */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-rose-100 shadow-md space-y-8">
        <h3 className="text-xl font-black text-gray-900">Trạng Thái Vận Chuyển Đơn Hàng</h3>

        <div className="grid grid-cols-3 gap-6 relative">
          {/* Timeline Step 1 */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-base transition ${
                getStepStatus('PENDING')
                  ? 'bg-rose-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              <Clock size={24} />
            </div>
            <span className="text-base font-extrabold text-gray-900">1. Đã Nhận Đơn</span>
            <span className="text-xs font-semibold text-gray-500">Chờ hệ thống xác nhận</span>
          </div>

          {/* Timeline Step 2 */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-base transition ${
                getStepStatus('PROCESSING')
                  ? 'bg-rose-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              <Package size={24} />
            </div>
            <span className="text-base font-extrabold text-gray-900">2. Đang Đóng Gói</span>
            <span className="text-xs font-semibold text-gray-500">Kiểm tra mỹ phẩm chính hãng</span>
          </div>

          {/* Timeline Step 3 */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-base transition ${
                getStepStatus('COMPLETED')
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              <Truck size={24} />
            </div>
            <span className="text-base font-extrabold text-gray-900">3. Giao Hàng Thành Công</span>
            <span className="text-xs font-semibold text-gray-500">Shipper giao tận tay</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Order Items */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-rose-100 shadow-md space-y-6">
          <h3 className="text-xl font-black text-gray-900 pb-4 border-b border-gray-100">
            Danh Sách Sản Phẩm Đã Đặt
          </h3>
          <div className="space-y-4">
            {order.items?.map((item) => {
              const imgs = parseImages(item.product?.images);
              return (
                <div key={item.id} className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0">
                  <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-200 overflow-hidden flex-shrink-0">
                    <img src={imgs[0] || ''} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-extrabold text-gray-900 text-base">{item.product?.name}</h4>
                    <p className="text-sm font-semibold text-gray-500 mt-1">
                      Số lượng: {item.quantity} x {formatVND(item.price)}
                    </p>
                  </div>
                  <span className="font-black text-lg text-gray-900">
                    {formatVND(item.price * item.quantity)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-6 border-t border-gray-100 space-y-3">
            <div className="flex justify-between items-center text-base font-semibold text-gray-600">
              <span>Phương thức thanh toán:</span>
              <span className="font-extrabold text-gray-900">
                {order.paymentMethod === 'MOMO' ? (
                  <span className="bg-pink-100 text-pink-700 font-extrabold px-3 py-1 rounded-full text-sm inline-flex items-center gap-1.5 border border-pink-200">
                    🍇 Ví MoMo
                  </span>
                ) : (
                  <span className="bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1 rounded-full text-sm inline-flex items-center gap-1.5 border border-emerald-200">
                    💵 Thanh toán COD khi nhận hàng
                  </span>
                )}
              </span>
            </div>
            <div className="flex justify-between text-xl font-black text-gray-900 border-t border-dashed border-gray-200 pt-3">
              <span>Tổng Tiền Thanh Toán:</span>
              <span className="text-rose-600 text-2xl font-black">{formatVND(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Customer Info */}
        <div className="bg-white p-8 rounded-3xl border border-rose-100 shadow-md space-y-6">
          <h3 className="text-xl font-black text-gray-900 pb-4 border-b border-gray-100">
            Thông Tin Khách Hàng
          </h3>
          <div className="space-y-4 text-base font-semibold text-gray-700">
            <div>
              <span className="text-xs font-black text-gray-400 block uppercase">Họ và tên:</span>
              <span className="text-gray-900 font-extrabold">{order.customerName}</span>
            </div>
            <div>
              <span className="text-xs font-black text-gray-400 block uppercase">Số điện thoại:</span>
              <span className="text-gray-900 font-extrabold">{order.phone}</span>
            </div>
            <div>
              <span className="text-xs font-black text-gray-400 block uppercase">Email:</span>
              <span className="text-gray-900 font-extrabold">{order.email}</span>
            </div>
            <div>
              <span className="text-xs font-black text-gray-400 block uppercase">Địa chỉ giao hàng:</span>
              <span className="text-gray-900 font-extrabold">{order.address}, {order.city}</span>
            </div>
            {order.notes && (
              <div>
                <span className="text-xs font-black text-gray-400 block uppercase">Ghi chú đơn hàng:</span>
                <span className="text-gray-800 italic">{order.notes}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
