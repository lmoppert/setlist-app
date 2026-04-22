import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

import { SetlistEntry as EntryType, Song } from '@setlist-app/shared-types';
import { SetlistStore } from '../../../models/setlist-store';
import { SongStore } from '../../../models/song-store';
import { TitleService } from '../../../core/title.service';
import { SongCard } from '../song-card/song-card'
import { DurationPipe } from '../../../shared/pipes/duration.pipe';


@Component({
  selector: 'app-setlist-editor',
  imports: [MatProgressBarModule, MatFormFieldModule, MatInputModule,
    MatIconModule, CdkDrag, CdkDropList, CdkDropListGroup, SongCard,
    MatChipsModule, DurationPipe
  ],
  templateUrl: './setlist-editor.html',
  styleUrl: './setlist-editor.scss',
})
export class SetlistEditor {
  protected setlistStore = inject(SetlistStore);
  protected songStore = inject(SongStore);
  private titleService = inject(TitleService);

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
      const location = this.setlistStore.currentSetlist()?.location; 
      this.titleService.setTitle(location ? `Gig ${location}` : 'Setliste bearbeiten');
    })
  }

  async moveSong(event: CdkDragDrop<any[]>) {
    const previousContainerId = event.previousContainer.id;
    const currentContainerId = event.container.id;
    console.log(`Move Container: ${previousContainerId} => ${currentContainerId}`)

    if (previousContainerId === currentContainerId && currentContainerId === 'setlist-songs') {
      const entry = event.item.data as EntryType;
      const newPosition = event.currentIndex + 1;
      await this.setlistStore.reorderEntry(entry.id!, newPosition);
    }
    else if (previousContainerId === 'available-songs' && currentContainerId === 'setlist-songs') {
      const song = event.item.data as Song;
      const position = event.currentIndex + 1;
      this.setlistStore.addSong(song.id!, position);
    }
    else if (previousContainerId === 'setlist-songs' && currentContainerId === 'available-songs') {
      const entry = event.item.data as EntryType;
      this.setlistStore.removeEntry(entry.id!);
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
}
