// src/app/home/home.page.ts
import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonMenuButton, IonFooter, IonIcon, IonRange, IonLabel, ModalController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { MusicService } from '../services/music.service';
import { SongsModalPage } from '../songs-modal/songs-modal.page';
import { addIcons } from 'ionicons';
import { playOutline, pauseOutline, playSkipForwardOutline, playSkipBackOutline, heart, heartOutline } from 'ionicons/icons';

register();

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonButton, 
    IonButtons, 
    IonMenuButton,
    IonFooter,
    IonIcon,
    IonRange,
    IonLabel
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit {
  colorClaro = '#cd53f6';
  colorOscuro = '#53048a';
  colorActual = this.colorOscuro;
  
  albums: any[] = [];
  
  // Variables para el reproductor
  currentSong: any = null;
  song: any = new Audio();
  isPlaying: boolean = false;
  currentTime: number = 0;
  duration: number = 0;
  playlist: any[] = [];
  currentIndex: number = -1;
  
  // Variables para favoritos
  userFavorites: any[] = []; // Lista completa de favoritos desde la API
  userId: number = 1; // ID del usuario actual

  constructor(
    private router: Router, 
    private storageService: StorageService, 
    private musicService: MusicService,
    private modalCtrl: ModalController
  ) {
    addIcons({ playOutline, pauseOutline, playSkipForwardOutline, playSkipBackOutline, heart, heartOutline });
  }

  async ngOnInit() {
    const temaGuardado = await this.storageService.get('tema');
    if (temaGuardado) {
      this.colorActual = temaGuardado;
      console.log(' Tema cargado desde storage:', temaGuardado);
    } else {
      await this.storageService.set('tema', this.colorActual);
      console.log(' Tema por defecto guardado:', this.colorActual);
    }

    const yaVioIntro = await this.storageService.get('introVista');
    console.log(' ¿Ya vio la intro?', yaVioIntro);

    this.loadAlbums();
    this.setupAudioListeners();
    await this.loadFavorites();
  }

  loadAlbums() {
    this.musicService.getAlbums().then(albums => {
      this.albums = albums;
      console.log(' Álbumes cargados:', this.albums);
    });
  }

  // Cargar favoritos desde la API
  async loadFavorites() {
    try {
      this.userFavorites = await this.musicService.getUserFavorites(this.userId);
      console.log(' Favoritos cargados desde API:', this.userFavorites);
    } catch (error) {
      console.error(' Error cargando favoritos:', error);
      this.userFavorites = [];
    }
  }

  // Verificar si la canción actual es favorita
isFavorite(): boolean {
  if (!this.currentSong) return false;
  // Ahora userFavorites tiene objetos con 'track_id' correctamente
  return this.userFavorites.some(fav => fav.track_id === this.currentSong.id);
}

// Obtener el ID del favorito para poder eliminarlo
getFavoriteId(): number | null {
  if (!this.currentSong) return null;
  // Buscamos el favorito que coincide con el track_id de la canción actual
  const favorite = this.userFavorites.find(fav => fav.track_id === this.currentSong.id);
  return favorite ? favorite.id : null;
}

  // Agregar o quitar de favoritos
async toggleFavorite() {
  if (!this.currentSong) {
    console.log(' No hay canción reproduciéndose');
    return;
  }

  const trackId = this.currentSong.id;
  console.log(' Canción actual:', this.currentSong.name, '- ID:', trackId);
  console.log(' Lista de favoritos antes:', this.userFavorites);
  
  if (this.isFavorite()) {
    // Quitar de favoritos
    const favoriteId = this.getFavoriteId();
    console.log(' Favorite ID encontrado:', favoriteId);
    console.log(' Track ID:', trackId);
    console.log(' User ID:', this.userId);
    
    if (favoriteId) {
      try {
        const result = await this.musicService.removeFromFavorites(favoriteId, this.userId, trackId);
        console.log(' Respuesta del servidor al eliminar:', result);
        console.log(' Quitado de favoritos:', this.currentSong.name);
        await this.loadFavorites(); // Recargar la lista
        console.log(' Lista de favoritos después de eliminar:', this.userFavorites);
      } catch (error) {
        console.error(' Error quitando de favoritos:', error);
      }
    } else {
      console.error(' No se encontró el ID del favorito');
    }
  } else {
    // Agregar a favoritos
    try {
      const result = await this.musicService.addToFavorites(trackId, this.userId);
      console.log(' Respuesta del servidor al agregar:', result);
      console.log(' Agregado a favoritos:', this.currentSong.name);
      await this.loadFavorites(); // Recargar la lista
      console.log(' Lista de favoritos después de agregar:', this.userFavorites);
    } catch (error) {
      console.error(' Error agregando a favoritos:', error);
    }
  }
}

  async showSongsByAlbum(albumId: number, albumName: string) {
    console.log(' Abriendo modal para álbum ID:', albumId);
    
    const songs = await this.musicService.getSongsByAlbum(albumId);
    console.log(' Canciones obtenidas:', songs);

    const modal = await this.modalCtrl.create({
      component: SongsModalPage,
      componentProps: {
        songs: songs,
        albumName: albumName,
        onSongSelected: (song: any, playlist: any[]) => {
          this.playSong(song, playlist);
        }
      }
    });

    modal.present();
  }

  setupAudioListeners() {
    this.song.addEventListener('timeupdate', () => {
      this.currentTime = this.song.currentTime;
    });

    this.song.addEventListener('loadedmetadata', () => {
      this.duration = this.song.duration;
    });

    this.song.addEventListener('ended', () => {
      this.next();
    });
  }

  playSong(song: any, playlist: any[] = []) {
    console.log('▶ Reproduciendo:', song);
    
    this.currentSong = song;
    this.playlist = playlist.length > 0 ? playlist : [song];
    this.currentIndex = this.playlist.findIndex(s => s.id === song.id);
    
    this.song.src = song.preview_url;
    this.song.load();
    this.song.play();
    this.isPlaying = true;
  }

  togglePlayPause() {
    if (this.song.paused) {
      this.song.play();
      this.isPlaying = true;
    } else {
      this.song.pause();
      this.isPlaying = false;
    }
  }

  next() {
    if (this.currentIndex < this.playlist.length - 1) {
      const nextSong = this.playlist[this.currentIndex + 1];
      this.playSong(nextSong, this.playlist);
    }
  }

  previous() {
    if (this.currentIndex > 0) {
      const prevSong = this.playlist[this.currentIndex - 1];
      this.playSong(prevSong, this.playlist);
    }
  }

  onSeek(event: any) {
    this.song.currentTime = event.detail.value;
  }

  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  async cambiarColor() {
    this.colorActual = this.colorActual === this.colorOscuro ? this.colorClaro : this.colorOscuro;
    await this.storageService.set('tema', this.colorActual);
    console.log(' Tema guardado en storage:', this.colorActual);
  }

  async irAIntro() {
    await this.storageService.set('introVista', true);
    this.router.navigate(['/intro']);
  }
}