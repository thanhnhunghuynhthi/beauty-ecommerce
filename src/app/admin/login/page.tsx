'use client';

import React, { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, User, ArrowLeft, Eye, EyeOff, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-rose-100 animate-pulse" />
        </div>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}

function AdminLoginContent() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('admin_logged_in', 'true');
        router.push('/admin');
      } else {
        setErrorMsg(data.error || 'Đăng nhập không thành công');
      }
    } catch (err) {
      setErrorMsg('Lỗi kết nối tới máy chủ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-rose-100 shadow-xl max-w-md w-full relative space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:underline absolute top-6 left-6"
        >
          <ArrowLeft size={14} /> Trở về trang chủ
        </Link>

        <div className="text-center pt-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-rose-200">
            <ShieldCheck size={36} />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center justify-center gap-1.5">
            Admin GlowBeauty <Sparkles size={18} className="text-rose-500" />
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Đăng nhập hệ thống quản trị cửa hàng mỹ phẩm
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-100 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Tên Đăng Nhập
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Nhập tên tài khoản (VD: admin)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Mật Khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Nhập mật khẩu (VD: admin123)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-700 hover:to-pink-700 text-white font-bold py-3 rounded-xl shadow-md transition text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? 'Đang xác thực...' : 'Đăng Nhập Quản Trị'}
          </button>
        </form>

        {/* Demo Hint Box */}
        <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 text-[11px] text-gray-600 space-y-1">
          <div className="font-bold text-rose-700 flex items-center gap-1">
            🔑 Tải khoản mặc định cho bản Demo:
          </div>
          <div>• Tên đăng nhập: <code className="font-bold bg-white px-1.5 py-0.5 rounded border text-rose-600">admin</code></div>
          <div>• Mật khẩu: <code className="font-bold bg-white px-1.5 py-0.5 rounded border text-rose-600">admin123</code></div>
        </div>
      </div>
    </div>
  );
}
