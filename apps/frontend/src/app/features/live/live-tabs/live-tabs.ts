import { Component, effect, inject, input } from '@angular/core';
import { formatDate } from '@angular/common';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';

import { TitleService } from '../../../core/title.service';
import { SetlistStore } from '../../../models/setlist-store';
import { LiveView } from '../live-view/live-view';
import { FileView } from '../file-view/file-view';

@Component({
  selector: 'app-live-tabs',
  imports: [MatProgressBarModule, MatTabsModule, LiveView, FileView, ],
  templateUrl: './live-tabs.html',
  styleUrl: './live-tabs.scss',
})
export class LiveTabs {
  protected store = inject(SetlistStore);
  private titleService = inject(TitleService);
  slug = input.required<string>();

  constructor() {
    effect(() => {
      const currentSlug = this.slug();
      if (currentSlug) this.store.loadSetlist(currentSlug);
    });
    effect(() => {
      let title: string = this.store.currentSetlist()?.location ?? ''; 
      const date = this.store.currentSetlist()?.date;
      if (date) {
        title += ` (${formatDate(date, 'dd.MM.yyyy', 'de-DE')})`; 
      }
      this.titleService.setTitle(location ? title : 'Setliste bearbeiten');
    });
  }
}