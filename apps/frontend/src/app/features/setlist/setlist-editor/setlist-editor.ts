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
import { SongStore } from '../../../models/song-store';
import { TitleService } from '../../../core/title.service';
import { SongCard } from '../../song/song-card/song-card'
import { DurationPipe } from '../../../shared/pipes/duration.pipe';
import { AlertService } from '../../../core/alert.service'


@Component({
  selector: 'app-setlist-editor',
  imports: [MatProgressBarModule, MatFormFieldModule, MatInputModule,
    MatIconModule, CdkDrag, CdkDropList, CdkDropListGroup, SongCard,
    MatChipsModule, DurationPipe, MatTooltip, RouterLink, MatButtonModule
  ],
  templateUrl: './setlist-editor.html',
  styleUrl: './setlist-editor.scss',
})
export class SetlistEditor {
  protected setlistStore = inject(SetlistStore);
  protected songStore = inject(SongStore);
  private titleService = inject(TitleService);
  private alert = inject(AlertService)

  slug = input.required<string>();
  searchTerm = signal('');

  readonly filteredAvailableSongs = computed(() => {
    const songs = this.setlistStore.availableSongs();
    const term = this.searchTerm();
    if (!term) return songs;
    return songs.filter(song => 
      song.title.toLowerCase().includes(term) || 
      song.artist?.toLowerCase().includes(term)
    );
  });

  readonly timeLeft = computed(() =>{
    const songTime = this.setlistStore.totalDuration();
    const totalTime = this.setlistStore.currentSetlist()?.duration;
    if (totalTime) { 
      return (totalTime - songTime);
    }
    return 0;
  })

  constructor() {
    effect(() => {
      const currentSlug = this.slug();
      if (currentSlug && currentSlug !== 'new') {
        this.setlistStore.loadSetlist(currentSlug);
      }
      else {
        this.setlistStore.loadSetlist(null);
      }
    })

    effect(() => {
      let title: string = this.setlistStore.currentSetlist()?.location ?? ''; 
      const date = this.setlistStore.currentSetlist()?.date;
      if (date) {
        title += ` (${formatDate(date, 'dd.MM.yyyy', 'de-DE')})`; 
      }
      this.titleService.setTitle(location ? title : 'Setliste bearbeiten');
    })
  }

  async moveSong(event: CdkDragDrop<any[]>) {
    const previousContainerId = event.previousContainer.id;
    const currentContainerId = event.container.id;
    console.log(`Move Container: ${previousContainerId} => ${currentContainerId}`)

    if (previousContainerId === currentContainerId && currentContainerId === 'setlist-songs') {
      const entry = event.item.data as ISetlistEntry;
      const newPosition = event.currentIndex + 1;
      await this.setlistStore.reorderEntry(entry.id!, newPosition);
    }
    else if (previousContainerId === 'available-songs' && currentContainerId === 'setlist-songs') {
      const song = event.item.data as ISong;
      const position = event.currentIndex + 1;
      this.setlistStore.addSong(song.id!, position);
    }
    else if (previousContainerId === 'setlist-songs' && currentContainerId === 'available-songs') {
      const entry = event.item.data as ISetlistEntry;
      this.setlistStore.removeEntry(entry.id!);
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
    const id = this.setlistStore.currentSetlist()?.id;
    if (id) {
      this.setlistStore.deleteSetlist(id);
    }
  }
}
