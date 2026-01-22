# 📚 คู่มือการใช้งาน REST API สำหรับผู้เริ่มต้น
## Fake Store API - https://api.escuelajs.co/api/v1/products

---

## 🎯 API นี้คืออะไร?

**Fake Store API** เป็น REST API สำหรับทดสอบและฝึกพัฒนา E-commerce ที่ให้ข้อมูลสินค้าจำลองฟรี ไม่ต้องสมัครสมาชิก ไม่ต้องใช้ API Key

### ใช้ทำอะไรได้บ้าง?
- ✅ ฝึกเขียน Frontend (React, Angular, Vue)
- ✅ ทดสอบการดึงข้อมูลจาก API
- ✅ สร้างหน้าแสดงรายการสินค้า
- ✅ ทำระบบ Pagination
- ✅ สร้างหน้ารายละเอียดสินค้า
- ✅ ฝึกทำ Shopping Cart

---

## 📦 รูปแบบข้อมูลที่ได้ (JSON)

เมื่อเรียก API จะได้ข้อมูลเป็น **Array ของ Object** ในรูปแบบ JSON:

```json
[
  {
    "id": 2,
    "title": "Classic Red Pullover Hoodie",
    "slug": "classic-red-pullover-hoodie",
    "price": 10,
    "description": "Elevate your casual wardrobe...",
    "category": {
      "id": 1,
      "name": "Clothes",
      "slug": "clothes",
      "image": "https://i.imgur.com/QkIa5tT.jpeg"
    },
    "images": [
      "https://i.imgur.com/1twoaDy.jpeg",
      "https://i.imgur.com/FDwQgLy.jpeg",
      "https://i.imgur.com/kg1ZhhH.jpeg"
    ],
    "creationAt": "2026-01-20T23:55:10.000Z",
    "updatedAt": "2026-01-20T23:55:10.000Z"
  }
]
```

### 🔑 Field สำคัญที่ต้องรู้จัก

| Field | ประเภท | คำอธิบาย | ตัวอย่าง |
|-------|--------|----------|----------|
| `id` | Number | รหัสสินค้า (ไม่ซ้ำกัน) | `2` |
| `title` | String | ชื่อสินค้า | `"Classic Red Pullover Hoodie"` |
| `slug` | String | URL-friendly name | `"classic-red-pullover-hoodie"` |
| `price` | Number | ราคาสินค้า (USD) | `10` |
| `description` | String | รายละเอียดสินค้า | `"Elevate your casual..."` |
| `images` | Array | รูปภาพสินค้า (หลายรูป) | `["url1", "url2", "url3"]` |
| `category` | Object | หมวดหมู่สินค้า | `{ id, name, slug, image }` |

---

## 🌐 วิธีเรียก API แบบ GET

### 1️⃣ ดึงสินค้าทั้งหมด
```
GET https://api.escuelajs.co/api/v1/products
```
**ผลลัพธ์:** Array ของสินค้าทั้งหมด (อาจมีเยอะมาก)

### 2️⃣ ดึงสินค้าทีละชิ้น (ตาม ID)
```
GET https://api.escuelajs.co/api/v1/products/2
```
**ผลลัพธ์:** Object ของสินค้า ID = 2

### 3️⃣ จำกัดจำนวนสินค้า (Limit)
```
GET https://api.escuelajs.co/api/v1/products?limit=10
```
**ผลลัพธ์:** แสดงเฉพาะ 10 รายการแรก

### 4️⃣ ข้ามรายการ (Offset) - สำหรับ Pagination
```
GET https://api.escuelajs.co/api/v1/products?offset=10&limit=10
```
**ผลลัพธ์:** ข้าม 10 รายการแรก แล้วแสดง 10 รายการถัดไป (รายการที่ 11-20)

### 5️⃣ กรองตามหมวดหมู่
```
GET https://api.escuelajs.co/api/v1/products?categoryId=1
```
**ผลลัพธ์:** สินค้าในหมวดหมู่ ID = 1 (Clothes)

---

## 💻 ตัวอย่างการเรียก API ด้วย JavaScript

