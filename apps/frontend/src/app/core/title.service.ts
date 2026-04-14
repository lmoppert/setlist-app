import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root'})
export class TitleService {
  private readonly _title = signal<string>('Home');
  readonly title = this._title.asReadonly();

  setTitle(newTitle: string) {
    this._title.set(newTitle);
  }
}
