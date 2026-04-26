import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ISetlist, ISetlistBase } from '@setlist-app/shared-types';

@Injectable({ providedIn: 'root' })
export class SetlistService {
  private readonly http = inject(HttpClient);

  create(data: ISetlistBase) {
    return this.http.post<ISetlist>('/api/setlists/', data);
  }

  update(id: string, data: ISetlistBase) {
    return this.http.patch<ISetlist>(`/api/setlists/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete(`/api/setlists/${id}`);
  }

  addSong(slug: string, songId: string, position: number) {
    return this.http.post(`/api/setlists/${slug}/entries`, {
      songId,
      position,
      isOptional: false,
      isEncore: false
    });
  }

  reorderEntry(slug: string, entryId: string, newPosition: number) {
    return this.http.patch(`/api/setlists/${slug}/entries/reorder`, {
      entryId,
      newPosition
    });
  }

  removeEntry(entryId: string) {
    return this.http.delete(`/api/setlists/entries/${entryId}`);
  }
}