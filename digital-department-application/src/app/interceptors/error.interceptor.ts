import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  
  constructor(private notificationService: NotificationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log(`HTTP запрос: ${request.method} ${request.url}`);
    
    return next.handle(request).pipe(
      // Обрабатываем ошибки HTTP
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        
        if (error.error instanceof ErrorEvent) {
          // Клиентская ошибка
          errorMessage = `Клиентская ошибка: ${error.error.message}`;
        } else {
          // Ошибка на стороне сервера
          errorMessage = `Серверная ошибка: ${error.status} ${error.statusText}`;
          if (error.error && error.error.message) {
            errorMessage += ` - ${error.error.message}`;
          }
        }
        
        // Отображаем уведомление об ошибке
        this.notificationService.showError(errorMessage);
        
        // Продолжаем цепочку с ошибкой
        return throwError(() => new Error(errorMessage));
      }),
      // Записываем в лог завершение запроса
      finalize(() => {
        console.log(`HTTP запрос завершен: ${request.method} ${request.url}`);
      })
    );
  }
}