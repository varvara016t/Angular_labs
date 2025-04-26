import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Book } from '../../models/book.model';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-template-driven-form',
  templateUrl: './template-driven-form.component.html',
  styleUrls: ['./template-driven-form.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TemplateDrivenFormComponent {
  @Output() formSubmit = new EventEmitter<Book>();
  
  genreOptions = ['Фантастика', 'Детектив', 'Роман', 'Научно-популярная', 'Историческая'];
  
  book: Book = {
    title: '',
    author: '',
    year: new Date().getFullYear(),
    genre: '',
    rating: 5
  };
  
  submitted = false;
  
  constructor(private notificationService: NotificationService) {}
  
  onSubmit(form: any) {
    this.submitted = true;
    
    if (form.invalid) {
      this.notificationService.showWarning('Форма содержит ошибки. Пожалуйста, исправьте их.');
      return;
    }
    
    // Отправляем данные в родительский компонент
    this.formSubmit.emit({...this.book});
    
    // Показываем уведомление об успешном добавлении
    this.notificationService.showSuccess('Книга успешно добавлена!');
    
    // Сбрасываем форму
    this.book = {
      title: '',
      author: '',
      year: new Date().getFullYear(),
      genre: '',
      rating: 5
    };
    
    form.resetForm();
    this.submitted = false;
  }
}