import { Routes } from '@angular/router';
import { pendingChangesGuard } from './shared/guards/pending-changes.guard';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  { 
    path: 'login',
    loadComponent: () => import('./shared/auth/login').then(m => m.LoginForm),
  },
  {
    path: '',
    redirectTo: '/setlists',
    pathMatch: 'full',
  },
  {
    path: 'setlists',
    loadComponent: () => import('./features/setlist/setlists/setlists').then(m => m.Setlists),
    canActivate: [authGuard],
  },
  {
    path: 'setlists/:slug/edit',
    loadComponent: () => import('./features/setlist/setlist-form/setlist-form').then(m => m.SetlistForm),
    canActivate: [authGuard],
    canDeactivate: [pendingChangesGuard],
  },
  {
    path: 'setlists/:slug',
    loadComponent: () => import('./features/setlist/setlist-editor/setlist-editor').then(m => m.SetlistEditor),
    canActivate: [authGuard],
  },
  {
    path: 'live/:slug',
    loadComponent: () => import('./features/live/live-tabs/live-tabs').then(m => m.LiveTabs),
    canActivate: [authGuard],
  },
  {
    path: 'songs',
    loadComponent: () => import('./features/song/songs/songs').then(m => m.Songs),
    canActivate: [authGuard],
  },
  {
    path: 'songs/:slug',
    loadComponent: () => import('./features/song/song-editor/song-editor').then(m => m.SongEditor),
    canActivate: [authGuard],
    canDeactivate: [pendingChangesGuard],
  },
];
