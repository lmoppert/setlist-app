import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root', })
export class AlertService {
  private snackBar = inject(MatSnackBar);

  success(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  error(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 8000,
      panelClass: ['error-snackbar'],
    });
  }

  warning(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      panelClass: ['warning-snackbar'],
    });
  }

  info(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      panelClass: ['info-snackbar'],
    });
  }
}