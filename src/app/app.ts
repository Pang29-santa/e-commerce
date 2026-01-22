import { Component, signal, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: false
})
export class App implements OnInit {
  protected readonly title = signal('e-commerce-app');

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // โหลดตะกร้าของ user ที่ login อยู่ (ถ้ามี)
    this.authService.initializeUser();
  }
}
