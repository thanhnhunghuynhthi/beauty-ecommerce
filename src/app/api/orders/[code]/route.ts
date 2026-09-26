import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ code: code }, { id: code }],
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Không tìm thấy đơn hàng' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: 'Lỗi tải đơn hàng' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const { status } = await request.json();

    const order = await prisma.order.update({
      where: { code },
      data: { status },
    });

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: 'Không thể cập nhật trạng thái đơn hàng' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    const order = await prisma.order.findFirst({
      where: { OR: [{ code: code }, { id: code }] },
    });

    if (!order) {
      return NextResponse.json({ error: 'Không tìm thấy đơn hàng' }, { status: 404 });
    }

    await prisma.orderItem.deleteMany({
      where: { orderId: order.id },
    });

    await prisma.order.delete({
      where: { id: order.id },
    });

    return NextResponse.json({ success: true, message: 'Đã xóa đơn hàng thành công' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'Không thể xóa đơn hàng' },
      { status: 500 }
    );
  }
}
