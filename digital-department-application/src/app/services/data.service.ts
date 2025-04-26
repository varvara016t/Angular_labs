import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // В реальном приложении здесь был бы запрос к файлу assets/data.json
  // Но для демонстрации используем локальные данные
  private dummyData = [
    { id: 1, name: 'Элемент 1', description: 'Описание первого элемента' },
    { id: 2, name: 'Элемент 2', description: 'Описание второго элемента' },
    { id: 3, name: 'Элемент 3', description: 'Описание третьего элемента' }
  ];

  constructor(private http: HttpClient) {}

  getData(): Observable<any[]> {
    // В реальном приложении: return this.http.get<any[]>('assets/data.json');
    return of(this.dummyData);
  }
}