### แบบ Vanilla JavaScript (Fetch API)

```javascript
// 1. ดึงสินค้าทั้งหมด
fetch('https://api.escuelajs.co/api/v1/products')
  .then(response => response.json())
  .then(products => {
    console.log('สินค้าทั้งหมด:', products);
    // นำข้อมูลไปแสดงบนหน้าเว็บ
    displayProducts(products);
  })
  .catch(error => {
    console.error('เกิดข้อผิดพลาด:', error);
  });

// 2. ดึงสินค้าทีละชิ้น
fetch('https://api.escuelajs.co/api/v1/products/2')
  .then(response => response.json())
  .then(product => {
    console.log('สินค้า ID 2:', product);
    console.log('ชื่อ:', product.title);
    console.log('ราคา:', product.price);
    console.log('รูปแรก:', product.images[0]);
  });

// 3. ดึงแบบมี Limit และ Offset
fetch('https://api.escuelajs.co/api/v1/products?limit=10&offset=0')
  .then(response => response.json())
  .then(products => {
    console.log('10 รายการแรก:', products);
  });
```

### แบบ Async/Await (แนะนำ - อ่านง่ายกว่า)

```javascript
async function getProducts() {
  try {
    const response = await fetch('https://api.escuelajs.co/api/v1/products?limit=10');
    const products = await response.json();
    
    console.log('ได้สินค้ามา:', products.length, 'รายการ');
    
    // แสดงข้อมูลสินค้าแต่ละตัว
    products.forEach(product => {
      console.log(`${product.title} - $${product.price}`);
    });
    
    return products;
  } catch (error) {
    console.error('เกิดข้อผิดพลาด:', error);
  }
}

// เรียกใช้งาน
getProducts();
```

---

## 🅰️ ตัวอย่างการเรียก API ด้วย Angular (HttpClient)

### 1️⃣ สร้าง Product Model

```typescript
// product.model.ts
export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  category: Category;
  images: string[];
  creationAt: string;
  updatedAt: string;
}
```

### 2️⃣ สร้าง Product Service

```typescript
// product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://api.escuelajs.co/api/v1/products';

  constructor(private http: HttpClient) {}

  // ดึงสินค้าทั้งหมด
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // ดึงสินค้าแบบมี Limit
  getProductsWithLimit(limit: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}?limit=${limit}`);
  }

  // ดึงสินค้าทีละชิ้น
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // ดึงสินค้าแบบ Pagination
  getProductsPaginated(offset: number, limit: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}?offset=${offset}&limit=${limit}`);
  }

  // ดึงสินค้าตามหมวดหมู่
  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}?categoryId=${categoryId}`);
  }
}
```

### 3️⃣ ใช้งานใน Component

```typescript
// products.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    // เรียก API ดึงสินค้า 20 รายการแรก
    this.productService.getProductsWithLimit(20).subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
        console.log('โหลดสินค้าสำเร็จ:', data.length, 'รายการ');
      },
      error: (err) => {
        this.error = 'ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่';
        this.loading = false;
        console.error('เกิดข้อผิดพลาด:', err);
      }
    });
  }
}
```

### 4️⃣ แสดงผลใน Template

```html
<!-- products.component.html -->
<div class="container">
  <h1>รายการสินค้า</h1>

  <!-- แสดงตอนกำลังโหลด -->
  <div *ngIf="loading" class="loading">
    <p>กำลังโหลดสินค้า...</p>
  </div>

  <!-- แสดงตอนเกิด Error -->
  <div *ngIf="error" class="error">
    <p>{{ error }}</p>
  </div>

  <!-- แสดงรายการสินค้า -->
  <div *ngIf="!loading && !error" class="product-grid">
    <div *ngFor="let product of products" class="product-card">
      <img [src]="product.images[0]" [alt]="product.title">
      <h3>{{ product.title }}</h3>
      <p class="price">${{ product.price }}</p>
      <p class="category">{{ product.category.name }}</p>
    </div>
  </div>
</div>
```

---

## 🔄 ลำดับการทำงานตั้งแต่เรียก API → แสดงบนหน้าเว็บ

```
1. Component เริ่มทำงาน (ngOnInit)
   ↓
