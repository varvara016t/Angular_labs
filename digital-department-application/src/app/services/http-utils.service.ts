import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Утилитный сервис для HTTP-запросов, который обходит Angular HttpClient
 * и использует нативный fetch API для предотвращения проблем с интерцепторами
 */
@Injectable({
  providedIn: 'root'
})
export class HttpUtilsService {

  /**
   * Выполняет GET-запрос и возвращает результат как Observable
   */
  get<T>(url: string, options: RequestInit = {}): Observable<T> {
    return new Observable<T>(observer => {
      // Проверка и коррекция URL
      let validatedUrl = url;
      if (!validatedUrl.startsWith('http') && !validatedUrl.startsWith('/')) {
        validatedUrl = '/' + validatedUrl;
      }
      
      console.log(`GET запрос к: ${validatedUrl}`);
      
      this.fetchJson<T>(validatedUrl, { ...options, method: 'GET' })
        .then(data => {
          observer.next(data);
          observer.complete();
        })
        .catch(err => {
          observer.error(err);
        });
    });
  }

  /**
   * Выполняет POST-запрос и возвращает результат как Observable
   */
  post<T>(url: string, body: any, options: RequestInit = {}): Observable<T> {
    return new Observable<T>(observer => {
      this.fetchJson<T>(url, {
        ...options,
        method: 'POST',
        body: JSON.stringify(body)
      })
        .then(data => {
          observer.next(data);
          observer.complete();
        })
        .catch(err => {
          observer.error(err);
        });
    });
  }

  /**
   * Намеренно вызывает ошибку для тестирования обработки ошибок
   */
  getWithError<T>(url: string = 'non-existent-resource'): Observable<T> {
    return new Observable<T>(observer => {
      // Добавляем случайный параметр для предотвращения кеширования
      const nonExistentUrl = `${url}-${Date.now()}.json`;
      
      // Для тестовой ошибки используем относительный URL
      let validatedUrl = nonExistentUrl;
      if (!validatedUrl.startsWith('http') && !validatedUrl.startsWith('/')) {
        validatedUrl = '/' + validatedUrl;
      }
      
      console.log(`Запрос с ожидаемой ошибкой к: ${validatedUrl}`);
      
      this.fetchJson<T>(validatedUrl)
        .then(() => {
          // Этот блок не должен выполняться, но если выполнится,
          // мы все равно вызовем ошибку
          observer.error(new Error('Ожидалась ошибка, но получен успешный ответ'));
        })
        .catch(err => {
          observer.error(err);
        });
    });
  }

  /**
   * Выполняет fetch с дополнительными проверками на тип ответа
   */
  private async fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
    try {
      // Проверка, начинается ли URL с http или /
      const validatedUrl = url.startsWith('http') || url.startsWith('/') 
        ? url 
        : `/${url}`;

      // Подготавливаем опции по умолчанию
      const fetchOptions: RequestInit = {
        ...options,
        // Устанавливаем заголовки
        headers: {
          'Accept': 'application/json',
          ...(options.headers || {}),
        },
        // Изменили с 'error' на 'follow', чтобы разрешить перенаправления
        redirect: 'follow'
      };

      console.log(`Выполняем fetch запрос к: ${validatedUrl}`);

      // Выполняем запрос
      const response = await fetch(validatedUrl, fetchOptions);

      // Проверяем статус ответа
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Проверяем тип контента
      const contentType = response.headers.get('content-type');
      
      // Если contentType не указан или не содержит application/json
      if (!contentType || !contentType.includes('application/json')) {
        // Получаем текстовое содержимое
        const text = await response.text();
        
        // Проверяем, начинается ли текст с HTML-тегов
        if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
          throw new Error('Получен HTML вместо JSON');
        }

        // Пробуем распарсить как JSON
        try {
          return JSON.parse(text) as T;
        } catch (e) {
          throw new Error(`Некорректный JSON: ${e}`);
        }
      } else {
        // Если заголовок правильный, читаем как JSON
        return await response.json() as T;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
}