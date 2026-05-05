import { computed, inject, Injectable, signal } from "@angular/core";
import { SetlistStore } from "./setlist-store";

@Injectable({ providedIn: 'root' })
export class LiveService {
  private store = inject(SetlistStore);

  private activeSongIndex = signal<number>(0);  

  readonly fileViewData = computed(() => {
    const songs = this.store.enrichedSetlist();
    const index = this.activeSongIndex();

    if (songs.length === 0) {
      return { prev: null, current: null, next: null };
    }
    return {
      prev: index > 0 ? songs[index - 1] : null,
      current: songs[index] ?? null,
      next: index < songs.length - 1 ? songs[index + 1] : null
    };
  });

  nextSong() {
    const len = this.store.enrichedSetlist().length - 1;
    this.activeSongIndex.update(i => Math.min(i + 1, len));
  }

  prevSong() {
    this.activeSongIndex.update(i => Math.max(i - 1, 0));
  }

}