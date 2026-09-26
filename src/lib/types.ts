export interface Brand {
  id: string;
  name: string;
  slug: string;
  country?: string | null;
  logo?: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  stock: number;
  images: string; // JSON string array
  skinType: string;
  ingredients?: string | null;
  volume?: string | null;
  isFeatured: boolean;
  isBestSeller: boolean;
  rating: number;
  reviewCount: number;
  categoryId: string;
  category?: Category;
  brandId: string;
  brand?: Brand;
  reviews?: Review[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selected?: boolean;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  code: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes?: string | null;
  totalAmount: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  paymentMethod: 'COD' | 'MOMO';
  items: OrderItem[];
  createdAt: string;
}
