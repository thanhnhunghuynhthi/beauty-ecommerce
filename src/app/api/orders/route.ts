import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');

    const where: any = {};

    if (userId || email || phone) {
      where.OR = [];
      if (userId) where.OR.push({ userId });
      if (email) where.OR.push({ email });
      if (phone) where.OR.push({ phone });
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: 'Không thể tải danh sách đơn hàng' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      customerName,
      email,
      phone,
      address,
      city,
      notes,
      paymentMethod,
      isPaid,
      couponCode,
      discountAmount,
      customCode,
      items,
    } = body;

    if (!customerName || !email || !phone || !address || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp đầy đủ thông tin đặt hàng' },
        { status: 400 }
      );
    }

    // Generate random 6 digit code if customCode not provided
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const orderCode = customCode || `GB${randomDigits}`;

    // Calculate total
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (product) {
        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;
        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        });

        // Deduct stock
        await prisma.product.update({
          where: { id: product.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }
    }

    const discountVal = typeof discountAmount === 'number' ? discountAmount : 0;
    const subtotalAfterDiscount = Math.max(0, totalAmount - discountVal);
    const shippingFee = subtotalAfterDiscount >= 200000 || orderItemsData.length === 0 ? 0 : 30000;
    const finalTotal = subtotalAfterDiscount + shippingFee;

    const order = await prisma.order.create({
      data: {
        code: orderCode,
        userId: userId || null,
        customerName,
        email,
        phone,
        address,
        city: city || 'Toàn quốc',
        notes: notes || '',
        paymentMethod: paymentMethod || 'COD',
        totalAmount: finalTotal,
        couponCode: couponCode || null,
        discountAmount: discountVal,
        status: isPaid ? 'PROCESSING' : 'PENDING',
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Không thể tạo đơn hàng. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
