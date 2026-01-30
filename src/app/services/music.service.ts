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

  getSongsByAlbum(albumId: number) {
    return fetch(`${this.urlServer}/tracks/album/${albumId}`).then(
      response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      }
    ).catch(error => {
      console.error('Error obteniendo canciones del álbum:', error);
      return []; // Retornar array vacío en caso de error
    });
  }
}
