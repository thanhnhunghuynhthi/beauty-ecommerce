'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Phone, MapPin, Mail, ArrowLeft, Save, CheckCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function ProfilePage() {
  const { user, login } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState(user?.city || 'TP. Hồ Chí Minh');
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setCity(user.city || 'TP. Hồ Chí Minh');
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto my-20 p-10 bg-white rounded-3xl border border-rose-100 text-center shadow-md space-y-6">
        <User size={56} className="mx-auto text-rose-500" />
        <h2 className="text-2xl font-black text-gray-900">Yêu Cầu Đăng Nhập</h2>
        <p className="text-sm font-semibold text-gray-500">
          Vui lòng đăng nhập tài khoản để xem và cập nhật thông tin cá nhân.
        </p>
        <Link
          href="/login"
          className="inline-block bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-8 py-3.5 rounded-full text-sm transition shadow-md"
        >
          Đăng Nhập Ngay
        </Link>
      </div>
    );
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name,
          phone,
          address,
          city,
        }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        login(updatedUser);
        setSuccessMsg('Đã cập nhật thông tin cá nhân thành công!');
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Cập nhật thất bại.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Đã có lỗi xảy ra.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-extrabold text-rose-600 hover:underline"
      >
        <ArrowLeft size={18} /> Quay lại trang chủ
      </Link>

      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-rose-100 shadow-md space-y-8">
        <div className="flex items-center gap-6 pb-8 border-b border-rose-100">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-500 to-pink-600 text-white flex items-center justify-center font-black text-3xl shadow-lg">
            {name ? name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900">{name}</h1>
            <p className="text-sm font-bold text-gray-500 flex items-center gap-2 mt-1">
              <Mail size={16} className="text-rose-500" /> {email} •{' '}
              <span className="text-rose-600 font-black">Thành Viên VIP</span>
            </p>
          </div>
        </div>

        {successMsg && (
          <div className="p-4 bg-emerald-100 border border-emerald-200 text-emerald-900 rounded-2xl text-sm font-bold flex items-center gap-2">
            <CheckCircle size={22} className="text-emerald-600" /> {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-rose-100 border border-rose-200 text-rose-900 rounded-2xl text-sm font-bold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <h2 className="text-xl font-black text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <User size={22} className="text-rose-500" /> Cập Nhật Thông Tin Cá Nhân & Giao Hàng
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-extrabold text-gray-800 mb-2">
                Họ và Tên Khách Hàng *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3.5 text-base font-semibold border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-800 mb-2">
                Email (Tài khoản)
              </label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full px-4 py-3.5 text-base font-semibold bg-gray-100 text-gray-500 border border-gray-200 rounded-2xl cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-extrabold text-gray-800 mb-2">
                Số Điện Thoại Nhận Hàng *
              </label>
              <input
                type="tel"
                required
                placeholder="Nhập số điện thoại (ví dụ: 0393104054)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3.5 text-base font-semibold border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-800 mb-2">
                Tỉnh / Thành Phố *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3.5 text-base font-semibold border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-extrabold text-gray-800 mb-2">
              Địa Chỉ Nhận Hàng Chi Tiết *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3.5 text-base font-semibold border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto px-10 py-4 bg-rose-600 hover:bg-rose-700 text-white font-black text-base rounded-2xl transition shadow-md flex items-center justify-center gap-3 cursor-pointer"
          >
            <Save size={20} />
            {isSaving ? 'Đang Lưu...' : 'Lưu Thay Đổi Thông Tin'}
          </button>
        </form>
      </div>
    </div>
  );
}
