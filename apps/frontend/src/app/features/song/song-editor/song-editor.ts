import { Component, computed, effect, inject, input, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";

import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatBadgeModule } from '@angular/material/badge';

import { HasUnsavedChanges } from '../../../shared/guards/pending-changes.guard';
import { TitleService } from '../../../core/title.service';
import { SongForm } from "./song-form";
import { SongResources } from "./song-resource";
import { SongStore } from "../../../models/song-store";

@Component({
  selector: 'app-song-editor',
  imports: [
    MatBadgeModule, MatProgressBarModule, MatTabsModule, SongForm, SongResources,
    MatIconModule, MatButtonModule, RouterLink
],
  template: `
    @if (store.songIsLoading()) {
      <mat-progress-bar mode="indeterminate"></mat-progress-bar>
    }
    @let resCount = resources().length;
    <mat-tab-group>
      <mat-tab label="Details">
        <button matButton type="button" routerLink="/songs">
          <mat-icon>chevron_left</mat-icon> Zurück zur Song-Übersicht
        </button>
        <app-song-form [slug]="slug()" (formDirty)="emitFormStatus($event)"></app-song-form>
      </mat-tab>

      <mat-tab [disabled]="!slug()">
        <ng-template mat-tab-label>
          <div [matBadge]="resCount" matBadgeOverlap="false" [matBadgeHidden]="resCount === 0">
            Dateien&nbsp;
          </div>
        </ng-template>
        <button matButton type="button" routerLink="/songs">
          <mat-icon>chevron_left</mat-icon> Zurück zur Song-Übersicht
        </button>
        @if (slug()) {
          <app-song-resources [slug]="slug()"></app-song-resources>
        }
      </mat-tab>
    </mat-tab-group>
  `,
})
export class SongEditor implements HasUnsavedChanges {
  protected store = inject(SongStore);
  protected titleService = inject(TitleService);
  slug = input.required<string>();

  readonly resources = computed(() => this.store.currentSong()?.resources ?? []);

  isFormDirty = signal(false);
  hasUnsavedChanges(): boolean { return this.isFormDirty(); };
  emitFormStatus(isDirty: boolean) { this.isFormDirty.set(isDirty) };

  constructor() {
    effect(() => {
      this.titleService.setTitle('Song bearbeiten');
    })
  }
}

@Component({
  selector: 'app-resource-type-dialog',
  standalone: true,
  imports: [MatDialogModule, MatIconModule, MatButtonModule, MatRadioModule, FormsModule],
  template: `
    <h2 mat-dialog-title>Dateityp auswählen</h2>
    <mat-dialog-content>
      <mat-radio-group [(ngModel)]="selectedType" class="flex flex-col gap-2">
        <mat-radio-button value="SHEET">Leadsheet</mat-radio-button>
        <mat-radio-button value="LYRICS">Songtext</mat-radio-button>
        <mat-radio-button value="BASS">Bass-Tabs</mat-radio-button>
        <mat-radio-button value="RECORDING">Aufnahme</mat-radio-button>
        <mat-radio-button value="OTHER">Sonstige</mat-radio-button>
      </mat-radio-group>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button matButton (click)="dialogRef.close()">Abbrechen</button>
      <button matButton="filled" [mat-dialog-close]="selectedType">Hochladen</button>
    </mat-dialog-actions>
  `
})
export class ResourceTypeDialogComponent {
  selectedType = 'BASS';
  constructor(public dialogRef: MatDialogRef<ResourceTypeDialogComponent>) {}
}