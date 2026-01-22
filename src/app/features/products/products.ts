import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ProductsComponent implements OnInit {
  allProducts: Product[] = [];
  displayedProducts: Product[] = [];
  loading = true;
  error = '';
  currentCategory: string | null = null;
  categories: string[] = [];
  categoriesLoading = true;
  
  // Pagination
  currentPage = 1;
  pageSize = 20;
  totalPages = 0;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: ModalService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // โหลดหมวดหมู่ทั้งหมดครั้งเดียว
    this.fetchCategories();

    // Subscribe ข้อมูล Query Params เพื่อรองรับการกรองตามหมวดหมู่
    this.route.queryParams.subscribe(params => {
      this.currentCategory = params['category'] || null;
      this.currentPage = 1; // รีเซ็ตหน้ากลับไปที่ 1 เมื่อมีการเปลี่ยนหมวดหมู่
      this.fetchProducts();
    });
  }

  fetchCategories(): void {
    this.productService.getCategoryList().subscribe({
      next: (data) => {
        this.categories = data;
        this.categoriesLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error fetching categories:', err);
        this.categoriesLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onCategoryChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const category = select.value === '' ? null : select.value;
    this.setCategory(category);
  }

  setCategory(category: string | null): void {
    this.router.navigate(['/products'], { 
      queryParams: { category: category ? category : null },
      queryParamsHandling: 'merge' 
    });
  }

  fetchProducts(): void {
    this.loading = true;
    this.error = '';
    
    const productObservable = this.currentCategory 
      ? this.productService.getProductsByCategory(this.currentCategory)
      : this.productService.getProducts(0);

    productObservable.subscribe({
      next: (data) => {
        // กรองข้อมูลที่มีปัญหาออก
        const validProducts = this.filterValidProducts(data);
        
        // อัพเดทข้อมูลสินค้าทั้งหมด
        this.allProducts = validProducts;
        this.totalPages = Math.ceil(this.allProducts.length / this.pageSize);
        
        // แสดงสินค้าหน้าแรก
        this.updateDisplayedProducts();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error fetching products:', err);
        this.error = 'Failed to load products. Please try again later.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * อัพเดทรายการสินค้าที่จะแสดงผลตามหน้าปัจจุบัน
   */
  updateDisplayedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedProducts = this.allProducts.slice(startIndex, endIndex);
  }

  /**
   * เปลี่ยนหน้า
   */
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedProducts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /**
   * Filter products with valid data only
   */
  filterValidProducts(products: Product[]): Product[] {
    return products.filter(product => {
      // Check if product has title
      if (!product.title || product.title.trim() === '') {
        return false;
      }

      // Check if product has valid price
      if (!product.price || product.price <= 0) {
        return false;
      }

      // Check if product has thumbnail or images
      if (!product.thumbnail && (!product.images || product.images.length === 0)) {
        return false;
      }

      // Check if image is a valid URL
      const firstImage = product.thumbnail || product.images[0];
      if (!firstImage || (!firstImage.startsWith('http://') && !firstImage.startsWith('https://'))) {
        return false;
      }

      // Filter out invalid/placeholder domains
      const invalidDomains = [
        'example.com',
        'example.org',
        'placeholder.com',
        'test.com',
        'localhost',
        'placeimg.com',
        'loremflickr.com',
        'pravatar.cc'
      ];

      const isInvalidDomain = invalidDomains.some(domain => 
        firstImage.toLowerCase().includes(domain)
      );

      if (isInvalidDomain) {
        return false;
      }

      // Check if product has category
      if (!product.category) {
        return false;
      }

      // Passed all validations
      return true;
    });
  }

  clearFilter(): void {
    this.router.navigate(['/products']);
  }

  viewProduct(productId: number): void {
    this.router.navigate(['/products', productId]);
  }

  addToCart(product: Product): void {
    console.log('🛒 Add to cart directly:', product.title);
    this.cartService.addToCart(product, 1);
    this.modalService.success(`เพิ่ม "${product.title}" ลงในตะกร้าเรียบร้อยแล้ว`, 'สำเร็จ');
  }

  /**
   * ดึง URL รูปภาพสินค้า พร้อมตรวจสอบความถูกต้อง
   */
  getProductImage(product: Product): string {
    // เช็ค thumbnail ก่อน
    if (product.thumbnail) {
      return product.thumbnail;
    }

    // ถ้าไม่มี thumbnail ใช้ images[0]
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }

    return this.getPlaceholderImage();
  }

  /**
   * รูป placeholder เมื่อไม่มีรูปหรือรูปผิด
   */
  getPlaceholderImage(): string {
    // ใช้ SVG inline แทน external URL
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
  }

  /**
   * Handle image load error
   */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.getPlaceholderImage();
  }
}
