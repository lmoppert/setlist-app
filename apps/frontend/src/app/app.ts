import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';

import { TitleService } from './core/title.service';
import { AuthService } from './shared/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterModule, MatToolbarModule, MatIconModule,
    MatTooltipModule, MatButtonModule, MatSidenavModule,
    MatListModule, MatMenuModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  readonly titleService = inject(TitleService);
  private router = inject(Router);
  protected auth = inject(AuthService);

  protected darkTheme = signal(false);
  readonly isDarkTheme = computed(() => this.darkTheme());

  ngOnInit(): void {
    if (!this.auth.isAuthenticated()) { this.router.navigate(['/login']); }
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
