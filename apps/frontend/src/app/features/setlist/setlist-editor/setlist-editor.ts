import { Component, effect, inject, input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SetlistStore } from '../../../models/setlist-store';
import { TitleService } from '../../../core/title.service';

@Component({
  selector: 'app-setlist-editor',
  imports: [MatProgressBarModule],
  templateUrl: './setlist-editor.html',
  styleUrl: './setlist-editor.scss',
})
export class SetlistEditor {
  protected store = inject(SetlistStore);
  private titleService = inject(TitleService);

  id = input<string>();

  constructor() {
    effect(() => {
      const currentId = this.id();
      if (currentId && currentId !== 'new') {
        this.store.loadSetlist(currentId);
      } else {
        this.store.loadSetlist(null);
      }
    })

    effect(() => {
      const location = this.store.currentSetlist()?.location; 
      this.titleService.setTitle(location ? `Gig in ${location}` : 'Setliste bearbeiten');
    })
  }
}
