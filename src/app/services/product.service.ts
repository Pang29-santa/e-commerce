import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'https://dummyjson.com';
  private productsEndpoint = '/products';

  constructor(private http: HttpClient) {}

  getProducts(limit: number = 0, skip: number = 0): Observable<Product[]> {
    console.log('🔧 ProductService: getProducts() เริ่มทำงาน');
    const url = `${this.baseUrl}${this.productsEndpoint}?limit=${limit}&skip=${skip}`;
    console.log('🌐 URL:', url);
    return this.http.get<any>(url).pipe(
      map(response => response.products as Product[])
    );
  }

  getProductById(id: number): Observable<Product> {
    console.log('🔧 ProductService: getProductById() ถูกเรียก - ID:', id);
    const url = `${this.baseUrl}${this.productsEndpoint}/${id}`;
    console.log('🌐 URL:', url);
    return this.http.get<Product>(url);
  }

  getProductsByCategory(categoryName: string): Observable<Product[]> {
    const url = `${this.baseUrl}${this.productsEndpoint}/category/${categoryName}?limit=0`;
    return this.http.get<any>(url).pipe(
      map(response => response.products as Product[])
    );
  }

  getCategoryList(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}${this.productsEndpoint}/category-list`);
  }
}
