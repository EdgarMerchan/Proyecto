// src/app/home/home.page.ts
import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

register();

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit {
  colorClaro = '#cd53f6';
  colorOscuro = '#53048a';
  colorActual = this.colorOscuro;
  
  genres = [
    {
      title: "Música Clásica",
      image: "https://media.istockphoto.com/id/1129332575/es/foto/m%C3%BAsica-cl%C3%A1sica-favorita-vista-de-cerca-de-manos-femeninas-suaves-tocando-una-melod%C3%ADa-en-el.jpg?s=612x612&w=0&k=20&c=aF-5X_5ZqxHVvud4YGoYeoP-xFWQm6AQhDcOAakKn38=",
      description: "La música clásica es una tradición artística que abarca más de mil años de historia occidental. Se caracteriza por su complejidad estructural, el uso de notación musical precisa y su instrumentación orquestal."
    },
    {
      title: "Rock",
      image: "https://www.discosderock.com/wp-content/uploads/2020/03/hard-rock-historia-tipo-de-rock-genero-musical-2.jpg",
      description: "El rock es un género musical de ritmo marcado derivado de la mezcla de diversos estilos del folclore estadounidense, como el blues, el country y el rhythm and blues."
    },
    {
      title: "Heavy Metal",
      image: "https://www.infobae.com/resizer/v2/ZFRWZ3ZBONHPBNT6X73KLTNQ2Y.jpg?auth=36b3aac98737fdd3fb0d222a329495224bac9ddf006e9824a7ca72aa62273ecc&smart=true&width=350&height=197&quality=85",
      description: "El heavy metal es un género musical que surgió a finales de los años 60 y principios de los 70 en el Reino Unido y Estados Unidos, derivado del blues rock, el hard rock y el rock psicodélico."
    },
    {
      title: "Jazz",
      image: "https://cdn.pixabay.com/photo/2016/11/23/15/48/audience-1853662_1280.jpg",
      description: "El jazz es un género musical nacido a finales del siglo XIX en Estados Unidos, que se caracteriza por la improvisación, el swing y la síncopa. Es una mezcla de tradiciones musicales africanas y europeas."
    },
    {
      title: "Reggaeton",
      image: "https://www.songacademy.co.uk/wp-content/uploads/2022/01/Reggaeton.jpg",
      description: "El reggaeton es un género musical latino que combina ritmos caribeños con hip hop. Originado en Puerto Rico en los años 90, se ha convertido en uno de los géneros más populares a nivel mundial."
    }
  ];

  constructor(private router: Router, private storageService: StorageService) {}

  async ngOnInit() {
    // Cargar el tema guardado al iniciar
    const temaGuardado = await this.storageService.get('tema');
    if (temaGuardado) {
      this.colorActual = temaGuardado;
      console.log(' Tema cargado desde storage:', temaGuardado);
    } else {
      // Si no hay tema guardado, guardar el tema por defecto
      await this.storageService.set('tema', this.colorActual);
      console.log(' Tema por defecto guardado:', this.colorActual);
    }

    // Verificar si ya vio la intro
    const yaVioIntro = await this.storageService.get('introVista');
    console.log(' ¿Ya vio la intro?', yaVioIntro);
  }

  async cambiarColor() {
    // Cambiar entre claro y oscuro
    this.colorActual = this.colorActual === this.colorOscuro ? this.colorClaro : this.colorOscuro;
    
    // Guardar el nuevo tema en el storage
    await this.storageService.set('tema', this.colorActual);
    console.log(' Tema guardado en storage:', this.colorActual);
  }

  async irAIntro() {
    // Marcar que vio la intro
    await this.storageService.set('introVista', true);
    // Navegar a la página de intro
    this.router.navigate(['/intro']);
  }

  async volverAlHome() {
    //Esta funcion me llama desde otras páginas al volver
    await this.storageService.set('introVista', true);
    this.router.navigate(['/home']);
  }
}