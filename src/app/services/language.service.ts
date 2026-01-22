import { Injectable, signal } from '@angular/core';

export type Lang = 'en' | 'th';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  // Use signal for reactive state

  currentLang = signal<Lang>('th');

  // Import Product model type locally to avoid circular dependency issues if full import not needed, 
  // or define a minimal interface. Here we use 'any' or verify structure to simplify.
  
  private translations: Record<Lang, Record<string, string>> = {
    en: {
      // Product Mapping
      'PROD_1_TITLE': 'Modern Sneakers',
      'PROD_1_DESC': 'High quality sneakers, very comfortable.',
      'PROD_2_TITLE': 'Classic T-Shirt',
      'PROD_2_DESC': 'Cotton t-shirt, breathable fabric.',
      // Navbar
      'NAV_HOME': 'Home',
      'NAV_PRODUCTS': 'Products',
      'NAV_CATEGORIES': 'Categories',
      'NAV_CART': 'Cart',
      'NAV_LOGIN': 'Login',
      'NAV_LOGOUT': 'Logout',
      
      // Common
      'LOADING': 'Loading...',
      'ERROR_LOAD': 'Failed to load data. Please try again.',
      
      // Products List
      'PRODUCTS_TITLE': 'Products',
      'BTN_DETAILS': 'Details',
      'BTN_ADD_TO_CART': 'Add to Cart',
      'MSG_ADDED_TO_CART': 'Added to cart',
      
      // Product Detail
      'BTN_BACK': 'Back to Products',
      'BTN_VIEW_CART': 'View Cart',
      'LBL_DESCRIPTION': 'Description',
      'LBL_PRODUCT_ID': 'Product ID',
      'LBL_SKU': 'SKU',
      
      // Cart
      'CART_TITLE': 'Shopping Cart',
      'CART_EMPTY': 'Your cart is empty',
      'CART_START_SHOPPING': 'Start Shopping',
      'CART_ITEM_PRICE': 'Price',
      'CART_ITEM_TOTAL': 'Total',
      'CART_SUMMARY': 'Order Summary',
      'CART_SUBTOTAL': 'Subtotal',
      'CART_SHIPPING': 'Shipping',
      'CART_TOTAL': 'Total',
      'BTN_CHECKOUT': 'Checkout',
      'BTN_CONTINUE': 'Continue Shopping',
      'BTN_CLEAR': 'Clear Cart',
      'FREE_SHIPPING': 'Free',
      'CART_ITEMS_COUNT': 'items',
      
      // Categories
      'CATEGORIES_TITLE': 'Categories',
      
      // Login
      'LOGIN_TITLE': 'Login',
      'LBL_USERNAME': 'Username',
      'LBL_PASSWORD': 'Password',
      'BTN_LOGIN': 'Sign In',
      'LOGIN_SUBTITLE': 'Welcome back! Please login to your account.',

      // Categories Mapping
      'CAT_CLOTHES': 'Clothes',
      'CAT_ELECTRONICS': 'Electronics',
      'CAT_FURNITURE': 'Furniture',
      'CAT_SHOES': 'Shoes',
      'CAT_OTHERS': 'Others',
      'CAT_MISCELLANEOUS': 'Miscellaneous',

      // Footer
      'POWERED_BY': 'Powered by',
      'API_OWNER': 'API Owner',
      'COPYRIGHT': 'E-Commerce Platform. Designed with',
      
      // Alerts & Errors
      'MSG_CHECKOUT_DEV': 'Checkout feature is under development...',
      'ERR_LOGIN_EMPTY': 'Please enter both username and password.'
    },
    th: {
      // Product Mapping
      'PROD_1_TITLE': 'รองเท้าผ้าใบสุดเท่',
      'PROD_1_DESC': 'รองเท้าผ้าใบคุณภาพดี ใส่สบาย พื้นนุ่ม',
      'PROD_2_TITLE': 'เสื้อยืดคลาสสิค',
      'PROD_2_DESC': 'เสื้อยืดผ้าฝ้าย ระบายอากาศได้ดี',
      // Navbar
      'NAV_HOME': 'หน้าแรก',
      'NAV_PRODUCTS': 'สินค้า',
      'NAV_CATEGORIES': 'หมวดหมู่',
      'NAV_CART': 'ตะกร้าสินค้า',
      'NAV_LOGIN': 'เข้าสู่ระบบ',
      'NAV_LOGOUT': 'ออกจากระบบ',
      
      // Common
      'LOADING': 'กำลังโหลด...',
      'ERROR_LOAD': 'เกิดข้อผิดพลาดในการโหลดข้อมูล โปรดลองใหม่อีกครั้ง',
      
      // Products List
      'PRODUCTS_TITLE': 'สินค้าทั้งหมด',
      'BTN_DETAILS': 'ดูรายละเอียด',
      'BTN_ADD_TO_CART': 'หยิบใส่ตะกร้า',
      'MSG_ADDED_TO_CART': 'เพิ่มสินค้าลงตะกร้าแล้ว',
      
      // Product Detail
      'BTN_BACK': 'กบับไปหน้าสินค้า',
      'BTN_VIEW_CART': 'ดูตะกร้าสินค้า',
      'LBL_DESCRIPTION': 'รายละเอียดสินค้า',
      'LBL_PRODUCT_ID': 'รหัสสินค้า',
      'LBL_SKU': 'รหัส SKU',
      
      // Cart
      'CART_TITLE': 'ตะกร้าสินค้าของฉัน',
      'CART_EMPTY': 'ไม่มีสินค้าในตะกร้า',
      'CART_START_SHOPPING': 'เริ่มเลือกซื้อสินค้า',
      'CART_ITEM_PRICE': 'ราคา',
      'CART_ITEM_TOTAL': 'รวม',
      'CART_SUMMARY': 'สรุปรายการสั่งซื้อ',
      'CART_SUBTOTAL': 'ยอดรวมสินค้าย่อย',
      'CART_SHIPPING': 'ค่าจัดส่ง',
      'CART_TOTAL': 'ยอดรวมทั้งสิ้น',
      'BTN_CHECKOUT': 'สั่งซื้อสินค้า',
      'BTN_CONTINUE': 'เลือกซื้อสินค้าต่อ',
      'BTN_CLEAR': 'ล้างตะกร้า',
      'FREE_SHIPPING': 'ฟรี',
      'CART_ITEMS_COUNT': 'รายการ',
      
      // Categories
      'CATEGORIES_TITLE': 'หมวดหมู่สินค้า',
      
      // Login
      'LOGIN_TITLE': 'เข้าสู่ระบบ',
      'LBL_USERNAME': 'ชื่อผู้ใช้',
      'LBL_PASSWORD': 'รหัสผ่าน',
      'BTN_LOGIN': 'เข้าสู่ระบบ',
      'LOGIN_SUBTITLE': 'ยินดีต้อนรับกลับ! กรุณาเข้าสู่ระบบ',

      // Categories Mapping
      'CAT_CLOTHES': 'เสื้อผ้า',
      'CAT_ELECTRONICS': 'อิเล็กทรอนิกส์',
      'CAT_FURNITURE': 'เฟอร์นิเจอร์',
      'CAT_SHOES': 'รองเท้า',
      'CAT_OTHERS': 'อื่นๆ',
      'CAT_MISCELLANEOUS': 'เบ็ดเตล็ด',

      // Footer
      'POWERED_BY': 'ขับเคลื่อนโดย',
      'API_OWNER': 'เจ้าของ API',
      'COPYRIGHT': 'E-Commerce Platform. ออกแบบด้วย',

      // Alerts & Errors
      'MSG_CHECKOUT_DEV': 'ระบบชำระเงินกำลังอยู่ในระหว่างการพัฒนา...',
      'ERR_LOGIN_EMPTY': 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน'
    }
  };

  /**
   * Toggle between English and Thai
   */
  toggleLanguage() {
    this.currentLang.update(lang => lang === 'en' ? 'th' : 'en');
  }

  /**
   * Set specific language
   */
  setLanguage(lang: Lang) {
    this.currentLang.set(lang);
  }

  /**
   * Get translation for a key
   */
  translate(key: string): string {
    const lang = this.currentLang();
    return this.translations[lang][key] || key;
  }

  /**
   * Map API category name to translation key and translate
   */
  translateCategory(categoryName: string): string {
    if (!categoryName) return '';

    const upperName = categoryName.toUpperCase();
    let key = `CAT_${upperName}`;
    
    // Mapping specific cases if needed (e.g., simplistic plural handling if API returns singular)
    // For now assuming exact match with keys like CAT_CLOTHES, CAT_ELECTRONICS
    
    // Check if key exists in current language
    const lang = this.currentLang();
    const translation = this.translations[lang][key];

    return translation || categoryName; // Return original if no translation found
  }

  /**
   * Translate Product Title
   */
  translateProductTitle(product: any): string {
    if (!product || !product.id) return '';
    
    // Check if we have a hardcoded translation for this ID
    const key = `PROD_${product.id}_TITLE`;
    const lang = this.currentLang();
    const translation = this.translations[lang][key];
    
    return translation || product.title;
  }

  /**
   * Translate Product Description
   */
  translateProductDesc(product: any): string {
    if (!product || !product.id) return '';
    
    const key = `PROD_${product.id}_DESC`;
    const lang = this.currentLang();
    const translation = this.translations[lang][key];
    
    return translation || product.description;
  }
}
