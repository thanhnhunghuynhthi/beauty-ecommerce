'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { User, Lock, ArrowLeft, Sparkles, LogIn, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-rose-100 animate-pulse" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect');
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        login(data.user);
        if (redirectTarget) {
          window.location.href = redirectTarget;
        } else if (data.user.role === 'ADMIN') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/';
        }
      } else {
        setErrorMsg(data.error || 'Đăng nhập không thành công');
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
            <LogIn size={32} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Đăng Nhập Khách Hàng</h1>
          <p className="text-sm font-semibold text-gray-500">
            Chào mừng bạn quay trở lại với thiên đường mỹ phẩm GlowBeauty!
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-sm font-bold text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-extrabold text-gray-800 mb-2">
              Email đăng nhập *
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
              <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
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
                placeholder="••••••••"
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
            {loading ? 'Đang Đăng Nhập...' : 'Đăng Nhập Tài Khoản'}
          </button>
        </form>

        <div className="pt-4 border-t border-gray-100 text-center text-sm font-semibold text-gray-600">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="font-extrabold text-rose-600 hover:underline">
            Đăng ký ngay tại đây
          </Link>
        </div>
      </div>
    </div>
  );
}
