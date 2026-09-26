import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, RefreshCw, Headphones, Phone, Mail, MapPin, PackageSearch } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-pink-50 via-rose-50 to-pink-100/90 text-gray-700 pt-16 pb-12 border-t border-rose-200/80 mt-20">
      {/* Guarantees */}
      <div className="max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-rose-200/80">
        <div className="flex items-center gap-5 bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-rose-200/70 shadow-sm hover:shadow-md hover:border-rose-400/60 transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-gray-900">100% Chính Hãng</h4>
            <p className="text-sm text-gray-600 mt-0.5 font-medium">Cam kết hoàn tiền 200% nếu phát hiện hàng giả</p>
          </div>
        </div>

        <div className="flex items-center gap-5 bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-rose-200/70 shadow-sm hover:shadow-md hover:border-pink-400/60 transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <RefreshCw size={32} />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-gray-900">Đổi Trả Trong 7 Ngày</h4>
            <p className="text-sm text-gray-600 mt-0.5 font-medium">Hỗ trợ đổi sản phẩm lỗi từ nhà sản xuất dễ dàng</p>
          </div>
        </div>

        <div className="flex items-center gap-5 bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-rose-200/70 shadow-sm hover:shadow-md hover:border-purple-400/60 transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <Headphones size={32} />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-gray-900">Tư Vấn Da Miễn Phí</h4>
            <p className="text-sm text-gray-600 mt-0.5 font-medium">Đội ngũ chuyên viên & AI tư vấn 24/7</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 py-12 grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
        {/* Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md">
              <Sparkles size={22} />
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tight">GlowBeauty</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed font-medium">
            Thiên đường mỹ phẩm và chăm sóc da chính hãng hàng đầu Việt Nam. Nâng tầm vẻ đẹp tự nhiên của bạn mỗi ngày.
          </p>
          <div className="space-y-2.5 text-sm text-gray-700 pt-2 font-medium">
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-rose-500 flex-shrink-0" /> Bà Điểm, TP HCM
            </div>
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-rose-500 flex-shrink-0" /> 0393104054 (Hotline mua hàng)
            </div>
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-rose-500 flex-shrink-0" /> dp1.1a6nhung@gmail.com
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-base font-black text-gray-900 uppercase tracking-wider mb-5 border-l-4 border-rose-500 pl-3">
            Danh Mục Hot
          </h4>
          <ul className="space-y-3 text-sm font-semibold">
            <li><Link href="/products?category=sua-rua-mat-tay-trang" className="hover:text-rose-600 transition-colors">Sữa rửa mặt & Tẩy trang</Link></li>
            <li><Link href="/products?category=serum-tinh-chat" className="hover:text-rose-600 transition-colors">Serum & Tinh chất phục hồi</Link></li>
            <li><Link href="/products?category=kem-chong-nang" className="hover:text-rose-600 transition-colors">Kem chống nắng phổ rộng</Link></li>
            <li><Link href="/products?category=kem-duong-am" className="hover:text-rose-600 transition-colors">Kem dưỡng ẩm chuyên sâu</Link></li>
            <li><Link href="/products?category=mat-na-toner" className="hover:text-rose-600 transition-colors">Mặt nạ & Toner cân bằng</Link></li>
          </ul>
        </div>

        {/* Brands */}
        <div>
          <h4 className="text-base font-black text-gray-900 uppercase tracking-wider mb-5 border-l-4 border-pink-500 pl-3">
            Thương Hiệu Nổi Bật
          </h4>
          <ul className="space-y-3 text-sm font-semibold">
            <li><Link href="/products?brand=la-roche-posay" className="hover:text-rose-600 transition-colors">La Roche-Posay (Pháp)</Link></li>
            <li><Link href="/products?brand=innisfree" className="hover:text-rose-600 transition-colors">Innisfree (Hàn Quốc)</Link></li>
            <li><Link href="/products?brand=anessa" className="hover:text-rose-600 transition-colors">Anessa (Nhật Bản)</Link></li>
            <li><Link href="/products?brand=cosrx" className="hover:text-rose-600 transition-colors">COSRX (Hàn Quốc)</Link></li>
            <li><Link href="/products?brand=estee-lauder" className="hover:text-rose-600 transition-colors">Estée Lauder (Mỹ)</Link></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="text-base font-black text-gray-900 uppercase tracking-wider mb-5 border-l-4 border-purple-500 pl-3">
            Hỗ Trợ Khách Hàng
          </h4>
          <ul className="space-y-3 text-sm font-semibold">
            <li><Link href="/buying-guide" className="hover:text-rose-600 transition-colors">Hướng dẫn mua hàng online</Link></li>
            <li><Link href="/shipping-policy" className="hover:text-rose-600 transition-colors">Chính sách vận chuyển & giao hàng</Link></li>
            <li><Link href="/privacy" className="hover:text-rose-600 transition-colors">Chính sách bảo mật thông tin</Link></li>
            <li><Link href="/orders" className="hover:text-rose-600 transition-colors flex items-center gap-2"><PackageSearch size={16} /> Tra cứu tiến trình đơn hàng</Link></li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 pt-8 border-t border-rose-200/80 text-center text-sm text-gray-500 font-medium">
        © 2026 GlowBeauty Cosmetics — Thiên Đường Mỹ Phẩm Chính Hãng. All Rights Reserved.
      </div>
    </footer>
  );
}
