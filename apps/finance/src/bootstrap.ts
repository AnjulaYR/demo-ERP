import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { FinanceRootComponent } from './app/finance-root.component';
import { remoteRoutes } from './app/remote-entry/routes';

bootstrapApplication(FinanceRootComponent, {
  providers: [provideHttpClient(), provideRouter(remoteRoutes)],
}).catch((error) => console.error(error));
