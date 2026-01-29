// src/app/services/music.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  urlServer = "https://music.fly.dev";
  
  constructor() { }

  getTracks() {
    return fetch(`${this.urlServer}/tracks`).then(
      response => response.json()
    );
  }

  getAlbums() {
    return fetch(`${this.urlServer}/albums`).then(
      response => response.json()
    );
  }

  // Nuevo método para obtener las canciones de un álbum específico
  getSongsByAlbum(albumId: number) {
    return fetch(`${this.urlServer}/albums/${albumId}/tracks`).then(
      response => response.json()
    );
  }
}
