'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag, UserCheck, Search, CheckCircle2 } from 'lucide-react';

export default function BuyingGuidePage() {
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
            <ShoppingBag size={34} />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Hướng Dẫn Mua Hàng Online
            </h1>
            <p className="text-sm font-semibold text-gray-500 mt-1">
              Các bước đơn giản để chọn mua mỹ phẩm chính hãng tại GlowBeauty
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700 leading-relaxed font-medium">
          <div className="p-6 bg-rose-50/70 rounded-3xl border border-rose-100 space-y-3">
            <div className="font-black text-rose-700 flex items-center gap-3 text-lg">
              <UserCheck size={22} /> Bước 1: Đăng Ký / Đăng Nhập
            </div>
            <p className="text-base">Tạo tài khoản khách hàng chỉ cần nhập Tên (ví dụ: Thanh Nhung), Email và Mật khẩu tại mục Đăng ký.</p>
          </div>

          <div className="p-6 bg-rose-50/70 rounded-3xl border border-rose-100 space-y-3">
            <div className="font-black text-rose-700 flex items-center gap-3 text-lg">
              <Search size={22} /> Bước 2: Tìm Kiếm Mỹ Phẩm
            </div>
            <p className="text-base">Sử dụng thanh tìm kiếm hoặc bộ lọc theo loại da (Dầu, Khô, Nhạy cảm, Mụn) để chọn sản phẩm yêu thích.</p>
          </div>

          <div className="p-6 bg-rose-50/70 rounded-3xl border border-rose-100 space-y-3">
            <div className="font-black text-rose-700 flex items-center gap-3 text-lg">
              <ShoppingBag size={22} /> Bước 3: Cho Vào Giỏ Hàng
            </div>
            <p className="text-base">Bấm nút <strong>"+ Thêm Giỏ Hàng"</strong> hoặc bấm <strong>"Mua Ngay"</strong> để tới ngay trang thanh toán.</p>
          </div>

          <div className="p-6 bg-rose-50/70 rounded-3xl border border-rose-100 space-y-3">
            <div className="font-black text-rose-700 flex items-center gap-3 text-lg">
              <CheckCircle2 size={22} /> Bước 4: Thanh Toán & Nhận Hàng
            </div>
            <p className="text-base">Chọn phương thức COD hoặc MoMo QR. Bạn có thể tra cứu đơn hàng trực tiếp bằng mã đơn hàng tại bất kỳ lúc nào.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
