import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {
  title = 'frontend';
  message = '';
  http = inject(HttpClient);

  constructor() {
    this.getHello().subscribe(data => {
      this.message = data;
    });
  }

  getHello(): Observable<string> {
    return this.http.get('http://localhost:8080/api/hello', { responseType: 'text' });
  }
}
