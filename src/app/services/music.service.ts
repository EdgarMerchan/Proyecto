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
      return [];
    });
  }

  // ===== MÉTODOS DE FAVORITOS =====
  
  // Agregar a favoritos
  addToFavorites(trackId: number, userId: number = 1) {
    return fetch(`${this.urlServer}/favorite_tracks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        track_id: trackId
      })
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }).catch(error => {
      console.error(' Error agregando a favoritos:', error);
      throw error;
    });
  }

  // Quitar de favoritos
  removeFromFavorites(favoriteId: number, userId: number = 1, trackId: number) {
    return fetch(`${this.urlServer}/favorite_tracks/${favoriteId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        favorite_track: {
          user_id: userId,
          track_id: trackId
        }
      })
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }).catch(error => {
      console.error(' Error eliminando de favoritos:', error);
      throw error;
    });
  }

 // Obtener favoritos del usuario (filtrando desde todos los favoritos)
getUserFavorites(userId: number = 1) {
  return fetch(`${this.urlServer}/favorite_tracks`).then(
    response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }
  ).then(favorites => {
    // Filtrar solo los favoritos del usuario actual
    return favorites.filter((fav: any) => fav.user_id === userId);
  }).catch(error => {
    console.error(' Error obteniendo favoritos:', error);
    return [];
  });
}

  // Obtener todos los favoritos
  getAllFavorites() {
    return fetch(`${this.urlServer}/favorite_tracks`).then(
      response => response.json()
    );
  }
}
