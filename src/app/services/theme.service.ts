import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<string>('light');
  theme$ = this.themeSubject.asObservable();

  constructor() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.setTheme('dark');
    }
  }

  toggleTheme() {
    const current = this.themeSubject.value;
    this.setTheme(current === 'light' ? 'dark' : 'light');
  }

  private setTheme(theme: string) {
    this.themeSubject.next(theme);
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}
