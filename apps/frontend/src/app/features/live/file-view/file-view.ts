import { Component, computed, effect, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TitleService } from '../../../core/title.service';
import { SafeUrlPipe } from '../../../shared/pipes/safeurl.pipe';
import { LiveService } from '../../../models/live-service';

@Component({
  selector: 'app-file-view',
  imports: [MatIconModule, SafeUrlPipe],
  templateUrl: './file-view.html',
  styleUrl: './file-view.scss',
})
export class FileView {
  protected service = inject(LiveService)

  data = this.service.fileViewData();
  selectedCategory = signal<string>( localStorage.getItem('preferredResource') || 'BASS');

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
}