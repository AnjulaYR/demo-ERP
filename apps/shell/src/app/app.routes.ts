import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

import { authGuard, loggedOutGuard } from './auth/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { ErpPageNotFoundComponent } from '../../../../libs/ui/src/lib/page-not-found/page-not-found.component';

export const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canMatch: [loggedOutGuard],
  },
  {
    path: '',
    pathMatch: 'full',
    component: DashboardComponent,
    canMatch: [authGuard],
  },
  {
    path: 'customers',
    canMatch: [authGuard],
    loadChildren: () =>
      loadRemoteModule('customers', './routes').then((m) => m.remoteRoutes),
  },
  {
    path: 'inventory',
    canMatch: [authGuard],
    loadChildren: () =>
      loadRemoteModule('inventory', './routes').then((m) => m.remoteRoutes),
  },
  {
    path: 'sales',
    canMatch: [authGuard],
    loadChildren: () => loadRemoteModule('sales', './routes').then((m) => m.remoteRoutes),
  },
  {
    path: 'finance',
    canMatch: [authGuard],
    loadChildren: () => loadRemoteModule('finance', './routes').then((m) => m.remoteRoutes),
  },
  {
    path: '**',
    component: ErpPageNotFoundComponent,
  },
];
