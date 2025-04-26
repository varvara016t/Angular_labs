import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './details/details.component';
import { AboutComponent } from './about/about.component';
import { FormsComponent } from './forms/forms.component';
import { ErrorTestComponent } from './error-test/error-test.component';
import { canActivateDetails, canDeactivateAbout } from './guards/route-guards';

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent 
  },
  { 
    path: 'details/:id', 
    component: DetailsComponent,
    canActivate: [canActivateDetails]
  },
  { 
    path: 'about', 
    component: AboutComponent,
    canDeactivate: [canDeactivateAbout]
  },
  {
    path: 'forms',
    component: FormsComponent
  },
  {
    path: 'error-test',
    component: ErrorTestComponent
  },
  // Исключение для папки assets - не применять маршрутизацию
  {
    path: 'assets/**',
    pathMatch: 'full',
    children: [] // или component: null
  },
  // Редирект на главную страницу, если маршрут не найден
  { 
    path: '**', 
    redirectTo: '' 
  }
];