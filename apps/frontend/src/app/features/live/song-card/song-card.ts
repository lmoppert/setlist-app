import { Component, computed, input, output, signal } from '@angular/core';

import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from "@angular/material/button";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ISetlistEntryWithSong, ISongDisplayData } from '@setlist-app/shared-types';
import { DurationPipe } from '../../../shared/pipes/duration.pipe';
import { FormatMonospacePipe } from '../../../shared/pipes/monospace.pipe';
import { InitialsPipe } from '../../../shared/pipes/initials.pipe';
import { SetlistContextMenu } from '../../../shared/menu/setlist-context-menu';

@Component({
  selector: 'app-song-card',
  imports: [
    MatChipsModule, DurationPipe, FormatMonospacePipe, InitialsPipe,
    MatIconModule, MatButtonModule, MatSlideToggleModule, MatMenuModule,
    MatDividerModule, MatTooltipModule, SetlistContextMenu
  ],
  templateUrl: './song-card.html',
  styleUrl: './song-card.scss',
})
export class SongCard {
  data = input.required<ISetlistEntryWithSong>();
  activate = output();

  dragReady = signal(false);
  private pressTimer: any;
  private wasLongPress = false;

  setActive() {
    if (this.wasLongPress) return;
    this.activate.emit();
  }

  trackPointerDown(){
    this.dragReady.set(false);
    this.wasLongPress = false;
    this.pressTimer = setTimeout(() => {
      this.dragReady.set(true);
      this.wasLongPress = true;
    }, 1000);
  }
  trackPointerUp () {
    clearTimeout(this.pressTimer);
    this.dragReady.set(false);
  }

  showTooltip = computed<string>(() => {
    const d = this.data();
    let msg = 'Verwende das ⁝ Menü oder Rechtsklick für weitere Optionen.';
    if (d.isEncore) msg = '... ist eine Zugabe!\n' + msg;
    if (d.isAccustic) msg = '... ist akustisch!\n' + msg;
    return msg;
  });

  displayData = computed<ISongDisplayData>(() => {
    const d = this.data();
    return {
      id: d.id!,
      slug: d.song?.slug ?? '',
      title: d.song?.title ?? 'Unbekannter Song',
      subtitle: d.song?.artist ?? '',
      duration: d.song?.duration ?? 0,
      tempo: d.song?.tempo ?? 0,
      key: d.song?.key ?? '',
      leadVocals: d.song?.leadVocals ?? '',
      position: d.position,
      isEncore: d.isEncore,
      isAccustic: d.isAccustic,
      isEntry: true,
      originalData: d
    }
  });
}
