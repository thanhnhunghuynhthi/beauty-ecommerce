'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Sparkles, ShoppingBag, Search, Menu, X, ShieldCheck, Truck, Bot, PackageSearch, User, LogOut, LogIn, ChevronDown, UserCheck, Package } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';

export default function Header({ onOpenAiModal }: { onOpenAiModal?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams ? searchParams.get('category') : null;
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { user, logout, isAdmin } = useAuth();

  const isActiveLink = (catSlug?: string) => {
    if (catSlug === undefined) {
      return pathname === '/';
    }
    if (catSlug === 'all') {
      return pathname === '/products' && !activeCategory;
    }
    return pathname === '/products' && activeCategory === catSlug;
  };

  const linkClass = (catSlug?: string) => {
    return isActiveLink(catSlug)
      ? 'text-rose-600 font-black border-b-2 border-rose-600 pb-0.5 transition'
      : 'text-gray-800 font-extrabold hover:text-rose-600 transition';
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [trackCode, setTrackCode] = useState('');
  const [showTrackModal, setShowTrackModal] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackCode.trim()) {
      setShowTrackModal(false);
      router.push(`/orders/${trackCode.trim()}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-rose-100">
      {/* Main Navbar */}
      <div className="max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 py-4 sm:py-5 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform duration-300">
            <Sparkles size={28} className="animate-pulse" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 bg-clip-text text-transparent tracking-tight">
              GlowBeauty
            </span>
            <span className="block text-[11px] sm:text-xs text-gray-500 font-extrabold -mt-1 tracking-widest uppercase">
              Cosmetics & Skincare
            </span>
          </div>
        </Link>

        {/* Desktop Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-2xl relative"
        >
          <input
            type="text"
            placeholder="Tìm kiếm mỹ phẩm, serum, kem chống nắng chính hãng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-6 pr-14 py-3 text-base font-medium bg-rose-50/70 border border-rose-200 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition shadow-xs"
          />
          <button
            type="submit"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-500 hover:text-rose-700 transition cursor-pointer p-1.5"
          >
            <Search size={22} />
          </button>
        </form>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4 sm:space-x-5">
          {/* AI Skincare Advisor Button */}
          <button
            onClick={onOpenAiModal}
            className="hidden sm:flex items-center gap-2.5 text-base font-black bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-3 rounded-full shadow-md hover:shadow-xl hover:scale-105 transition cursor-pointer"
          >
            <Bot size={22} />
            <span>Tư Vấn</span>
          </button>

          {/* User Auth Dropdown Menu */}
          {user ? (
            <div className="relative hidden sm:block">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2.5 bg-rose-50 hover:bg-rose-100 px-5 py-2.5 rounded-full border border-rose-200 text-base font-extrabold text-gray-900 transition cursor-pointer shadow-xs"
              >
                <div className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center text-sm font-black">
                  {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                </div>
                <span className="truncate max-w-[150px]">{user.name || user.email || 'Khách hàng'}</span>
                <ChevronDown size={18} className={`text-rose-600 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu Box */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-3xl shadow-2xl border border-rose-100 py-3 text-sm z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-5 py-3.5 border-b border-gray-100 bg-rose-50/50">
                    <p className="font-extrabold text-gray-900 text-base truncate">{user.name || user.email || 'Khách hàng'}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                  </div>

                  <div className="py-2">
                    {isAdmin ? (
                      <Link
                        href="/admin"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 text-purple-700 hover:bg-purple-50 font-black text-sm transition"
                      >
                        <ShieldCheck size={20} className="text-purple-600" />
                        <span>Trang Quản Trị (Admin)</span>
                      </Link>
                    ) : (
                      <>
                        <Link
                          href="/profile"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-5 py-3 text-gray-800 hover:bg-rose-50 hover:text-rose-600 font-bold text-sm transition"
                        >
                          <UserCheck size={20} className="text-rose-500" />
                          <span>Cập Nhật Thông Tin Cá Nhân</span>
                        </Link>

                        <Link
                          href="/orders"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-5 py-3 text-gray-800 hover:bg-rose-50 hover:text-rose-600 font-bold text-sm transition"
                        >
                          <Package size={20} className="text-rose-500" />
                          <span>Tra Cứu Đơn Hàng Của Tôi</span>
                        </Link>
                      </>
                    )}
                  </div>

                  <div className="border-t border-gray-100 pt-1.5">
                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-3 px-5 py-3 text-rose-600 hover:bg-rose-50 font-black text-sm transition text-left cursor-pointer"
                    >
                      <LogOut size={20} />
                      <span>Đăng Xuất Tài Khoản</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden sm:flex items-center gap-2 text-base font-extrabold text-rose-600 bg-rose-50 hover:bg-rose-100 px-5 py-2.5 rounded-full border border-rose-200 transition"
            >
              <LogIn size={18} /> Đăng Nhập
            </Link>
          )}

          {/* Cart Icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-3 text-gray-800 hover:text-rose-600 hover:bg-rose-50 rounded-full transition cursor-pointer"
            aria-label="Shopping Cart"
          >
            <ShoppingBag size={28} />
            {totalItemsCount > 0 && (
              <span className="absolute top-1 right-1 bg-rose-500 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center animate-bounce shadow">
                {totalItemsCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2.5 text-gray-800 hover:text-rose-600 rounded-xl"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="bg-rose-50/80 border-t border-rose-100 hidden md:block">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center space-x-7 text-base lg:text-lg font-extrabold text-gray-800 py-3.5 overflow-x-auto whitespace-nowrap">
          <Link href="/" className={linkClass(undefined)}>
            Trang Chủ
          </Link>
          <Link href="/products" className={linkClass('all')}>
            Tất Cả Sản Phẩm
          </Link>
          <Link
            href="/products?category=trang-diem-makeup"
            className={`${linkClass('trang-diem-makeup')} flex items-center gap-1.5`}
          >
            💄 Trang Điểm (Makeup)
          </Link>
          <Link
            href="/products?category=sua-rua-mat-tay-trang"
            className={linkClass('sua-rua-mat-tay-trang')}
          >
            Sữa Rửa Mặt & Tẩy Trang
          </Link>
          <Link
            href="/products?category=serum-tinh-chat"
            className={linkClass('serum-tinh-chat')}
          >
            Serum & Tinh Chất
          </Link>
          <Link
            href="/products?category=kem-chong-nang"
            className={linkClass('kem-chong-nang')}
          >
            Kem Chống Nắng
          </Link>
          <Link
            href="/products?category=kem-duong-am"
            className={linkClass('kem-duong-am')}
          >
            Kem Dưỡng Ẩm
          </Link>
          <Link
            href="/products?category=mat-na-toner"
            className={linkClass('mat-na-toner')}
          >
            Mặt Nạ & Toner
          </Link>
          {isAdmin && (
            <Link href="/admin" className="ml-auto text-base font-black text-purple-700 hover:underline flex items-center gap-2">
              <ShieldCheck size={18} /> Trang Quản Lý (Admin)
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-rose-100 px-4 py-5 space-y-4 shadow-xl">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-3 text-base bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-500"
            >
              <Search size={20} />
            </button>
          </form>

          <nav className="flex flex-col space-y-3 font-bold text-gray-800 text-base">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition"
            >
              Trang Chủ
            </Link>
            <Link
              href="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition"
            >
              Tất Cả Sản Phẩm
            </Link>
            <Link
              href="/products?category=sua-rua-mat-tay-trang"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition"
            >
              Sữa Rửa Mặt & Tẩy Trang
            </Link>
            <Link
              href="/products?category=serum-tinh-chat"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition"
            >
              Serum & Tinh Chất
            </Link>
            <Link
              href="/products?category=kem-chong-nang"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition"
            >
              Kem Chống Nắng
            </Link>
            <Link
              href="/products?category=kem-duong-am"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition"
            >
              Kem Dưỡng Ẩm
            </Link>

            {user ? (
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <div className="px-3 py-2 bg-rose-50 rounded-lg">
                  <p className="font-extrabold text-gray-900">{user.name || user.email || 'Khách hàng'}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                {isAdmin ? (
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-purple-700 font-extrabold"
                  >
                    <ShieldCheck size={18} /> Trang Quản Lý (Admin)
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-rose-600 font-bold"
                    >
                      <UserCheck size={18} /> Cập Nhật Thông Tin Cá Nhân
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-rose-600 font-bold"
                    >
                      <Package size={18} /> Tra Cứu Đơn Hàng Của Tôi
                    </Link>
                  </>
                )}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-rose-600 font-bold w-full text-left"
                >
                  <LogOut size={18} /> Đăng Xuất
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 bg-rose-500 text-white font-bold py-2.5 rounded-xl"
                >
                  <LogIn size={18} /> Đăng Nhập
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
