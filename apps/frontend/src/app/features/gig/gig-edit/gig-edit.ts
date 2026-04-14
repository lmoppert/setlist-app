import { Component, effect, inject, input } from '@angular/core';
import { TitleService } from '../../../core/title.service';
import { GigStore } from '../../../models/gig-store.js';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-gig-edit',
  imports: [MatProgressBarModule],
  templateUrl: './gig-edit.html',
  styleUrl: './gig-edit.scss',
})
export class GigEdit {
  protected store = inject(GigStore);
  private titleService = inject(TitleService);

  id = input<string>();

  constructor() {
    // Set currentGig reactive from id
    effect(() => {
      const currentId = this.id();
      if (currentId && currentId !== 'new') {
        this.store.selectGig(currentId)
      } else {
        this.store.selectGig(null);
      }
    })

    // Set title reactive from currentGig
    effect(() => {
      const location = this.store.currentGig()?.location;
      this.titleService.setTitle(location ? `Gig in ${location}` : 'Gig bearbeiten');
    })
  }

}
