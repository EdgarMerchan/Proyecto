import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

export const introGuard: CanActivateFn = async (route, state) => {
  const storageService = inject(StorageService);
  const router = inject(Router);

  // Verificar si el usuario ya vio la intro
  const introVista = await storageService.get('introVista');

  if (introVista) {
    // Si ya vio la intro, permite el acceso
    console.log(' Usuario ya vio la intro, permitiendo acceso al home');
    return true;
  } else {
    // Si NO vio la intro, redirige a /intro
    console.log(' Usuario NO ha visto la intro, redirigiendo a /intro');
    router.navigate(['/intro']);
    return false;
  }
};