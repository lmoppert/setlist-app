import { computed, inject, Injectable, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom, tap } from 'rxjs';

import { ISong, ISetlist, ISetlistBase } from '@setlist-app/shared-types';
import { SetlistService } from './setlist-service';
import { AlertService } from '../core/alert.service'

@Injectable({ providedIn: 'root' })
export class SetlistStore {
  private service = inject(SetlistService)
  private router = inject(Router)
  private alert = inject(AlertService)

  // Single Setlist
  readonly activeSlug = signal<string | null>(null);
  readonly setlistResource = httpResource<ISetlist>(() => {
    const slug = this.activeSlug();
    return slug ? `/api/setlists/${slug}` : undefined;
  });
  readonly liveLink = computed(() => {
    const slug = this.activeSlug();
    return slug ? ['/live', slug] : null;
  });
  readonly currentSetlist = computed(() => this.setlistResource.value())
  readonly setlistIsLoading = computed(() => this.setlistResource.isLoading())
  readonly setlistError = computed(() => this.setlistResource.error())

  // List of setlists
  readonly listResource = httpResource<ISetlist[]>(() =>
    this.activeSlug() ? undefined : '/api/setlists'
  );
  readonly songResource = httpResource<ISong[]>(() => '/api/songs'); 
  readonly setlists = computed(() => this.listResource.value())
  readonly setlistsAreLoading = computed(() => this.listResource.isLoading())
  readonly setlistsError = computed(() => this.listResource.error())

  private reloadAllResources() {
    this.setlistResource.reload();
    this.listResource.reload();
  }
  loadListOfSetlists() {
    this.activeSlug.set(null);
  }
  loadSetlist(slug: string | null) {
    this.activeSlug.set(slug);
  }

  // List of available Songs, not yet on the setlist
  readonly availableSongs = computed(() => {
    const songs = this.songResource.value() ?? [];
    const entries = this.currentSetlist()?.entries ?? [];
    const usedSongIds = new Set(entries.map(e => e.songId));
    return songs.filter(s => !usedSongIds.has(s.id!));
  });

  // This is a derived state that combines the setlist entries with the
  // corresponding song details.
  readonly enrichedSetlist = computed(() => {
    const setlist = this.setlistResource.value();
    const songs = this.songResource.value() ?? [];
    if (!setlist || !songs || songs.length === 0 ) { return []; }

    return setlist.entries!.map(entry => ({
      ...entry,
      song: songs.find(song => song.id === entry.songId) || null
    }));
    // return setlist.entries!.map(entry => {
    //   const songData = songs.find(s => s.id === entry.songId);
    //   if (!songData) return { ...entry, song: null};
    //   const leads = songData.assignments
    //     ?.filetr(a => a.isLead)
    //     .map(a => a.member.name) || [];
    //   const myAssignments = songData.assignments || [];

    //   return {
    //     ...entry,
    //     song: {
    //       ...songData,
    //       leads,
    //       myAssignments,
    //     }
    //   };
    // });
  });

  // Calculate the total duration of the setlist by summing up the durations of
  // the individual songs.
  readonly totalDuration = computed(() => {
    const entries = this.enrichedSetlist();
    return entries.reduce((total, entry) => {
      const songDuration = entry.song?.duration ?? 0;
      return total + songDuration / 60;
    }, 0);
  })

  // create and update methods
  create(data: ISetlistBase) {
    return this.service.create(data).pipe(
      tap(() => this.listResource.reload())
    )
  }
  update(data: ISetlistBase) {
    const id = this.currentSetlist()?.id;
    if (!id) throw new Error('Keine aktive Setliste gefunden');
    return this.service.update(id, data).pipe(
      tap(() => {
        this.reloadAllResources(); 
      })
    );
  }

  // edit methods
  async addSong(songId: string, position: number) {
    const slug = this.activeSlug();
    if (!slug) return;
    await firstValueFrom(this.service.addSong(slug, songId, position));
    this.reloadAllResources(); 
  }
  async reorderEntry(entryId: string, newPosition: number) {
    const slug = this.activeSlug();
    if (!slug) return;
    await firstValueFrom(this.service.reorderEntry(slug, entryId, newPosition));
    this.reloadAllResources(); 
  }
  async removeEntry(entryId: string) {
    await firstValueFrom(this.service.removeEntry(entryId));
    this.reloadAllResources(); 
  }
  async deleteSetlist(id: string) {
    const confirmed = confirm('Möchtest du diese Setliste wirklich unwiderruflich löschen?');
    if (confirmed) {
      try {
        await firstValueFrom(this.service.delete(id));
        this.listResource.reload();
        this.alert.success('Setliste wurde erfolgreich gelöscht.')
        this.router.navigate(['/setlists']);
      } catch (err) {
        this.alert.error('Fehler beim Löschen der Setliste:' + err)
      }
    }
  }
  async toggleEncore(entryId: string) {
    const entry = this.currentSetlist()?.entries?.find(e => e.id === entryId);
    if (!entry) return;
    await firstValueFrom(this.service.toggleEntry(entryId, !entry.isEncore, 'isEncore'));
    this.reloadAllResources();
  }
  async toggleOptional(entryId: string) {
    const entry = this.currentSetlist()?.entries?.find(e => e.id === entryId);
    if (!entry) return;
    await firstValueFrom(this.service.toggleEntry(entryId, !entry.isOptional, 'isOptional'));
    this.reloadAllResources();
  }
}