2. เรียก Service → productService.getProducts()
   ↓
3. Service ส่ง HTTP GET Request ไปที่ API
   ↓
4. รอรับข้อมูลจาก API (loading = true)
   ↓
5. API ส่งข้อมูล JSON กลับมา
   ↓
6. Angular แปลง JSON → TypeScript Object
   ↓
7. เก็บข้อมูลใน products: Product[] = []
   ↓
8. ตั้งค่า loading = false
   ↓
9. Angular ตรวจจับการเปลี่ยนแปลง (Change Detection)
   ↓
10. *ngFor วนลูปแสดงข้อมูลบนหน้าเว็บ
```

---

## ⚠️ ข้อควรระวังที่พบบ่อย

### 1. ข้อมูลยังไม่มา แต่พยายามใช้งาน

**❌ ผิด:**
```typescript
ngOnInit() {
  this.productService.getProducts().subscribe();
  console.log(this.products[0].title); // ❌ Error! ข้อมูลยังไม่มา
}
```

**✅ ถูกต้อง:**
```typescript
ngOnInit() {
  this.productService.getProducts().subscribe({
    next: (data) => {
      this.products = data;
      console.log(this.products[0].title); // ✅ ใช้ได้ เพราะข้อมูลมาแล้ว
    }
  });
}
```

### 2. รูปภาพเป็น undefined หรือ Array ว่าง

**❌ ผิด:**
```html
<img [src]="product.images[0]">
<!-- ถ้า images เป็น undefined หรือ [] จะ Error -->
```

**✅ ถูกต้อง:**
```html
<img [src]="product.images?.[0] || 'assets/no-image.png'">
<!-- ใช้ Optional Chaining และ Default Image -->
```

หรือเช็คใน TypeScript:
```typescript
getProductImage(product: Product): string {
  return product.images && product.images.length > 0 
    ? product.images[0] 
    : 'assets/no-image.png';
}
```

### 3. Render ก่อนข้อมูลโหลด

**❌ ผิด:**
```html
<div *ngFor="let product of products">
  {{ product.title }}
</div>
<!-- ถ้า products = [] จะไม่แสดงอะไร ผู้ใช้งงว่าทำไมว่าง -->
```

**✅ ถูกต้อง:**
```html
<div *ngIf="loading">กำลังโหลด...</div>
<div *ngIf="error">{{ error }}</div>
<div *ngIf="!loading && !error && products.length === 0">
  ไม่พบสินค้า
</div>
<div *ngIf="!loading && !error && products.length > 0">
  <div *ngFor="let product of products">
    {{ product.title }}
  </div>
