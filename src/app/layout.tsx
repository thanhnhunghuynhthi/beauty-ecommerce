'use client';

import React, { useState, Suspense } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';
import { AuthProvider } from '@/lib/auth-context';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import AiAdvisorModal from '@/components/AiAdvisorModal';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  return (
    <html lang="vi">
      <head>
        <title>GlowBeauty - Thế Giới Mỹ Phẩm & Trang Điểm Chính Hãng</title>
        <meta
          name="description"
          content="Cửa hàng mỹ phẩm & trang điểm cao cấp chính hãng 3CE, MAC, Laneige, Innisfree, La Roche-Posay. Trải nghiệm Chuyên Gia AI tư vấn cá nhân hóa hoàn toàn miễn phí."
        />
      </head>
      <body className={`${inter.className} bg-slate-50/50 text-slate-800 antialiased min-h-screen flex flex-col`}>
        <AuthProvider>
          <CartProvider>
            <Suspense fallback={null}>
              <Header onOpenAiModal={() => setIsAiModalOpen(true)} />
            </Suspense>
            <main className="flex-1">{children}</main>
            <CartDrawer />
            <AiAdvisorModal
              isOpen={isAiModalOpen}
              onClose={() => setIsAiModalOpen(false)}
            />
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
