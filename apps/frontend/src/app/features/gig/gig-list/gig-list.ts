import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { DatePipe } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { GigStore } from '../../../models/gig-store';
import { TitleService } from '../../../core/title.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-gig-list',
  imports: [
    RouterLink, DatePipe, MatButtonModule, MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './gig-list.html',
  styleUrl: './gig-list.scss',
})
export class GigList {
  protected store = inject(GigStore);
  private titleService = inject(TitleService);

  constructor() {
    this.titleService.setTitle('Auftritte');
  }
}
