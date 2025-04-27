// src/app/models/task.model.ts

export type TaskType = 'bug' | 'task';
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';
export type TaskStatus = 'new' | 'in progress' | 'testing' | 'done';

export interface Task {
  id: number;           // генерируется автоматически*
  type: TaskType;       // bug или task*
  priority?: TaskPriority; // critical/high/medium/low (необязательно)
  status: TaskStatus;   // Статус*
  title: string;        // Заголовок*
  description?: string; // Описание (необязательно)
  assignee?: string;    // Исполнитель (необязательно)
  creator: string;      // Создатель*
  createdAt: Date;      // Дата и время создания (генерируется автоматически)*
  updatedAt: Date;      // Дата и время последнего изменения (генерируется автоматически)*
}