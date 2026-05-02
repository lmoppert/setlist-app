import { computed, Injectable, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';

import { IBandMember, ISong } from '@setlist-app/shared-types';

@Injectable({ providedIn: 'root' })
export class SongStore {
  // List of songs
  readonly listResource = httpResource<ISong[]>(() => '/api/songs'); 
  readonly songs = computed(() => this.listResource.value())
  readonly songsAreLoading = computed(() => this.listResource.isLoading())
  readonly songsError = computed(() => this.listResource.error())

  // List of members
  readonly membersResource = httpResource<IBandMember[]>(() => '/api/members');
  readonly members = computed(() => this.membersResource.value())
  readonly membersAreLoading = computed(() => this.membersResource.isLoading())
  readonly membersError = computed(() => this.membersResource.error())

  refreshList() {
    this.listResource.reload();
  }
}