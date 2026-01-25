import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar si el usuario está logueado
  const isLoggedIn = await authService.isLoggedIn();

  if (isLoggedIn) {
    // Si está logueado, permite el acceso
    console.log(' Usuario autenticado, permitiendo acceso');
    return true;
  } else {
    // Si no está logueado, redirige a /login
    console.log(' Usuario no autenticado, redirigiendo a /login');
    router.navigate(['/login']);
    return false;
  }
};