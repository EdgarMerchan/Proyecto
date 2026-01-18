// src/app/intro/intro.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton]
})
export class IntroPage {

  constructor(
    private router: Router,
    private storageService: StorageService
  ) { }

  async volverAlHome() {
    // Guardar que ya vio la intro
    await this.storageService.set('introVista', true);
    console.log('Intro vista guardada en storage');
    this.router.navigate(['/home']);
  }

}
