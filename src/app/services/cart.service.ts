import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { Cart, CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<Cart>(this.getCart());
  private currentUser: string | null = null;

  constructor() {
    // โหลดตะกร้าจาก localStorage เมื่อเริ่มต้น
    this.loadCartFromStorage();
  }

  /**
   * ตั้งค่า user ปัจจุบัน (เรียกเมื่อ login)
   */
  setCurrentUser(username: string): void {
    console.log('👤 Set current user:', username);
    this.currentUser = username;
    this.loadCartFromStorage();
  }

  /**
   * ล้างข้อมูล user (เรียกเมื่อ logout)
   */
  clearCurrentUser(): void {
    console.log('👤 Clearing current user and restoring guest cart');
    this.currentUser = null;
    this.loadCartFromStorage();
  }

  /**
   * ดึงข้อมูลตะกร้าแบบ Observable
   */
  getCart$(): Observable<Cart> {
    return this.cartSubject.asObservable();
  }

  /**
   * ดึงข้อมูลตะกร้าปัจจุบัน
   */
  getCart(): Cart {
    const totalItems = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = this.cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    return {
      items: this.cartItems,
      totalItems,
      totalPrice
    };
  }

  /**
   * เพิ่มสินค้าลงตะกร้า
   */
  addToCart(product: Product, quantity: number = 1): void {
    console.log('🛒 Add to cart:', product.title, 'quantity:', quantity);

    const existingItem = this.cartItems.find(item => item.product.id === product.id);

    if (existingItem) {
      // ถ้ามีสินค้าอยู่แล้ว เพิ่มจำนวน
      existingItem.quantity += quantity;
      console.log('✅ Increased quantity:', existingItem.product.title, 'to', existingItem.quantity);
    } else {
      // ถ้ายังไม่มี เพิ่มรายการใหม่
      this.cartItems.push({
        product,
        quantity,
        addedAt: new Date()
      });
      console.log('✅ Added new item:', product.title);
    }

    this.updateCart();
  }

  /**
   * ลบสินค้าออกจากตะกร้า
   */
  removeFromCart(productId: number): void {
    console.log('🗑️ Remove from cart ID:', productId);
    
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.updateCart();
    
    console.log('✅ Item removed');
  }

  /**
   * อัพเดทจำนวนสินค้า
   */
  updateQuantity(productId: number, quantity: number): void {
    console.log('🔄 Update quantity ID:', productId, 'to', quantity);

    const item = this.cartItems.find(item => item.product.id === productId);
    
    if (item) {
      if (quantity <= 0) {
        // ถ้าจำนวนเป็น 0 หรือติดลบ ให้ลบออก
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.updateCart();
        console.log('✅ Quantity updated');
      }
    }
  }

  /**
   * ล้างตะกร้าทั้งหมด
   */
  clearCart(): void {
    console.log('🗑️ Clear entire cart');
    this.cartItems = [];
    this.updateCart();
    console.log('✅ Cart cleared');
  }

  /**
   * เช็คว่าสินค้าอยู่ในตะกร้าหรือไม่
   */
  isInCart(productId: number): boolean {
    return this.cartItems.some(item => item.product.id === productId);
  }

  /**
   * ดึงจำนวนสินค้าในตะกร้า
   */
  getItemQuantity(productId: number): number {
    const item = this.cartItems.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  }

  /**
   * อัพเดทตะกร้าและบันทึกลง localStorage
   */
  private updateCart(): void {
    const cart = this.getCart();
    this.cartSubject.next(cart);
    this.saveCartToStorage();
    
    console.log('📊 Current cart:', cart.totalItems, 'items', 'total:', cart.totalPrice);
  }

  /**
   * สร้าง localStorage key สำหรับ user ปัจจุบัน
   */
  private getStorageKey(): string {
    if (!this.currentUser) {
      return 'cart_guest';
    }
    return `cart_${this.currentUser}`;
  }

  /**
   * บันทึกตะกร้าลง localStorage (แยกตาม user)
   */
  private saveCartToStorage(): void {
    try {
      const key = this.getStorageKey();
      localStorage.setItem(key, JSON.stringify(this.cartItems));
      console.log('💾 Saved cart to localStorage:', key);
    } catch (error) {
      console.error('❌ Cannot save cart:', error);
    }
  }

  /**
   * โหลดตะกร้าจาก localStorage (แยกตาม user)
   */
  private loadCartFromStorage(): void {
    try {
      const key = this.getStorageKey();
      const savedCart = localStorage.getItem(key);
      
      if (savedCart) {
        this.cartItems = JSON.parse(savedCart);
        // แปลง addedAt กลับเป็น Date object
        this.cartItems.forEach(item => {
          item.addedAt = new Date(item.addedAt);
        });
        this.updateCart();
        console.log('📂 Loaded cart from localStorage:', key, '-', this.cartItems.length, 'items');
      } else {
        this.cartItems = [];
        this.updateCart();
        console.log('📂 No saved cart found for:', key);
      }
    } catch (error) {
      console.error('❌ Cannot load cart:', error);
      this.cartItems = [];
    }
  }
}
