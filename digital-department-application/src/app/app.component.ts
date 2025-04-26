import { Component } from '@angular/core';
import { GreetingComponent } from './greeting/greeting.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, GreetingComponent],
  standalone: true
})
export class AppComponent {
  title = 'digital-department-application';
  parentMessage = 'Данные от родительского компонента';
  
  updateParentMessage() {
    this.parentMessage = 'Обновленные данные от родителя: ' + new Date().toLocaleTimeString();
  }
}