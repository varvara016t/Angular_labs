import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItalicDirective } from '../directives/italic.directive';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  standalone: true,
  imports: [CommonModule, ItalicDirective]
})
export class AboutComponent {
  canLeave: boolean = true;

  toggleCanLeave() {
    this.canLeave = !this.canLeave;
  }
}