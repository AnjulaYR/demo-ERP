import { Routes } from '@angular/router';

import { InventoryHomeComponent } from '../inventory-home/inventory-home.component';
import { ErpPageNotFoundComponent } from '../../../../../libs/ui/src/lib/page-not-found/page-not-found.component';

export const remoteRoutes: Routes = [
  {
    path: '',
    component: InventoryHomeComponent,
  },
  {
    path: '**',
    component: ErpPageNotFoundComponent,
  },
];
