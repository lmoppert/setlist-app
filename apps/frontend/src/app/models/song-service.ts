import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ISong } from '@setlist-app/shared-types';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SongService {
  private readonly http = inject(HttpClient);

  create(data: ISong) {
    return this.http.post<ISong>('/api/songs/', data);
  }

  update(slug: string, data: ISong) {
    return this.http.patch<ISong>(`/api/songs/${slug}`, data);
  }

  async toggleActive(id: string) {
    try {
      await firstValueFrom(this.http.patch(`/api/songs/${id}/toggle-active`, {}));
    } catch (error) {
      console.error('Error toggling song active status:', error);
    }
  }
}