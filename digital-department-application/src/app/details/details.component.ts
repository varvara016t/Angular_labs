import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ItalicDirective } from '../directives/italic.directive';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  standalone: true,
  imports: [CommonModule, ItalicDirective]
})
export class DetailsComponent implements OnInit {
  id: string | null = null;
  data: any[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    // Получаем параметр из URL
    this.id = this.route.snapshot.paramMap.get('id');
    
    // Получаем данные из сервиса
    this.dataService.getData().subscribe(
      (result) => {
        this.data = result;
      },
      (error) => {
        console.error('Ошибка при загрузке данных:', error);
      }
    );
  }
}