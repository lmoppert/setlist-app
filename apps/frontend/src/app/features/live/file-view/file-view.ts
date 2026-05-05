import { Component, computed, effect, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SetlistStore } from '../../../models/setlist-store';
import { TitleService } from '../../../core/title.service';
import { SafeUrlPipe } from '../../../shared/pipes/safeurl.pipe';

@Component({
  selector: 'app-file-view',
  imports: [MatIconModule, SafeUrlPipe],
  templateUrl: './file-view.html',
  styleUrl: './file-view.scss',
})
export class FileView {
  protected store = inject(SetlistStore)
  private titleService = inject(TitleService);

  data = this.store.fileViewData();
  selectedCategory = signal<string>( localStorage.getItem('preferredResource') || 'chords');
  activeFile = computed(() => {
    const song = this.data.current?.song;
    const category = this.selectedCategory();
    return song?.resources.find(r => r.type === category) ?? null;
  });

  setCategory(cat: string) {
    this.selectedCategory.set(cat);
    localStorage.setItem('preferredResource', cat);
  }
  getHint(fromEntry: any, toEntry: any): string {
    if (!fromEntry || !toEntry) return '';
    // TODO: check instrument or tuning changes
    return ''; 
  }

  constructor() {
    effect(() => {
      let title: string = this.data.current?.song?.title ?? 'Noch kein aktueller Song'
      this.titleService.setTitle(location ? title : 'Setliste bearbeiten');
    })
  }
}
