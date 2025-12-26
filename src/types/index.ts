// Product Types
export interface ProductVariant {
  id: string;
  name: string;
  weight: string;
  price: number;
  compareAtPrice?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  collection: string;
  tags: string[];
  variants: ProductVariant[];
  inStock: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  brewingInstructions: {
    temperature: string;
    steepTime: string;
    amount: string;
  };
  ingredients: string[];
  origin: string;
  caffeineLevel: 'none' | 'low' | 'medium' | 'high';
  rating: number;
  reviewCount: number;
  createdAt: string;
}

// Collection Types
export interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

// Cart Types
export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

// Order Types
export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface ShippingAddress {
  address: string;
  city: string;
  district: string;
  postalCode: string;
  country: string;
}

export type PaymentMethod = 'cod' | 'bkash' | 'card';

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerInfo;
  shippingAddress: ShippingAddress;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
}

// Testimonial Types
export interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar?: string;
  rating: number;
  text: string;
  productName?: string;
}

// Filter Types
export interface ProductFilters {
  category?: string;
  collection?: string;
  priceRange?: [number, number];
  caffeineLevel?: string[];
  inStock?: boolean;
  sortBy?: 'price-asc' | 'price-desc' | 'name' | 'newest' | 'rating';
}
