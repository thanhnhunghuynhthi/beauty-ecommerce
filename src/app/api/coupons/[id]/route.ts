import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.coupon.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, message: 'Đã xóa mã giảm giá thành công' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Không thể xóa mã giảm giá' },
      { status: 500 }
    );
  }
}
