import { Component, computed, effect, inject, input, signal } from '@angular/core';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray,
  transferArrayItem } from '@angular/cdk/drag-drop';

import { SetlistStore } from '../../../models/setlist-store';
import { SongStore } from '../../../models/song-store';
import { TitleService } from '../../../core/title.service';
import { SetlistEntry, Song } from '@setlist-app/shared-types';


@Component({
  selector: 'app-setlist-editor',
  imports: [MatProgressBarModule, MatFormFieldModule, MatInputModule, CdkDrag,
    CdkDropList, CdkDropListGroup, 
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
    const songs = this.setlistStore.availableSongs(); // Das Signal, das wir schon hatten
    const term = this.searchTerm();
    if (!term) return songs;
    return songs.filter(song => 
      song.name.toLowerCase().includes(term) || 
      song.artist?.toLowerCase().includes(term)
    );
  });

  constructor() {
    effect(() => {
      const currentSlug = this.slug();
      if (currentSlug && currentSlug !== 'new') {
        this.setlistStore.loadSetlistBySlug(currentSlug);
      } else {
        this.setlistStore.loadSetlist(null);
      }
    })

    effect(() => {
      const location = this.setlistStore.currentSetlist()?.location; 
      this.titleService.setTitle(location ? `Gig in ${location}` : 'Setliste bearbeiten');
    })
  }

  moveSong(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      // Nur sortieren innerhalb der Liste
    } else {
      // Verschieben zwischen den Listen
      if (event.container.id === 'setlist-list') {
        const song = event.item.data as Song;
        this.setlistStore.addSong(song.id!, event.currentIndex);
      } else {
        const entry = event.item.data as SetlistEntry;
        this.setlistStore.removeEntry(entry.id!);
      }
    }
  }

  filterSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value.toLocaleLowerCase());
  }
}
