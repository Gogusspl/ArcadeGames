import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  balance: number = 0;
  amountToAdd: number = 0;

  authService = inject(AuthService);

  ngOnInit(): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.authService.getBalance(username).subscribe({
        next: (data) => {
          this.balance = data;
        },
        error: (err) => {
          console.error('Błąd przy pobieraniu salda:', err);
        }
      });
    }
  }

  addToBalance(): void {
    console.log('Kliknięto dodaj saldo');
    const username = localStorage.getItem('username');
    console.log('amountToAdd:', this.amountToAdd);
    if (username && this.amountToAdd > 0) {
      console.log('przeslano');
      this.authService.updateBalance(username, this.amountToAdd).subscribe({
        next: () => {
          console.log('dodano');
          this.balance += this.amountToAdd;
          this.amountToAdd = 0;
        },
        error: (err) => {
          console.error('Błąd przy aktualizacji salda:', err);
        }
      });
    }
  }
}
