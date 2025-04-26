import { inject } from '@angular/core';
import { HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const notificationService = inject(NotificationService);
  console.log(`HTTP запрос: ${req.method} ${req.url}`);
  
  return next(req).pipe(
    catchError((error: unknown) => {
      // Проверяем, является ли ошибка экземпляром HttpErrorResponse
      if (!(error instanceof HttpErrorResponse)) {
        const genericError = 'Произошла неизвестная ошибка';
        notificationService.showError(genericError);
        return throwError(() => new Error(genericError));
      }
      
      // Теперь мы уверены, что ошибка - это HttpErrorResponse
      const httpError = error as HttpErrorResponse;
      let errorMessage = '';
      
      // Проверяем, является ли это клиентской ошибкой
      if (httpError.error instanceof ErrorEvent) {
        // Клиентская ошибка (например, отсутствие сети)
        errorMessage = `Клиентская ошибка: ${httpError.error.message}`;
      } 
      // Проверяем, является ли это серверной ошибкой (статус >= 400)
      else if (httpError.status >= 400) {
        errorMessage = `Серверная ошибка: ${httpError.status} ${httpError.statusText}`;
        if (httpError.error && typeof httpError.error.message === 'string') {
          errorMessage += ` - ${httpError.error.message}`;
        }
      } 
      // Если это не ошибка клиента и не ошибка сервера (например, код 200),
      // это необычное поведение, которое не должно происходить
      else {
        console.warn('Успешный HTTP ответ попал в обработчик ошибок:', httpError);
        errorMessage = `Необычная ситуация: успешный HTTP ответ (${httpError.status}) обрабатывается как ошибка`;
      }
      
      // Отображаем уведомление об ошибке
      if (errorMessage) {
        notificationService.showError(errorMessage);
      }
      
      // Продолжаем цепочку с ошибкой
      return throwError(() => new Error(errorMessage || 'Неизвестная ошибка'));
    }),
    finalize(() => {
      console.log(`HTTP запрос завершен: ${req.method} ${req.url}`);
    })
  );
};