import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ItalicDirective } from '../directives/italic.directive';
import { DataService, DataItem } from '../services/data.service';
import { TruncatePipe } from '../pipes/truncate.pipe';
import { Observable } from 'rxjs';
import { HttpUtilsService } from '../services/http-utils.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  standalone: true,
  imports: [CommonModule, ItalicDirective, TruncatePipe]
})
export class DetailsComponent implements OnInit {
  id: string | null = null;
  data$!: Observable<DataItem[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;
  
  // Параметры для pipe
  truncateLength: number = 20;
  truncateSuffix: string = '[обрезано]';
  
  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private httpUtils: HttpUtilsService
  ) {}

  ngOnInit(): void {
    // Получаем параметр из URL
    this.id = this.route.snapshot.paramMap.get('id');
    
    // Получаем данные из сервиса через Observable
    this.data$ = this.dataService.data$;
    this.loading$ = this.dataService.loading$;
    this.error$ = this.dataService.error$;
    
    // Загружаем данные через обновленный сервис
    this.refreshData();
  }
  
  // Метод для обновления данных
  refreshData(): void {
    this.dataService.refreshData().subscribe({
      error: (err) => console.log('Ошибка в компоненте:', err)
    });
  }
  
  // Метод для демонстрации ошибки
  testError(): void {
    this.dataService.getDataWithError().subscribe({
      error: () => {} // Ошибка будет обработана в сервисе
    });
  }
  
  // Изменение параметров pipe
  increaseTruncateLength(): void {
    this.truncateLength += 10;
  }
  
  decreaseTruncateLength(): void {
    if (this.truncateLength > 10) {
      this.truncateLength -= 10;
    }
  }
  
  changeTruncateSuffix(): void {
    this.truncateSuffix = this.truncateSuffix === '[обрезано]' ? '...' : '[обрезано]';
  }
}