import { Routes } from '@angular/router';
import { SetlistEditor } from './features/setlist/setlist-editor/setlist-editor';
import { Setlists } from './features/setlist/setlists/setlists';

export const routes: Routes = [
  { path: '', redirectTo: '/setlists', pathMatch: 'full' },
  { path: 'setlists', component: Setlists },
  { path: 'setlists/new', component: SetlistEditor },
  { path: 'setlists/:id/edit', component: SetlistEditor },
  // { path: 'live/:gigId', component: LiveView },
];
