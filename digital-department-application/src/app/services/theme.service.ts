import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkMode = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.isDarkMode.asObservable();
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    if (this.isBrowser) {
      // Проверяем сохраненные настройки темы только в браузере
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        this.isDarkMode.next(savedTheme === 'dark');
        this.applyTheme(savedTheme === 'dark');
      } else {
        // Проверяем системные настройки
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.isDarkMode.next(prefersDark);
        this.applyTheme(prefersDark);
      }
    }
  }

  toggleTheme(): void {
    const newMode = !this.isDarkMode.value;
    this.isDarkMode.next(newMode);
    
    if (this.isBrowser) {
      // Сохраняем настройки только в браузере
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      
      // Применяем тему
      this.applyTheme(newMode);
    }
  }
  
  private applyTheme(isDark: boolean): void {
    if (this.isBrowser) {
      if (isDark) {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    }
  }
}