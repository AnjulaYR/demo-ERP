import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { CustomersRootComponent } from './app/customers-root.component';
import { remoteRoutes } from './app/remote-entry/routes';

bootstrapApplication(CustomersRootComponent, {
  providers: [provideHttpClient(), provideRouter(remoteRoutes)],
}).catch((error) => console.error(error));
