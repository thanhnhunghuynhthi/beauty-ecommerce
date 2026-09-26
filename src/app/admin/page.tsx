'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, DollarSign, ShoppingBag, ArrowLeft, LogOut, ShieldCheck, Trash2, Edit, Plus, X, Ticket, Tag, Upload, Image as ImageIcon } from 'lucide-react';
import { Order, Product, Category, Brand } from '@/lib/types';
import { formatVND, parseImages } from '@/lib/formatters';

interface CouponData {
  id: string;
  code: string;
  discount: number;
  type: 'PERCENT' | 'FIXED';
  minSpend: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<CouponData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'coupons'>('orders');
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // File upload state
  const [uploadingImage, setUploadingImage] = useState(false);

  // Edit product modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState<number | ''>(0);
  const [editOriginalPrice, setEditOriginalPrice] = useState<number | ''>('');
  const [editSkinType, setEditSkinType] = useState('');
  const [editStock, setEditStock] = useState<number | ''>(0);
  const [editDescription, setEditDescription] = useState('');
  const [editImages, setEditImages] = useState('');
  const [savingProduct, setSavingProduct] = useState(false);

  // Create product modal state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState<number | ''>('');
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState<number | ''>('');
  const [newProdSkinType, setNewProdSkinType] = useState('Mọi loại da');
  const [newProdStock, setNewProdStock] = useState<number | ''>(50);
  const [newProdCategoryId, setNewProdCategoryId] = useState('');
  const [newProdBrandId, setNewProdBrandId] = useState('');
  const [newProdDescription, setNewProdDescription] = useState('');
  const [newProdImages, setNewProdImages] = useState('');
  const [newProdVolume, setNewProdVolume] = useState('50ml');
  const [creatingProduct, setCreatingProduct] = useState(false);
  const [productError, setProductError] = useState('');

