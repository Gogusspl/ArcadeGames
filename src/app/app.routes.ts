import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () => import('@app/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('@app/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('@app/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'survival-games',
    loadComponent: () =>
      import('@app/games/survival-games/survival-games.component').then(m => m.SurvivalGamesComponent)
  }
];
