import { computed, inject, Injectable, signal } from '@angular/core';
import { httpResource, HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { Song } from '@setlist-app/shared-types';
import { Setlist } from '@setlist-app/shared-types';

@Injectable({ providedIn: 'root' })
export class SetlistStore {
  private readonly http = inject(HttpClient);

  // Single Setlist
  readonly activeSlug = signal<string | null>(null);
  readonly setlistResource = httpResource<Setlist>(() => {
    const slug = this.activeSlug();
    return slug ? `/api/setlists/${slug}` : undefined;
  });
  readonly currentSetlist = computed(() => this.setlistResource.value())
  readonly setlistIsLoading = computed(() => this.setlistResource.isLoading())
  readonly setlistError = computed(() => this.setlistResource.error())

  // List of setlists
  readonly listResource = httpResource<Setlist[]>(() => '/api/setlists');
  readonly songResource = httpResource<Song[]>(() => '/api/songs'); 
  readonly setlists = computed(() => this.listResource.value())
  readonly setlistsAreLoading = computed(() => this.listResource.isLoading())
  readonly setlistsError = computed(() => this.listResource.error())

  refreshList() {
    this.listResource.reload();
  }

  // List of available Songs, not yet on the setlist
  readonly availableSongs = computed(() => {
    const songs = this.songResource.value() ?? [];
    const entries = this.currentSetlist()?.entries ?? [];
    const usedSongIds = new Set(entries.map(e => e.songId));
    
    return songs.filter(s => !usedSongIds.has(s.id!));
  });

  // This is a derived state that combines the setlist entries with the corresponding song details.
  readonly enrichedSetlist = computed(() => {
    const setlist = this.setlistResource.value();
    const songs = this.songResource.value() ?? [];

    if (!setlist) { return []; }

    return setlist.entries!.map(entry => ({
      ...entry,
      song: songs.find(song => song.id === entry.songId) || null
    }));
  });

  // Calculate the total duration of the setlist by summing up the durations of the individual songs.
  readonly totalDuration = computed(() => {
    const entries = this.enrichedSetlist();
    return entries.reduce((total, entry) => {
      const songDuration = entry.song?.duration ?? 0;
      return total + songDuration / 60;
    }, 0);
  })

  loadSetlist(slug: string | null) {
    this.activeSlug.set(slug);
  }

  // edit methods
  async addSong(songId: string, position: number) {
    if (!this.activeSlug) return;

    await firstValueFrom(this.http.post(`/api/setlists/${this.activeSlug()}/entries`, {
      songId,
      position,
      isOptional: false,
      isEncore: false
    }));
    this.setlistResource.reload();
  }

  async reorderEntry(entryId: string, newPosition: number) {
    await firstValueFrom(this.http.patch(`/api/setlists/${this.activeSlug()}/entries/reorder`, {
      entryId,
      newPosition
    }));
    this.setlistResource.reload();
  }

  async removeEntry(entryId: string) {
    await firstValueFrom(this.http.delete(`/api/setlists/entries/${entryId}`));
    this.setlistResource.reload();
  }
}