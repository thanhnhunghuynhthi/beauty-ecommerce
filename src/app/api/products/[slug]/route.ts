import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: slug }, { slug }],
      },
      include: {
        category: true,
        brand: true,
        reviews: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Không tìm thấy sản phẩm' },
        { status: 404 }
      );
    }

    // Related products in same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        NOT: { id: product.id },
      },
      take: 4,
      include: {
        brand: true,
        category: true,
      },
    });

    return NextResponse.json({ product, relatedProducts });
  } catch (error) {
    console.error('Error fetching single product:', error);
    return NextResponse.json(
      { error: 'Lỗi hệ thống khi tải sản phẩm' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { userName, rating, comment, userId, email, phone } = body;

    if (!userName || !rating || !comment) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ tên, đánh giá và nhận xét' },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { slug },
      include: { reviews: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Không tìm thấy sản phẩm' },
        { status: 404 }
      );
    }

    // Verify if customer has actually purchased this product before
    const userEmail = email ? String(email).trim().toLowerCase() : '';
    const userPhone = phone ? String(phone).trim() : '';

    const filterConditions: any[] = [];
    if (userId) filterConditions.push({ userId });
    if (userEmail) filterConditions.push({ email: { equals: userEmail } });
    if (userPhone) filterConditions.push({ phone: { equals: userPhone } });

    if (filterConditions.length === 0) {
      return NextResponse.json(
        { error: 'Vui lòng đăng nhập tài khoản đã mua hàng để gửi đánh giá' },
        { status: 401 }
      );
    }

    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId: product.id,
        order: {
          OR: filterConditions,
        },
      },
    });

    if (!hasPurchased) {
      return NextResponse.json(
        { error: '🔒 Bạn chưa mua sản phẩm này. Chỉ khách hàng đã từng đặt mua thành công mới được quyền gửi đánh giá!' },
        { status: 403 }
      );
    }

    // Add review
    const newReview = await prisma.review.create({
      data: {
        productId: product.id,
        userName,
        rating: Number(rating),
        comment,
      },
    });

    // Update product rating and review count
    const totalReviews = product.reviews.length + 1;
    const sumRatings = product.reviews.reduce((sum, r) => sum + r.rating, 0) + Number(rating);
    const newRating = Number((sumRatings / totalReviews).toFixed(1));

    await prisma.product.update({
      where: { id: product.id },
      data: {
        rating: newRating,
        reviewCount: totalReviews,
      },
    });

    return NextResponse.json(newReview);
  } catch (error) {
    console.error('Error adding review:', error);
    return NextResponse.json(
      { error: 'Lỗi hệ thống khi thêm đánh giá' },
      { status: 500 }
    );
  }
}
