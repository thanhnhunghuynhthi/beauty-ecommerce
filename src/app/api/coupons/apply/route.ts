import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, cartTotal, orderTotal } = body;
    const total = Number(orderTotal !== undefined ? orderTotal : (cartTotal !== undefined ? cartTotal : 0));

    if (!code || !code.trim()) {
      return NextResponse.json(
        { error: 'Vui lòng nhập mã giảm giá' },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();

    const coupon = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json(
        { error: 'Mã giảm giá không tồn tại hoặc đã hết hạn' },
        { status: 404 }
      );
    }

    if (total < coupon.minSpend) {
      return NextResponse.json(
        {
          error: `Mã ${coupon.code} chỉ áp dụng cho đơn hàng từ ${coupon.minSpend.toLocaleString('vi-VN')}đ trở lên!`,
        },
        { status: 400 }
      );
    }

    let discountAmount = 0;
    if (coupon.type === 'PERCENT') {
      discountAmount = Math.round((total * coupon.discount) / 100);
    } else {
      discountAmount = coupon.discount;
    }

    // Ensure discount amount doesn't exceed total
    if (discountAmount > total) {
      discountAmount = total;
    }

    return NextResponse.json({
      success: true,
      code: coupon.code,
      discountAmount,
      discount: coupon.discount,
      type: coupon.type,
      minSpend: coupon.minSpend,
    });
  } catch (error) {
    console.error('Error applying coupon:', error);
    return NextResponse.json(
      { error: 'Không thể áp dụng mã giảm giá' },
      { status: 500 }
    );
  }
}
