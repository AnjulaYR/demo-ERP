import { Routes } from '@angular/router';

import { SalesHomeComponent } from '../sales-home/sales-home.component';
import { ErpPageNotFoundComponent } from '../../../../../libs/ui/src/lib/page-not-found/page-not-found.component';

export const remoteRoutes: Routes = [
  {
    path: '',
    component: SalesHomeComponent,
  },
  {
    path: '**',
    component: ErpPageNotFoundComponent,
  },
];
