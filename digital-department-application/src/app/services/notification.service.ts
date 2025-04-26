import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  
  notifications$ = this.notificationSubject.asObservable();
  
  constructor() { }
  
  showSuccess(message: string) {
    this.notify(message, 'success');
  }
  
  showError(message: string) {
    this.notify(message, 'error');
  }
  
  showInfo(message: string) {
    this.notify(message, 'info');
  }
  
  showWarning(message: string) {
    this.notify(message, 'warning');
  }
  
  private notify(message: string, type: 'success' | 'error' | 'info' | 'warning') {
    this.notificationSubject.next({ message, type });
  }
}