import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials = {
    username: '',
    password: ''
  };

  authService = inject(AuthService);
  router = inject(Router);

  ngOnInit(): void {}

  signIn() {
    this.authService.login(this.credentials).subscribe({
      next: (response: any) => {
        console.log('Login successful', response);

        localStorage.setItem('username', this.credentials.username);
        localStorage.setItem('auth_token', response.token);
       
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login error', error);
        alert('Nieprawidłowy login lub hasło!');
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
