import { Component, computed, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { DatePipe } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

import { ISetlist, ISetlistGroup } from '@setlist-app/shared-types'
import { TitleService } from '../../../core/title.service';
import { SetlistStore } from '../../../models/setlist-store';
import { AlertService } from '../../../core/alert.service'

@Component({
  selector: 'app-setlists',
  imports: [
    RouterLink, DatePipe, MatButtonModule, MatIconModule, MatListModule,
    MatProgressBarModule, RouterLink, MatDividerModule 
  ],
  templateUrl: './setlists.html',
  styleUrl: './setlists.scss',
})
export class Setlists {
  protected store = inject(SetlistStore);
  protected titleService = inject(TitleService);
  protected alert = inject(AlertService)

  readonly groupedSetlists = computed(() => {
    const data = this.store.setlists();
    if (!data) return [];

    const grouped = this.groupData(data);
    if (!grouped) return [];

    return Object.entries(grouped)
      .map(([year, items]): ISetlistGroup => ({
        yearLabel: year === '9999' ? 'Vorlagen / Proben' : year,
        yearValue: +year,
        items
      }))
      .sort((a, b) => b.yearValue - a.yearValue);
  });

  constructor() {
    this.titleService.setTitle('Auftritte')
  }

  private groupData(setlists: ISetlist[] | undefined) {
    if (!setlists) return undefined;

    const grouped = setlists.reduce((groups, setlist) => {
      const year = setlist.date ? new Date(setlist.date).getFullYear() : 9999;

      if (!groups[year]) {
        groups[year] = [];
      }
      groups[year].push(setlist);
      return groups;
    }, {} as { [key: number]: ISetlist[] });

    Object.values(grouped).forEach(list => {
      list.sort((a, b) => {
        if (!a.date && !b.date) return a.location.localeCompare(b.location);
        return new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime();
      });
    });
    return grouped;
  }
}
