'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, Eye, CheckCircle2 } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
            <ShieldCheck size={34} />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Chính Sách Bảo Mật Thông Tin
            </h1>
            <p className="text-sm font-semibold text-gray-500 mt-1">
              GlowBeauty Cosmetics cam kết bảo vệ tuyệt đối dữ liệu và thông tin cá nhân của quý khách
            </p>
          </div>
        </div>

        <div className="space-y-8 text-base text-gray-700 leading-relaxed font-medium">
          <section className="space-y-3 bg-rose-50/50 p-6 rounded-3xl border border-rose-100">
            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <Lock size={22} className="text-rose-500" /> 1. Thu Thập Thông Tin Cá Nhân
            </h3>
            <p className="text-base">
              GlowBeauty chỉ thu thập các thông tin cần thiết phục vụ cho việc xử lý đơn hàng bao gồm: Họ tên, Số điện thoại, Email và Địa chỉ nhận hàng. Các thông tin này chỉ được thu thập khi khách hàng tự nguyện đăng ký tài khoản hoặc đặt mua sản phẩm trên website.
            </p>
          </section>

          <section className="space-y-3 bg-rose-50/50 p-6 rounded-3xl border border-rose-100">
            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <Eye size={22} className="text-rose-500" /> 2. Mục Đích Sử Dụng Thông Tin
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-base">
              <li>Xác nhận đơn hàng và đóng gói giao sản phẩm tận nơi cho khách hàng.</li>
              <li>Thông báo về tiến trình giao hàng và cung cấp dịch vụ hỗ trợ sau bán hàng.</li>
              <li>Gửi các chương trình khuyến mãi, mã giảm giá đặc quyền cho thành viên.</li>
            </ul>
          </section>

          <section className="space-y-3 bg-rose-50/50 p-6 rounded-3xl border border-rose-100">
            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <CheckCircle2 size={22} className="text-rose-500" /> 3. Cam Kết Mật Tuyệt Đối
            </h3>
            <p className="text-base">
              Chúng tôi cam kết không bán, chia sẻ hay trao đổi thông tin cá nhân của khách hàng cho bất kỳ bên thứ ba nào khác vì mục đích thương mại.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
