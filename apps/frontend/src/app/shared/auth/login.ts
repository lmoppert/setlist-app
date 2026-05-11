import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  imports: [
    MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule,
  ],
  template: `
    <div class="login-form">
      <h2>Band Bereich</h2>
      <p>Bitte melde Dich an, um fortzufahren:</p>
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Benutzername</mat-label>
        <input matInput [(ngModel)]="username">
      </mat-form-field>
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Passwort</mat-label>
        <input matInput
              type="password"
              [(ngModel)]="password"
              (keyup.enter)="submit()"
              cdkFocusInitial
        />
      </mat-form-field>
      @if (error) {
        <p class="error">{{ error }}</p>
      }
      <div align="end" class="login-actions">
        <button matButton="elevated" (click)="submit()" [disabled]="loading">Login</button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: var(--mat-sys-surface-container);
    }
    .login-form {
      border-radius: var(--mat-sys-corner-medium);
      box-shadow: var(--mat-sys-level3);
      background-color: var(--mat-sys-surface);
      padding: 1rem 2rem;
      width: 400px;
    }
    .w-full {
      width: 100%;
    }
    .error {
      color: var(--mat-sys-error);
      background-color: var(--mat-sys-error-container);
      border-radius: var(--mat-sys-corner-small);
      padding: .5rem 1rem;
      margin: 0;
    }
  `],
})
export class LoginForm {
  private router = inject(Router);

  username = 'band';
  password = '';
  loading = false;
  error = '';

  private auth = inject(AuthService);

  submit() {
    this.error = '';
    if (!this.username || !this.password) { return; }
    this.loading = true;
    this.auth.login(this.username, this.password)
      .pipe(finalize(() => {
        this.loading = false;
      }),
    ).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: () => {
        this.error = 'Benutzername oder Passwort falsch!';
      },
    });
  }
}