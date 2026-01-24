// src/app/intro/intro.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IntroPage {

  slides = [
    {
      title: "Bienvenido a ProSong",
      image: "https://previews.123rf.com/images/phys1cx/phys1cx1605/phys1cx160500021/56619042-music-note-app-icon-template-mobile-application-icon-vector-colorful-photo-icon.jpg", 
      description: "Descubre el fascinante mundo de los géneros musicales y su rica historia."
    },
    {
      title: "Explora Géneros Musicales",
      image: "https://previews.123rf.com/images/muchmaniavector/muchmaniavector1610/muchmaniavector161000044/67375178-music-genres-signs-and-symbols-vector-illustration-design-element.jpg", 
      description: "Navega a través de diferentes estilos musicales desde clásica hasta rock y más."
    },
    {
      title: "Aprende y Descubre",
      image: "https://andro4all.com/hero/2023/06/musify.jpg?width=768&aspect_ratio=16:9&format=nowebp", 
      description: "Conoce la historia, características y artistas destacados de cada género."
    },
    {
      title: "Comienza tu Viaje Musical",
      image: "https://media.losandes.com.ar/p/91faceed73a86d4f4cb72fc879743474/adjuntos/368/imagenes/100/013/0100013805/1000x0/smart/rimusic-la-app-musica-gratuita-legal-y-anuncios-que-hace-temblar-spotify.png", 
      description: "Explora, aprende y disfruta de la música como nunca antes."
    }
  ];

  constructor(
    private router: Router,
    private storageService: StorageService
  ) { }

  async volverAlHome() {
    await this.storageService.set('introVista', true);
    console.log(' Intro vista guardada en storage');
    this.router.navigate(['/home']);
  }

}
