import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage)
  },
  {
    path: 'vacinas',
    loadComponent: () => import('./pages/vaccines/vaccines.page').then((m) => m.VaccinesPage)
  },
  {
    path: 'campanhas',
    loadComponent: () => import('./pages/campaigns/campaigns.page').then((m) => m.CampaignsPage)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
