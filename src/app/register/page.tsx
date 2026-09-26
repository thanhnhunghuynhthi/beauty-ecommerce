'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, Lock, Mail, ArrowLeft, UserPlus, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function RegisterPage() {
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        login(data.user);
        window.location.href = '/';
      } else {
        setErrorMsg(data.error || 'Tạo tài khoản không thành công');
      }
    } catch (err) {
      setErrorMsg('Lỗi kết nối tới hệ thống');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16">
      <div className="bg-white p-10 sm:p-12 rounded-3xl border border-rose-100 shadow-2xl max-w-lg w-full relative space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-extrabold text-rose-600 hover:underline absolute top-8 left-8"
        >
          <ArrowLeft size={18} /> Trang chủ
        </Link>

        <div className="text-center pt-6 space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-rose-200">
            <UserPlus size={32} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Tạo Tài Khoản Khách Hàng</h1>
          <p className="text-sm font-semibold text-gray-500">
            Trở thành thành viên GlowBeauty để nhận mã giảm giá và ưu đãi độc quyền
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-sm font-bold text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-extrabold text-gray-800 mb-2">
              Họ và tên khách hàng *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Thanh Nhung"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 text-base font-semibold border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
              <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-extrabold text-gray-800 mb-2">
              Địa chỉ Email *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="thanhnhung@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 text-base font-semibold border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
              <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-extrabold text-gray-800 mb-2">
              Mật khẩu *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Tối thiểu 6 ký tự..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 text-base font-semibold border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
              <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white font-black text-base rounded-2xl transition shadow-lg shadow-rose-200 cursor-pointer"
          >
            {loading ? 'Đang Khởi Tạo...' : 'Đăng Ký Tài Khoản Ngay'}
          </button>
        </form>

        <div className="pt-4 border-t border-gray-100 text-center text-sm font-semibold text-gray-600">
          Đã có tài khoản?{' '}
          <Link href="/login" className="font-extrabold text-rose-600 hover:underline">
            Đăng nhập ngay tại đây
          </Link>
        </div>
      </div>
    </div>
  );
}
