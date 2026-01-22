import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_KEY = 'isLoggedIn';
  private readonly USER_KEY = 'currentUser';

  constructor(
    private router: Router,
    private cartService: CartService
  ) {}

  login(username: string, password: string): boolean {
    if (username.trim() && password.trim()) {
      sessionStorage.setItem(this.AUTH_KEY, 'true');
      sessionStorage.setItem(this.USER_KEY, username);
      
      // แจ้ง CartService ว่ามี user login แล้ว
      this.cartService.setCurrentUser(username);
      
      console.log('✅ Login successful:', username);
      return true;
    }
    return false;
  }

  isLoggedIn(): boolean {
    return sessionStorage.getItem(this.AUTH_KEY) === 'true';
  }

  getCurrentUser(): string | null {
    return sessionStorage.getItem(this.USER_KEY);
  }

  logout(): void {
    const username = this.getCurrentUser();
    console.log('👋 Logout:', username);
    
    // ล้างตะกร้าก่อน logout
    this.cartService.clearCurrentUser();
    
    sessionStorage.removeItem(this.AUTH_KEY);
    sessionStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/login']);
  }

  /**
   * เรียกเมื่อ app เริ่มต้น เพื่อโหลดตะกร้าของ user ที่ login อยู่
   */
  initializeUser(): void {
    const username = this.getCurrentUser();
    if (username && this.isLoggedIn()) {
      console.log('🔄 Initialize user:', username);
      this.cartService.setCurrentUser(username);
    }
  }
}
