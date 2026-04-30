import { Component, computed, inject, input, output } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

import {
  ISong, isSetlistEntryWithSong, ISetlistEntryWithSong, ISongDisplayData
} from '@setlist-app/shared-types';
import { DurationPipe } from '../../../shared/pipes/duration.pipe';
import { FormatMonospacePipe } from '../../../shared/pipes/monospace.pipe';
import { InitialsPipe } from '../../../shared/pipes/initials.pipe';

@Component({
  selector: 'app-setlist-entry',
  imports: [
    DurationPipe, FormatMonospacePipe, InitialsPipe, MatChipsModule,
    MatIconModule, MatButtonModule, MatMenuModule, MatDividerModule
  ],
  templateUrl: './setlist-entry.html',
  styleUrl: './setlist-entry.scss',
})
export class EntryCard {
  data = input.required<ISong | ISetlistEntryWithSong>();

  displayData = computed<ISongDisplayData>(() => {
    const d = this.data();

    if (isSetlistEntryWithSong(d)) {
      return {
        title: d.song?.title ?? 'Unbekannter Song',
        subtitle: d.song?.artist ?? '',
        duration: d.song?.duration ?? 0,
        tempo: d.song?.tempo ?? 0,
        key: d.song?.key ?? '',
        leadVocals: d.song?.leadVocals ?? '',
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
        leadVocals: d.leadVocals ?? '',
        isEntry: false,
        originalData: d
      }
    }
  });
}
