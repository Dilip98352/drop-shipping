export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  imageUrl: string;
  images?: string[];
  description: string;
  features?: string[];
  stock: number;
  fakeBuyCount: number;
  rating: number;
  reviews: number;
  isActive: boolean;
  createdAt: number;
}

export interface Category {
  id: string;
  name: string;
  imageUrl?: string;
  isActive: boolean;
}

export interface Banner {
  id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  link?: string;
  isActive: boolean;
  order: number;
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  quantity: number;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: number;
}

export interface Settings {
  facebookPixelId?: string;
  showFakePurchase: boolean;
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
}