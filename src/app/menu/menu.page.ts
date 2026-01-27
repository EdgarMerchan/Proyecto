import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonMenu,  IonHeader, IonToolbar,  IonTitle,  IonContent,  IonList, IonItem, IonLabel,  IonIcon, IonRouterOutlet, IonButtons, IonButton, MenuController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { addIcons } from 'ionicons';
import { playCircleOutline, logOutOutline, closeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,  IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList,  IonItem, IonLabel, IonIcon, IonRouterOutlet, IonButtons, IonButton ]
})
export class MenuPage implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
    private menuCtrl: MenuController
  ) {
    // Registrar los iconos
    addIcons({ playCircleOutline, logOutOutline, closeOutline });
  }

  ngOnInit() {
  }

  // Navegar a la intro
  async goToIntro() {
    await this.menuCtrl.close(); // Cerrar el menú
    this.router.navigate(['/intro']);
  }

  // Cerrar sesión
  async logout() {
    await this.menuCtrl.close(); // Cerrar el menú
    await this.authService.logout(); // Eliminar datos del storage
    console.log(' Sesión cerrada, redirigiendo a login');
    this.router.navigate(['/login']);
  }

  // Cerrar el menú
async closeMenu() {
  await this.menuCtrl.close();
}

}
