import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

 login(credentials: any): Observable<string> {
  return this.http.post(`${this.baseUrl}/login`, credentials, { responseType: 'text' });
}

  getBalance(username: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/${username}/balance`);
  }

  updateBalance(username: string, amountToAdd: number): Observable<any> {
  return this.http.put(`${this.baseUrl}/${username}/balance`, {
    amount: amountToAdd
  });
}

}
