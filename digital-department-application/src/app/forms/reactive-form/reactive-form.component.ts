import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Book } from '../../models/book.model';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ReactiveFormComponent {
  @Output() formSubmit = new EventEmitter<Book>();
  
  bookForm: FormGroup;
  genreOptions = ['Фантастика', 'Детектив', 'Роман', 'Научно-популярная', 'Историческая'];
  submitted = false;
  
  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.bookForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      year: ['', [Validators.required, Validators.min(1800), Validators.max(new Date().getFullYear())]],
      genre: ['', Validators.required],
      rating: [5, [Validators.required, Validators.min(1), Validators.max(10)]]
    });
  }
  
  // Геттеры для более простого доступа к полям формы
  get title() { return this.bookForm.get('title'); }
  get author() { return this.bookForm.get('author'); }
  get year() { return this.bookForm.get('year'); }
  get genre() { return this.bookForm.get('genre'); }
  get rating() { return this.bookForm.get('rating'); }
  
  onSubmit() {
    this.submitted = true;
    
    // Проверяем форму на валидность
    if (this.bookForm.invalid) {
      this.notificationService.showError('Форма содержит ошибки. Пожалуйста, исправьте их.');
      return;
    }
    
    // Отправляем данные в родительский компонент
    this.formSubmit.emit(this.bookForm.value);
    
    // Показываем уведомление
    this.notificationService.showSuccess('Книга успешно добавлена!');
    
    // Сбрасываем форму
    this.bookForm.reset({
      title: '',
      author: '',
      year: '',
      genre: '',
      rating: 5
    });
    this.submitted = false;
  }
}