import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { ModalService } from '../../services/modal.service';
import { ChatbotService } from '../../services/chatbot.service';



@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  error = '';
  selectedImageIndex = 0;
  quantity = 1;

  // AI Insights
  aiInsight = '';
  aiLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private modalService: ModalService,
    private chatbotService: ChatbotService,
    private cdr: ChangeDetectorRef
  ) {
    console.log('🏗️ ProductDetailComponent: Constructor ถูกเรียก');
  }

  ngOnInit(): void {
    console.log('🚀 ProductDetailComponent: ngOnInit เริ่มทำงาน');
    
    this.route.params.subscribe(params => {
      const id = +params['id'];
      console.log('📌 Route Params:', params);
      console.log('🔢 Product ID:', id);
      
      if (id) {
        this.fetchProduct(id);
      } else {
        console.error('❌ ไม่พบ Product ID ใน URL');
        this.error = 'Invalid product ID';
        this.loading = false;
      }
    });
  }

  fetchProduct(id: number): void {
    console.log('📡 กำลังเรียก API สำหรับสินค้า ID:', id);
    this.loading = true;
    
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        console.log('✅ ได้ข้อมูลสินค้าแล้ว:', data);
        console.log('📦 ชื่อสินค้า:', data.title);
        console.log('💰 ราคา:', data.price);
        console.log('🖼️ รูปภาพหลัก:', data.thumbnail);
        
        this.product = data;
        this.loading = false;
        
        // Trigger AI Analysis
        this.getAiInsight(data);

        console.log('✨ อัพเดทสถานะ - loading:', this.loading);
        console.log('🔄 กำลังบังคับ Change Detection...');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ เกิดข้อผิดพลาดในการโหลดสินค้า!');
        console.error('📛 Error Details:', err);
        console.error('📛 Error Status:', err.status);
        console.error('📛 Error Message:', err.message);
        
        this.error = 'Failed to load product details. Please try again later.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  selectImage(index: number): void {
    console.log('🖼️ เปลี่ยนรูปภาพเป็น index:', index);
    this.selectedImageIndex = index;
  }

  /**
   * Add product to cart
   */
  addToCart(): void {
    if (!this.product) return;

    console.log('🛒 Add to cart:', this.product.title, 'quantity:', this.quantity);
    this.cartService.addToCart(this.product, this.quantity);
    
    // Show confirmation message
    this.modalService.success(`เพิ่ม "${this.product.title}" ลงในตะกร้าเรียบร้อยแล้ว`, 'สำเร็จ');
  }

  /**
   * ไปหน้าตะกร้า
   */
  goToCart(): void {
    console.log('🛒 ไปหน้าตะกร้า');
    this.router.navigate(['/cart']);
  }

  goBack(): void {
    console.log('⬅️ กลับไปหน้ารายการสินค้า');
    this.router.navigate(['/products']);
  }

  /**
   * ดึง URL รูปภาพสินค้า พร้อมตรวจสอบความถูกต้อง
   */
  getProductImage(imageUrl: string): string {
    // Filter out restricted domains
    const restrictedDomains = ['placeimg.com', 'loremflickr.com', 'pravatar.cc'];
    if (restrictedDomains.some(domain => imageUrl.includes(domain))) {
       return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
    }

    if (imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
      return imageUrl;
    }
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
  }

  /**
   * Handle image load error
   */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
  }

  async getAiInsight(product: Product): Promise<void> {
    this.aiLoading = true;
    this.aiInsight = '';
    
    try {
      this.aiInsight = await this.chatbotService.analyzeProduct(product);
    } catch (error) {
      console.error('❌ Failed to get AI Insight:', error);
      this.aiInsight = 'ไม่สามารถดึงข้อมูลวิเคราะห์จาก AI ได้ในขณะนี้';
    } finally {
      this.aiLoading = false;
      this.cdr.detectChanges();
    }
  }
}
