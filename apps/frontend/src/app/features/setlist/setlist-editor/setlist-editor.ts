import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { formatDate } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltip } from "@angular/material/tooltip";
import { MatButtonModule } from '@angular/material/button';

import { ISetlistEntry , ISong } from '@setlist-app/shared-types';
import { SetlistStore } from '../../../models/setlist-store';
import { TitleService } from '../../../core/title.service';
import { EntryCard } from '../setlist-entry/setlist-entry'
import { DurationPipe } from '../../../shared/pipes/duration.pipe';
import { AlertService } from '../../../core/alert.service'


@Component({
  selector: 'app-setlist-editor',
  imports: [MatProgressBarModule, MatFormFieldModule, MatInputModule,
    MatIconModule, CdkDrag, CdkDropList, CdkDropListGroup, EntryCard,
    MatChipsModule, DurationPipe, MatTooltip, RouterLink, MatButtonModule
  ],
  templateUrl: './setlist-editor.html',
  styleUrl: './setlist-editor.scss',
})
export class SetlistEditor {
  protected store = inject(SetlistStore);
  private titleService = inject(TitleService);
  private alert = inject(AlertService);

  slug = input.required<string>();
  searchTerm = signal('');

  readonly filteredAvailableSongs = computed(() => {
    const songs = this.store.availableSongs();
    const term = this.searchTerm();
    if (!term) return songs;
    return songs.filter(song => 
      song.title.toLowerCase().includes(term) || 
      song.artist?.toLowerCase().includes(term)
    );
  });

  readonly timeLeft = computed(() =>{
    const songTime = this.store.totalDuration();
    const totalTime = this.store.currentSetlist()?.duration;
    if (totalTime) { 
      return (totalTime - songTime);
    }
    return 0;
  })

  constructor() {
    effect(() => {
      const currentSlug = this.slug();
      if (currentSlug && currentSlug !== 'new') {
        this.store.loadSetlist(currentSlug);
      }
      else {
        this.store.loadSetlist(null);
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

  async moveSong(event: CdkDragDrop<any[]>) {
    const previousContainerId = event.previousContainer.id;
    const currentContainerId = event.container.id;
    console.log(`Move Container: ${previousContainerId} => ${currentContainerId}`)

    if (previousContainerId === currentContainerId && currentContainerId === 'setlist-songs') {
      const entry = event.item.data as ISetlistEntry;
      const newPosition = event.currentIndex + 1;
      await this.store.reorderEntry(entry.id!, newPosition);
    }
    else if (previousContainerId === 'available-songs' && currentContainerId === 'setlist-songs') {
      const song = event.item.data as ISong;
      const position = event.currentIndex + 1;
      this.store.addSong(song.id!, position);
    }
    else if (previousContainerId === 'setlist-songs' && currentContainerId === 'available-songs') {
      const entry = event.item.data as ISetlistEntry;
      this.store.removeEntry(entry.id!);
    }
    if (this.timeLeft() < 0) {
      this.alert.warning('Die maximale Dauer des Gigs wurde überschritten.')
    }
  }

  filterSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value.toLocaleLowerCase());
  }
  clearSearch(input: HTMLInputElement) {
    this.searchTerm.set('');
    input.value = '';
  }

  deleteSetlist() {
    const id = this.store.currentSetlist()?.id;
    if (id) {
      this.store.deleteSetlist(id);
    }
  }
}
