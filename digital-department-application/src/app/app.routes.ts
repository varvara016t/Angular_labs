import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './details/details.component';
import { AboutComponent } from './about/about.component';
import { FormsComponent } from './forms/forms.component';
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
  // Редирект на главную страницу, если маршрут не найден
  { 
    path: '**', 
    redirectTo: '' 
  }
];