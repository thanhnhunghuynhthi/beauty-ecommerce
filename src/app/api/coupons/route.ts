import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(coupons);
  } catch (error) {
    return NextResponse.json(
      { error: 'Không thể lấy danh sách mã giảm giá' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, discount, type, minSpend } = body;

    if (!code || !discount) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp mã và giá trị giảm' },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();

    const existing = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Mã giảm giá này đã tồn tại trong hệ thống' },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: cleanCode,
        discount: Number(discount),
        type: type || 'PERCENT',
        minSpend: minSpend ? Number(minSpend) : 0,
        isActive: true,
      },
    });

    return NextResponse.json(coupon, { status: 201 });
  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json(
      { error: 'Không thể tạo mã giảm giá' },
      { status: 500 }
    );
  }
}
