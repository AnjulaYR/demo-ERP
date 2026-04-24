import { Routes } from '@angular/router';

import { CustomersHomeComponent } from '../customers-home/customers-home.component';
import { ErpPageNotFoundComponent } from '../../../../../libs/ui/src/lib/page-not-found/page-not-found.component';

export const remoteRoutes: Routes = [
  {
    path: '',
    component: CustomersHomeComponent,
  },
  {
    path: '**',
    component: ErpPageNotFoundComponent,
  },
];
