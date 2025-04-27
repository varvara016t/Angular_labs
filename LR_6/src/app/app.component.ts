// src/app/app.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskDetailsComponent } from './components/task-details/task-details.component';
import { Task } from './models/task.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TaskListComponent, TaskFormComponent, TaskDetailsComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Трекер задач';
  
  selectedTask: Task | null = null;
  isFormVisible: boolean = false;
  isEditMode: boolean = false;
  
  // Select task to view details
  onTaskSelect(task: Task): void {
    this.selectedTask = task;
    this.isFormVisible = false;
  }
  
  // Open form to add a new task
  onAddTask(): void {
    this.selectedTask = null;
    this.isFormVisible = true;
    this.isEditMode = false;
  }
  
  // Open form to edit a task
  onEditTask(): void {
    this.isFormVisible = true;
    this.isEditMode = true;
  }
  
  // Handle task saved event
  onTaskSaved(task: Task): void {
    this.selectedTask = task;
    this.isFormVisible = false;
  }
  
  // Handle form closed event
  onFormClosed(): void {
    this.isFormVisible = false;
    if (!this.isEditMode) {
      this.selectedTask = null;
    }
  }
  
  // Handle details closed event
  onDetailsClosed(): void {
    this.selectedTask = null;
  }
}