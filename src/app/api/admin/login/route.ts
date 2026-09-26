import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Default admin credentials for local development
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const response = NextResponse.json({
        success: true,
        message: 'Đăng nhập Admin thành công!',
        admin: { username: ADMIN_USERNAME, role: 'ADMIN' },
      });

      // Set cookie for 24 hours
      response.cookies.set('admin_token', 'glowbeauty_admin_valid_session', {
        httpOnly: false,
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
      });

      return response;
    }

    return NextResponse.json(
      { error: 'Tên đăng nhập hoặc mật khẩu không chính xác!' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Lỗi hệ thống khi đăng nhập' },
      { status: 500 }
    );
  }
}
