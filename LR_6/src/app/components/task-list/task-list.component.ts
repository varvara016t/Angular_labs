// src/app/components/task-list/task-list.component.ts

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task, TaskType, TaskStatus, TaskPriority } from '../../models/task.model';
import { TaskFilterPipe } from '../../pipes/task-filter.pipe';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskFilterPipe],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  selectedTask: Task | null = null;
  
  // Add output event emitter for task selection
  @Output() taskSelected = new EventEmitter<Task>();
  
  // Filter properties
  searchTerm: string = '';
  typeFilter: TaskType | '' = '';
  statusFilter: TaskStatus | '' = '';
  priorityFilter: TaskPriority | '' = '';
  
  // Available options for dropdowns
  taskTypes: TaskType[] = ['bug', 'task'];
  taskStatuses: TaskStatus[] = ['new', 'in progress', 'testing', 'done'];
  taskPriorities: TaskPriority[] = ['critical', 'high', 'medium', 'low'];
  
  constructor(private taskService: TaskService) {}
  
  ngOnInit(): void {
    // Subscribe to tasks from the service
    this.taskService.tasks$.subscribe(tasks => {
      this.tasks = tasks;
    });
  }
  
  get filters() {
    return {
      search: this.searchTerm,
      type: this.typeFilter || undefined,
      status: this.statusFilter || undefined,
      priority: this.priorityFilter || undefined
    };
  }
  
  // Select a task to view/edit
  selectTask(task: Task): void {
    this.selectedTask = { ...task };
    this.taskSelected.emit(task);
  }
  
  // Clear all filters
  clearFilters(): void {
    this.searchTerm = '';
    this.typeFilter = '';
    this.statusFilter = '';
    this.priorityFilter = '';
  }
  
  // Delete a task
  deleteTask(id: number, event: Event): void {
    event.stopPropagation(); // Prevent row click event
    
    if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
      this.taskService.deleteTask(id);
      if (this.selectedTask && this.selectedTask.id === id) {
        this.selectedTask = null;
      }
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
}