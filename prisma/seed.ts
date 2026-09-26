import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with Unified Makeup & Skincare Collection...');

  // Clean existing data
  await prisma.coupon.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.brand.deleteMany({});
  await prisma.user.deleteMany({});

  // Seed Initial Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: 'GLOW2026',
        discount: 20,
        type: 'PERCENT',
        minSpend: 200000,
        isActive: true,
      },
      {
        code: 'BEAUTY50',
        discount: 50000,
        type: 'FIXED',
        minSpend: 300000,
        isActive: true,
      },
      {
        code: 'CHINHHANG10',
        discount: 10,
        type: 'PERCENT',
        minSpend: 0,
        isActive: true,
      },
    ],
  });

  // 0. Create Users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@glowbeauty.vn',
      password: 'admin123',
      name: 'Quản Trị Viên GlowBeauty',
      phone: '0393104054',
      role: 'ADMIN',
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      email: 'thanhnhung@gmail.com',
      password: '123456',
      name: 'Thanh Nhung',
      phone: '0393104054',
      address: '456 Lê Lợi, Bà Điểm',
      city: 'TP. Hồ Chí Minh',
      role: 'CUSTOMER',
    },
  });

  // 1. Create Brands
  const brandLaRoche = await prisma.brand.create({
    data: {
      name: 'La Roche-Posay',
      slug: 'la-roche-posay',
      country: 'Pháp',
      logo: 'https://medias.watsons.vn/publishing/WTCVN-200480-front-bIKFK6R3-prodcat.png',
    },
  });

  const brandBioderma = await prisma.brand.create({
    data: {
      name: 'Bioderma',
      slug: 'bioderma',
      country: 'Pháp',
      logo: 'https://img.watsonsvn.com/ecommerce/ecom/Bioderma/Bioderma-Sensibio-H20-500ml-1.jpg',
    },
  });

  const brandLoreal = await prisma.brand.create({
    data: {
      name: "L'Oréal Paris",
      slug: 'loreal-paris',
      country: 'Pháp',
      logo: 'https://medias.watsons.vn/publishing/WTCVN-200480-front-bIKFK6R3-prodcat.png',
    },
  });

  const brandSkin1004 = await prisma.brand.create({
    data: {
      name: 'Skin1004',
      slug: 'skin1004',
      country: 'Hàn Quốc',
      logo: 'https://medias.watsons.vn/publishing/WTCVN-214601-front-prodcat.jpg',
    },
  });

  const brandKlairs = await prisma.brand.create({
    data: {
      name: 'Dear Klairs',
      slug: 'dear-klairs',
      country: 'Hàn Quốc',
      logo: 'https://www.guardian.com.vn/media/catalog/product/cache/207e23213cf636ccdef205098cf3c8a3/3/0/3032512_16_.png',
    },
  });

  const brandNeutrogena = await prisma.brand.create({
    data: {
      name: 'Neutrogena',
      slug: 'neutrogena',
      country: 'Mỹ',
      logo: 'https://www.guardian.com.vn/media/catalog/product/cache/207e23213cf636ccdef205098cf3c8a3/s/e/se207c9276fbf4fef9c366335e74bbff9c_heljxejzer5b2ttg.png',
    },
  });

  const brandInnisfree = await prisma.brand.create({
    data: {
      name: 'Innisfree',
      slug: 'innisfree',
      country: 'Hàn Quốc',
      logo: 'https://www.guardian.com.vn/media/catalog/product/cache/207e23213cf636ccdef205098cf3c8a3/s/2/s22724b9cd19e48138b1379b80c803d26b_6zhdk3atm87zrhfs.png',
    },
  });

  const brandAnessa = await prisma.brand.create({
    data: {
      name: 'Anessa',
      slug: 'anessa',
      country: 'Nhật Bản',
      logo: 'https://medias.watsons.vn/publishing/WTCVN-211800-front-prodcat.jpg',
    },
  });

  const brandCosrx = await prisma.brand.create({
    data: {
      name: 'COSRX',
      slug: 'cosrx',
      country: 'Hàn Quốc',
      logo: 'https://img.watsonsvn.com/ecommerce/ecom/Cosrx/Cosrx-Low-pH-Good-Morning-Gel-Cleanser-150ml-1.jpg',
    },
  });

  const brandEstee = await prisma.brand.create({
    data: {
      name: 'Estée Lauder',
      slug: 'estee-lauder',
      country: 'Mỹ',
      logo: 'https://medias.watsons.com.sg/publishing/WTCSG-11299-front-QJRomw29-prodcat.png',
    },
  });

  const brand3CE = await prisma.brand.create({
    data: {
      name: '3CE (3 Concept Eyes)',
      slug: '3ce',
      country: 'Hàn Quốc',
      logo: 'https://medias.watsons.vn/publishing/WTCVN-217691-front-zoom.jpg',
    },
  });

  const brandMac = await prisma.brand.create({
    data: {
      name: 'MAC Cosmetics',
      slug: 'mac-cosmetics',
      country: 'Mỹ',
      logo: 'https://product.hstatic.net/1000301613/product/son-3ce-velvet-lip-tint-taupe-do-nau-1_26e976cae59945ba8476f8e982b0de6d.jpg',
    },
  });

  const brandMaybelline = await prisma.brand.create({
    data: {
      name: 'Maybelline New York',
      slug: 'maybelline',
      country: 'Mỹ',
      logo: 'https://medias.watsons.vn/publishing/WTCVN-211800-front-prodcat.jpg',
    },
  });

  const brandRomand = await prisma.brand.create({
    data: {
      name: 'Romand',
      slug: 'romand',
      country: 'Hàn Quốc',
      logo: 'https://medias.watsons.co.th/publishing/WTCTH-308640-side-zoom.jpg',
    },
  });

  const brandCanmake = await prisma.brand.create({
    data: {
      name: 'Canmake',
      slug: 'canmake',
      country: 'Nhật Bản',
      logo: 'https://medias.watsons.vn/publishing/WTCVN-217691-front-zoom.jpg',
    },
  });

  const brandTooCool = await prisma.brand.create({
    data: {
      name: 'Too Cool For School',
      slug: 'too-cool-for-school',
      country: 'Hàn Quốc',
      logo: 'https://medias.watsons.vn/publishing/WTCVN-214736-front-thumbnail.jpg',
    },
  });

  const brandLaneige = await prisma.brand.create({
    data: {
      name: 'Laneige',
      slug: 'laneige',
      country: 'Hàn Quốc',
      logo: 'https://www.laneige.com.vn/media/catalog/product/1/0/1000-1.jpg',
    },
  });

  // 2. Create Combined Categories
  const catCleanser = await prisma.category.create({
    data: {
      name: 'Sữa Rửa Mặt & Tẩy Trang',
      slug: 'sua-rua-mat-tay-trang',
      description: 'Làm sạch sâu, loại bỏ bụi bẩn, dầu thừa và nước tẩy trang dịu nhẹ cho làn da',
      icon: 'sparkles',
    },
  });

  const catSerum = await prisma.category.create({
    data: {
      name: 'Serum & Tinh Chất',
      slug: 'serum-tinh-chat',
      description: 'Đặc trị mụn, thâm, cấp ẩm, phục hồi da tổn thương và tinh chất chống lão hóa',
      icon: 'droplet',
    },
  });

  const catSunscreen = await prisma.category.create({
    data: {
      name: 'Kem Chống Nắng',
      slug: 'kem-chong-nang',
      description: 'Bảo vệ da toàn diện khỏi tia UV và tác nhân môi trường',
      icon: 'sun',
    },
  });

  const catCream = await prisma.category.create({
    data: {
      name: 'Kem Dưỡng Ẩm',
      slug: 'kem-duong-am',
      description: 'Khóa ẩm, phục hồi B5, mềm mịn da và củng cố hàng rào bảo vệ da',
      icon: 'heart',
    },
  });

  const catMask = await prisma.category.create({
    data: {
      name: 'Mặt Nạ & Toner',
      slug: 'mat-na-toner',
      description: 'Cân bằng độ pH và cung cấp dưỡng chất tức thì',
      icon: 'smile',
    },
  });

  // COMBINED TRANG ĐIỂM CATEGORY (Includes Son môi, Phấn phủ, Tạo khối, Bảng mắt, Chì kẻ mày, Mascara, Cushion)
  const catMakeup = await prisma.category.create({
    data: {
      name: 'Trang Điểm (Makeup)',
      slug: 'trang-diem-makeup',
      description: 'Trọn bộ trang điểm chính hãng: Son môi, phấn phủ, phấn tạo khối, bảng mắt, chì kẻ mày, mascara và kem nền',
      icon: 'sparkles',
    },
  });

  // 3. Create Authentic Products
  const products = [
    // --- COMBINED MAKEUP CATEGORY (TRANG ĐIỂM) ---
    {
      name: 'Phấn Tạo Khối 3 Ô Too Cool For School Artclass By Rodin Shading 9.5g',
      slug: 'phan-tao-khoi-too-cool-for-school-artclass-by-rodin-shading-9-5g',
      description: 'Phấn tạo khối 3 ô huyền thoại của Too Cool For School Hàn Quốc giúp định hình đường nét khuôn mặt thon gọn, tự nhiên, hạt phấn siêu mịn dễ tán.',
      price: 285000,
      originalPrice: 350000,
      stock: 80,
      images: JSON.stringify([
        'https://medias.watsons.vn/publishing/WTCVN-214736-front-thumbnail.jpg'
      ]),
      skinType: 'Mọi Tông Da',
      ingredients: 'Talc, Mica, Titanium Dioxide, Synthetic Fluorphlogopite',
      volume: '9.5g',
      isFeatured: true,
      isBestSeller: true,
      rating: 4.9,
      reviewCount: 350,
      categoryId: catMakeup.id,
      brandId: brandTooCool.id,
    },
    {
      name: 'Bảng Phấn Mắt 9 Ô 3CE Multi Eye Color Palette #Overtake (Cam Đất Đào)',
      slug: 'bang-phan-mat-3ce-multi-eye-color-palette-overtake',
      description: 'Bảng phấn mắt 9 ô đỉnh cao 3CE #Overtake Hàn Quốc tông màu cam đất đào và nhũ kim tuyến lấp lánh sang trọng, lâu trôi cả ngày.',
      price: 590000,
      originalPrice: 680000,
      stock: 55,
      images: JSON.stringify([
        'https://www.guardian.com.vn/media/catalog/product/cache/207e23213cf636ccdef205098cf3c8a3/1/_/1.overtake.png'
      ]),
      skinType: 'Mọi Tông Da',
      ingredients: 'Silica, Synthetic Wax, Macadamia Seed Oil',
      volume: '8.1g',
      isFeatured: true,
      isBestSeller: true,
      rating: 5.0,
      reviewCount: 290,
      categoryId: catMakeup.id,
      brandId: brand3CE.id,
    },
    {
      name: 'Chì Kẻ Chân Mày 2 Đầu Innisfree Auto Eyebrow Pencil (Tự Nhiên)',
      slug: 'chi-ke-chan-may-2-dau-innisfree-auto-eyebrow-pencil',
      description: 'Chì kẻ mày dạng xoay 2 đầu Innisfree Hàn Quốc thiết kế đầu vạt xéo sắc nét kèm chải mi mày mềm mại, lên màu tự nhiên lâu trôi.',
      price: 85000,
      originalPrice: 110000,
      stock: 140,
      images: JSON.stringify([
        'https://www.guardian.com.vn/media/catalog/product/cache/207e23213cf636ccdef205098cf3c8a3/3/0/3029587.jpg'
      ]),
      skinType: 'Mọi Tông Da',
      ingredients: 'Iron Oxides, Hydrogenated Soybean Oil, Tocopherol',
      volume: '0.3g',
      isFeatured: false,
      isBestSeller: true,
      rating: 4.8,
      reviewCount: 210,
      categoryId: catMakeup.id,
      brandId: brandInnisfree.id,
    },
    {
      name: 'Son Kem Lì 3CE Velvet Lip Tint #Taupe (Đỏ Nâu)',
      slug: 'son-kem-li-3ce-velvet-lip-tint-taupe',
      description: 'Son kem lì mịn như nhung chuẩn 3CE Hàn Quốc, tone màu Taupe (Đỏ Nâu) sang trọng tôn da, chất son mịn mượt không gây khô môi.',
      price: 295000,
      originalPrice: 350000,
      stock: 65,
      images: JSON.stringify([
        'https://medias.watsons.vn/publishing/WTCVN-217691-front-zoom.jpg'
      ]),
      skinType: 'Mọi Tông Da',
      ingredients: 'Dimethicone, Sunflower Seed Oil, Vitamin E',
      volume: '4g',
      isFeatured: true,
      isBestSeller: true,
      rating: 4.9,
      reviewCount: 142,
      categoryId: catMakeup.id,
      brandId: brand3CE.id,
    },
    {
      name: 'Son Tint Bóng Romand Juicy Lasting Tint #20 Dark Coconut (Hồng Nâu Trầm)',
      slug: 'son-tint-bong-romand-juicy-lasting-tint-20-dark-coconut',
      description: 'Son tint bóng Rom&nd Hàn Quốc chính hãng cho hiệu ứng đôi môi mọng nước căng mịn, giữ màu lâu trôi cả ngày với sắc Dark Coconut sang chảnh.',
      price: 175000,
      originalPrice: 220000,
      stock: 90,
      images: JSON.stringify([
        'https://medias.watsons.co.th/publishing/WTCTH-308640-side-zoom.jpg'
      ]),
      skinType: 'Mọi Tông Da',
      ingredients: 'Chiết xuất dừa, xoài, kiwi',
      volume: '5.5g',
      isFeatured: true,
      isBestSeller: true,
      rating: 4.8,
      reviewCount: 98,
      categoryId: catMakeup.id,
      brandId: brandRomand.id,
    },
    {
      name: 'Son Thỏi Lì MAC Matte Lipstick #707 Ruby Woo (Đỏ Cổ Điển)',
      slug: 'son-thoi-mac-matte-lipstick-707-ruby-woo',
      description: 'Son thỏi lì huyền thoại MAC Cosmetics Mỹ tone màu #707 Ruby Woo đỏ cổ điển siêu tôn da tôn răng, lên màu cực chuẩn và bền màu đến 8h.',
      price: 590000,
      originalPrice: 680000,
      stock: 40,
      images: JSON.stringify([
        'https://product.hstatic.net/1000301613/product/son-3ce-velvet-lip-tint-taupe-do-nau-1_26e976cae59945ba8476f8e982b0de6d.jpg'
      ]),
      skinType: 'Mọi Tông Da',
      ingredients: 'Castor Seed Oil, Carnauba Wax, Tocopherol',
      volume: '3g',
      isFeatured: true,
      isBestSeller: true,
      rating: 5.0,
      reviewCount: 230,
      categoryId: catMakeup.id,
      brandId: brandMac.id,
    },
    {
      name: 'Phấn Phủ Nén Kiềm Dầu Canmake Marshmallow Finish Powder 10g',
      slug: 'phan-phu-nen-canmake-marshmallow-finish-powder-10g',
      description: 'Phấn phủ nén kiềm dầu mỏng mịn như kẹo bông marshmallow Canmake Nhật Bản, mang lại làn da trắng mịn tự nhiên suốt cả ngày.',
      price: 310000,
      originalPrice: 380000,
      stock: 60,
      images: JSON.stringify([
        'https://medias.watsons.vn/publishing/WTCVN-217691-front-zoom.jpg'
      ]),
      skinType: 'Da Dầu, Da Hỗn Hợp, Da Thường',
      ingredients: 'Khoáng chất Nhật Bản, Chiết xuất lá lô hội, Rosemary',
      volume: '10g',
      isFeatured: true,
      isBestSeller: false,
      rating: 4.9,
      reviewCount: 88,
      categoryId: catMakeup.id,
      brandId: brandCanmake.id,
    },
    {
      name: 'Phấn Phủ Bột Kiềm Dầu Innisfree No-Sebum Mineral Powder 5g',
      slug: 'phan-phu-kiem-dau-innisfree-no-sebum-mineral-powder-5g',
      description: 'Phấn phủ dạng bột chứa khoáng chất tự nhiên từ đảo Jeju Innisfree giúp kiểm soát lượng dầu thừa vượt trội, giữ lớp makeup khô thoáng 12h.',
      price: 145000,
      originalPrice: 180000,
      stock: 150,
      images: JSON.stringify([
        'https://medias.watsons.vn/publishing/WTCVN-217058-front-prodcat.jpg'
      ]),
      skinType: 'Da Dầu, Da Hỗn Hợp, Da Mụn',
      ingredients: 'Khoáng chất Jeju, Bạc hà tự nhiên, Silica',
      volume: '5g',
      isFeatured: true,
      isBestSeller: true,
      rating: 4.9,
      reviewCount: 310,
      categoryId: catMakeup.id,
      brandId: brandInnisfree.id,
    },
    {
      name: 'Kem Nền Mịn Nhẹ Kiềm Dầu Maybelline Fit Me Matte + Poreless SPF22 30ml',
      slug: 'kem-nen-maybelline-fit-me-matte-poreless-30ml',
      description: 'Kem nền kiềm dầu Maybelline New York Fit Me Matte + Poreless giúp che phủ lỗ chân lông hoàn hảo, tạo hiệu ứng mịn lì tự nhiên.',
      price: 265000,
      originalPrice: 315000,
      stock: 75,
      images: JSON.stringify([
        'https://medias.watsons.vn/publishing/WTCVN-209204-front-zoom.jpg'
      ]),
      skinType: 'Da Dầu, Da Hỗn Hợp, Da Thường',
      ingredients: 'Hạt phấn Aerogel micro-powder kiềm dầu',
      volume: '30ml',
      isFeatured: false,
      isBestSeller: true,
      rating: 4.8,
      reviewCount: 185,
      categoryId: catMakeup.id,
      brandId: brandMaybelline.id,
    },
    {
      name: 'Mascara Chống Nước Dày Mi Maybelline Lash Sensational Waterproof 10ml',
      slug: 'mascara-chong-nuoc-maybelline-lash-sensational-10ml',
      description: 'Mascara Maybelline Lash Sensational đầu cọ xòe quạt giúp chải mi tơi đều, làm dài và tơi mi x3 lần, kháng nước mồ hôi tối đa.',
      price: 185000,
      originalPrice: 220000,
      stock: 110,
      images: JSON.stringify([
        'https://medias.watsons.vn/publishing/WTCVN-217691-front-zoom.jpg'
      ]),
      skinType: 'Mọi Loại Da',
      ingredients: 'Tinh chất dầu Jojoba nuôi dưỡng mi',
      volume: '10ml',
      isFeatured: true,
      isBestSeller: false,
      rating: 4.7,
      reviewCount: 115,
      categoryId: catMakeup.id,
      brandId: brandMaybelline.id,
    },

    // --- NƯỚC TẨY TRANG & SỮA RỬA MẶT ---
    {
      name: 'Nước Tẩy Trang Bioderma Sensibio H2O 500ml (Nắp Hồng Da Nhạy Cảm)',
      slug: 'nuoc-tay-trang-bioderma-sensibio-h2o-500ml',
      description: 'Nước tẩy trang công nghệ Micellar huyền thoại làm sạch sâu 99% bụi bẩn và makeup mà không rát da chính hãng Bioderma Pháp.',
      price: 485000,
      originalPrice: 550000,
      stock: 100,
      images: JSON.stringify([
        'https://img.watsonsvn.com/ecommerce/ecom/Bioderma/Bioderma-Sensibio-H20-500ml-1.jpg'
      ]),
      skinType: 'Da Nhạy Cảm, Da Khô, Mọi Loại Da',
      ingredients: 'Nước khoáng Bioderma, Chiết xuất dưa leo, PEG-6 Caprylic Glycerides',
      volume: '500ml',
      isFeatured: true,
      isBestSeller: true,
      rating: 5.0,
      reviewCount: 420,
      categoryId: catCleanser.id,
      brandId: brandBioderma.id,
    },
    {
      name: "Nước Tẩy Trang L'Oréal Paris Micellar Water 3 in 1 400ml",
      slug: 'nuoc-tay-trang-loreal-paris-micellar-water-400ml',
      description: "Nước tẩy trang kiềm dầu cấp ẩm 3 trong 1 chính hãng L'Oréal Paris Pháp làm sạch mịn da và loại bỏ dầu thừa tức thì.",
      price: 199000,
      originalPrice: 245000,
      stock: 120,
      images: JSON.stringify([
        'https://medias.watsons.vn/publishing/WTCVN-200480-front-bIKFK6R3-prodcat.png'
      ]),
      skinType: 'Da Dầu, Da Hỗn Hợp, Da Thường',
      ingredients: 'Công nghệ Micellar, Nước khoáng Pháp, Glycerin',
      volume: '400ml',
      isFeatured: true,
      isBestSeller: true,
      rating: 4.8,
      reviewCount: 230,
      categoryId: catCleanser.id,
      brandId: brandLoreal.id,
    },
    {
      name: 'Sữa Rửa Mặt La Roche-Posay Effaclar Purifying Foaming Gel 200ml',
      slug: 'sua-rua-mat-la-roche-posay-effaclar-200ml',
      description: 'Sữa rửa mặt dạng gel làm sạch dịu nhẹ, kiểm soát dầu thừa và ngăn ngừa mụn dành riêng cho da dầu nhạy cảm chính hãng La Roche-Posay Pháp.',
      price: 385000,
      originalPrice: 450000,
      stock: 50,
      images: JSON.stringify([
        'https://medias.watsons.vn/publishing/WTCVN-200480-front-bIKFK6R3-prodcat.png'
      ]),
      skinType: 'Da Dầu, Da Nhạy Cảm, Da Mụn',
      ingredients: 'Zinc PCA, Nước khoáng La Roche-Posay, Citric Acid',
      volume: '200ml',
      isFeatured: true,
      isBestSeller: true,
      rating: 4.9,
      reviewCount: 128,
      categoryId: catCleanser.id,
      brandId: brandLaRoche.id,
    },
    {
      name: 'Sữa Rửa Mặt Dịu Nhẹ COSRX Low pH Good Morning Gel Cleanser 150ml',
      slug: 'sua-rua-mat-cosrx-low-ph-good-morning-150ml',
      description: 'Sữa rửa mặt gel độ pH chuẩn 5.5 giúp làm sạch sâu lỗ chân lông mà vẫn giữ độ ẩm tự nhiên cho da thương hiệu COSRX Hàn Quốc.',
      price: 195000,
      originalPrice: 260000,
      stock: 120,
      images: JSON.stringify([
        'https://img.watsonsvn.com/ecommerce/ecom/Cosrx/Cosrx-Low-pH-Good-Morning-Gel-Cleanser-150ml-1.jpg'
      ]),
      skinType: 'Da Nhạy Cảm, Da Mụn, Da Hỗn Hợp',
      ingredients: 'Tinh dầu tràm trà, BHA tự nhiên, Allantoin',
      volume: '150ml',
      isFeatured: true,
      isBestSeller: false,
      rating: 4.8,
      reviewCount: 175,
      categoryId: catCleanser.id,
      brandId: brandCosrx.id,
    },

    // --- SERUM & TINH CHẤT ---
    {
      name: 'Tinh Chất Rau Má Phục Hồi Skin1004 Madagascar Centella Ampoule 100ml',
      slug: 'tinh-chat-rau-ma-skin1004-madagascar-centella-ampoule-100ml',
      description: 'Tinh chất chiết xuất 100% rau má mọc hoang dã tại Madagascar làm dịu da mụn sưng đỏ, phục hồi hàng rào bảo vệ da thương hiệu Skin1004 Hàn Quốc.',
      price: 375000,
      originalPrice: 450000,
      stock: 85,
      images: JSON.stringify([
        'https://medias.watsons.vn/publishing/WTCVN-214601-front-prodcat.jpg'
      ]),
      skinType: 'Da Mụn, Da Nhạy Cảm, Da Tổn Thương',
      ingredients: '100% Chiết xuất Rau Má Madagascar (Centella Asiatica)',
      volume: '100ml',
      isFeatured: true,
      isBestSeller: true,
      rating: 4.9,
      reviewCount: 310,
      categoryId: catSerum.id,
      brandId: brandSkin1004.id,
    },
    {
      name: 'Serum Cấp Ẩm Sâu Klairs Rich Moist Soothing Serum 80ml',
      slug: 'serum-cap-am-klairs-rich-moist-soothing-serum-80ml',
      description: 'Serum cấp ẩm dạng gel dịu mát chứa Hyaluronic Acid và chiết xuất rau má nuôi dưỡng làn da khô ráp trở nên mềm mịn mọng nước thương hiệu Dear Klairs Hàn Quốc.',
      price: 345000,
      originalPrice: 420000,
      stock: 60,
      images: JSON.stringify([
        'https://www.guardian.com.vn/media/catalog/product/cache/207e23213cf636ccdef205098cf3c8a3/3/0/3032512_16_.png'
      ]),
      skinType: 'Da Khô, Da Nhạy Cảm, Da Thiếu Nước',
      ingredients: 'Hyaluronic Acid, Centella Asiatica, Phyto-Oligo',
      volume: '80ml',
      isFeatured: true,
      isBestSeller: false,
      rating: 4.8,
      reviewCount: 140,
      categoryId: catSerum.id,
      brandId: brandKlairs.id,
    },
    {
      name: 'Serum Phục Hồi La Roche-Posay Hyalu B5 Serum 30ml',
      slug: 'serum-la-roche-posay-hyalu-b5-30ml',
      description: 'Tinh chất dưỡng ẩm chuyên sâu, hỗ trợ tái tạo da, giúp da săn chắc và đàn hồi hơn với Vitamin B5 và Hyaluronic Acid kép chính hãng La Roche-Posay.',
      price: 980000,
      originalPrice: 1150000,
      stock: 30,
      images: JSON.stringify([
        'https://www.guardian.com.vn/media/catalog/product/cache/207e23213cf636ccdef205098cf3c8a3/s/d/sd2b5b6efc87f4174a861393292b03826f_ndpfn45o50ytftj0.png'
      ]),
      skinType: 'Mọi Loại Da, Da Khô, Da Nhạy Cảm',
      ingredients: 'Hyaluronic Acid, Vitamin B5, Madecassoside',
      volume: '30ml',
      isFeatured: true,
      isBestSeller: true,
      rating: 4.8,
      reviewCount: 95,
      categoryId: catSerum.id,
      brandId: brandLaRoche.id,
    },
    {
      name: 'Serum Estée Lauder Advanced Night Repair Synchronized Multi-Recovery Complex 50ml',
      slug: 'serum-estee-lauder-advanced-night-repair-50ml',
      description: 'Serum chống lão hóa biểu tượng hàng đầu thế giới của Estée Lauder Mỹ, giúp trẻ hóa làn da, giảm nếp nhăn và cho da căng mướt rạng rỡ.',
      price: 2450000,
      originalPrice: 2800000,
      stock: 20,
      images: JSON.stringify([
        'https://medias.watsons.com.sg/publishing/WTCSG-11299-front-QJRomw29-prodcat.png'
      ]),
      skinType: 'Mọi Loại Da, Da Lão Hóa, Da Chảy Xệ',
      ingredients: 'Công nghệ Chronolux Power Signal, Tripeptide-32, Hyaluronic Acid',
      volume: '50ml',
      isFeatured: true,
      isBestSeller: true,
      rating: 5.0,
      reviewCount: 320,
      categoryId: catSerum.id,
      brandId: brandEstee.id,
    },

    // --- KEM DƯỠNG ẨM & KEM CHỐNG NẮNG ---
    {
      name: 'Kem Dưỡng Phục Hồi Da La Roche-Posay Cicaplast Baume B5+ 40ml',
      slug: 'kem-duong-la-roche-posay-cicaplast-baume-b5-plus-40ml',
      description: 'Kem dưỡng làm dịu da kích ứng, phục hồi da tổn thương B5+ thế hệ mới tái tạo hàng rào da gấp 2 lần chính hãng La Roche-Posay Pháp.',
      price: 365000,
      originalPrice: 410000,
      stock: 95,
      images: JSON.stringify([
        'https://medias.watsons.vn/publishing/WTCVN-200500-front-TThDMwhZ-prodcat.png'
      ]),
      skinType: 'Da Nhạy Cảm, Da Tổn Thương, Da Kích Ứng',
      ingredients: 'Tribioma phức hợp prebiotic, Panthenol 5% (B5), Madecassoside',
      volume: '40ml',
      isFeatured: true,
      isBestSeller: true,
      rating: 4.9,
      reviewCount: 380,
      categoryId: catCream.id,
      brandId: brandLaRoche.id,
    },
    {
      name: 'Kem Dưỡng Khóa Ẩm Kiềm Dầu Neutrogena Hydro Boost Water Gel 50g',
      slug: 'kem-duong-neutrogena-hydro-boost-water-gel-50g',
      description: 'Kem dưỡng ẩm dạng gel mỏng nhẹ thấm nhanh, cấp nước vượt trội cho da dầu da hỗn hợp suốt 72h thương hiệu Neutrogena Mỹ.',
      price: 330000,
      originalPrice: 390000,
      stock: 80,
      images: JSON.stringify([
        'https://www.guardian.com.vn/media/catalog/product/cache/207e23213cf636ccdef205098cf3c8a3/s/e/se207c9276fbf4fef9c366335e74bbff9c_heljxejzer5b2ttg.png'
      ]),
      skinType: 'Da Dầu, Da Hỗn Hợp, Da Thiếu Nước',
      ingredients: 'Hyaluronic Acid tinh khiết, Chiết xuất olive, Glycerin',
      volume: '50g',
      isFeatured: true,
      isBestSeller: true,
      rating: 4.8,
      reviewCount: 260,
      categoryId: catCream.id,
      brandId: brandNeutrogena.id,
    },
    {
      name: 'Kem Chống Nắng Anessa Perfect UV Sunscreen Skincare Milk SPF50+ PA++++ 60ml',
      slug: 'kem-chong-nang-anessa-perfect-uv-milk-60ml',
      description: 'Kem chống nắng dạng sữa mỏng nhẹ, chống nước & mồ hôi tối ưu với công nghệ Auto Booster độc quyền từ Shiseido Anessa Nhật Bản.',
      price: 525000,
      originalPrice: 680000,
      stock: 80,
      images: JSON.stringify([
        'https://medias.watsons.vn/publishing/WTCVN-211800-front-prodcat.jpg'
      ]),
      skinType: 'Mọi Loại Da, Da Dầu, Da Hỗn Hợp',
      ingredients: 'Trà Xanh, Rễ Cam Thảo, Collagen, Hyaluronic Acid',
      volume: '60ml',
      isFeatured: true,
      isBestSeller: true,
      rating: 4.9,
      reviewCount: 210,
      categoryId: catSunscreen.id,
      brandId: brandAnessa.id,
    },

    // --- MẶT NẠ & TONER ---
    {
      name: 'Nước Hoa Hồng Klairs Supple Preparation Unscented Toner 180ml',
      slug: 'nuoc-hoa-hong-klairs-supple-preparation-unscented-toner-180ml',
      description: 'Nước hoa hồng cân bằng độ pH không chứa hương liệu không cồn Dear Klairs Hàn Quốc giúp cấp ẩm sâu và làm dịu da nhạy cảm.',
      price: 285000,
      originalPrice: 340000,
      stock: 70,
      images: JSON.stringify([
        'https://medias.watsons.vn/publishing/WTCVN-214649-front-dYOFFIzj-prodcat.png'
      ]),
      skinType: 'Da Nhạy Cảm, Da Khô, Da Mụn',
      ingredients: 'Hyaluronic Acid, Centella Asiatica Extract, Lipidure',
      volume: '180ml',
      isFeatured: true,
      isBestSeller: true,
      rating: 4.9,
      reviewCount: 220,
      categoryId: catMask.id,
      brandId: brandKlairs.id,
    },
    {
      name: 'Nước Hoa Hồng Tẩy Tế Bào Chết COSRX AHA/BHA Clarifying Treatment Toner 150ml',
      slug: 'nuoc-hoa-hong-cosrx-aha-bha-clarifying-treatment-toner-150ml',
      description: 'Nước hoa hồng dạng xịt chứa AHA/BHA tự nhiên COSRX Hàn Quốc giúp loại bỏ tế bào chết dịu nhẹ, kiểm soát bã nhờn và ngừa mụn ẩn.',
      price: 245000,
      originalPrice: 300000,
      stock: 85,
      images: JSON.stringify([
        'https://medias.watsons.vn/publishing/WTCVN-213554-front-zoom.jpg'
      ]),
      skinType: 'Da Dầu, Da Mụn, Da Hỗn Hợp',
      ingredients: 'Nước khoáng, Nước vỏ cây liễu (BHA), Nước ép táo (AHA)',
      volume: '150ml',
      isFeatured: true,
      isBestSeller: false,
      rating: 4.8,
      reviewCount: 160,
      categoryId: catMask.id,
      brandId: brandCosrx.id,
    },
    {
      name: 'Mặt Nạ Giấy Phục Hồi Dịu Da Skin1004 Madagascar Centella Watergel Sheet Mask 25ml',
      slug: 'mat-na-giay-skin1004-madagascar-centella-watergel-sheet-mask-25ml',
      description: 'Mặt nạ giấy mỏng ôm sát mặt chứa 51% chiết xuất rau má Madagascar giúp cấp ẩm tức thì, hạ nhiệt làm dịu da tức thì thương hiệu Skin1004.',
      price: 35000,
      originalPrice: 45000,
      stock: 200,
      images: JSON.stringify([
        'https://medias.watsons.vn/publishing/WTCVN-214624-front-zoom.jpg'
      ]),
      skinType: 'Da Mụn, Da Nhạy Cảm, Da Kích Ứng',
      ingredients: '51% Chiết xuất Rau má Madagascar, Hyaluronic Acid, Mentha Arvensis Leaf Oil',
      volume: '25ml',
      isFeatured: true,
      isBestSeller: true,
      rating: 4.9,
      reviewCount: 190,
      categoryId: catMask.id,
      brandId: brandSkin1004.id,
    },
    {
      name: 'Mặt Nạ Đất Sét Hút Dầu Thừa Innisfree Super Volcanic Pore Clay Mask 100ml',
      slug: 'mat-na-dat-set-innisfree-super-volcanic-pore-clay-mask-100ml',
      description: 'Mặt nạ đất sét tro núi lửa Jeju Innisfree 10 trong 1 giúp làm sạch sâu lỗ chân lông, hút sạch bã nhờn dầu thừa và tẩy tế bào chết hiệu quả.',
      price: 320000,
      originalPrice: 380000,
      stock: 65,
      images: JSON.stringify([
        'https://www.guardian.com.vn/media/catalog/product/cache/207e23213cf636ccdef205098cf3c8a3/s/2/s22724b9cd19e48138b1379b80c803d26b_6zhdk3atm87zrhfs.png'
      ]),
      skinType: 'Da Dầu, Da Hỗn Hợp, Da Có Mụn Đầu Đen',
      ingredients: 'Tro núi lửa Jeju, Phấn Kaolin, AHA (Lactic Acid)',
      volume: '100ml',
      isFeatured: true,
      isBestSeller: true,
      rating: 4.9,
      reviewCount: 310,
      categoryId: catMask.id,
      brandId: brandInnisfree.id,
    },
    {
      name: 'Mặt Nạ Ngủ Cấp Ẩm Tái Tạo Da Laneige Water Sleeping Mask EX 70ml',
      slug: 'mat-na-ngu-cap-am-laneige-water-sleeping-mask-ex-70ml',
      description: 'Mặt nạ ngủ cấp nước chuyên sâu Laneige Hàn Quốc giúp thanh lọc và phục hồi vẻ rạng rỡ tươi tắn cho làn da sau một đêm ngủ dài.',
      price: 650000,
      originalPrice: 750000,
      stock: 40,
      images: JSON.stringify([
        'https://www.laneige.com.vn/media/catalog/product/1/0/1000-1.jpg'
      ]),
      skinType: 'Da Khô, Da Thiếu Nước, Mọi Loại Da',
      ingredients: 'Công nghệ Sleeping Micro Biome, Phức hợp Probiotics, Squalane',
      volume: '70ml',
      isFeatured: true,
      isBestSeller: true,
      rating: 5.0,
      reviewCount: 280,
      categoryId: catMask.id,
      brandId: brandLaneige.id,
    },
  ];

  for (const p of products) {
    const createdProduct = await prisma.product.create({ data: p });

    await prisma.review.create({
      data: {
        productId: createdProduct.id,
        userName: 'Nguyễn Thị Mai',
        rating: 5,
        comment: 'Sản phẩm chính hãng chất lượng tuyệt vời, giao hàng siêu nhanh!',
      }
    });
  }

  // Sample order for customer
  const firstProduct = await prisma.product.findFirst();
  if (firstProduct) {
    await prisma.order.create({
      data: {
        code: 'ORD-2026-9812',
        userId: customerUser.id,
        customerName: customerUser.name,
        email: customerUser.email,
        phone: customerUser.phone || '0901234567',
        address: customerUser.address || 'Bà Điểm',
        city: customerUser.city || 'TP. Hồ Chí Minh',
        notes: 'Giao giờ hành chính giúp em ạ',
        totalAmount: firstProduct.price * 2,
        status: 'COMPLETED',
        paymentMethod: 'COD',
        items: {
          create: [
            {
              productId: firstProduct.id,
              quantity: 2,
              price: firstProduct.price,
            }
          ]
        }
      }
    });
  }

  console.log('Database seeded with Unified Trang Điểm (Makeup) Collection successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
