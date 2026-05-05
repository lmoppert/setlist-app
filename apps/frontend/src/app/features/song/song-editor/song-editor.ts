import { Component, effect, inject, input, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from "@angular/material/progress-bar";

import { HasUnsavedChanges } from '../../../shared/guards/pending-changes.guard';
import { TitleService } from '../../../core/title.service';
import { SongForm } from "./song-form";
import { SongResources } from "./song-resource";
import { SongStore } from "../../../models/song-store";

@Component({
  selector: 'app-song-editor',
  imports: [MatProgressBarModule, MatTabsModule, SongForm, SongResources],
  template: `
    @if (store.songIsLoading()) {
      <mat-progress-bar mode="indeterminate"></mat-progress-bar>
    }
    <mat-tab-group>
      <mat-tab label="Details">
        <app-song-form [slug]="slug()" (formDirty)="emitFormStatus($event)"></app-song-form>
      </mat-tab>

      <mat-tab label="Dateien" [disabled]="!slug()">
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
  selectedType = 'SHEET';
  constructor(public dialogRef: MatDialogRef<ResourceTypeDialogComponent>) {}
}