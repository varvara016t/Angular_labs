import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../services/data.service';
import { HttpUtilsService } from '../services/http-utils.service';

@Component({
  selector: 'app-error-test',
  template: `
    <div class="error-test-container">
      <h2>Тестирование обработки ошибок</h2>
      <div class="button-group">
        <button (click)="testValidRequest()" class="btn">Запрос к существующему файлу</button>
        <button (click)="testInvalidRequest()" class="btn btn-danger">Запрос к несуществующему файлу</button>
        <button (click)="testDataService()" class="btn btn-warning">Тест через DataService</button>
        <button (click)="testDirectFetch()" class="btn btn-info">Прямой Fetch API</button>
      </div>
      
      <div *ngIf="loading" class="loading-indicator">
        <div class="spinner"></div>
        <p>Загрузка данных...</p>
      </div>
      
      <div *ngIf="error" class="error-message">
        <h3>Произошла ошибка:</h3>
        <p>{{ error }}</p>
      </div>
      
      <div *ngIf="response" class="response-preview">
        <h3>Ответ сервера:</h3>
        <pre>{{ response | json }}</pre>
      </div>
    </div>
  `,
  styles: [`
    .error-test-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .button-group {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    
    .btn {
      padding: 10px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      color: white;
      background-color: #1976d2;
    }
    
    .btn-danger {
      background-color: #d32f2f;
    }
    
    .btn-warning {
      background-color: #f57c00;
    }
    
    .btn-info {
      background-color: #0288d1;
    }
    
    .loading-indicator {
      display: flex;
      align-items: center;
      margin: 20px 0;
    }
    
    .spinner {
      width: 30px;
      height: 30px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid #1976d2;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-right: 10px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .error-message {
      padding: 15px;
      background-color: #ffebee;
      border-left: 4px solid #d32f2f;
      margin: 20px 0;
    }
    
    .response-preview {
      padding: 15px;
      background-color: #e8f5e9;
      border-left: 4px solid #4caf50;
      margin: 20px 0;
      overflow: auto;
    }
    
    pre {
      margin: 0;
      white-space: pre-wrap;
    }
  `],
  standalone: true,
  imports: [CommonModule]
})
export class ErrorTestComponent {
  loading = false;
  error: string | null = null;
  response: any = null;

  constructor(
    private dataService: DataService,
    private httpUtils: HttpUtilsService
  ) {}

  testValidRequest() {
    this.resetState();
    this.loading = true;
    
    // Используем корректный путь к JSON файлу
    this.httpUtils.get('assets/data.json').subscribe({
      next: (data) => {
        this.response = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  testInvalidRequest() {
    this.resetState();
    this.loading = true;
    
    // Запрос к несуществующему файлу через наш HttpUtilsService
    this.httpUtils.get(`assets/non-existent-${Date.now()}.json`).subscribe({
      next: (data) => {
        this.response = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  testDataService() {
    this.resetState();
    this.loading = true;
    
    // Использование обновленного DataService
    this.dataService.getDataWithError().subscribe({
      next: (data) => {
        this.response = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  testDirectFetch() {
    this.resetState();
    this.loading = true;
    
    // Корректный путь к JSON файлу для fetch
    const url = 'assets/data.json';
    
    console.log('Выполняем прямой fetch запрос к:', url);
    
    // Прямое использование fetch API
    fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      this.response = data;
      this.loading = false;
    })
    .catch(error => {
      this.error = `Прямой fetch: ${error.message}`;
      this.loading = false;
    });
  }

  

  private resetState() {
    this.loading = false;
    this.error = null;
    this.response = null;
  }
}