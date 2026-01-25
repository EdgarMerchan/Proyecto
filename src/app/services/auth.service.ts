import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  constructor(private storageService: StorageService) {}

  // Método para validar credenciales y hacer el login
  async loginUser(credentials: any): Promise<boolean> {
    return new Promise((accept, reject) => {
      // Valido credenciales 
      if (
        credentials.email === "camilo@gmail.com" &&
        credentials.password === "123456789"
      ) {
        // Login correcto - guardar en storage
        this.storageService.set('login', true).then(() => {
          accept(true);
          console.log(' Login correcto - guardado en storage');
        });
      } else {
        // Login incorrecto
        reject(false);
        console.log(' Login incorrecto');
      }
    });
  }

  // Método para verificar si el usuario está logueado
  async isLoggedIn(): Promise<boolean> {
    const loginStatus = await this.storageService.get('login');
    return loginStatus === true;
  }

}