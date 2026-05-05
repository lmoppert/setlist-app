import { Component, effect, inject, input, signal } from "@angular/core";

import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";

import { SetlistService } from "../../../models/setlist-service";
import { SongStore } from "../../../models/song-store";
import { ResourceTypeDialogComponent } from "./song-editor";

@Component({
  selector: 'app-song-resources',
  standalone: true,
  imports: [MatListModule, MatButtonModule, MatIconModule],
  template: `
    <div class="upload-section">
      <h3>Ressourcen & Dokumente</h3>
      <input #fileInput type="file" hidden (change)="uploadResource($event)" accept=".pdf,.txt,.md,.mp3">
      <button matButton="elevated" (click)="fileInput.click()">
        <mat-icon>add</mat-icon> Datei hinzufügen
      </button>
      <mat-list>
        @for (res of resources(); track res.id) {
          <mat-list-item>
            <mat-icon matListItemIcon>
              {{ getFileIcon(res.filetype) }}
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
  resources = signal<any[]>([]);
  songId = signal<string | null>(null);

  constructor() {
    effect(() => {
      const currentSlug = this.slug();
      const isLoading = this.store.songIsLoading();
      if(isLoading || !currentSlug || currentSlug === 'new') {
        this.store.loadSong(currentSlug);
        return;
      }
      const song = this.store.currentSong()
      if (song) {
        this.resources.set(song.resources ?? []);
        this.songId.set(song.id || null)
        console.log('Resources:', song.resources)
      }
    });
  }

  uploadResource(event: any) {
    const file = event.target.files[0];
    const songId = this.songId();
    if (!file) return;
    const dialogRef = this.dialog.open(ResourceTypeDialogComponent, {
      width: '300px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        if (songId) this.service.uploadResource(songId, result, file).subscribe(() => {
          this.store.loadSong(this.slug());
          event.target.value = '';
        });
      }
    });
  }

  delete(id: string) {
    this.service.delete(id).subscribe(() => this.store.loadSong(this.slug()));
  }

  getFileIcon(type: string) {
    if (type === 'PDF') return 'picture_as_pdf';
    if (type === 'TXT') return 'lyrics';
    if (type === 'MD') return 'description';
    return 'audio_file';
  }
}