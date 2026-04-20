import { Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatIcon } from "@angular/material/icon";
import { MatIconButton } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

import { SetlistStore } from '../../../models/setlist-store';
import { Song } from '@setlist-app/shared-types';
import { DurationPipe } from '../../../shared/pipes/duration.pipe';
import { FormatMonospacePipe } from '../../../shared/pipes/monospace.pipe';

//import { SongService } from '../../models/song-service';
//import { SelectionService } from '../../models/selection-service';

@Component({
  selector: 'app-setlist-entry',
  imports: [MatIcon, MatIconButton, MatChipsModule, DurationPipe,
    FormatMonospacePipe, RouterLink
  ],
  templateUrl: './setlist-entry.html',
  styleUrl: './setlist-entry.scss',
})
export class SetlistEntry {
  protected store = inject(SetlistStore);

  // private songService = inject(SongService);
  // //private selectionService = inject(SelectionService);

  // // Die neuen funktionalen In- und Outputs verwenden.
  // song = input.required<Song>();
  // delete = output();

  // selected = computed(() => this.selectionService.isSongInSetlist(this.song().id!)());

  // toggleSongSelected() {
  //   if (!this.selected()) {
  //     this.selectionService.addSong(this.song());
  //   } else if (this.song().id) {
  //     this.selectionService.removeSong(this.song().id!);
  //   }
  // }

  // deleteSong(song: Song) {
  //   if (!song.id) return;
  //   if (!confirm('Song "${song.title}" wirklich löschen?')) return;

  //   this.songService.delete(song.id).subscribe({
  //     next: () => this.delete.emit(),
  //     error: err => console.error('Deleting song failed.', err),
  //   });
  // }
}
