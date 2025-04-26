import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { errorInterceptor } from './interceptors/error.interceptor.fn';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    // Оставляем HttpClient для совместимости, но в критических местах будем использовать HttpUtilsService
    provideHttpClient(withInterceptors([errorInterceptor]))
  ]
};