  // Create coupon state
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState<number | ''>('');
  const [newType, setNewType] = useState<'PERCENT' | 'FIXED'>('PERCENT');
  const [newMinSpend, setNewMinSpend] = useState<number | ''>(0);
  const [creatingCoupon, setCreatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Check authentication
  useEffect(() => {
    let isAdminUser = localStorage.getItem('admin_logged_in') === 'true';
    try {
      const savedUser = localStorage.getItem('glowbeauty_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.role === 'ADMIN') {
          isAdminUser = true;
          localStorage.setItem('admin_logged_in', 'true');
        }
      }
    } catch (e) {
      console.error(e);
    }

    if (!isAdminUser) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const fetchAdminData = async () => {
    try {
      const [resOrders, resProducts, resCoupons, resCats, resBrands] = await Promise.all([
        fetch('/api/orders').then((r) => r.json()),
        fetch('/api/products').then((r) => r.json()),
        fetch('/api/coupons').then((r) => r.json()),
        fetch('/api/categories').then((r) => r.json()),
        fetch('/api/brands').then((r) => r.json()),
      ]);
      setOrders(Array.isArray(resOrders) ? resOrders : []);
      setProducts(Array.isArray(resProducts) ? resProducts : []);
      setCoupons(Array.isArray(resCoupons) ? resCoupons : []);
      setCategories(Array.isArray(resCats) ? resCats : []);
      setBrands(Array.isArray(resBrands) ? resBrands : []);

      if (Array.isArray(resCats) && resCats.length > 0) {
        setNewProdCategoryId(resCats[0].id);
      }
      if (Array.isArray(resBrands) && resBrands.length > 0) {
        setNewProdBrandId(resBrands[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminData();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('glowbeauty_user');
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = '/';
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (isEdit) {
          setEditImages(data.url);
        } else {
          setNewProdImages(data.url);
        }
      } else {
        alert('Tải ảnh từ máy tính lên thất bại.');
      }
    } catch (err) {
      console.error(err);
      alert('Đã xảy ra lỗi khi tải ảnh.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUpdateOrderStatus = async (code: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${code}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteOrder = async (code: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa đơn hàng #${code}?`)) return;
    try {
      const res = await fetch(`/api/orders/${code}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (slug: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}" khỏi cửa hàng?`)) return;
    try {
      const res = await fetch(`/api/products/${slug}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCoupon = async (id: string, code: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa voucher "${code}"?`)) return;
    try {
      const res = await fetch(`/api/coupons/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setEditName(p.name);
    setEditPrice(p.price);
    setEditOriginalPrice(p.originalPrice || '');
    setEditSkinType(p.skinType);
    setEditStock(p.stock);
    setEditDescription(p.description);
    setEditImages(p.images);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSavingProduct(true);

    try {
      const res = await fetch(`/api/products/${editingProduct.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          price: Number(editPrice),
          originalPrice: editOriginalPrice ? Number(editOriginalPrice) : null,
          skinType: editSkinType,
          stock: Number(editStock),
          images: editImages,
          description: editDescription,
        }),
      });

      if (res.ok) {
        setEditingProduct(null);
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingProduct(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice || !newProdCategoryId || !newProdBrandId) {
      setProductError('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return;
    }

    setCreatingProduct(true);
    setProductError('');

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProdName,
          price: Number(newProdPrice),
          originalPrice: newProdOriginalPrice ? Number(newProdOriginalPrice) : null,
          skinType: newProdSkinType || 'Mọi loại da',
          stock: Number(newProdStock) || 50,
          categoryId: newProdCategoryId,
          brandId: newProdBrandId,
          description: newProdDescription || newProdName,
          images: newProdImages || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop',
          volume: newProdVolume || '50ml',
        }),
      });

      if (res.ok) {
        setShowAddProductModal(false);
        setNewProdName('');
        setNewProdPrice('');
        setNewProdOriginalPrice('');
        setNewProdSkinType('Mọi loại da');
        setNewProdStock(50);
        setNewProdDescription('');
        setNewProdImages('');
        setNewProdVolume('50ml');
        fetchAdminData();
      } else {
        const err = await res.json();
        setProductError(err.error || 'Tạo sản phẩm thất bại.');
      }
    } catch (err) {
      console.error(err);
      setProductError('Lỗi kết nối tới máy chủ.');
    } finally {
      setCreatingProduct(false);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newDiscount) {
      setCouponError('Vui lòng điền mã voucher và mức giảm giá.');
      return;
    }

    setCreatingCoupon(true);
    setCouponError('');

    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newCode.toUpperCase().trim(),
          type: newType,
          discount: Number(newDiscount),
          minSpend: newMinSpend ? Number(newMinSpend) : 0,
        }),
      });

      if (res.ok) {
        setShowAddCouponModal(false);
        setNewCode('');
        setNewDiscount('');
        setNewMinSpend(0);
        fetchAdminData();
      } else {
        const err = await res.json();
        setCouponError(err.error || 'Tạo voucher không thành công');
      }
    } catch (err) {
      console.error(err);
      setCouponError('Đã có lỗi xảy ra.');
    } finally {
      setCreatingCoupon(false);
    }
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="max-w-[1700px] mx-auto px-6 py-24 text-center text-xl font-bold text-gray-500 animate-pulse">
        Đang kiểm tra quyền đăng nhập Admin...
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 py-10 space-y-8">
      {/* Admin Top Header & Logout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white p-8 sm:p-10 rounded-3xl border border-rose-100 shadow-md">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-extrabold text-rose-600 hover:underline mb-3"
          >
            <ArrowLeft size={16} /> Quay về trang bán hàng khách
          </Link>
          <div className="flex items-center gap-3">
            <ShieldCheck size={32} className="text-purple-600" />
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Bảng Quản Trị Hệ Thống GlowBeauty</h1>
          </div>
          <p className="text-sm font-semibold text-gray-500 mt-1">
            Quản lý doanh thu, xử lý đơn hàng, kho sản phẩm & mã giảm giá (Voucher)
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-rose-50 p-1.5 rounded-2xl border border-rose-100 overflow-x-auto">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-sm transition cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-rose-100'
              }`}
            >
              📦 Đơn Hàng ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-sm transition cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-rose-100'
              }`}
            >
              🧴 Sản Phẩm ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('coupons')}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-sm transition cursor-pointer ${
                activeTab === 'coupons'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-rose-100'
              }`}
            >
              🎟️ Vouchers ({coupons.length})
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="px-5 py-2.5 bg-gray-100 hover:bg-rose-100 text-rose-600 font-extrabold text-sm rounded-2xl transition flex items-center gap-2 cursor-pointer"
          >
            <LogOut size={18} /> Đăng Xuất Admin
          </button>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
            <DollarSign size={28} />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 block uppercase">Doanh Thu Hệ Thống</span>
            <span className="text-2xl font-black text-emerald-600">{formatVND(totalRevenue)}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
            <ShoppingBag size={28} />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 block uppercase">Tổng Đơn Hàng</span>
            <span className="text-2xl font-black text-gray-900">{orders.length} đơn</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
            <Package size={28} />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 block uppercase">Sản Phẩm Mỹ Phẩm</span>
            <span className="text-2xl font-black text-gray-900">{products.length} SP</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
            <Ticket size={28} />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 block uppercase">Vouchers Đang Khả Dụng</span>
            <span className="text-2xl font-black text-gray-900">{coupons.length} mã</span>
          </div>
        </div>
      </div>

      {/* Dynamic Content Table */}
      {activeTab === 'orders' ? (
        /* Orders Management Table */
        <div className="bg-white rounded-3xl border border-rose-100 shadow-sm overflow-hidden space-y-4">
          <div className="p-6 border-b border-rose-100 font-bold text-gray-900 text-base flex justify-between items-center">
            <span>Danh Sách Đơn Hàng Cần Xử Lý</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-rose-50/50 text-gray-600 uppercase tracking-wider text-[10px] font-bold border-b border-rose-100">
                <tr>
                  <th className="p-4">Mã Đơn</th>
                  <th className="p-4">Khách Hàng</th>
                  <th className="p-4">Liên Hệ</th>
                  <th className="p-4">Thanh Toán</th>
                  <th className="p-4">Tổng Tiền</th>
                  <th className="p-4">Trạng Thái Hiện Tại</th>
                  <th className="p-4">Đổi Trạng Thái</th>
                  <th className="p-4 text-center">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-rose-50/20">
                    <td className="p-4 font-extrabold text-rose-600">
                      <Link href={`/orders/${o.code}`} className="hover:underline">
                        #{o.code}
                      </Link>
                    </td>
                    <td className="p-4 font-bold text-gray-900">
                      {o.customerName}
                      <span className="block text-[10px] font-normal text-gray-400 truncate max-w-xs">{o.address}, {o.city}</span>
                    </td>
                    <td className="p-4">
                      {o.phone}
                      <span className="block text-[10px] text-gray-400">{o.email}</span>
                    </td>
                    <td className="p-4 font-medium">
                      <span className="font-bold">{o.paymentMethod}</span>
                      {o.status === 'COMPLETED' ? (
                        <span className="block text-[10px] text-emerald-600 font-bold">✓ Đã thanh toán</span>
                      ) : (
                        <span className="block text-[10px] text-amber-600">Chờ thu tiền</span>
                      )}
                    </td>
                    <td className="p-4 font-extrabold text-gray-900">{formatVND(o.totalAmount)}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          o.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : o.status === 'PROCESSING'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o.code, e.target.value)}
                        className="bg-white border border-gray-300 rounded-lg p-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
                      >
                        <option value="PENDING">PENDING (Đã nhận)</option>
                        <option value="PROCESSING">PROCESSING (Đóng gói)</option>
                        <option value="COMPLETED">COMPLETED (Đã giao)</option>
                        <option value="CANCELLED">CANCELLED (Hủy)</option>
                      </select>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDeleteOrder(o.code)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Xóa đơn hàng này"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'products' ? (
        /* Products Inventory Table */
        <div className="bg-white rounded-3xl border border-rose-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-rose-100 font-bold text-gray-900 text-base flex justify-between items-center">
            <span>Danh Sách Tồn Kho Sản Phẩm Mỹ Phẩm ({products.length} Sản phẩm)</span>

            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm rounded-xl shadow transition flex items-center gap-2 cursor-pointer"
            >
              <Plus size={18} /> Thêm Sản Phẩm Mới
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-rose-50/50 text-gray-600 uppercase tracking-wider text-[10px] font-bold border-b border-rose-100">
                <tr>
                  <th className="p-4">Hình Ảnh</th>
                  <th className="p-4">Tên Sản Phẩm</th>
                  <th className="p-4">Thương Hiệu</th>
                  <th className="p-4">Loại Da</th>
                  <th className="p-4">Giá Bán</th>
                  <th className="p-4">Tồn Kho</th>
                  <th className="p-4">Đánh Giá</th>
                  <th className="p-4 text-center">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50">
                {products.map((p) => {
                  const imgs = parseImages(p.images);
                  return (
                    <tr key={p.id} className="hover:bg-rose-50/20">
                      <td className="p-4">
                        <img src={imgs[0]} alt="" className="w-10 h-10 object-cover rounded-lg bg-rose-50" />
                      </td>
                      <td className="p-4 font-bold text-gray-900">
                        <Link href={`/products/${p.slug}`} className="hover:text-rose-600">
                          {p.name}
                        </Link>
                      </td>
                      <td className="p-4 font-medium text-rose-600">{p.brand?.name}</td>
                      <td className="p-4 text-gray-500">{p.skinType}</td>
                      <td className="p-4 font-bold text-gray-900">{formatVND(p.price)}</td>
                      <td className="p-4">
                        <span className={`font-bold ${p.stock < 30 ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {p.stock} chai/lọ
                        </span>
                      </td>
                      <td className="p-4 font-bold text-amber-500">⭐ {p.rating} ({p.reviewCount})</td>
                      <td className="p-4 text-center flex items-center justify-center gap-1">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="Chỉnh sửa sản phẩm"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.slug, p.name)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Xóa sản phẩm"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Coupons Management Table */
        <div className="bg-white rounded-3xl border border-rose-100 shadow-sm overflow-hidden space-y-4">
          <div className="p-6 border-b border-rose-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Ticket size={20} className="text-rose-600" /> Quản Lý Mã Giảm Giá (Vouchers)
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Tạo mã voucher giảm giá %, giảm tiền cố định cho khách hàng áp dụng tại trang Checkout
              </p>
            </div>

            <button
              onClick={() => setShowAddCouponModal(true)}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={16} /> Thêm Mã Giảm Giá Mới
            </button>
          </div>

          <div className="overflow-x-auto px-6 pb-6">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-rose-50/50 text-gray-600 uppercase tracking-wider text-[10px] font-bold border-b border-rose-100">
                <tr>
                  <th className="p-4">Mã Voucher</th>
                  <th className="p-4">Loại Giảm</th>
                  <th className="p-4">Mức Giảm</th>
                  <th className="p-4">Đơn Tối Thiểu</th>
                  <th className="p-4">Trạng Thái</th>
                  <th className="p-4 text-center">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-rose-50/20">
                    <td className="p-4 font-extrabold text-rose-600 tracking-wider">
                      <span className="bg-rose-50 px-2.5 py-1 rounded-md border border-rose-100">
                        {c.code}
                      </span>
                    </td>
                    <td className="p-4 font-semibold">
                      {c.type === 'PERCENT' ? 'Phần trăm (%)' : 'Số tiền cố định (VNĐ)'}
                    </td>
                    <td className="p-4 font-bold text-gray-900">
                      {c.type === 'PERCENT' ? `${c.discount}%` : formatVND(c.discount)}
                    </td>
                    <td className="p-4 font-medium text-gray-600">
                      {c.minSpend > 0 ? formatVND(c.minSpend) : 'Không yêu cầu'}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Đang Hoạt Động
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDeleteCoupon(c.id, c.code)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Xóa mã giảm giá này"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in">
            <button
              onClick={() => setEditingProduct(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Edit size={18} className="text-rose-600" /> Chỉnh Sửa Sản Phẩm Mỹ Phẩm
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Tên sản phẩm *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Giá bán (VNĐ) *</label>
                  <input
                    type="number"
                    required
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Giá gốc (VNĐ)</label>
                  <input
                    type="number"
                    value={editOriginalPrice}
                    onChange={(e) =>
                      setEditOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Loại da phù hợp</label>
                  <input
                    type="text"
                    value={editSkinType}
                    onChange={(e) => setEditSkinType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Số lượng tồn kho</label>
                  <input
                    type="number"
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Hình ảnh sản phẩm</label>
                <div className="flex items-center gap-3">
                  <label className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs rounded-xl border border-rose-200 transition cursor-pointer flex items-center gap-1.5">
                    <Upload size={14} />
                    {uploadingImage ? 'Đang tải lên...' : 'Tải ảnh từ máy tính'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, true)}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-gray-400 font-semibold">Hoặc dán URL:</span>
                </div>
                <input
                  type="text"
                  value={editImages}
                  onChange={(e) => setEditImages(e.target.value)}
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
                {editImages && (
                  <div className="mt-2 w-16 h-16 rounded-xl overflow-hidden border border-gray-200">
                    <img src={parseImages(editImages)[0]} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Mô tả sản phẩm</label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={savingProduct}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow cursor-pointer"
                >
                  {savingProduct ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in">
            <button
              onClick={() => setShowAddProductModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={22} />
            </button>

            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <Plus size={22} className="text-rose-600" /> Thêm Sản Phẩm Mỹ Phẩm Mới
            </h3>

            {productError && (
              <div className="p-3 bg-rose-100 border border-rose-200 text-rose-800 text-xs rounded-xl font-semibold">
                {productError}
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="space-y-4 text-sm font-semibold">
              <div>
                <label className="block text-xs font-extrabold text-gray-800 mb-1">Tên sản phẩm *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Tinh Chất Phục Hồi B5 La Roche-Posay"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-gray-800 mb-1">Danh mục sản phẩm *</label>
                  <select
                    value={newProdCategoryId}
                    onChange={(e) => setNewProdCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-800 mb-1">Thương hiệu *</label>
                  <select
                    value={newProdBrandId}
                    onChange={(e) => setNewProdBrandId(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none cursor-pointer"
                  >
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-gray-800 mb-1">Giá bán (VNĐ) *</label>
                  <input
                    type="number"
                    required
                    placeholder="Ví dụ: 450000"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-800 mb-1">Giá gốc (VNĐ)</label>
                  <input
                    type="number"
                    placeholder="Ví dụ: 550000 (Để trống nếu không giảm giá)"
                    value={newProdOriginalPrice}
                    onChange={(e) => setNewProdOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-gray-800 mb-1">Loại da</label>
                  <input
                    type="text"
                    placeholder="Dầu, Khô, Mụn..."
                    value={newProdSkinType}
                    onChange={(e) => setNewProdSkinType(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-800 mb-1">Dung tích</label>
                  <input
                    type="text"
                    placeholder="50ml, 100g..."
                    value={newProdVolume}
                    onChange={(e) => setNewProdVolume(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-800 mb-1">Tồn kho (Số lượng)</label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-gray-800 mb-1">Hình ảnh sản phẩm</label>
                <div className="flex items-center gap-3">
                  <label className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs rounded-xl border border-rose-200 transition cursor-pointer flex items-center gap-2">
                    <Upload size={16} />
                    {uploadingImage ? 'Đang tải ảnh...' : '📁 Tải ảnh từ máy tính lên'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, false)}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-gray-400 font-semibold">Hoặc dán URL:</span>
                </div>

                <input
                  type="text"
                  placeholder="Link hình ảnh /uploads/... hoặc https://..."
                  value={newProdImages}
                  onChange={(e) => setNewProdImages(e.target.value)}
                  className="w-full mt-2 px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />

                {newProdImages && (
                  <div className="mt-2.5 flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0">
                      <img src={parseImages(newProdImages)[0]} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs text-emerald-600 font-bold">✓ Đã chọn hình ảnh thành công</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-extrabold text-gray-800 mb-1">Mô tả sản phẩm</label>
                <textarea
                  rows={3}
                  placeholder="Mô tả công dụng và thông tin chi tiết sản phẩm..."
                  value={newProdDescription}
                  onChange={(e) => setNewProdDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={creatingProduct || uploadingImage}
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl shadow cursor-pointer"
                >
                  {creatingProduct ? 'Đang Tạo...' : 'Thêm Sản Phẩm Mới Ngay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Coupon Modal */}
      {showAddCouponModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in">
            <button
              onClick={() => setShowAddCouponModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Ticket size={20} className="text-rose-600" /> Tạo Mã Giảm Giá Mới
            </h3>

            {couponError && (
              <div className="p-3 bg-rose-100 border border-rose-200 text-rose-800 text-xs rounded-xl font-semibold">
                {couponError}
              </div>
            )}

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Mã Voucher (Viết hoa, không dấu) *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: SALE50K, HELLO2026"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl font-bold uppercase focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Loại giảm giá *</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as 'PERCENT' | 'FIXED')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none cursor-pointer"
                  >
                    <option value="PERCENT">Giảm phần trăm (%)</option>
                    <option value="FIXED">Giảm tiền (VNĐ)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Giá trị giảm *</label>
                  <input
                    type="number"
                    required
                    placeholder={newType === 'PERCENT' ? 'Ví dụ: 20' : 'Ví dụ: 50000'}
                    value={newDiscount}
                    onChange={(e) => setNewDiscount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Đơn hàng tối thiểu (VNĐ)</label>
                <input
                  type="number"
                  placeholder="Ví dụ: 200000 (0 nếu không yêu cầu)"
                  value={newMinSpend}
                  onChange={(e) => setNewMinSpend(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCouponModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={creatingCoupon}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow cursor-pointer"
                >
                  {creatingCoupon ? 'Đang tạo...' : 'Tạo Voucher Ngay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
