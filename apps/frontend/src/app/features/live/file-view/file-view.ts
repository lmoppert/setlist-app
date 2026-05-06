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

  readonly navData = computed(() => { return this.service.fileViewData(); });
  readonly activeCategory = computed(() => { return this.service.activeCategory(); })
  readonly activeIndex = computed(() => { return this.service.activeSongIndex(); });

  activeFile = computed(() => {
    const files = this.navData().current?.song?.resources;
    if (!files) return null;
    return files.find(r => r.type === this.activeCategory())
  });

  getHint(fromEntry: any, toEntry: any): string {
    if (!fromEntry || !toEntry) return '';
    // TODO: check instrument or tuning changes
    return ''; 
  }
}