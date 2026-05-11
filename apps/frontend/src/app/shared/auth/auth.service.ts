import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { IUser } from '@setlist-app/shared-types';

@Injectable({ providedIn: 'root', })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  readonly currentUser = signal<IUser | null>(null);
  readonly isAuthenticated = computed(() => this.currentUser() !== null,);

  login(username: string, password: string) {
    return this.http.post(
      '/api/auth/login',
      { username, password, },
    ).pipe(
      switchMap(() =>
        this.http.get<IUser>('/api/auth/status'),
      ),
      tap((user) => {
        console.log('[DEBUG] Response:', user)
        this.currentUser.set(user);
        this.router.navigate(['/']);
      }),
    );
  }

  logout() {
    return this.http.post(
      '/api/auth/logout', {},
    ).pipe(
      tap(() => {
        console.log('Trying to log out...');
        this.currentUser.set(null);
        this.router.navigate(['/login']);
      }),
    );
  }
}