import { Component, inject, input, viewChild } from "@angular/core";
import { RouterModule } from "@angular/router";

import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatMenu, MatMenuModule } from "@angular/material/menu";

import { ISongDisplayData } from "@setlist-app/shared-types";
import { SetlistStore } from "../../models/setlist-store";

@Component({
  selector: 'app-setlist-context-menu',
  imports: [MatMenuModule, MatIconModule, MatDividerModule, RouterModule],
  template: `
    <mat-menu #menu="matMenu">
      @if (data().isEntry) {
        <button mat-menu-item
                (click)="store.toggleAccustic(data().id)"
                [class.active]="data().isAccustic"
                type="button">
          <mat-icon>{{ data().isAccustic ? 'toggle_on' : 'toggle_off' }}</mat-icon>
          Akustik Stück
        </button>
        
        <button mat-menu-item
                (click)="store.toggleEncore(data().id)"
                [class.active]="data().isEncore"
                type="button">
          <mat-icon>{{ data().isEncore ? 'toggle_on' : 'toggle_off' }}</mat-icon>
          Zugabe
        </button>

        <mat-divider></mat-divider>
      }

      <button mat-menu-item [routerLink]="['/songs', data().slug]">
        <mat-icon>edit_note</mat-icon>
        Song bearbeiten
      </button>
    </mat-menu>
  `,
  styles: [`
    button.active {
      font-weight: bold;
      color: var(--icon-active-color);
      mat-icon{
        color: var(--icon-active-color);
      }
    }
  `]
})
export class SetlistContextMenu {
  readonly data = input.required<ISongDisplayData>();
  readonly menu = viewChild<MatMenu>('menu');
  protected store = inject(SetlistStore);
}