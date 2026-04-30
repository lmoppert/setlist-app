import { Component, computed, inject, input, output, signal } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from "@angular/material/button";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

import { ISetlistEntryWithSong, ISongDisplayData } from '@setlist-app/shared-types';
import { DurationPipe } from '../../../shared/pipes/duration.pipe';
import { FormatMonospacePipe } from '../../../shared/pipes/monospace.pipe';
import { InitialsPipe } from '../../../shared/pipes/initials.pipe';

@Component({
  selector: 'app-song-card',
  imports: [
    MatChipsModule, DurationPipe, FormatMonospacePipe, InitialsPipe,
    MatIconModule, MatButtonModule, MatSlideToggleModule, MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './song-card.html',
  styleUrl: './song-card.scss',
})
export class SongCard {
  data = input.required<ISetlistEntryWithSong>();
  activate = output();

  setActive() {
    this.activate.emit();
  }

  displayData = computed<ISongDisplayData>(() => {
    const d = this.data();
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
    }
  });
}
