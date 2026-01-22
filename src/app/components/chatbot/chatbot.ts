import { Component, ElementRef, ViewChild, ViewChildren, QueryList, AfterViewChecked, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService, ChatMessage } from '../../services/chatbot.service';
import { Router } from '@angular/router';
import lottie from 'lottie-web';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.html',
  styleUrls: ['./chatbot.css']
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  @ViewChild('triggerLottie') private triggerLottie!: ElementRef;
  @ViewChild('headerLottie') private headerLottie!: ElementRef;
  @ViewChildren('botAvatarLottie') private botAvatarLotties!: QueryList<ElementRef>;
  
  isOpen = false;
  userInput = '';
  messages: ChatMessage[] = [];
  hasUnreadMessages = true; // Start with attention grabber

  private triggerAnim: any;
  private headerAnim: any;
  private avatarAnims: any[] = [];

  constructor(
    private chatbotService: ChatbotService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.chatbotService.getMessages().subscribe(msgs => {
      this.messages = msgs;
      // Force change detection because Gemini async call might happen outside Angular zone
      this.cdr.detectChanges();
      this.scrollToBottom();
      
      // Initialize animations for new bot avatars after a tick
      setTimeout(() => this.initAvatarAnimations(), 0);
    });

    // Initialize Lottie animations after a slight delay to ensure containers are ready
    setTimeout(() => {
      this.initAnimations();
    }, 100);
  }

  private initAnimations() {
    if (this.triggerLottie) {
      this.triggerAnim = lottie.loadAnimation({
        container: this.triggerLottie.nativeElement,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'animations/chatbot.json'
      });
    }

    if (this.headerLottie) {
      this.headerAnim = lottie.loadAnimation({
        container: this.headerLottie.nativeElement,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'animations/chatbot.json'
      });
    }
  }

  private initAvatarAnimations() {
    if (!this.botAvatarLotties) return;

    this.botAvatarLotties.forEach((avatarRef, index) => {
      // Small optimization: only init if it hasn't been initialized (doesn't have children)
      if (avatarRef.nativeElement.children.length === 0) {
        const anim = lottie.loadAnimation({
          container: avatarRef.nativeElement,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: 'animations/chatbot.json'
        });
        this.avatarAnims.push(anim);
      }
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    } catch(err) { }
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.hasUnreadMessages = false;
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  sendMessage() {
    if (!this.userInput.trim()) return;
    
    this.chatbotService.addUserMessage(this.userInput);
    this.userInput = '';
  }

  viewProduct(productId: number) {
    console.log('🤖 Chatbot: Navigating to product detail', productId);
    this.router.navigate(['/products', productId]).then(success => {
      if (success) {
        console.log('✅ Navigation successful');
        if (window.innerWidth < 768) {
           this.isOpen = false; // Close chat window on mobile for better view
        }
      } else {
        console.error('❌ Navigation failed');
      }
    });
  }
}
