import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';

import { TitleService } from './core/title.service';
import { LoginDialog } from './shared/auth/login';
import { AuthService } from './shared/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterModule, MatToolbarModule, MatIconModule,
    MatTooltipModule, MatButtonModule, MatSidenavModule,
    MatListModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  readonly titleService = inject(TitleService);
  private dialog = inject(MatDialog)
  private auth = inject(AuthService)

  protected darkTheme = signal(false);
  readonly isDarkTheme = computed(() => this.darkTheme());

  ngOnInit(): void {
    this.checkAuth();
  }

  checkAuth() {
    this.auth.status().subscribe({
      next: () => {
        console.log('User ist eingeloggt');
      },
      error: () => {
        const dialogRef = this.dialog.open(LoginDialog, {
          disableClose: true,
          width: '400px',
        });

        dialogRef.afterClosed().subscribe(() => {
          this.checkAuth();
        })
      },
    });
  }

  toggleTheme() {
    this.darkTheme.update((value) => !value);
    this.applyTheme()
  }
  private applyTheme() {
    const body = document.body;
    body.classList.toggle('dark-theme', this.isDarkTheme());
    body.classList.toggle('light-theme', !this.isDarkTheme());
    body.style.colorScheme = this.isDarkTheme() ? 'dark' : 'light';
  }
}
