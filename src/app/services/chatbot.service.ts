import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductService } from './product.service';
import { Product } from '../models/product.model';
import Groq from 'groq-sdk';

export interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  products?: Product[];
  isThinking?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();
  
  private chatHistory: ChatMessage[] = [];
  private allProducts: Product[] = [];

  // Groq AI Setup
  private groq: Groq;
  private readonly API_KEY: string = process.env['NG_APP_GROQ_API_KEY'] || ''; 

  constructor(
    private productService: ProductService
  ) {
    // Initialize Groq
    this.groq = new Groq({
      apiKey: this.API_KEY,
      dangerouslyAllowBrowser: true // Required for client-side usage
    });

    // Load products into memory for context
    this.productService.getProducts().subscribe(products => {
      this.allProducts = products;
      console.log('🤖 Chatbot: Loaded ' + products.length + ' products into context.');
    });

    // Add initial greeting
    this.addBotMessage('สวัสดีค่ะ! ฉันคือผู้ช่วย AI (Groq) ⚡\nยินดีต้อนรับสู่ Antigravity Shop ค่ะ สนใจสินค้าชิ้นไหนสอบถามได้เลย!');
  }

  getMessages(): Observable<ChatMessage[]> {
    return this.messagesSubject.asObservable();
  }

  async addUserMessage(text: string) {
    const message: ChatMessage = {
      text,
      sender: 'user',
      timestamp: new Date()
    };
    this.chatHistory.push(message);
    this.messagesSubject.next([...this.chatHistory]);
    
    // Trigger bot response
    await this.generateBotResponse(text);
  }

  private addBotMessage(text: string, products?: Product[]) {
    const message: ChatMessage = {
      text,
      sender: 'bot',
      timestamp: new Date(),
      products
    };
    this.chatHistory.push(message);
    this.messagesSubject.next([...this.chatHistory]);
  }

  private async generateBotResponse(userText: string) {
    // 1. Add "Thinking" State
    const thinkingMsg: ChatMessage = {
      text: '',
      sender: 'bot',
      timestamp: new Date(),
      isThinking: true
    };
    this.chatHistory.push(thinkingMsg);
    this.messagesSubject.next([...this.chatHistory]);

    try {
      // 2. Prepare Context (Include ALL products to allow AI to search semantically)
      // Sending up to 50 products is fine for Llama-3-70b (approx 1-2k tokens)
      let contextProducts = this.allProducts.slice(0, 50);

      const productContext = contextProducts.map(p => 
        `#${p.id}:${p.title}|$${p.price}|${p.category}`
      ).join('\n');

      const historyContext = this.chatHistory
        .filter(m => !m.isThinking)
        .slice(-3) // Reduced history to save tokens
        .map(m => `${m.sender === 'user' ? 'User' : 'Assistant'}: ${m.text}`)
        .join('\n');

      const systemPrompt = `Assistant for "Antigravity Shop". I HAVE ACCESS TO THESE PRODUCTS:
${productContext}

Chat History:
${historyContext}

Rules:
1. Respond in Thai using "ค่ะ" (Female polite particle).
2. You can recommend ANY item from the list above if it matches the user's request.
3. If user asks for something not in the list (like "cat food"), say "ไม่มี[item]ค่ะ" and Suggest available items (e.g. "เรามีน้ำหอม/เสื้อผ้าค่ะ").
4. Do NOT output raw data lines.
5. MUST end with [RECOM: id1, id2] if mentioning products.
6. Max 50 words.`;

      // 3. Call AI (Groq)
      let text = '';
      if (this.API_KEY && this.API_KEY !== 'YOUR_GROQ_API_KEY') {
        const completion = await this.groq.chat.completions.create({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userText }
          ],
          model: 'llama-3.3-70b-versatile', // Using a reliable Groq model
          temperature: 0.7,
          max_tokens: 150,
        });

        text = completion.choices[0]?.message?.content || '';
      } else {
        throw new Error('MISSING_API_KEY');
      }

      // 4. Parse recommended product IDs
      const recomMatch = text.match(/\[RECOM:\s*([^\]]+)\]/);
      let recommendedProducts: Product[] = [];
      
      if (recomMatch) {
         const ids = recomMatch[1].replace(/#/g, '').split(',').map((id: string) => parseInt(id.trim()));
         recommendedProducts = this.allProducts.filter(p => ids.includes(p.id));
         text = text.replace(/\[RECOM:.*\]/, '').trim();
      }

      // 5. Success
      this.removeThinkingMessage();
      this.addBotMessage(text, recommendedProducts.length > 0 ? recommendedProducts.slice(0, 4) : undefined);

    } catch (error: any) {
      console.error('❌ AI Error:', error);
      this.removeThinkingMessage();

      const errorMsg = error?.message || '';
      
      if (errorMsg === 'MISSING_API_KEY') {
        this.addBotMessage('⚠️ ไม่สามารถใช้งาน AI ได้เนื่องจากไม่ได้ตั้งค่า API Key\nกรุณาตั้งค่า NG_APP_GROQ_API_KEY ในไฟล์ .env');
      } else {
        this.useFallbackResponse(userText);
      }
    }
  }

  private removeThinkingMessage() {
    this.chatHistory = this.chatHistory.filter(m => !m.isThinking);
    this.messagesSubject.next([...this.chatHistory]);
  }

  private useFallbackResponse(userText: string) {
    const lowerText = userText.toLowerCase();
    if (lowerText.includes('สวัสดี') || lowerText.includes('hi')) {
       this.addBotMessage('สวัสดีครับ ผมเป็นผู้ช่วยใน Shop ครับ');
    } else {
       this.addBotMessage('ขออภัยครับ ระบบประมวลผลขัดข้องเล็กน้อย ลองถามใหม่อีกครั้งนะครับ');
    }
  }

  /**
   * Analyze product using Groq
   */
  async analyzeProduct(product: Product): Promise<string> {
    const prompt = `
      คุณคือผู้เชี่ยวชาญด้านการวิเคราะห์สินค้า 
      จงสรุปข้อมูลสินค้าต่อไปนี้ให้น่าสนใจ โดยประกอบด้วย:
      1. จุดเด่นสั้นๆ (Highlight)
      2. เหมาะกับใคร (Target User)
      3. ทำไมถึงควรซื้อ (Verdict)
      
      ข้อมูลสินค้า:
      ชื่อ: ${product.title}
      หมวดหมู่: ${product.category}
      ราคา: $${product.price}
      รายละเอียด: ${product.description}
      
      คำอธิบายต้องสั้น กระชับ และเป็นภาษาไทยที่พรีเมียม (ไม่เกิน 60 คำ)
    `;

    try {
      console.log('⚡ Using Groq for product analysis...');
      const completion = await this.groq.chat.completions.create({
          messages: [
            { role: 'user', content: prompt }
          ],
          model: 'llama-3.3-70b-versatile',
          temperature: 0.7,
      });
      return completion.choices[0]?.message?.content || 'ไม่สามารถวิเคราะห์ข้อมูลได้';
    } catch (error) {
      console.error('❌ AI Analysis Error:', error);
      return 'ขออภัยครับ ไม่สามารถวิเคราะห์ข้อมูลสินค้าได้ในขณะนี้';
    }
  }
}

