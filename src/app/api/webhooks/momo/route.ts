import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Official MoMo IPN & Webhook Receiver (Ví MoMo)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received MoMo Webhook IPN:', body);

    // Support MoMo IPN parameters (orderId, extraData, comment, content, description)
    const content =
      body.orderId ||
      body.extraData ||
      body.comment ||
      body.content ||
      body.description ||
      '';
    const amount = body.amount || body.transAmount || 0;
    const resultCode = body.resultCode ?? 0;

    if (resultCode !== 0 && resultCode !== '0') {
      return NextResponse.json({
        success: false,
        message: 'Giao dịch MoMo không thành công',
      });
    }

    // Extract Order Code (e.g. GB849201) from MoMo payload
    const match = content.match(/GB\d{6}/i) || content.match(/GB-\d+/i);
    const orderCode = match ? match[0].toUpperCase() : null;

    if (!orderCode) {
      return NextResponse.json({
        success: false,
        message: 'Không tìm thấy mã đơn hàng trong nội dung chuyển MoMo',
      });
    }

    const order = await prisma.order.findUnique({
      where: { code: orderCode },
    });

    if (order) {
      // Mark order as COMPLETED / Paid
      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'COMPLETED',
          paymentMethod: 'MOMO',
        },
      });

      return NextResponse.json({
        success: true,
        message: `Đã xác nhận thanh toán MoMo tự động cho đơn hàng ${orderCode}`,
        order: updatedOrder,
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Đơn hàng không tồn tại',
    });
  } catch (error) {
    console.error('Error handling MoMo webhook:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi xử lý MoMo webhook' },
      { status: 500 }
    );
  }
}
