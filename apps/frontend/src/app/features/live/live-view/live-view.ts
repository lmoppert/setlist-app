import { Component, computed, effect, ElementRef, inject, input, signal, viewChildren } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';

import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ISetlistEntry } from '@setlist-app/shared-types';
import { DurationPipe } from '../../../shared/pipes/duration.pipe';
import { SetlistStore } from '../../../models/setlist-store';
import { SongCard } from '../song-card/song-card'
import { SongStore } from '../../../models/song-store';
import { LiveService } from '../../../models/live-service';

@Component({
  selector: 'app-live-view',
  imports: [
    MatChipsModule, DurationPipe, MatIconModule, MatButtonModule,
    MatProgressBarModule, CdkDrag, CdkDropList, SongCard, DatePipe,
    MatFormFieldModule, MatMenuModule, MatTooltipModule
],
  templateUrl: './live-view.html',
  styleUrl: './live-view.scss',
})
export class LiveView {
  protected store = inject(SetlistStore);
  protected songStore = inject(SongStore);
  protected service = inject(LiveService)

  hasStarted = signal(false)
  currentTime = signal(new Date());
  activeMember = signal<string | null>(null);
  songElements = viewChildren<ElementRef>('songItem');

  readonly index = computed(() => {
    return this.service.activeSongIndex();
  })

  constructor() {
    effect((onCleanup) => {
      const id = setInterval(() => {
        this.currentTime.set(new Date());
      }, 1000); 
      onCleanup(() => clearInterval(id));
    });
    effect(() => {
      const index = this.index();
      const elements = this.songElements();
      if (elements[index]) {
        elements[index].nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    });
  }

  getActiveMemberName(): string | undefined {
    const id = this.activeMember();
    return this.songStore.members()?.find(m => m.id === id)?.name;
  }
  setActiveMember(id: string | null) {
    this.activeMember.set(id);
  }

  activateEntry(id: number) {
    this.service.setActiveSong(id);
  }

  readonly timeLeft = computed(() => {
    const songs = this.store.enrichedSetlist();
    const index = this.index();
    return songs
      .slice(index)
      .reduce((total, entry) => total + (entry.song?.duration || 0), 0);
  });

  async moveSong(event: CdkDragDrop<any[]>) {
    if (this.hasStarted()) return
    const entry = event.item.data as ISetlistEntry;
    const newPosition = event.currentIndex + 1;
    await this.store.reorderEntry(entry.id!, newPosition);
  }

  showTooltip = computed<string>(() => {
    return 'Verwende das ⁝ Menü oder Rechtsklick für weitere Optionen.';
  });
}
