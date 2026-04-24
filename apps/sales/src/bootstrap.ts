import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { remoteRoutes } from './app/remote-entry/routes';
import { SalesRootComponent } from './app/sales-root.component';

bootstrapApplication(SalesRootComponent, {
  providers: [provideHttpClient(), provideRouter(remoteRoutes)],
}).catch((error) => console.error(error));
