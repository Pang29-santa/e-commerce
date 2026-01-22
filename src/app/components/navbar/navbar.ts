import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { filter } from 'rxjs/operators';

import { ThemeService } from '../../services/theme.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class NavbarComponent implements OnInit {
  showNavbar = true;
  cartItemCount = 0;
  theme$: Observable<string>;

  constructor(
    public authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private themeService: ThemeService
  ) {
    this.theme$ = this.themeService.theme$;
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.showNavbar = !event.url.includes('/login');
    });
  }

  ngOnInit(): void {
    // Subscribe ข้อมูลตะกร้าเพื่ออัพเดทจำนวนสินค้า
    this.cartService.getCart$().subscribe(cart => {
      this.cartItemCount = cart.totalItems;
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logout(): void {
    this.authService.logout();
  }


}
