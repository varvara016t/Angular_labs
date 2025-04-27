// src/app/services/task.service.ts

import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task, TaskType, TaskPriority, TaskStatus } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [];
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private isBrowser: boolean;
  
  // Expose tasks as an Observable for components to subscribe
  tasks$ = this.tasksSubject.asObservable();
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    if (this.isBrowser) {
      // Initialize with some demo tasks if localStorage is empty
      const storedTasks = localStorage.getItem('tasks');
      if (storedTasks) {
        this.tasks = JSON.parse(storedTasks, (key, value) => {
          // Convert string dates back to Date objects
          if (key === 'createdAt' || key === 'updatedAt') {
            return new Date(value);
          }
          return value;
        });
      } else {
        // Add some demo tasks
        this.addTask({
          type: 'bug',
          status: 'new',
          title: 'Fix navigation menu',
          description: 'Menu doesn\'t work correctly on mobile devices',
          priority: 'high',
          creator: 'Admin',
        });
        this.addTask({
          type: 'task',
          status: 'in progress',
          title: 'Implement user authentication',
          priority: 'critical',
          creator: 'Admin',
          assignee: 'John Doe',
        });
      }
    } else {
      // For SSR, add minimal demo data without using localStorage
      this.tasks = [
        {
          id: 1,
          type: 'bug',
          status: 'new',
          title: 'Fix navigation menu',
          description: 'Menu doesn\'t work correctly on mobile devices',
          priority: 'high',
          creator: 'Admin',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          type: 'task',
          status: 'in progress',
          title: 'Implement user authentication',
          priority: 'critical',
          creator: 'Admin',
          assignee: 'John Doe',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
    }
    
    // Update the BehaviorSubject with initial tasks
    this.tasksSubject.next([...this.tasks]);
  }
  
  // Get all tasks
  getTasks(): Task[] {
    return [...this.tasks];
  }
  
  // Get task by ID
  getTaskById(id: number): Task | undefined {
    return this.tasks.find(task => task.id === id);
  }
  
  // Add a new task
  addTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const now = new Date();
    const newTask: Task = {
      ...taskData,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now
    };
    
    this.tasks.push(newTask);
    this.updateTasks();
    return newTask;
  }
  
  // Update an existing task
  updateTask(id: number, taskData: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>): Task | null {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return null;
    }
    
    // Update the task with new data
    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      ...taskData,
      updatedAt: new Date()
    };
    
    this.updateTasks();
    return this.tasks[taskIndex];
  }
  
  // Delete a task
  deleteTask(id: number): boolean {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter(task => task.id !== id);
    
    if (this.tasks.length !== initialLength) {
      this.updateTasks();
      return true;
    }
    
    return false;
  }
  
  // Helper method to generate a unique ID
  private generateId(): number {
    return this.tasks.length > 0 
      ? Math.max(...this.tasks.map(task => task.id)) + 1 
      : 1;
  }
  
  // Helper method to update the tasks in localStorage and notify subscribers
  private updateTasks(): void {
    // Sort tasks by ID in descending order (newest first)
    this.tasks.sort((a, b) => b.id - a.id);
    
    // Save to localStorage if in browser environment
    if (this.isBrowser) {
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
    
    // Notify subscribers
    this.tasksSubject.next([...this.tasks]);
  }
}