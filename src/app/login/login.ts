import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  onLogin(): void {
    if (this.authService.login(this.username, this.password)) {
      this.router.navigate(['/products']);
    } else {
      this.errorMessage = 'Please enter both username and password';
    }
  }
}
