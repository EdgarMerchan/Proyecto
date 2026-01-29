import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonButtons, IonIcon, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, playCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-songs-modal',
  templateUrl: './songs-modal.page.html',
  styleUrls: ['./songs-modal.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButtons, IonButton, IonLabel, IonItem, IonList, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SongsModalPage implements OnInit {
  songs: any[] = [];
  albumName: string = '';

  constructor(private modalCtrl: ModalController) {
    addIcons({ closeOutline, playCircleOutline });
  }

  ngOnInit() {
    console.log('Songs recibidas en el modal:', this.songs);
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  playSong(song: any) {
    console.log('Reproducir canción:', song);
    // Aquí puedes implementar la reproducción de la canción
    if (song.preview_url) {
      window.open(song.preview_url, '_blank');
    }
  }
}
