import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Vui lòng điền email và mật khẩu' },
        { status: 400 }
      );
    }

    // Check if default admin login
    if (email === 'admin' || email === 'admin@glowbeauty.vn') {
      if (password === 'admin123') {
        return NextResponse.json({
          user: {
            id: 'admin-id',
            email: 'admin@glowbeauty.vn',
            name: 'Quản Trị Viên GlowBeauty',
            role: 'ADMIN',
          },
        });
      }
    }

    // Check in Database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không chính xác' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        city: user.city,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Lỗi hệ thống khi đăng nhập' },
      { status: 500 }
    );
  }
}
