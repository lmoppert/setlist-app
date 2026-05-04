import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';

import { IBandMember, ISong } from '@setlist-app/shared-types';
import { SongService } from './song-service';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SongStore {
  private service = inject(SongService);

  // List of songs
  readonly listResource = httpResource<ISong[]>(() => '/api/songs'); 
  readonly songs = computed(() => this.listResource.value() ?? []);
  readonly activeSongs = computed(() => {
    const all = this.listResource.value() ?? [];
    return all.filter(song => song.isActive);
  });
  readonly songsAreLoading = computed(() => this.listResource.isLoading())
  readonly songsError = computed(() => this.listResource.error())
  refreshList() { this.listResource.reload(); }

  // List of members
  readonly membersResource = httpResource<IBandMember[]>(() => '/api/members');
  readonly members = computed(() => this.membersResource.value())
  readonly membersAreLoading = computed(() => this.membersResource.isLoading())
  readonly membersError = computed(() => this.membersResource.error())

  // Single song
  readonly activeSlug = signal<string | null>(null);
  readonly songResource = httpResource<ISong>(() => {
    const slug = this.activeSlug();
    return slug ? `/api/songs/${slug}` : undefined;
  });
  readonly currentSong = computed(() => this.songResource.value())
  readonly songIsLoading = computed(() => this.songResource.isLoading())
  readonly songError = computed(() => this.songResource.error())

  // Methods to load data
  private reloadAllResources() {
    this.songResource.reload();
    this.listResource.reload();
  }
  loadListOfSongs() {
    this.activeSlug.set(null);
  }
  loadSong(slug: string | null) {
    this.activeSlug.set(slug);
  }

  // Create and update methods
  create(data: ISong) {
    return this.service.create(data).pipe(
      tap(() => this.listResource.reload())
    )
  }
  update(data: ISong) {
    const id = this.currentSong()?.id;
    if (!id) throw new Error('Keine aktive Setliste gefunden');
    return this.service.update(id, data).pipe(
      tap(() => {
        this.reloadAllResources(); 
      })
    );
  }
  async toggleActive(id: string) {
    const song = this.songs()?.find(e => e.id === id);
    if (!song) return;
    this.service.toggleActive(id);
    this.listResource.reload();
  }
}