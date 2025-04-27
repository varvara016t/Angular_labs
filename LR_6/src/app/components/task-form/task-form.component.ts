// src/app/components/task-form/task-form.component.ts

import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TaskType, TaskStatus, TaskPriority } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  @Input() task: Task | null = null;
  @Output() taskSaved = new EventEmitter<Task>();
  @Output() formClosed = new EventEmitter<void>();
  
  editMode: boolean = false;
  formTitle: string = 'Добавить задачу';
  
  // Form model
  formData: {
    type: TaskType;
    priority?: TaskPriority;
    status: TaskStatus;
    title: string;
    description?: string;
    assignee?: string;
    creator: string;
  } = {
    type: 'task',
    status: 'new',
    title: '',
    creator: ''
  };
  
  // Available options for dropdowns
  taskTypes: TaskType[] = ['bug', 'task'];
  taskStatuses: TaskStatus[] = ['new', 'in progress', 'testing', 'done'];
  taskPriorities: TaskPriority[] = ['critical', 'high', 'medium', 'low'];
  
  constructor(private taskService: TaskService) {}
  
  ngOnInit(): void {
    this.initializeForm();
  }
  
  // When the input task changes
  ngOnChanges(): void {
    this.initializeForm();
  }
  
  initializeForm(): void {
    if (this.task) {
      // Edit mode
      this.editMode = true;
      this.formTitle = 'Редактировать задачу';
      this.formData = {
        type: this.task.type,
        priority: this.task.priority,
        status: this.task.status,
        title: this.task.title,
        description: this.task.description,
        assignee: this.task.assignee,
        creator: this.task.creator
      };
    } else {
      // Add mode
      this.editMode = false;
      this.formTitle = 'Добавить задачу';
      this.formData = {
        type: 'task',
        status: 'new',
        title: '',
        creator: ''
      };
    }
  }
  
  // Submit the form
  onSubmit(): void {
    if (this.validateForm()) {
      let result: Task | null;
      
      if (this.editMode && this.task) {
        // Update existing task
        result = this.taskService.updateTask(this.task.id, this.formData);
      } else {
        // Add new task
        result = this.taskService.addTask(this.formData);
      }
      
      if (result) {
        this.taskSaved.emit(result);
        this.resetForm();
      }
    }
  }
  
  // Validate form before submission
  validateForm(): boolean {
    // Check required fields
    if (!this.formData.type || !this.formData.status || !this.formData.title || !this.formData.creator) {
      alert('Пожалуйста, заполните все обязательные поля (*)');
      return false;
    }
    
    return true;
  }
  
  // Reset the form
  resetForm(): void {
    if (!this.editMode) {
      this.formData = {
        type: 'task',
        status: 'new',
        title: '',
        creator: ''
      };
    }
  }
  
  // Cancel and close the form
  cancel(): void {
    this.formClosed.emit();
  }
}