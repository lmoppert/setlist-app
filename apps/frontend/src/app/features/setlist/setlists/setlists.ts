import { Component, computed, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { DatePipe, KeyValuePipe } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

import { Setlist } from '@setlist-app/shared-types'
import { TitleService } from '../../../core/title.service';
import { SetlistStore } from '../../../models/setlist-store';

@Component({
  selector: 'app-setlists',
  imports: [
    RouterLink, DatePipe, MatButtonModule, MatIconModule, MatListModule,
    MatProgressBarModule, RouterLink, KeyValuePipe, MatDividerModule 
  ],
  templateUrl: './setlists.html',
  styleUrl: './setlists.scss',
})
export class Setlists {
  protected store = inject(SetlistStore);
  protected titleService = inject(TitleService);

  groupedSetlists = computed(() => {
    const setlists = this.store.setlists();
    return this.groupData(setlists);
  })

  constructor() {
    this.titleService.setTitle('Auftritte')
  }

  private groupData(setlists: Setlist[] | undefined) {
    if (setlists === undefined) return undefined;
    return setlists.reduce((groups, setlist) => {
      const year = new Date(setlist.date).getFullYear();
      if (!groups[year]) {
        groups[year] = [];
      }
      groups[year].push(setlist);
      groups[year].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return groups;
    }, {} as { [key: number]: Setlist[] });
  }
  sortDescending = (a: any, b: any) => b.key - a.key;
}
