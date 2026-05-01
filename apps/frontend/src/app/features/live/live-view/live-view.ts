import { Component, computed, effect, ElementRef, inject, input, signal, viewChildren } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { DatePipe, formatDate } from '@angular/common';

import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { DurationPipe } from '../../../shared/pipes/duration.pipe';
import { SetlistStore } from '../../../models/setlist-store';
import { SongCard } from '../song-card/song-card'
import { ISetlistEntry } from '@setlist-app/shared-types';
import { TitleService } from '../../../core/title.service';
import { AlertService } from '../../../core/alert.service';

@Component({
  selector: 'app-live-view',
  imports: [
    MatChipsModule, DurationPipe, MatIconModule, MatButtonModule,
    MatProgressBarModule, CdkDrag, CdkDropList, SongCard, DatePipe
  ],
  templateUrl: './live-view.html',
  styleUrl: './live-view.scss',
})
export class LiveView {
  protected store = inject(SetlistStore);
  private titleService = inject(TitleService);
  private alert = inject(AlertService);

  slug = input.required<string>();

  hasStarted = signal(false)
  activeSongIndex = signal(0);  
  currentTime = signal(new Date());
  songElements = viewChildren<ElementRef>('songItem');

  constructor() {
    effect(() => {
      const currentSlug = this.slug();
      if (currentSlug) this.store.loadSetlist(currentSlug);
    });
    effect((onCleanup) => {
      const id = setInterval(() => {
        this.currentTime.set(new Date());
      }, 1000); 
      onCleanup(() => clearInterval(id));
    });
    effect(() => {
      const index = this.activeSongIndex();
      const elements = this.songElements();
      console.log('Scrolling triggert:', index, elements[index])
      if (elements[index]) {
        elements[index].nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
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

  activateEntry(id: number) {
    console.log('Received activate ID-', id)
    this.activeSongIndex.set(id);
  }

  readonly timeLeft = computed(() => {
    const songs = this.store.enrichedSetlist();
    const currentIndex = this.activeSongIndex();
    return songs
      .slice(currentIndex)
      .reduce((total, entry) => total + (entry.song?.duration || 0), 0);
  });

  async moveSong(event: CdkDragDrop<any[]>) {
    if (this.hasStarted()) return
    const entry = event.item.data as ISetlistEntry;
    const newPosition = event.currentIndex + 1;
    await this.store.reorderEntry(entry.id!, newPosition);
  }
}
