import { computed, inject, Injectable, signal } from "@angular/core";
import { SetlistStore } from "./setlist-store";

@Injectable({ providedIn: 'root' })
export class LiveService {
  private store = inject(SetlistStore);

  activeSongIndex = signal<number>(0);  
  activeCategory = signal<string>('SHEET');  
  categories = ['SHEET', 'LYRICS', 'BASS', 'RECORDING', 'OTHER'];

  readonly fileViewData = computed(() => {
    const entries = this.store.enrichedSetlist();
    const index = this.activeSongIndex();

    if (entries.length === 0) {
      return { prev: null, current: null, next: null, index: -1 };
    }
    return {
      prev: index > 0 ? entries[index - 1] : null,
      current: entries[index] ?? null,
      next: index < entries.length - 1 ? entries[index + 1] : null,
      index: index,
    };
  });

  nextSong() {
    const len = this.store.enrichedSetlist().length - 1;
    this.activeSongIndex.update(i => Math.min(i + 1, len));
  }

  prevSong() {
    this.activeSongIndex.update(i => Math.max(i - 1, 0));
  }

  setActiveSong(index: number) {
    this.activeSongIndex.set(index);
  }

  setActiveCategory(value: string) {
    this.activeCategory.set(value);
  }
}