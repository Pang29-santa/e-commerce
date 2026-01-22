import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Cart, CartItem } from '../../models/cart.model';
import { ModalService } from '../../services/modal.service';



@Component({
  selector: 'app-cart',
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class CartComponent implements OnInit {
  cart: Cart = { items: [], totalItems: 0, totalPrice: 0 };

   constructor(
    private cartService: CartService,
    private router: Router,
    private modalService: ModalService
  ) {
    console.log('🏗️ CartComponent: Constructor ถูกเรียก');
  }

  ngOnInit(): void {
    console.log('🚀 CartComponent: ngOnInit เริ่มทำงาน');
    
    // Subscribe ข้อมูลตะกร้า
    this.cartService.getCart$().subscribe(cart => {
      console.log('🛒 อัพเดทตะกร้า:', cart);
      this.cart = cart;
    });
  }

  /**
   * เพิ่มจำนวนสินค้า
   */
  increaseQuantity(item: CartItem): void {
    this.cartService.updateQuantity(item.product.id, item.quantity + 1);
  }

  /**
   * ลดจำนวนสินค้า
   */
  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.product.id, item.quantity - 1);
    } else {
      this.removeItem(item);
    }
  }

  /**
   * Remove item from cart
   */
  async removeItem(item: CartItem): Promise<void> {
    const isConfirmed = await this.modalService.showConfirm(`คุณต้องการลบ "${item.product.title}" ออกจากตะกร้าใช่หรือไม่?`, 'ยืนยันการลบ');
    if (isConfirmed) {
      this.cartService.removeFromCart(item.product.id);
    }
  }

  /**
   * Clear entire cart
   */
  async clearCart(): Promise<void> {
    const isConfirmed = await this.modalService.showConfirm('คุณต้องการลบสินค้าทั้งหมดออกจากตะกร้าใช่หรือไม่?', 'ยืนยันการล้างตะกร้า');
    if (isConfirmed) {
      this.cartService.clearCart();
    }
  }

  /**
   * Go to checkout
   */
  async checkout(): Promise<void> {
    console.log('💳 Go to Checkout');
    this.modalService.showAlert('Checkout feature is under development...', 'กำลังพัฒนา');
  }

  /**
   * กลับไปหน้ารายการสินค้า
   */
  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  /**
   * ดูรายละเอียดสินค้า
   */
  viewProduct(productId: number): void {
    this.router.navigate(['/products', productId]);
  }

  /**
   * ดึง URL รูปภาพสินค้า
   */
  getProductImage(imageUrl: string): string {
    if (imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
      return imageUrl;
    }
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
  }

  /**
   * จัดการเมื่อรูปภาพโหลดไม่ได้
   */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.getProductImage('');
  }
}
