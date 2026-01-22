import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { NavbarComponent } from './components/navbar/navbar';
import { FooterComponent } from './components/footer/footer';
import { LoginComponent } from './login/login';
import { ProductsComponent } from './features/products/products';
import { ProductDetailComponent } from './features/products/product-detail';
import { CartComponent } from './features/cart/cart';
import { ChatbotComponent } from './components/chatbot/chatbot';
import { ModalComponent } from './components/modal/modal';

@NgModule({
  declarations: [
    App,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    ProductsComponent,
    ProductDetailComponent,
    CartComponent,
    ChatbotComponent
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
  ],
  bootstrap: [App]
})
export class AppModule { }
// Refresh
