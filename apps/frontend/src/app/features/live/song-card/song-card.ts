import { Component, computed, inject, input, output, signal } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from "@angular/material/button";
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

import { ISong } from '@setlist-app/shared-types';
import { DurationPipe } from '../../../shared/pipes/duration.pipe';
import { FormatMonospacePipe } from '../../../shared/pipes/monospace.pipe';
import {
  isSetlistEntryWithSong, ISetlistEntryWithSong, ISongDisplayData
} from '../../../shared/types/song-entry';

@Component({
  selector: 'app-song-card',
  imports: [
    MatChipsModule, DurationPipe, FormatMonospacePipe, MatIconModule,
    MatButtonModule, MatSlideToggleModule
  ],
  templateUrl: './song-card.html',
  styleUrl: './song-card.scss',
})
export class SongCard {
  data = input.required<ISong | ISetlistEntryWithSong>();
  activate = output();

  setActive() {
    this.activate.emit();
  }

  displayData = computed<ISongDisplayData>(() => {
    const d = this.data();

    if (isSetlistEntryWithSong(d)) {
      return {
        title: d.song?.title ?? 'Unbekannter Song',
        subtitle: d.song?.artist ?? '',
        duration: d.song?.duration ?? 0,
        tempo: d.song?.tempo ?? 0,
        key: d.song?.key ?? '',
        position: d.position,
        isEncore: d.isEncore,
        isOptional: d.isOptional,
        isEntry: true,
        originalData: d
      };
    } else {
      return {
        title: d.title ?? 'Unbekannter Song',
        subtitle: d.artist,
        duration: d.duration ?? 0,
        tempo: d.tempo ?? 0,
        key: d.key ?? '',
        isEntry: false,
        originalData: d
      }
    }
  });
}
