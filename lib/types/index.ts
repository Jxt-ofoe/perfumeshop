// ── Core type definitions for the VELOUR perfume shop ──

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number; // in kobo (smallest currency unit)
  image: string;
  category: string;
  scentFamily: string;
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  size: string;
  featured: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

export type CartAction =
  | { type: 'ADD_ITEM'; product: Product }
  | { type: 'REMOVE_ITEM'; productId: number }
  | { type: 'UPDATE_QUANTITY'; productId: number; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' };

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  reference: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface CreateOrderPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  items: OrderItem[];
  totalAmount: number;
}

export interface PaystackResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface ProductsApiResponse {
  products: Product[];
  total: number;
  page: number;
}

export interface FilterParams {
  category?: string;
  scent?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  limit?: number;
  offset?: number;
}
