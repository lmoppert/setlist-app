import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthService } from './auth.service';

@Component({
  imports: [
    MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule,
    FormsModule,
  ],
  template: `
    <h2 mat-dialog-title>Band Bereich</h2>
    <mat-dialog-content>
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
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button matButton="elevated" (click)="submit()" [disabled]="loading">Login</button>
    </mat-dialog-actions>
  `,
  styles: [`
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
  `]
})
export class LoginDialog {
  username = 'band';
  password = '';
  loading = false;
  error = '';

  private auth = inject(AuthService);
  private dialogRef = inject(MatDialogRef<LoginDialog>);

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
        this.dialogRef.close(true);
      },
      error: () => {
        this.error = 'Benutzername oder Passwort falsch!';
      },
    });
  }
}