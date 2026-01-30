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
import { playOutline, pauseOutline, playSkipForwardOutline, playSkipBackOutline } from 'ionicons/icons';

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

  constructor(
    private router: Router, 
    private storageService: StorageService, 
    private musicService: MusicService,
    private modalCtrl: ModalController
  ) {
    addIcons({ playOutline, pauseOutline, playSkipForwardOutline, playSkipBackOutline });
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
  }

  loadAlbums() {
    this.musicService.getAlbums().then(albums => {
      this.albums = albums;
      console.log(' Álbumes cargados:', this.albums);
    });
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

  // Configurar listeners del audio
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

  // Reproducir una canción
  playSong(song: any, playlist: any[] = []) {
    console.log(' Reproduciendo:', song);
    
    this.currentSong = song;
    this.playlist = playlist.length > 0 ? playlist : [song];
    this.currentIndex = this.playlist.findIndex(s => s.id === song.id);
    
    this.song.src = song.preview_url;
    this.song.load();
    this.song.play();
    this.isPlaying = true;
  }

  // Alternar reproduccion/pausa
  togglePlayPause() {
    if (this.song.paused) {
      this.song.play();
      this.isPlaying = true;
    } else {
      this.song.pause();
      this.isPlaying = false;
    }
  }

  // Siguiente canción
  next() {
    if (this.currentIndex < this.playlist.length - 1) {
      const nextSong = this.playlist[this.currentIndex + 1];
      this.playSong(nextSong, this.playlist);
    }
  }

  // Canción anterior
  previous() {
    if (this.currentIndex > 0) {
      const prevSong = this.playlist[this.currentIndex - 1];
      this.playSong(prevSong, this.playlist);
    }
  }

  // Buscar en la canción
  onSeek(event: any) {
    this.song.currentTime = event.detail.value;
  }

  // Formatear tiempo
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