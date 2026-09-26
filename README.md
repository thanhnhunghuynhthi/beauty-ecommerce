# 🌟 GlowBeauty - E-Commerce Website Bán Mỹ Phẩm & Chăm Sóc Da Chính Hãng

> Dự án cá nhân xây dựng Website Thương Mại Điện Tử Bán Mỹ Phẩm cao cấp, hỗ trợ Phân quyền 3 cấp độ, Tích hợp AI Tư Vấn Da, Thanh Toán Linh Hoạt & Trang Quản Lý Admin toàn diện.

---

## 📖 1. Giới Thiệu Dự Án

**GlowBeauty** là một giải pháp e-commerce hiện đại dành riêng cho ngành hàng Mỹ phẩm & Chăm sóc da (Skincare). Website được thiết kế với giao diện chuẩn UI/UX phong cách Hồng Pastel sang trọng, mang lại trải nghiệm mua sắm mượt mà trên cả máy tính lẫn thiết bị di động.

### 🛠️ Công Nghệ Sử Dụng (Tech Stack):
- **Core Framework**: [Next.js](https://nextjs.org/) (App Router, React 19, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Responsive, Custom Palette Rose/Pink)
- **Database & ORM**: [Prisma ORM](https://www.prisma.io/) với cơ sở dữ liệu **SQLite** (`prisma/dev.db`)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🔒 2. Mô Hình Phân Quyền Người Dùng (3 Cấp Độ)

Website được thiết kế chặt chẽ với 3 vai trò truy cập riêng biệt:

### 1️⃣ Khách vãng lai (Guest User):
- **Quyền hạn**:
  - Xem trang chủ, duyệt danh mục mỹ phẩm, lọc theo loại da (*Da dầu, Da khô, Da nhạy cảm, Da mụn*).
  - Tìm kiếm mỹ phẩm, đọc thành phần, đọc đánh giá nhận xét từ người dùng khác.
  - Sử dụng trợ lý **AI Tư Vấn Da** để nhận lời khuyên chăm sóc da.
- **Hạn chế**:
  - 🛑 **Không thể thêm sản phẩm vào giỏ hàng hoặc thanh toán**. Khi bấm nút *"Thêm vào giỏ"*, hệ thống sẽ bật khung thông báo yêu cầu đăng nhập hoặc đăng ký tài khoản mới.

### 2️⃣ Khách hàng đã đăng nhập (Customer User):
- **Quyền hạn**:
  - Đăng ký tài khoản mới (`/register`) và Đăng nhập (`/login`).
  - Thêm mỹ phẩm vào giỏ hàng, quản lý số lượng sản phẩm.
  - Tiến hành thanh toán đơn hàng với các phương thức: **COD (Tiền mặt khi nhận hàng)**, **Ví MoMo**.
  - Theo dõi tiến trình đơn hàng trực quan với dòng thời gian 3 bước.
  - Viết đánh giá & bình luận 5 sao cho sản phẩm.

### 3️⃣ Quản trị viên (Admin User):
- **Quyền hạn**:
  - Đăng nhập trang quản trị riêng tại đường dẫn: `/admin`.
  - **Thống kê doanh thu**: Xem tổng số tiền từ tất cả các đơn hàng đã bán.
  - **Quản lý đơn hàng**: Xem thông tin chi tiết từng đơn hàng (*Khách hàng, SĐT, Địa chỉ, Danh sách món*) và **Cập nhật trạng thái đơn hàng** (`PENDING` ➔ `PROCESSING` ➔ `COMPLETED` ➔ `CANCELLED`).
  - **Quản lý kho hàng**: Kiểm tra số lượng tồn kho theo từng loại mỹ phẩm và điểm đánh giá.

---

## 🔑 3. Thông Tin Tài Khoản Thử Nghiệm (Credentials)

Bạn có thể sử dụng ngay các tài khoản mẫu bên dưới để kiểm tra các tính năng trên website:

| Vai Trò | Email / Tên Đăng Nhập | Mật Khẩu | Mục Đích Thử Nghiệm |
| :--- | :--- | :--- | :--- |
| 🛡️ **ADMIN** | `admin` *(hoặc `admin@glowbeauty.vn`)* | `admin123` | Đăng nhập trang Quản lý Admin `/admin` xem doanh thu & duyệt đơn hàng |
| 🛍️ **KHÁCH HÀNG** | `khachhang@gmail.com` | `123456` | Đăng nhập tài khoản Khách hàng mua mỹ phẩm, thêm giỏ hàng & thanh toán |

*(Lưu ý: Bạn cũng có thể bấm nút **Đăng ký** trên giao diện để tự tạo một tài khoản khách hàng hoàn toàn mới).*

---

## 🚀 4. Hướng Dẫn Khởi Chạy Dự Án (Getting Started)

### 📋 Yêu cầu hệ thống:
- Node.js phiên bản 18.x, 20.x trở lên.
- Trình duyệt web (Chrome, Edge, Firefox, Cốc Cốc...).

---

### 💻 Các Bước Thực Hiện Chi Tiết (Xuống Dòng Rõ Ràng):

**Bước 1:** Mở ứng dụng Terminal (PowerShell / Command Prompt) trên máy tính.

**Bước 2:** Di chuyển vào thư mục dự án bằng lệnh:
```bash
cd C:\Users\THANHNHUNG\.gemini\antigravity\scratch\cosmetics-store
```

**Bước 3:** Cài đặt các thư viện cần thiết:
```bash
npm install
```

**Bước 4:** Đồng bộ hóa cấu trúc Cơ sở dữ liệu SQLite:
```bash
npx prisma db push
```

**Bước 5:** Nạp dữ liệu mẫu (Sản phẩm mỹ phẩm & Các tài khoản thử nghiệm):
```bash
npx tsx prisma/seed.ts
```

**Bước 6:** Khởi chạy máy chủ thử nghiệm (Development Server):
```bash
npm run dev
```

**Bước 7:** Mở trình duyệt web và truy cập vào địa chỉ:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🖥️ 5. Các Đường Dẫn Trang Web Chính (Sitemap)

- **Trang chủ cửa hàng**: `http://localhost:3000/`
- **Danh mục & Tìm kiếm mỹ phẩm**: `http://localhost:3000/products`
- **Đăng nhập**: `http://localhost:3000/login`
- **Đăng ký tài khoản**: `http://localhost:3000/register`
- **Giỏ hàng & Thanh toán**: `http://localhost:3000/checkout`
- **Trang Quản Trị Admin**: `http://localhost:3000/admin`
- **Trình chỉnh sửa CSDL đồ họa (Prisma Studio)**: Run `npx prisma studio` ➔ `http://localhost:5555`

---

## 📂 6. Cấu Trúc Thư Mục Dự Án (Project Structure)

```text
cosmetics-store/
├── prisma/
│   ├── schema.prisma       # Cấu trúc CSDL (User, Product, Order, Category, Brand, Review)
│   ├── dev.db              # Tệp Cơ sở dữ liệu SQLite
│   └── seed.ts             # Script nạp dữ liệu mẫu mỹ phẩm & tài khoản
├── src/
│   ├── app/
│   │   ├── admin/          # Giao diện & Đăng nhập Admin
│   │   ├── api/            # API Endpoints (Auth, Products, Orders, AI Advisor)
│   │   ├── checkout/       # Trang thanh toán đơn hàng
│   │   ├── login/          # Trang đăng nhập
│   │   ├── orders/[code]/  # Trang theo dõi tiến trình đơn hàng
│   │   ├── products/       # Trang danh mục & chi tiết sản phẩm
│   │   ├── layout.tsx      # Root Layout tích hợp AuthProvider & CartProvider
│   │   └── page.tsx        # Trang chủ cửa hàng GlowBeauty
│   ├── components/         # Các UI Component (Header, Footer, ProductCard, CartDrawer, AiAdvisorModal)
│   └── lib/                # AuthContext, CartContext, Prisma client singleton, Types & Formatters
├── package.json
└── README.md
```

---

© 2026 **GlowBeauty Cosmetics**. Bảo lưu mọi quyền. Dự án cá nhân Bán Mỹ Phẩm & Chăm Sóc Da.
