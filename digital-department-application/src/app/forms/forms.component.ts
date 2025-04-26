import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormComponent } from './reactive-form/reactive-form.component';
import { TemplateDrivenFormComponent } from './template-driven-form/template-driven-form.component';
import { Book } from '../models/book.model';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormComponent, TemplateDrivenFormComponent]
})
export class FormsComponent {
  reactiveBooks: Book[] = [];
  templateDrivenBooks: Book[] = [];
  
  onReactiveFormSubmit(book: Book) {
    // Добавляем ID для книги (в реальном приложении это бы делал бэкенд)
    const newBook: Book = {
      ...book,
      id: this.reactiveBooks.length + 1
    };
    
    this.reactiveBooks.push(newBook);
  }
  
  onTemplateDrivenFormSubmit(book: Book) {
    // Добавляем ID для книги
    const newBook: Book = {
      ...book,
      id: this.templateDrivenBooks.length + 1
    };
    
    this.templateDrivenBooks.push(newBook);
  }
}