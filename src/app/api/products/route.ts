import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

function removeAccents(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const skinType = searchParams.get('skinType');
    const featured = searchParams.get('featured');
    const bestseller = searchParams.get('bestseller');
    const sort = searchParams.get('sort') || 'newest';

    const where: any = {};

    if (category) {
      where.category = { slug: category };
    }

    if (brand) {
      where.brand = { slug: brand };
    }

    if (skinType) {
      where.skinType = { contains: skinType };
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (bestseller === 'true') {
      where.isBestSeller = true;
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'rating') {
      orderBy = { rating: 'desc' };
    }

    let products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        brand: true,
      },
      orderBy,
    });

    if (search && search.trim()) {
      const q = removeAccents(search.trim());
      products = products.filter((p) => {
        const nameMatch = removeAccents(p.name).includes(q);
        const descMatch = p.description ? removeAccents(p.description).includes(q) : false;
        const ingMatch = p.ingredients ? removeAccents(p.ingredients).includes(q) : false;
        const brandMatch = p.brand?.name ? removeAccents(p.brand.name).includes(q) : false;
        const catMatch = p.category?.name ? removeAccents(p.category.name).includes(q) : false;
        return nameMatch || descMatch || ingMatch || brandMatch || catMatch;
      });
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Không thể lấy danh sách sản phẩm' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, price, originalPrice, skinType, stock, images, description, categoryId, brandId, volume } = body;

    if (!name || !price || !categoryId || !brandId) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc (Tên, Giá, Danh mục, Thương hiệu)' }, { status: 400 });
    }

    let slug = removeAccents(name)
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const existingSlug = await prisma.product.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    let imgArray = typeof images === 'string' && images.trim()
      ? (images.startsWith('[') ? images : JSON.stringify([images.trim()]))
      : JSON.stringify(['https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop']);

    const newProduct = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || name,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        stock: Number(stock) || 50,
        images: imgArray,
        skinType: skinType || 'Mọi loại da',
        volume: volume || '50ml',
        categoryId,
        brandId,
      },
    });

    return NextResponse.json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Không thể tạo sản phẩm mới' }, { status: 500 });
  }
}
