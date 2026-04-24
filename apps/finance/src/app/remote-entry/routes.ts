import { Routes } from '@angular/router';

import { FinanceHomeComponent } from '../finance-home/finance-home.component';
import { ErpPageNotFoundComponent } from '../../../../../libs/ui/src/lib/page-not-found/page-not-found.component';

export const remoteRoutes: Routes = [
  {
    path: '',
    component: FinanceHomeComponent,
  },
  {
    path: '**',
    component: ErpPageNotFoundComponent,
  },
];
