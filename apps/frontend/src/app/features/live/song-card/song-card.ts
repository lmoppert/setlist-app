import { Component, computed, inject, input, output, signal } from '@angular/core';

import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from "@angular/material/button";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ISetlistEntryWithSong, ISongDisplayData } from '@setlist-app/shared-types';
import { SetlistContextMenu } from '../../../shared/menu/setlist-context-menu';
import { SongStore } from '../../../models/song-store';
import { DurationPipe } from '../../../shared/pipes/duration.pipe';
import { FormatMonospacePipe } from '../../../shared/pipes/monospace.pipe';
import { InitialsPipe } from '../../../shared/pipes/initials.pipe';
import { TuningPipe } from '../../../shared/pipes/tuning.pipe';
import { InstrumentPipe } from '../../../shared/pipes/instrument.pipe';

@Component({
  selector: 'app-song-card',
  imports: [
    MatChipsModule, DurationPipe, FormatMonospacePipe, InitialsPipe,
    MatIconModule, MatButtonModule, MatSlideToggleModule, MatMenuModule,
    MatDividerModule, MatTooltipModule, SetlistContextMenu, InstrumentPipe,
    TuningPipe
  ],
  templateUrl: './song-card.html',
  styleUrl: './song-card.scss',
})
export class SongCard {
  protected store = inject(SongStore);
  data = input.required<ISetlistEntryWithSong>();
  prevData = input<ISetlistEntryWithSong>();
  activeMember = input<string | null>();
  activate = output();

  dragReady = signal(false);
  private pressTimer: any;
  private wasLongPress = false;

  setActive() {
    if (this.wasLongPress) return;
    this.activate.emit();
  }

  getMemberName(id: string | null): string | undefined {
    return this.store.members()?.find(m => m.id === id)?.name;
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

  alerts = computed(() => {
    const current = this.data();
    const prev = this.prevData();
    const memberId = this.activeMember();

    return current.song?.instruments?.filter(
        inst => !memberId || inst.memberId === memberId
      ).map(inst => {
        const prevInst = prev?.song?.instruments?.find(
          p => p.memberId === inst.memberId
        );
        return {
          member: inst.memberId,
          instrument: inst.name,
          tuning: inst.tuning,
          isSwap: prevInst && prevInst.name !== inst.name,
          isTuning: prevInst && prevInst.tuning !== inst.tuning
        };
      })
      .filter(a => a.isSwap || a.isTuning);
  });

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
