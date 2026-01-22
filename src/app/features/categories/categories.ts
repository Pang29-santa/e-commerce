import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.html',
  styleUrls: ['./categories.css'],
  standalone: true,
  imports: [CommonModule]
})
export class CategoriesComponent implements OnInit {
  categories: string[] = [];
  loading = true;
  error = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.http.get<string[]>('https://dummyjson.com/products/category-list')
      .subscribe({
        next: (data) => {
          this.categories = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load categories. Please try again later.';
          this.loading = false;
          console.error('Error fetching categories:', err);
        }
      });
  }

  onCategoryClick(category: string): void {
    // Navigate to products page with category filter
    this.router.navigate(['/products'], { queryParams: { category: category } });
  }
}
