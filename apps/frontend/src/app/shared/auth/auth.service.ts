import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root', })
export class AuthService {
  private http = inject(HttpClient);

  login(
    username: string,
    password: string,
  ): Observable<void> {
    console.log('Überprüfe die Zugangsdaten...');
    return this.http.post<void>(
      '/api/auth/login',
      { username, password, },
      { withCredentials: true, },
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(
      '/api/auth/logout',
      {},
      { withCredentials: true, },
    );
  }
}