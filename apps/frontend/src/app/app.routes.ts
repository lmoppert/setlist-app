import { Routes } from '@angular/router';
import { GigList } from './features/gig/gig-list/gig-list';
import { GigEdit } from './features/gig/gig-edit/gig-edit';

export const routes: Routes = [
  { path: '', redirectTo: '/gigs', pathMatch: 'full' },
  { path: 'gigs', component: GigList},
  { path: 'gigs/new', component: GigEdit},
  { path: 'gigs/:id/edit', component: GigEdit},
  // { path: 'setlist/:id', component: SetlistEditor },
  // { path: 'live/:gigId', component: LiveView },
  { path: '', redirectTo: '/gigs', pathMatch: 'full' }
];
