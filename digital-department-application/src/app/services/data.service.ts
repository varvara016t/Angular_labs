import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, retry, tap, map, shareReplay } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { HttpUtilsService } from './http-utils.service';

export interface DataItem {
  id: number;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'assets/data.json';
  private dataSubject = new BehaviorSubject<DataItem[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  // Публичные Observable для подписки компонентов
  public data$ = this.dataSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();
  
  // Кешированный результат для оптимизации
  private cachedData$?: Observable<DataItem[]>;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private httpUtils: HttpUtilsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Загружает данные из JSON-файла с использованием нашего безопасного HttpUtils
   */
  getData(): Observable<DataItem[]> {
    // Если данные уже были загружены, возвращаем кешированный результат
    if (this.cachedData$) {
      console.log('Возвращаем кешированные данные');
      return this.cachedData$;
    }

    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    
    console.log('Запрашиваем данные через HttpUtilsService');
    
    // Создаем и сохраняем Observable с кешированием результата
    // ВАЖНО: Используем httpUtils вместо http
    this.cachedData$ = this.httpUtils.get<DataItem[]>(this.apiUrl).pipe(
      retry(2), // Повторить запрос до 2 раз при ошибке
      map(data => {
        console.log('Получены данные:', data);
        return data.map(item => ({
          ...item,
          name: `${item.name} (обработано)` // Пример обработки данных
        }));
      }),
      tap(data => {
        console.log('Обработанные данные:', data);
        this.dataSubject.next(data);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        let errorMessage = '';
        
        if (error instanceof Error) {
          errorMessage = error.message;
        } else {
          errorMessage = 'Неизвестная ошибка';
        }
        
        console.error('Ошибка при загрузке данных:', errorMessage);
        this.errorSubject.next(errorMessage);
        this.loadingSubject.next(false);
        return throwError(() => new Error(errorMessage));
      }),
      shareReplay(1) // Кешируем результат для всех подписчиков
    );
    
    return this.cachedData$;
  }

  /**
   * Намеренно вызывает ошибку для демонстрации обработки ошибок
   */
  getDataWithError(): Observable<never> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    
    // Используем httpUtils для вызова ошибки
    return this.httpUtils.getWithError<never>().pipe(
      catchError(error => {
        let errorMessage = '';
        
        if (error instanceof Error) {
          errorMessage = error.message;
        } else {
          errorMessage = 'Неизвестная ошибка';
        }
        
        this.errorSubject.next(errorMessage);
        this.loadingSubject.next(false);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Очищает кеш и загружает данные заново
   */
  refreshData(): Observable<DataItem[]> {
    this.cachedData$ = undefined;
    return this.getData();
  }
}