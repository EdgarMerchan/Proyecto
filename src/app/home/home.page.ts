// src/app/home/home.page.ts
import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonMenuButton, ModalController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { MusicService } from '../services/music.service';
import { SongsModalPage } from '../songs-modal/songs-modal.page';

register();

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonMenuButton],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit {
  colorClaro = '#cd53f6';
  colorOscuro = '#53048a';
  colorActual = this.colorOscuro;
  
  albums: any[] = [];

  constructor(
    private router: Router, 
    private storageService: StorageService, 
    private musicService: MusicService,
    private modalCtrl: ModalController
  ) {}

  async ngOnInit() {
    // Cargar el tema guardado al iniciar
    const temaGuardado = await this.storageService.get('tema');
    if (temaGuardado) {
      this.colorActual = temaGuardado;
      console.log(' Tema cargado desde storage:', temaGuardado);
    } else {
      await this.storageService.set('tema', this.colorActual);
      console.log(' Tema por defecto guardado:', this.colorActual);
    }

    // Verificar si ya vio la intro
    const yaVioIntro = await this.storageService.get('introVista');
    console.log(' ¿Ya vio la intro?', yaVioIntro);

    // Cargar los álbumes
    this.loadAlbums();
  }

  loadAlbums() {
    this.musicService.getAlbums().then(albums => {
      this.albums = albums;
      console.log(' Álbumes cargados:', this.albums);
    });
  }

  // Función para mostrar las canciones de un álbum en el modal
  async showSongsByAlbum(albumId: number, albumName: string) {
    console.log(' Abriendo modal para álbum ID:', albumId);
    
    // Obtener las canciones del álbum
    const songs = await this.musicService.getSongsByAlbum(albumId);
    console.log(' Canciones obtenidas:', songs);

    // Crear el modal
    const modal = await this.modalCtrl.create({
      component: SongsModalPage,
      componentProps: {
        songs: songs,
        albumName: albumName
      }
    });

    // Presentar el modal
    modal.present();
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