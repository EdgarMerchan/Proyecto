import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule]
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
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
          Validators.required
        ])
      )
    })
  }

  ngOnInit() {
  }

  async login() {
    if (this.loginForm.valid) {
      const credentials = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };
      
      try {
        // Intenta hacer login con el servicio
        await this.authService.loginUser(credentials);
        
        console.log(' Login exitoso, navegando a /intro');
        
        // Si el login es exitoso, navega a la intro
        this.router.navigate(['/intro']);
        
      } catch (error) {
        console.log(' Login fallido');
        alert('Credenciales incorrectas. Intenta con:\nEmail: camilo@gmail.com\nPassword: 123456789');
      }
    } else {
      console.log(' Formulario inválido');
    }
  }

  goToRegister() {
  this.router.navigate(['/register']);
}

}
