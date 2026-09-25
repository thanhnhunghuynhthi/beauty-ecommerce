/**
 * SEED DATA SCRIPT - Crazy BeautyBeauty
 * Chạy: node seed.mjs
 * Tạo: Admin user, Brands, Categories, Products với ảnh thật
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const BASE_URL = "http://localhost:8000";
const MONGO_URI = "mongodb+srv://nguyentai2292005_db_user:pXn9SXgAN3GZLOZf@furnimart-cluster.s6q7vhd.mongodb.net/fas_users?appName=furnimart-cluster";

// ─── HELPER ─────────────────────────────────────────────────────────────────
async function req(method, path, body, token) {
  const opts = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (token) opts.headers["Authorization"] = `Bearer ${token}`;
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, opts);
  const data = await res.json();
  if (!res.ok && res.status !== 201) {
    console.error(`❌ ${method} ${path} → ${res.status}:`, JSON.stringify(data).slice(0, 200));
    return null;
  }
  return data;
}

// ─── 1. TẠO ADMIN USER (trực tiếp vào DB) ───────────────────────────────────
async function seedAdmin() {
  console.log("\n👤 Tạo Admin User trực tiếp vào MongoDB...");

  await mongoose.connect(MONGO_URI);

  const userSchema = new mongoose.Schema(
    {
      name: String,
      email: { type: String, unique: true },
      password: String,
      role: { type: String, default: "user" },
      provider: { type: String, default: "local" },
    },
    { collection: "users", timestamps: true }
  );
  const User = mongoose.models.User || mongoose.model("User", userSchema);

  const ADMIN_EMAIL = "admin@crazybeautybeauty.vn";
  const ADMIN_PASSWORD = "Admin@123456";

  let admin = await User.findOne({ email: ADMIN_EMAIL });
  if (!admin) {
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    admin = await User.create({
      name: "Admin Crazy BeautyBeauty",
      email: ADMIN_EMAIL,
      password: hash,
      role: "admin",
    });
    console.log(`  ✅ Admin tạo mới: ${admin._id}`);
  } else if (admin.role !== "admin") {
    await User.updateOne({ _id: admin._id }, { role: "admin" });
    console.log(`  ✅ Đã nâng quyền admin cho: ${ADMIN_EMAIL}`);
  } else {
    console.log(`  ℹ️  Admin đã tồn tại: ${admin._id}`);
  }

  await mongoose.disconnect();

  // Đăng nhập qua API để lấy token
  const login = await req("POST", "/api/auth/login-admin", {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });

  if (login?.data?.accessToken) {
    console.log("  ✅ Đăng nhập admin thành công");
    return login.data.accessToken;
  }

  // Fallback thử /login
  const login2 = await req("POST", "/api/auth/login", {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  if (login2?.data?.accessToken) {
    console.log("  ✅ Đăng nhập admin thành công (login)");
    return login2.data.accessToken;
  }

  console.error("  ❌ Không đăng nhập được admin");
  return null;
}

// ─── 2. TẠO BRANDS ──────────────────────────────────────────────────────────
async function seedBrands(token) {
  console.log("\n🏷️  Tạo Brands...");
  const brands = [
    {
      name: "Crazy BeautyBeauty",
      description: "Mỹ phẩm chăm sóc da và làm đẹp chính hãng",
      image: "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Glow Lab",
      description: "Giải pháp dưỡng da sáng khỏe mỗi ngày",
      image: "https://images.pexels.com/photos/3738347/pexels-photo-3738347.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Lumière Beauty",
      description: "Mỹ phẩm trang điểm tinh tế và hiện đại",
      image: "https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Herb & Care",
      description: "Chăm sóc cơ thể dịu lành từ thiên nhiên",
      image: "https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Pure Skin",
      description: "Sản phẩm làm sạch và phục hồi da",
      image: "https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
  ];

  const results = [];
  for (const brand of brands) {
    const res = await req("POST", "/api/brands", brand, token);
    if (res?.data?._id || res?._id) {
      const id = res.data?._id || res._id;
      console.log(`  ✅ Brand: ${brand.name} (${id})`);
      results.push({ ...brand, _id: id });
    }
  }
  return results;
}

// ─── 3. TẠO CATEGORIES ──────────────────────────────────────────────────────
async function seedCategories(token) {
  console.log("\n📂 Tạo Categories...");
  const categories = [
    { name: "Chăm sóc da", description: "Sữa rửa mặt, toner và sản phẩm dưỡng da" },
    { name: "Trang điểm", description: "Sản phẩm trang điểm cho phong cách hàng ngày" },
    { name: "Chống nắng", description: "Kem chống nắng bảo vệ da mỗi ngày" },
    { name: "Son môi", description: "Son môi đa dạng màu sắc và chất son" },
    { name: "Chăm sóc tóc", description: "Dầu gội, dầu xả và sản phẩm dưỡng tóc" },
    { name: "Chăm sóc cơ thể", description: "Sản phẩm làm sạch và dưỡng ẩm cơ thể" },
    { name: "Nước hoa", description: "Hương thơm thanh lịch cho mọi dịp" },
    { name: "Mặt nạ", description: "Mặt nạ cấp ẩm và phục hồi chuyên sâu" },
    { name: "Dụng cụ làm đẹp", description: "Dụng cụ hỗ trợ chăm sóc và trang điểm" },
    { name: "Combo làm đẹp", description: "Bộ sản phẩm chăm sóc tiện lợi, tiết kiệm" },
  ];

  const results = [];
  for (const cat of categories) {
    const res = await req("POST", "/api/categories", cat, token);
    if (res?.data?._id || res?._id) {
      const id = res.data?._id || res._id;
      console.log(`  ✅ Category: ${cat.name} (${id})`);
      results.push({ ...cat, _id: id });
    }
  }
  return results;
}

// ─── 4. TẠO PRODUCTS ────────────────────────────────────────────────────────
function getProductData(brands, categories) {
  const b = (name) => brands.find((b) => b.name === name)?._id;
  const c = (name) => categories.find((c) => c.name === name)?._id;

  return [
    {
      name: "Sữa Rửa Mặt Dịu Nhẹ Glow Lab",
      shortDescription: "Làm sạch bụi bẩn và dầu thừa mà không gây khô da",
      longDescription: "Sữa rửa mặt dịu nhẹ với công thức làm sạch cân bằng, phù hợp sử dụng hằng ngày cho mọi loại da.",
      brand: b("Glow Lab"),
      category: c("Chăm sóc da"),
      gender: "unisex",
      image: "https://images.pexels.com/photos/7755657/pexels-photo-7755657.jpeg?auto=compress&cs=tinysrgb&w=600",
      isActive: true,
      isFeatured: true,
      attributes: [{ name: "Dung tích", values: ["100ml", "150ml"] }],
    },
    {
      name: "Serum Niacinamide 10% Pure Skin",
      shortDescription: "Serum hỗ trợ làm sáng và cải thiện bề mặt da",
      longDescription: "Tinh chất niacinamide giúp kiểm soát dầu, làm đều màu da và hỗ trợ thu nhỏ vẻ ngoài của lỗ chân lông.",
      brand: b("Pure Skin"),
      category: c("Chăm sóc da"),
      gender: "unisex",
      image: "https://images.pexels.com/photos/6975445/pexels-photo-6975445.jpeg?auto=compress&cs=tinysrgb&w=600",
      isActive: true,
      isFeatured: true,
      attributes: [{ name: "Dung tích", values: ["30ml", "50ml"] }],
    },
    {
      name: "Kem Chống Nắng Glow Lab SPF50+",
      shortDescription: "Bảo vệ da trước tia UVA và UVB với kết cấu mỏng nhẹ",
      longDescription: "Kem chống nắng SPF50+ dễ tán, không để lại cảm giác bết dính và phù hợp cho nhu cầu sử dụng mỗi ngày.",
      brand: b("Glow Lab"),
      category: c("Chống nắng"),
      gender: "unisex",
      image: "https://images.pexels.com/photos/6621460/pexels-photo-6621460.jpeg?auto=compress&cs=tinysrgb&w=600",
      isActive: true,
      isFeatured: true,
      attributes: [{ name: "Dung tích", values: ["40ml", "60ml"] }],
    },
    {
      name: "Son Kem Lì Lumière Beauty",
      shortDescription: "Son kem lì mềm mịn, lên màu chuẩn và lâu trôi",
      longDescription: "Son kem lì có chất son nhẹ môi, dễ tán và nhiều sắc độ phù hợp từ trang điểm hằng ngày đến dự tiệc.",
      brand: b("Lumière Beauty"),
      category: c("Son môi"),
      gender: "female",
      image: "https://images.pexels.com/photos/3373742/pexels-photo-3373742.jpeg?auto=compress&cs=tinysrgb&w=600",
      isActive: true,
      isFeatured: true,
      attributes: [{ name: "Màu", values: ["Đỏ đất", "Hồng nude", "Cam đào"] }],
    },
    {
      name: "Phấn Nước Lumière Beauty",
      shortDescription: "Lớp nền mỏng nhẹ, che phủ tự nhiên và căng bóng",
      longDescription: "Phấn nước tạo hiệu ứng nền mịn đẹp, dễ dặm lại trong ngày và có nhiều tông màu cho làn da Việt.",
      brand: b("Lumière Beauty"),
      category: c("Trang điểm"),
      gender: "female",
      image: "https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=600",
      isActive: true,
      isFeatured: false,
      attributes: [{ name: "Tông màu", values: ["21N", "23N"] }],
    },
    {
      name: "Mặt Nạ Cấp Ẩm Herb & Care",
      shortDescription: "Mặt nạ giấy cấp ẩm và làm dịu làn da mệt mỏi",
      longDescription: "Mặt nạ chiết xuất thiên nhiên giúp bổ sung độ ẩm, làm dịu da và mang lại cảm giác thư giãn sau một ngày dài.",
      brand: b("Herb & Care"),
      category: c("Mặt nạ"),
      gender: "unisex",
      image: "https://images.pexels.com/photos/3985360/pexels-photo-3985360.jpeg?auto=compress&cs=tinysrgb&w=600",
      isActive: true,
      isFeatured: true,
      attributes: [{ name: "Loại da", values: ["Mọi loại da", "Da khô"] }],
    },
    {
      name: "Dầu Gội Phục Hồi Herb & Care",
      shortDescription: "Làm sạch nhẹ nhàng và hỗ trợ nuôi dưỡng tóc hư tổn",
      longDescription: "Dầu gội giàu dưỡng chất giúp tóc sạch khỏe, mềm mượt và dễ vào nếp hơn sau mỗi lần gội.",
      brand: b("Herb & Care"),
      category: c("Chăm sóc tóc"),
      gender: "unisex",
      image: "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=600",
      isActive: true,
      isFeatured: false,
      attributes: [{ name: "Dung tích", values: ["250ml", "500ml"] }],
    },
    {
      name: "Sữa Dưỡng Thể Dưỡng Ẩm Crazy BeautyBeauty",
      shortDescription: "Dưỡng ẩm mềm mịn với hương thơm nhẹ nhàng",
      longDescription: "Sữa dưỡng thể thấm nhanh, giúp làn da cơ thể mềm mại và mịn màng mà không gây nhờn rít.",
      brand: b("Crazy BeautyBeauty"),
      category: c("Chăm sóc cơ thể"),
      gender: "unisex",
      image: "https://images.pexels.com/photos/3737594/pexels-photo-3737594.jpeg?auto=compress&cs=tinysrgb&w=600",
      isActive: true,
      isFeatured: true,
      attributes: [{ name: "Dung tích", values: ["200ml", "400ml"] }],
    },
  ];

  return [
    // ── ÁO THUN NỮ ──
    {
      name: "Áo Thun Nữ Thời Trang Basic",
      shortDescription: "Áo thun nữ cotton 100%, form rộng thoải mái, nhiều màu sắc",
      longDescription: "Áo thun nữ được làm từ chất liệu cotton 100% cao cấp, thoáng mát và thấm hút mồ hôi tốt. Thiết kế basic, dễ phối đồ, phù hợp cho mọi hoàn cảnh từ đi học, đi làm đến đi chơi. Sản phẩm được xử lý chống nhăn, giữ form tốt sau nhiều lần giặt.",
      brand: b("FIT ME"),
      category: c("Áo Thun"),
      gender: "female",
      image: "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=600",
      isActive: true,
      isFeatured: true,
      attributes: [
        { name: "Size", values: ["S", "M", "L", "XL"] },
        { name: "Màu", values: ["Trắng", "Đen", "Hồng", "Xanh navy"] },
      ],
    },
    {
      name: "Áo Thun Nữ Thêu Hoa",
      shortDescription: "Áo thun nữ họa tiết hoa thêu tinh tế, phong cách vintage",
      longDescription: "Áo thun nữ với họa tiết hoa thêu tinh tế trên ngực, tạo điểm nhấn nổi bật. Chất liệu cotton pha thun co giãn tốt, ôm nhẹ vóc dáng. Phong cách vintage nhẹ nhàng, phù hợp đi dạo, café, chụp ảnh.",
      brand: b("Elegance"),
      category: c("Áo Thun"),
      gender: "female",
      image: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=600",
      isActive: true,
      isFeatured: true,
      attributes: [
        { name: "Size", values: ["S", "M", "L"] },
        { name: "Màu", values: ["Trắng", "Vàng kem", "Hồng nhạt"] },
      ],
    },
    {
      name: "Áo Thun Nữ Dáng Crop",
      shortDescription: "Áo thun crop top nữ, hở eo nhẹ, năng động trẻ trung",
      longDescription: "Áo thun crop top dành cho nữ, dáng ngắn hở eo nhẹ. Phong cách trẻ trung, năng động phù hợp cho các cô gái yêu thích style streetwear. Chất liệu cotton mềm mịn, co giãn 4 chiều thoải mái khi vận động.",
      brand: b("Urban Style"),
      category: c("Áo Thun"),
      gender: "female",
      image: "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=600",
      isActive: true,
      isFeatured: false,
      attributes: [
        { name: "Size", values: ["XS", "S", "M", "L"] },
        { name: "Màu", values: ["Đen", "Trắng", "Xám", "Cam"] },
      ],
    },
    // ── ÁO THUN NAM ──
    {
      name: "Áo Thun Nam Cổ Tròn Basic",
      shortDescription: "Áo thun nam cổ tròn, chất cotton dày dặn, thoáng khí",
      longDescription: "Áo thun nam cổ tròn được may từ vải cotton 95% + elastane 5%, đảm bảo độ co giãn và thoáng khí. Form chuẩn, không quá rộng không quá bó, phù hợp mọi vóc dáng. Đường may chắc chắn, bền màu sau nhiều lần giặt máy.",
      brand: b("FIT ME"),
      category: c("Áo Thun"),
      gender: "male",
      image: "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=600",
      isActive: true,
      isFeatured: true,
      attributes: [
        { name: "Size", values: ["S", "M", "L", "XL", "XXL"] },
        { name: "Màu", values: ["Đen", "Trắng", "Xám", "Navy", "Xanh rêu"] },
      ],
    },
    // ── ÁO SƠ MI ──
    {
      name: "Áo Sơ Mi Nam Công Sở",
      shortDescription: "Áo sơ mi nam lịch sự, chống nhăn, phù hợp công sở",
      longDescription: "Áo sơ mi nam được thiết kế dành riêng cho môi trường công sở. Chất liệu vải pha cotton cao cấp, có khả năng chống nhăn và thoáng khí. Form slim-fit vừa vặn, tôn dáng người mặc. Đường may tinh tế, cúc áo bền chắc.",
      brand: b("Elegance"),
      category: c("Áo Sơ Mi"),
      gender: "male",
      image: "https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=600",
      isActive: true,
      isFeatured: true,
      attributes: [
        { name: "Size", values: ["S", "M", "L", "XL"] },
        { name: "Màu", values: ["Trắng", "Xanh nhạt", "Xám nhạt"] },
      ],
    },
    {
      name: "Áo Sơ Mi Nữ Tay Dài",
      shortDescription: "Áo sơ mi nữ tay dài, dáng suông thanh lịch, nhiều màu pastel",
      longDescription: "Áo sơ mi nữ tay dài với thiết kế dáng suông nhẹ nhàng, thanh lịch. Phù hợp cho văn phòng và các buổi gặp gỡ quan trọng. Chất liệu lụa pha thoáng mát, mềm nhẹ. Màu sắc pastel nhẹ nhàng dễ phối cùng quần âu hay chân váy.",
      brand: b("Elegance"),
      category: c("Áo Sơ Mi"),
      gender: "female",
      image: "https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=600",
      isActive: true,
      isFeatured: false,
      attributes: [
        { name: "Size", values: ["XS", "S", "M", "L"] },
        { name: "Màu", values: ["Trắng", "Hồng pastel", "Vàng nhạt", "Xanh mint"] },
      ],
    },
    // ── ÁO KHOÁC ──
    {
      name: "Áo Khoác Nam Thanh Lịch",
      shortDescription: "Áo khoác nam dáng dài, phong cách lịch lãm, chống gió nhẹ",
      longDescription: "Áo khoác nam dáng dài với thiết kế thanh lịch, phù hợp mọi hoàn cảnh. Chất liệu polyester chống gió nhẹ, ấm áp trong những ngày trời se lạnh. Túi có khóa kéo tiện lợi, lớp lót bên trong mềm mịn và ấm áp.",
      brand: b("FIT ME"),
      category: c("Áo Khoác"),
      gender: "male",
      image: "https://images.pexels.com/photos/1192335/pexels-photo-1192335.jpeg?auto=compress&cs=tinysrgb&w=600",
      isActive: true,
      isFeatured: true,
      attributes: [
        { name: "Size", values: ["S", "M", "L", "XL"] },
        { name: "Màu", values: ["Đen", "Xám", "Navy", "Nâu"] },
      ],
    },
    {
      name: "Áo Khoác Nữ Dáng Crop",
      shortDescription: "Áo khoác nữ dáng ngắn, phong cách trẻ trung hiện đại",
      longDescription: "Áo khoác nữ dáng crop hiện đại, phong cách streetwear. Chất liệu dày dặn, ấm áp, phù hợp cho mùa thu đông. Thiết kế khóa kéo phía trước, có mũ trùm đầu có thể tháo rời. Dễ phối cùng quần jean, chân váy hay quần jogger.",
      brand: b("Urban Style"),
      category: c("Áo Khoác"),
      gender: "female",
      image: "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=600",
      isActive: true,
      isFeatured: false,
      attributes: [
        { name: "Size", values: ["S", "M", "L"] },
        { name: "Màu", values: ["Đen", "Hồng", "Xanh rêu", "Kem"] },
      ],
    },
    // ── QUẦN ──
    {
      name: "Quần Jean Nam Skinny",
      shortDescription: "Quần jean nam dáng skinny, co giãn tốt, phong cách trẻ trung",
      longDescription: "Quần jean nam dáng skinny ôm sát chân, tôn dáng người mặc. Chất liệu denim co giãn 4 chiều, thoải mái khi vận động. Màu xanh đậm cổ điển hoặc xanh nhạt wash dễ phối đồ. Bền màu, ít nhàu sau giặt.",
      brand: b("Urban Style"),
      category: c("Quần Jean"),
      gender: "male",
      image: "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=600",
      isActive: true,
      isFeatured: true,
      attributes: [
        { name: "Size", values: ["28", "29", "30", "31", "32", "33", "34"] },
        { name: "Màu", values: ["Xanh đậm", "Xanh nhạt", "Đen"] },
      ],
    },
    {
      name: "Quần Kaki Nam Ôm Form",
      shortDescription: "Quần kaki nam slim fit, lịch sự phù hợp công sở và đi chơi",
      longDescription: "Quần kaki nam dáng slim fit, phù hợp cả đi làm lẫn đi chơi. Chất vải kaki cao cấp, mềm mịn, thoáng khí và chống nhăn. Phom quần chuẩn, tôn vóc dáng người mặc. Dễ phối cùng áo sơ mi, polo hay áo thun.",
      brand: b("FIT ME"),
      category: c("Quần Kaki"),
      gender: "male",
      image: "https://images.pexels.com/photos/52518/jeans-pants-blue-shop-52518.jpeg?auto=compress&cs=tinysrgb&w=600",
      isActive: true,
      isFeatured: true,
      attributes: [
        { name: "Size", values: ["28", "29", "30", "31", "32", "34"] },
        { name: "Màu", values: ["Be", "Navy", "Xám", "Đen", "Olive"] },
      ],
    },
    // ── CHÂN VÁY ──
    {
      name: "Chân Váy Xếp Ly Thanh Lịch",
      shortDescription: "Chân váy xếp ly nữ dáng midi, thanh lịch phù hợp công sở",
      longDescription: "Chân váy xếp ly dáng midi thanh lịch, dành cho phụ nữ công sở và các buổi gặp gỡ formal. Chất liệu vải taffeta cao cấp, xếp ly đều, giữ form tốt. Khóa kéo tàng hình phía sau, dây đai tinh tế. Dài qua gối, che khuyết điểm hiệu quả.",
      brand: b("Elegance"),
      category: c("Chân Váy"),
      gender: "female",
      image: "https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=600",
      isActive: true,
      isFeatured: true,
      attributes: [
        { name: "Size", values: ["XS", "S", "M", "L", "XL"] },
        { name: "Màu", values: ["Đen", "Be", "Trắng kem", "Hồng powder"] },
      ],
    },
    {
      name: "Chân Váy Ngắn Bất Đối Xứng",
      shortDescription: "Chân váy ngắn bất đối xứng, cá tính và sành điệu",
      longDescription: "Chân váy ngắn thiết kế bất đối xứng độc đáo, tạo điểm nhấn thời trang. Phong cách trẻ trung, cá tính. Chất liệu vải dệt mềm mịn, nhẹ nhàng thoải mái. Phù hợp đi chơi, cafe, dạo phố.",
      brand: b("Urban Style"),
      category: c("Chân Váy"),
      gender: "female",
      image: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=600",
      isActive: true,
      isFeatured: false,
      attributes: [
        { name: "Size", values: ["XS", "S", "M", "L"] },
        { name: "Màu", values: ["Đen", "Caramen", "Xanh rêu"] },
      ],
    },
    // ── ĐẦM VÁY ──
    {
      name: "Đầm Maxi Nữ Boho",
      shortDescription: "Đầm maxi phong cách boho, họa tiết hoa nhẹ nhàng, phù hợp đi biển",
      longDescription: "Đầm maxi nữ phong cách bohemian với họa tiết hoa tươi vui. Dáng váy xòe tự nhiên, chất liệu voan mỏng nhẹ, thoáng mát lý tưởng cho mùa hè. Dây đeo điều chỉnh được. Phù hợp đi biển, dã ngoại, tiệc ngoài trời.",
      brand: b("Elegance"),
      category: c("Đầm Váy"),
      gender: "female",
      image: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=600",
      isActive: true,
      isFeatured: true,
      attributes: [
        { name: "Size", values: ["S", "M", "L", "XL"] },
        { name: "Màu", values: ["Hoa trắng", "Hoa hồng", "Hoa xanh"] },
      ],
    },
    // ── ĐỒ THỂ THAO ──
    {
      name: "Áo Dài Tay Thể Thao Promax",
      shortDescription: "Áo thể thao tay dài co giãn 4 chiều, thấm hút mồ hôi tốt",
      longDescription: "Áo thể thao tay dài của Promax Sport với công nghệ vải DryFit thấm hút mồ hôi và thoát nhiệt nhanh. Co giãn 4 chiều thoải mái khi vận động. Thiết kế ôm nhẹ tôn dáng, không gây cản trở chuyển động. Phù hợp chạy bộ, gym, yoga.",
      brand: b("Promax Sport"),
      category: c("Đồ Thể Thao"),
      gender: "male",
      image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600",
      isActive: true,
      isFeatured: true,
      attributes: [
        { name: "Size", values: ["S", "M", "L", "XL", "XXL"] },
        { name: "Màu", values: ["Đen", "Xanh navy", "Xám đậm", "Đỏ"] },
      ],
    },
    {
      name: "Quần Jogger Thể Thao Nữ",
      shortDescription: "Quần jogger nữ co giãn, ôm nhẹ, thoải mái cho mọi hoạt động",
      longDescription: "Quần jogger nữ được làm từ chất liệu thun polyester cao cấp, co giãn 4 chiều. Ống quần dáng tapered bó nhẹ ở cổ chân, thun cổ chân chắc chắn. Cạp thun có dây rút điều chỉnh vòng eo. Túi hông có khóa kéo tiện lợi.",
      brand: b("Promax Sport"),
      category: c("Đồ Thể Thao"),
      gender: "female",
      image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600",
      isActive: true,
      isFeatured: false,
      attributes: [
        { name: "Size", values: ["XS", "S", "M", "L"] },
        { name: "Màu", values: ["Đen", "Xám", "Tím", "Hồng"] },
      ],
    },
    // ── ÁO POLO ──
    {
      name: "Áo Polo Nam Classic",
      shortDescription: "Áo polo nam classic, cổ bẻ lịch sự, chất liệu pique cao cấp",
      longDescription: "Áo polo nam classic với thiết kế cổ bẻ truyền thống, thích hợp nhiều hoàn cảnh. Chất liệu vải pique cotton cao cấp, thoáng mát và bền màu. Form regular fit thoải mái. Phù hợp công sở casual, đi chơi golf, hoặc các buổi gặp gỡ semi-formal.",
      brand: b("FIT ME"),
      category: c("Áo Polo"),
      gender: "male",
      image: "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=600",
      isActive: true,
      isFeatured: true,
      attributes: [
        { name: "Size", values: ["S", "M", "L", "XL", "XXL"] },
        { name: "Màu", values: ["Trắng", "Đen", "Navy", "Đỏ mận", "Xanh lá"] },
      ],
    },
    {
      name: "Áo Polo Nữ Slim Fit",
      shortDescription: "Áo polo nữ dáng ôm nhẹ, thanh lịch và năng động",
      longDescription: "Áo polo nữ dáng slim fit ôm nhẹ tôn vóc dáng. Chất liệu cotton pique mềm mịn, thoáng khí. Cổ áo và tay áo viền tinh tế. Phù hợp nhiều hoàn cảnh từ thể thao nhẹ đến casual outing.",
      brand: b("Casual Wear"),
      category: c("Áo Polo"),
      gender: "female",
      image: "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=600",
      isActive: true,
      isFeatured: false,
      attributes: [
        { name: "Size", values: ["XS", "S", "M", "L"] },
        { name: "Màu", values: ["Trắng", "Hồng nhạt", "Xanh baby", "Vàng nhạt"] },
      ],
    },
  ];

  return products;
}

async function seedProducts(token, brands, categories) {
  console.log("\n💄 Tạo Products mỹ phẩm...");
  const products = getProductData(brands, categories);
  let created = 0;

  for (const product of products) {
    if (!product.brand || !product.category) {
      console.log(`  ⚠️  Bỏ qua "${product.name}" - thiếu brand/category`);
      continue;
    }

    const res = await req("POST", "/api/products", product, token);
    if (res?.data?._id || res?._id) {
      const id = res.data?._id || res._id;
      console.log(`  ✅ Product: ${product.name} (${id})`);
      created++;
    } else {
      console.log(`  ⚠️  Bỏ qua: ${product.name}`);
    }
  }
  return created;
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🚀 BẮT ĐẦU SEED DATA - Crazy BeautyBeauty");
  console.log("=".repeat(50));

  // 1. Admin
  const token = await seedAdmin();
  if (!token) {
    console.error("\n❌ Không lấy được admin token. Dừng seed.");
    process.exit(1);
  }

  // 2. Brands
  const brands = await seedBrands(token);
  if (!brands.length) {
    console.error("\n❌ Không tạo được brand nào. Dừng.");
    process.exit(1);
  }

  // 3. Categories
  const categories = await seedCategories(token);
  if (!categories.length) {
    console.error("\n❌ Không tạo được category nào. Dừng.");
    process.exit(1);
  }

  // 4. Products
  const count = await seedProducts(token, brands, categories);

  console.log("\n" + "=".repeat(50));
  console.log("🎉 SEED HOÀN THÀNH!");
  console.log(`   ✅ Brands:     ${brands.length}`);
  console.log(`   ✅ Categories: ${categories.length}`);
  console.log(`   ✅ Products:   ${count}`);
  console.log("\n📌 Tài khoản Admin:");
  console.log("   Email:    admin@crazybeautybeauty.vn");
  console.log("   Password: Admin@123456");
  console.log("=".repeat(50));
}

main().catch((err) => {
  console.error("💥 Lỗi không mong muốn:", err);
  process.exit(1);
});
