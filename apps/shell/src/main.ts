import { initFederation } from '@angular-architects/native-federation';

initFederation('/assets/federation.manifest.json')
  .catch((error) => console.error(error))
  .then(() => import('./bootstrap'))
  .catch((error) => console.error(error));
