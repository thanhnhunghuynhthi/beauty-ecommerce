'use client';

import React from 'react';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckSquare, Square } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatVND, parseImages } from '@/lib/formatters';

export default function CartDrawer() {
  const {
    items,
    selectedItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    toggleSelectItem,
    toggleSelectAll,
    isAllSelected,
    selectedTotalPrice,
    selectedItemsCount,
    totalItemsCount,
  } = useCart();

  if (!isCartOpen) return null;

  const hasSelected = selectedItemsCount > 0;
  const shippingFee = selectedTotalPrice >= 200000 || !hasSelected ? 0 : 30000;
  const finalPayTotal = selectedTotalPrice + shippingFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 bg-rose-50 border-b border-rose-100 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-rose-700">
              <ShoppingBag size={20} />
              <h2 className="font-bold text-lg">Giỏ Hàng Mỹ Phẩm ({totalItemsCount})</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Select All Controls Bar */}
          {items.length > 0 && (
            <div className="px-6 py-2.5 bg-rose-50/60 border-b border-rose-100/60 flex items-center justify-between">
              <label
                onClick={() => toggleSelectAll()}
                className="flex items-center space-x-2.5 cursor-pointer select-none text-xs font-extrabold text-gray-700 hover:text-rose-600 transition"
              >
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={() => {}} // handled by label onClick
                  className="w-4 h-4 text-rose-600 rounded border-gray-300 focus:ring-rose-400 cursor-pointer accent-rose-600"
                />
                <span>Chọn tất cả ({selectedItemsCount}/{totalItemsCount} SP)</span>
              </label>

              <span className="text-[11px] text-rose-600 font-extrabold bg-rose-100/80 px-2 py-0.5 rounded-full">
                Đã chọn {selectedItems.length} loại SP
              </span>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-300 mb-3">
                  <ShoppingBag size={32} />
                </div>
                <p className="text-gray-500 font-medium">Giỏ hàng của bạn đang trống</p>
                <p className="text-xs text-gray-400 mt-1">Hãy khám phá các sản phẩm mỹ phẩm ưu đãi ngay!</p>
                <Link
                  href="/products"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-block mt-4 px-6 py-2.5 bg-rose-600 text-white text-xs font-extrabold rounded-full hover:bg-rose-700 transition cursor-pointer shadow-md"
                >
                  Mua Sắm Ngay
                </Link>
              </div>
            ) : (
              items.map((item) => {
                const { product, quantity, selected = true } = item;
                const images = parseImages(product.images);
                const imgUrl = images[0] || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300';
                
                return (
                  <div
                    key={product.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition shadow-xs ${
                      selected
                        ? 'border-rose-200 bg-white ring-1 ring-rose-100'
                        : 'border-gray-200 bg-gray-50/50 opacity-70'
                    }`}
                  >
                    {/* Checkbox Tick */}
                    <div className="flex items-center justify-center pl-1">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleSelectItem(product.id)}
                        className="w-4 h-4 text-rose-600 rounded border-gray-300 focus:ring-rose-400 cursor-pointer accent-rose-600"
                      />
                    </div>

                    {/* Product Image */}
                    <img
                      src={imgUrl}
                      alt={product.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg bg-rose-50 flex-shrink-0"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between h-full space-y-1">
                      <div>
                        <h4 className="text-xs font-semibold text-gray-800 line-clamp-2">
                          {product.name}
                        </h4>
                        <span className="text-[10px] text-rose-600 font-medium">
                          {product.brand?.name}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-bold text-rose-600">
                          {formatVND(product.price)}
                        </span>

                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="p-1 text-gray-500 hover:bg-gray-200 transition cursor-pointer"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2 text-xs font-medium text-gray-700">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="p-1 text-gray-500 hover:bg-gray-200 transition cursor-pointer"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-gray-400 hover:text-rose-500 p-1 transition cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Summary */}
          {items.length > 0 && (
            <div className="p-6 bg-rose-50/50 border-t border-rose-100 space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính ({selectedItemsCount} sản phẩm)</span>
                  <span className="font-medium text-gray-800">{formatVND(selectedTotalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-xs">
                  <span>Phí vận chuyển</span>
                  <span className="text-emerald-600 font-semibold">
                    {!hasSelected
                      ? '0 ₫'
                      : selectedTotalPrice >= 200000
                      ? 'MIỄN PHÍ'
                      : '30.000 ₫'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-rose-200">
                  <span>Tổng tiền thanh toán</span>
                  <span className="text-rose-600 text-lg font-black">
                    {formatVND(finalPayTotal)}
                  </span>
                </div>
              </div>

              {hasSelected ? (
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-rose-200 transition cursor-pointer"
                >
                  Tiến Hành Thanh Toán ({selectedItemsCount}) <ArrowRight size={18} />
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-500 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed text-xs"
                >
                  ⚠️ Vui lòng chọn ít nhất 1 sản phẩm để thanh toán
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
