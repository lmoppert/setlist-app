import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { ISong } from '@setlist-app/shared-types';
import { SongStore } from '../../../models/song-store';
import { TitleService } from '../../../core/title.service';
import { AlertService } from '../../../core/alert.service';
import { FormatMonospacePipe } from '../../../shared/pipes/monospace.pipe';

@Component({
  selector: 'app-songs',
  imports: [
    RouterLink, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule,
    MatTableModule, MatSlideToggleModule, MatProgressBarModule, FormatMonospacePipe
  ],
  templateUrl: './songs.html',
  styleUrl: './songs.scss',
})
export class Songs {
  protected store = inject(SongStore);
  protected titleService = inject(TitleService);
  protected alert = inject(AlertService)

  searchTerm = signal('');
  displayedColumns: string[] = ['title', 'key', 'tempo', 'vocals', 'resources', 'actions'];

  readonly filteredSongs = computed(() => {
    const songs = this.store.songs() ?? [];
    const term = this.searchTerm();

    if (!term) return songs;

    return songs.filter(song => 
      song.title.toLowerCase().includes(term) || 
      song.artist?.toLowerCase().includes(term) ||
      song.leadVocals?.toLowerCase().includes(term)
    );
  });

  constructor() {
    this.titleService.setTitle('Liste unserer Songs');
  }

  applyFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value.toLocaleLowerCase());
  }
  clearSearch(input: HTMLInputElement) {
    this.searchTerm.set('');
    input.value = '';
  }
}
