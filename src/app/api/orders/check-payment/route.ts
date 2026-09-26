import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ paid: false, error: 'Thiếu mã đơn hàng' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { code },
    });

    if (order && (order.status === 'PROCESSING' || order.status === 'COMPLETED')) {
      return NextResponse.json({ paid: true, status: order.status, order });
    }

    return NextResponse.json({ paid: false });
  } catch (error) {
    return NextResponse.json({ paid: false }, { status: 500 });
  }
}
