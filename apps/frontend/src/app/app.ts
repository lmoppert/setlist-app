import { Component, computed, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

import { TitleService } from './core/title.service';

@Component({
  selector: 'app-root',
  imports: [RouterModule, MatToolbarModule, MatIconModule,
    MatTooltipModule, MatButtonModule, MatSidenavModule,
    MatListModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly titleService = inject(TitleService);

  protected darkTheme = signal(false);
  readonly isDarkTheme = computed(() => this.darkTheme());

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
  toggleMenu() {
    // TODO: Toggle menu
  }
}
