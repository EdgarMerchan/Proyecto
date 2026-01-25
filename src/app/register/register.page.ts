import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonItem, IonInput } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { RegisterService } from '../services/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonItem, IonInput]
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;

constructor(
  private formBuilder: FormBuilder,
  private router: Router,
  private registerService: RegisterService
) {
    this.registerForm = this.formBuilder.group({
      nombre: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3)
        ])
      ),
      apellido: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3)
        ])
      ),
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.email
        ])
      ),
      password: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(6)
        ])
      )
    });
  }

  ngOnInit() {
  }

async register() {
  if (this.registerForm.valid) {
    const userData = {
      nombre: this.registerForm.value.nombre,
      apellido: this.registerForm.value.apellido,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    };
    
    try {
      // Intentar registrar el usuario
      await this.registerService.registerUser(userData);
      
      console.log(' Registro exitoso');
      alert('¡Registro exitoso!\nAhora puedes iniciar sesión');
      
      // Navegar al login
      this.router.navigate(['/login']);
      
    } catch (error) {
      console.log(' Error en el registro');
      alert('El email ya está registrado. Intenta con otro email.');
    }
  } else {
    console.log(' Formulario inválido');
    alert('Por favor completa todos los campos correctamente');
  }
}

goToLogin() {
  this.router.navigate(['/login']);
}

}