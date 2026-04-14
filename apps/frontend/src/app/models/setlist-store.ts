import { httpResource } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { readonly } from '@angular/forms/signals';
import { Song } from '@setlist-app/shared-types';
import { Setlist } from '@setlist-app/shared-types';

@Injectable({ providedIn: 'root' })
export class SetlistStore {
  readonly setlistId = signal<string | null>(null);
  readonly setlistResource = httpResource<Setlist>(() => {
    const id = this.setlistId();
    return id ? `/api/setlists/${id}` : undefined;
  });

  readonly songResource = httpResource<Song[]>(() => '/api/songs'); 

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

  loadSetlist(id: string) {
    this.setlistId.set(id);
  }
}