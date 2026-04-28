import { Routes } from '@angular/router';
import { pendingChangesGuard } from './shared/guards/pending-changes.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/setlists',
    pathMatch: 'full',
  },
  {
    path: 'setlists',
    loadComponent: () => import('./features/setlist/setlists/setlists').then(m => m.Setlists),
  },
  {
    path: 'setlists/new',
    loadComponent: () => import('./features/setlist/setlist-form/setlist-form').then(m => m.SetlistForm),
    canDeactivate: [pendingChangesGuard],
  },
  {
    path: 'setlists/:slug/edit',
    loadComponent: () => import('./features/setlist/setlist-form/setlist-form').then(m => m.SetlistForm),
    canDeactivate: [pendingChangesGuard],
  },
  {
    path: 'setlists/:slug',
    loadComponent: () => import('./features/setlist/setlist-editor/setlist-editor').then(m => m.SetlistEditor)
  },
  {
    path: 'live/:slug',
    loadComponent: () => import('./features/live/live-view/live-view').then(m => m.LiveView),
  },
];
