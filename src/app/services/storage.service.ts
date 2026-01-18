// src/app/services/storage.service.ts
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    // Inicializar el storage
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Guardar datos
  async set(key: string, value: any): Promise<any> {
    return await this._storage?.set(key, value);
  }

  // Obtener datos
  async get(key: string): Promise<any> {
    return await this._storage?.get(key);
  }

  // Eliminar un item
  async remove(key: string): Promise<any> {
    return await this._storage?.remove(key);
  }

  // Limpiar todo el storage
  async clear(): Promise<void> {
    return await this._storage?.clear();
  }

  // Obtener todas las keys
  async keys(): Promise<string[]> {
    return await this._storage?.keys() || [];
  }
}

// Exportar también con el nombre 'storage' para compatibilidad
export { StorageService as storage };
