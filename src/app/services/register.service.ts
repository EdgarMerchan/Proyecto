import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private storageService: StorageService) { }

  // Método para registrar un nuevo usuario
  async registerUser(userData: any): Promise<boolean> {
    return new Promise(async (accept, reject) => {
      try {
        // Verificar si el email ya existe
        const existingUser = await this.storageService.get(userData.email);
        
        if (existingUser) {
          // Si el email ya está registrado, rechazar
          console.log(' El email ya está registrado');
          reject(false);
        } else {
          // Guardar el nuevo usuario en el storage usando el email como llave
          await this.storageService.set(userData.email, {
            nombre: userData.nombre,
            apellido: userData.apellido,
            email: userData.email,
            password: userData.password
          });
          
          console.log(' Usuario registrado exitosamente');
          accept(true);
        }
      } catch (error) {
        console.log(' Error al registrar usuario:', error);
        reject(false);
      }
    });
  }
}
