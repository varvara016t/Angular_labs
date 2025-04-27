// src/app/components/task-details/task-details.component.ts

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskType, TaskStatus, TaskPriority } from '../../models/task.model';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent {
  @Input() task: Task | null = null;
  @Output() edit = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  
  constructor() {}
  
  // Translate type to human-readable format
  getTypeLabel(type: TaskType): string {
    return type === 'bug' ? 'Ошибка' : 'Задача';
  }
  
  // Translate priority to human-readable format
  getPriorityLabel(priority?: TaskPriority): string {
    if (!priority) return 'Не указан';
    
    switch (priority) {
      case 'critical': return 'Критический';
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return 'Не указан';
    }
  }
  
  // Translate status to human-readable format
  getStatusLabel(status: TaskStatus): string {
    switch (status) {
      case 'new': return 'Новая';
      case 'in progress': return 'В работе';
      case 'testing': return 'Тестирование';
      case 'done': return 'Готово';
      default: return status;
    }
  }
  
  // Format date for display
  formatDate(date: Date): string {
    return new Date(date).toLocaleString('ru-RU');
  }
  
  // Get CSS class for task priority
  getPriorityClass(priority?: TaskPriority): string {
    if (!priority) return '';
    
    switch (priority) {
      case 'critical': return 'priority-critical';
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  }
  
  // Get CSS class for task status
  getStatusClass(status: TaskStatus): string {
    switch (status) {
      case 'new': return 'status-new';
      case 'in progress': return 'status-in-progress';
      case 'testing': return 'status-testing';
      case 'done': return 'status-done';
      default: return '';
    }
  }
  
  // Handle edit button click
  onEdit(): void {
    this.edit.emit();
  }
  
  // Handle close button click
  onClose(): void {
    this.close.emit();
  }
}