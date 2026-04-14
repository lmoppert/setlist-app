import { httpResource } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { Gig } from '@setlist-app/shared-types';

@Injectable({ providedIn: 'root', })
export class GigStore {
  // List of all gigs
  readonly listResource = httpResource<Gig[]>(() => '/api/gigs');
  readonly gigs = computed(() => this.listResource.value() ?? [])
  readonly listIsLoading = computed(() => this.listResource.isLoading());
  readonly listError = computed(() => this.listResource.error());

  refreshList() {
    this.listResource.reload();
  }

  // Single selected gig
  readonly selectedGigId = signal<string | null>(null);
  readonly gigResource = httpResource<Gig>(() => {
    const id = this.selectedGigId();
    return id ? `/api/gigs/${id}` : undefined;
  });
  readonly currentGig = computed(() => this.gigResource.value());
  readonly gigIsLoading = computed(() => this.gigResource.isLoading());
  readonly gigError = computed(() => this.gigResource.error());

  selectGig(id: string | null) {
    this.selectedGigId.set(id);
  }

  refresh() {
    this.gigResource.reload();
  }
}