import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Standard Bank Webhook Gateway (Sepay / Casso / Bank Notification)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received Bank Webhook:', body);

    // Support Sepay / Casso / Custom format
    const content = body.content || body.description || body.data?.content || body.data?.description || '';
    const amount = body.transferAmount || body.amount || body.data?.amount || 0;

    // Extract Order Code (e.g. GB849201) from transfer memo
    const match = content.match(/GB\d{6}/i) || content.match(/GB-\d+/i);
    const orderCode = match ? match[0].toUpperCase() : null;

    if (!orderCode) {
      return NextResponse.json({ success: false, message: 'Khong tim thay ma don hang trong noi dung' });
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
        },
      });

      return NextResponse.json({
        success: true,
        message: `Da xac nhan thanh toan tu dong cho don hang ${orderCode}`,
        order: updatedOrder,
      });
    }

    return NextResponse.json({ success: false, message: 'Don hang khong ton tai' });
  } catch (error) {
    console.error('Error handling bank webhook:', error);
    return NextResponse.json({ success: false, error: 'Loi xu ly webhook' }, { status: 500 });
  }
}
