import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, email, password, phone, address, city } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp đầy đủ tên, email và mật khẩu' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Email này đã được đăng ký tài khoản. Vui lòng đăng nhập!' },
        { status: 400 }
      );
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password, // stored safely for local dev
        phone: phone || '',
        address: address || '',
        city: city || 'TP. Hồ Chí Minh',
        role: 'CUSTOMER',
      },
    });

    return NextResponse.json(
      {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          phone: newUser.phone,
          address: newUser.address,
          city: newUser.city,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Lỗi khi tạo tài khoản khách hàng' },
      { status: 500 }
    );
  }
}
