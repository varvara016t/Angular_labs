import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../services/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class NavComponent implements OnInit {
  isDarkMode$!: Observable<boolean>;
  
  constructor(private themeService: ThemeService) {}
  
  ngOnInit(): void {
    // Инициализируем после создания компонента
    this.isDarkMode$ = this.themeService.isDarkMode$;
  }
  
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}