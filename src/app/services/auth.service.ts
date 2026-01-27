import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  constructor(private storageService: StorageService) {}

  // Método para validar credenciales y hacer el login
async loginUser(credentials: any): Promise<boolean> {
  return new Promise(async (accept, reject) => {
    try {
      // Buscar el usuario en el storage por email
      const user = await this.storageService.get(credentials.email);
      
      if (user && user.password === credentials.password) {
        // Login correcto - guardar en storage
        await this.storageService.set('login', true);
        await this.storageService.set('currentUser', user);
        accept(true);
        console.log(' Login correcto - guardado en storage');
      } else {
        // Login incorrecto
        reject(false);
        console.log(' Credenciales incorrectas');
      }
    } catch (error) {
      reject(false);
      console.log(' Error en el login:', error);
    }
  });
}

  // Método para verificar si el usuario está logueado
  async isLoggedIn(): Promise<boolean> {
    const loginStatus = await this.storageService.get('login');
    return loginStatus === true;
  }

  // Método para cerrar sesión
async logout(): Promise<void> {
  await this.storageService.remove('login');
  await this.storageService.remove('currentUser');
  console.log(' Sesión cerrada - datos eliminados del storage');
}

}