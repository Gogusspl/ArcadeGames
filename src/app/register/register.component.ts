import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Ścieżkę dostosuj

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  authService = inject(AuthService);
  router = inject(Router);

  ngOnInit(): void { }

  signUp() {
    if (this.user.password !== this.user.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const payload = {
      username: this.user.username,
      email: this.user.email,
      password: this.user.password
    };

    this.authService.register(payload).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
        alert('Account created successfully!');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registration error', error);
        alert('Registration failed.');
      }
    });
  }
  goToLogin() {
  this.router.navigate(['/login']);
}

}
