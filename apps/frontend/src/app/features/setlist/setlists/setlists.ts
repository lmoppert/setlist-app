import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { DatePipe } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { TitleService } from '../../../core/title.service';
import { SetlistStore } from '../../../models/setlist-store';

@Component({
  selector: 'app-setlists',
  imports: [
    RouterLink, DatePipe, MatButtonModule, MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './setlists.html',
  styleUrl: './setlists.scss',
})
export class Setlists {
  protected store = inject(SetlistStore);
  protected titleService = inject(TitleService);

  constructor() {
    this.titleService.setTitle('Auftritte')
    
  }
}