</div>
```

### 4. ลืมจัดการ Error

**❌ ผิด:**
```typescript
this.productService.getProducts().subscribe({
  next: (data) => this.products = data
  // ถ้า API Error จะไม่รู้ว่าเกิดอะไรขึ้น
});
```

**✅ ถูกต้อง:**
```typescript
this.productService.getProducts().subscribe({
  next: (data) => {
    this.products = data;
    this.loading = false;
  },
  error: (err) => {
    console.error('API Error:', err);
    this.error = 'ไม่สามารถโหลดข้อมูลได้';
    this.loading = false;
  }
});
```

### 5. ไม่ใช้ Query Parameters อย่างถูกต้อง

**❌ ผิด:**
```typescript
// ดึงข้อมูลทั้งหมดทุกครั้ง (อาจมีหลักพันรายการ)
this.http.get('https://api.escuelajs.co/api/v1/products')
```

**✅ ถูกต้อง:**
```typescript
// จำกัดจำนวนเพื่อประสิทธิภาพ
this.http.get('https://api.escuelajs.co/api/v1/products?limit=20')
```

---

## 🎓 เหมาะกับนำไปใช้งานอะไรบ้าง?

### 1. **ฝึกพัฒนา Frontend**
- เรียนรู้การดึงข้อมูลจาก API
- ฝึกใช้ HttpClient ใน Angular
- ฝึกใช้ fetch() ใน JavaScript

### 2. **สร้างหน้าแสดงรายการสินค้า**
- Product List Page
- Product Grid Layout
- Product Card Component

### 3. **ทำระบบ Pagination**
```typescript
// หน้าที่ 1: offset=0, limit=10
// หน้าที่ 2: offset=10, limit=10
// หน้าที่ 3: offset=20, limit=10
loadPage(pageNumber: number, pageSize: number = 10) {
  const offset = (pageNumber - 1) * pageSize;
  this.productService.getProductsPaginated(offset, pageSize).subscribe(...);
}
```

### 4. **สร้างหน้ารายละเอียดสินค้า**
```typescript
// ดึงข้อมูลสินค้าตาม ID จาก URL
ngOnInit() {
  const id = this.route.snapshot.params['id'];
  this.productService.getProductById(id).subscribe(...);
}
```

### 5. **ทำระบบกรองและค้นหา**
- กรองตามหมวดหมู่
- กรองตามช่วงราคา
- ค้นหาตามชื่อสินค้า

### 6. **ฝึกทำ Shopping Cart**
- เพิ่มสินค้าลงตะกร้า
- คำนวณราคารวม
- จัดการจำนวนสินค้า

---

## 📊 ตัวอย่าง Use Case จริง

### Use Case 1: แสดงสินค้า 12 รายการแรก

```typescript
this.productService.getProductsWithLimit(12).subscribe({
  next: (products) => {
    this.products = products;
  }
});
```

### Use Case 2: Pagination - แสดงหน้าละ 10 รายการ

```typescript
currentPage = 1;
pageSize = 10;

loadPage(page: number) {
  const offset = (page - 1) * this.pageSize;
  this.productService.getProductsPaginated(offset, this.pageSize).subscribe({
    next: (products) => {
      this.products = products;
      this.currentPage = page;
    }
  });
}

nextPage() {
  this.loadPage(this.currentPage + 1);
}

previousPage() {
  if (this.currentPage > 1) {
    this.loadPage(this.currentPage - 1);
  }
}
```

### Use Case 3: แสดงรายละเอียดสินค้า

```typescript
// ใน product-detail.component.ts
ngOnInit() {
  const productId = +this.route.snapshot.params['id'];
  
  this.productService.getProductById(productId).subscribe({
    next: (product) => {
      this.product = product;
      this.selectedImage = product.images[0];
    },
    error: (err) => {
      this.router.navigate(['/products']);
    }
  });
}
```

---

## 🎯 สรุป

### ✅ สิ่งที่ควรจำ
1. **API URL:** `https://api.escuelajs.co/api/v1/products`
2. **ใช้ฟรี** ไม่ต้อง API Key
3. **ข้อมูลเป็น JSON** ต้องแปลงเป็น Object
4. **ใช้ Query Parameters** เพื่อจำกัดข้อมูล (`limit`, `offset`)
5. **ต้องจัดการ Loading และ Error** เสมอ
6. **เช็ค images array** ก่อนใช้งาน

### 🚀 ขั้นตอนการใช้งานพื้นฐาน
1. สร้าง Model/Interface
2. สร้าง Service สำหรับเรียก API
3. เรียกใช้ใน Component (ngOnInit)
4. แสดงผลใน Template (*ngFor, *ngIf)
5. จัดการ Loading State และ Error

### 💡 Tips สำหรับผู้เริ่มต้น
- เริ่มจากดึงข้อมูลทั้งหมดก่อน
- ค่อยๆ เพิ่ม Limit และ Pagination
- ใช้ `console.log()` ดูข้อมูลที่ได้
- ทดสอบ API ใน Browser ก่อน (เปิด URL ใน Tab ใหม่)
- ใช้ DevTools → Network Tab ดู Request/Response

---

## 📚 แหล่งข้อมูลเพิ่มเติม

- **API Documentation:** https://fakeapi.platzi.com/
- **Angular HttpClient:** https://angular.io/guide/http
- **JavaScript Fetch API:** https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

---

**สร้างโดย:** Antigravity AI  
**วันที่:** 21 มกราคม 2026  
**เวอร์ชัน:** 1.0
