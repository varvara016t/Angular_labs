// src/app/pipes/task-filter.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';
import { Task, TaskType, TaskStatus, TaskPriority } from '../models/task.model';

@Pipe({
  name: 'taskFilter',
  standalone: true
})
export class TaskFilterPipe implements PipeTransform {
  transform(tasks: Task[], filters: {
    search?: string,
    type?: TaskType,
    status?: TaskStatus,
    priority?: TaskPriority
  }): Task[] {
    if (!tasks) return [];
    if (!filters) return tasks;
    
    return tasks.filter(task => {
      // Apply search filter (title, description, creator, assignee)
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchFields = [
          task.title.toLowerCase(),
          task.description?.toLowerCase() || '',
          task.creator.toLowerCase(),
          task.assignee?.toLowerCase() || ''
        ];
        
        if (!searchFields.some(field => field.includes(searchTerm))) {
          return false;
        }
      }
      
      // Apply type filter
      if (filters.type && task.type !== filters.type) {
        return false;
      }
      
      // Apply status filter
      if (filters.status && task.status !== filters.status) {
        return false;
      }
      
      // Apply priority filter
      if (filters.priority && task.priority !== filters.priority) {
        return false;
      }
      
      return true;
    });
  }
}