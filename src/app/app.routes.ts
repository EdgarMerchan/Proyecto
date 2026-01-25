// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { introGuard } from './guards/intro-guard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'intro',
    loadComponent: () => import('./intro/intro.page').then(m => m.IntroPage),
    canActivate: [authGuard] // Necesito estar logueado
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate: [authGuard, introGuard] // Necesito el login Y haber visto la intro
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  }
];
