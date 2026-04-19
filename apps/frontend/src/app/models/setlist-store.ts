import { httpResource } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { Song } from '@setlist-app/shared-types';
import { Setlist } from '@setlist-app/shared-types';

@Injectable({ providedIn: 'root' })
export class SetlistStore {
  // Single Setlist
  readonly setlistId = signal<string | null>(null);
  readonly setlistResource = httpResource<Setlist>(() => {
    const id = this.setlistId();
    return id ? `/api/setlists/${id}` : undefined;
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
      return total + songDuration;
    }, 0);
  })

  loadSetlist(id: string | null) {
    this.setlistId.set(id);
  }
}