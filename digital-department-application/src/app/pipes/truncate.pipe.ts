import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  /**
   * Обрезает текст до указанной длины и добавляет многоточие
   * @param value Исходный текст
   * @param limit Максимальная длина (по умолчанию 50)
   * @param trail Строка, добавляемая в конце (по умолчанию '...')
   * @returns Обрезанный текст
   */
  transform(value: string, limit: number = 50, trail: string = '...'): string {
    if (!value) {
      return '';
    }

    if (value.length <= limit) {
      return value;
    }

    return value.substring(0, limit) + trail;
  }
}