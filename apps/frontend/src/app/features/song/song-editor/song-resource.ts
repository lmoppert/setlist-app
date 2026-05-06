import { Component, computed, effect, inject, input, signal, untracked } from "@angular/core";

import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";

import { SetlistService } from "../../../models/setlist-service";
import { SongStore } from "../../../models/song-store";
import { ResourceTypeDialogComponent } from "./song-editor";
import { FiletypePipe } from "../../../shared/pipes/icon.pipe";

@Component({
  selector: 'app-song-resources',
  standalone: true,
  imports: [MatListModule, MatButtonModule, MatIconModule, FiletypePipe],
  template: `
    <div class="upload-section">
      <h2>{{ currentSong()?.title }}</h2>
      <h3>Ressourcen & Dokumente</h3>
      <input #fileInput type="file" hidden (change)="uploadResource($event)" accept=".pdf,.txt,.md,.mp3">
      <button matButton="elevated" (click)="fileInput.click()">
        <mat-icon>add</mat-icon> Datei hinzufügen
      </button>
      <mat-list>
        @for (res of resources(); track res.id) {
          <mat-list-item>
            <mat-icon matListItemIcon>
              {{ res.filetype | ftIcon }}
            </mat-icon>
            <div matListItemTitle>{{ res.type }}: {{ res.filetype }}</div>
            <div matListItemLine>{{ res.path }}</div>
            <button matIconButton matListItemMeta (click)="delete(res.id)">
              <mat-icon class="delete">delete</mat-icon>
            </button>
          </mat-list-item>
        } @empty {
          <p class="empty-hint">Keine Ressourcen für diesen Song hinterlegt.</p>
        }
      </mat-list>
    </div>
  `,
  styles: `
    :host {
      padding: 20px 50px;
      display: flex;
    }
    h3 {
      margin-top: 32px;
      margin-bottom: 16px;
      font-weight: 500;
      color: var(--mat-sys-primary);
      display: flex;
      align-items: center;
      gap: 8px;

      &::before {
        content: 'attachment';
        font-family: 'Material Icons';
        font-size: 24px;
      }
    }
    .delete {
      color: var(--mat-sys-error);
    }
  `
})
export class SongResources {
  private service = inject(SetlistService)
  private store = inject(SongStore)
  private dialog = inject(MatDialog);

  slug = input.required<string>();

  readonly currentSong = this.store.currentSong;
  readonly resources = computed(() => this.currentSong()?.resources ?? []);
  readonly songId = computed(() => this.currentSong()?.id ?? null);

  constructor() {
    effect(() => {
      const currentSlug = this.slug();
      if(currentSlug || currentSlug !== 'new') {
        untracked(() => this.store.loadSong(currentSlug));
      }
    });
  }

  uploadResource(event: any) {
    const file = event.target.files[0];
    const songId = this.songId();

    if (!file || !songId) return;

    const dialogRef = this.dialog.open(ResourceTypeDialogComponent, { width: '300px', height: '280px' });

    dialogRef.afterClosed().subscribe(result => {
      console.log('[DEBUG] result:', result)
      if(result) {
        this.service.uploadResource(songId, result, file).subscribe(() => {
          // this.store.loadSong(this.slug());
          console.log('[DEBUG] state:', this.store.songResource.isLoading())
          this.store.songResource.reload();
          this.store.listResource.reload();
          event.target.value = '';
        });
      }
    });
  }

  delete(id: string) {
    this.service.delete(id).subscribe(() => this.store.loadSong(this.slug()));
  }
}