import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [
    MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule,
    FormsModule,
  ],
  template: `
    <h2 mat-dialog-title>Band Bereich</h2>
    <mat-dialog-content>
      <p>Bitte gib das Passwort ein, um fortzufahren:</p>
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Passwort</mat-label>
        <input matInput type="password" [(ngModel)]="password" (keyup.enter)="submit()" autofocus>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-raised-button color="primary" (click)="submit()">Login</button>
    </mat-dialog-actions>
  `,
  styles: [`.w-full { width: 100%; }`]
})
export class LoginDialog {
  password = '';
  constructor(private dialogRef: MatDialogRef<LoginDialog>) {}

  submit() {
    if (this.password) this.dialogRef.close(this.password);
  }
}