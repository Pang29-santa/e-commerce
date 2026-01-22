import { Product } from './product.model';

/**
 * รายการสินค้าในตะกร้า
 */
export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: Date;
}

/**
 * ข้อมูลตะกร้าสินค้า
 */
export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}
