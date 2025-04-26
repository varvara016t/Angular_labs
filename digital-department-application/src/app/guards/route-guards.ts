import { inject } from '@angular/core';
import { CanActivateFn, CanDeactivateFn, Router } from '@angular/router';
import { AboutComponent } from '../about/about.component';

// Guard для защиты входа на страницу Details
export const canActivateDetails: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const confirmed = window.confirm('Вы уверены, что хотите перейти на страницу Details?');
  
  if (confirmed) {
    return true;
  } else {
    // Если пользователь отказался, возвращаемся на предыдущую страницу
    return router.parseUrl('/');
  }
};

// Guard для защиты выхода со страницы About
export const canDeactivateAbout: CanDeactivateFn<AboutComponent> = (component, currentRoute, currentState, nextState) => {
  // Если компонент разрешает выход, просто возвращаем true
  if (component.canLeave) {
    return true;
  }
  
  // Если не разрешает, просим подтверждение
  return window.confirm('У вас есть несохраненные изменения. Вы уверены, что хотите покинуть страницу?');
};