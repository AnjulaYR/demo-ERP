import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { InventoryRootComponent } from './app/inventory-root.component';
import { remoteRoutes } from './app/remote-entry/routes';

bootstrapApplication(InventoryRootComponent, {
  providers: [provideHttpClient(), provideRouter(remoteRoutes)],
}).catch((error) => console.error(error));
