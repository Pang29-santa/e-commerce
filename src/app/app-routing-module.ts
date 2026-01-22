import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { ProductsComponent } from './features/products/products';
import { ProductDetailComponent } from './features/products/product-detail';
import { CartComponent } from './features/cart/cart';
import { CategoriesComponent } from './features/categories/categories';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'products', component: ProductsComponent, canActivate: [AuthGuard] },
  { path: 'products/:id', component: ProductDetailComponent, canActivate: [AuthGuard] },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: '**', redirectTo: '/products' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
