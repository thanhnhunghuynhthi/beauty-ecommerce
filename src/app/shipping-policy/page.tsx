'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Truck, Clock, ShieldCheck, MapPin } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 py-10 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-extrabold text-rose-600 hover:underline"
      >
        <ArrowLeft size={18} /> Quay về trang chủ
      </Link>

      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-rose-100 shadow-md space-y-8">
        <div className="flex items-center gap-4 border-b border-rose-100 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
            <Truck size={34} />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Chính Sách Vận Chuyển & Giao Hàng
            </h1>
            <p className="text-sm font-semibold text-gray-500 mt-1">
              Giao hàng nhanh chóng, đóng gói cẩn thận và an toàn tuyệt đối toàn quốc
            </p>
          </div>
        </div>

        <div className="space-y-8 text-base text-gray-700 leading-relaxed font-medium">
          <section className="space-y-3 bg-rose-50/50 p-6 rounded-3xl border border-rose-100">
            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <Truck size={22} className="text-rose-500" /> 1. Phí Vận Chuyển
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-base">
              <li><strong className="text-emerald-600 font-black">MIỄN PHÍ VẬN CHUYỂN (Free Ship)</strong> cho tất cả đơn hàng mỹ phẩm có tổng giá trị từ **200.000đ** trở lên.</li>
              <li>Đơn hàng dưới 200.000đ: Phí vận chuyển đồng giá **30.000đ** trên toàn quốc.</li>
            </ul>
          </section>

          <section className="space-y-3 bg-rose-50/50 p-6 rounded-3xl border border-rose-100">
            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <Clock size={22} className="text-rose-500" /> 2. Thời Gian Giao Hàng Dự Kiến
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-base">
              <li><strong>Nội thành TP. Hồ Chí Minh:</strong> Giao siêu tốc trong **1 - 2 ngày** làm việc.</li>
              <li><strong>Các Tỉnh/Thành khác:</strong> Giao hàng từ **2 - 4 ngày** làm việc.</li>
            </ul>
          </section>

          <section className="space-y-3 bg-rose-50/50 p-6 rounded-3xl border border-rose-100">
            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <ShieldCheck size={22} className="text-rose-500" /> 3. Kiểm Tra Hàng Khi Nhận (Được Đồng Kiểm)
            </h3>
            <p className="text-base">
              Khách hàng hoàn toàn được quyền mở hộp kiểm tra sản phẩm trước khi thanh toán tiền cho nhân viên giao hàng (Shipper).
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
