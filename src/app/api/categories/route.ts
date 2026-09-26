import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

const CATEGORY_ORDER = [
  'trang-diem-makeup',
  'sua-rua-mat-tay-trang',
  'serum-tinh-chat',
  'kem-chong-nang',
  'kem-duong-am',
  'mat-na-toner',
];

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    const sortedCategories = categories.sort((a, b) => {
      const indexA = CATEGORY_ORDER.indexOf(a.slug);
      const indexB = CATEGORY_ORDER.indexOf(b.slug);
      return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
    });

    return NextResponse.json(sortedCategories);
  } catch (error) {
    return NextResponse.json(
      { error: 'Lỗi tải danh mục' },
      { status: 500 }
    );
  }
}
