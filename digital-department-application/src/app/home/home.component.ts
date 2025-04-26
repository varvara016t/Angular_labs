import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigateToDetails() {
    // Используем navigate для перехода на страницу с параметром
    this.router.navigate(['/details', 123]);
  }

  navigateToAbout() {
    // Используем navigateByUrl для перехода на страницу about
    this.router.navigateByUrl('/about');
  }
}