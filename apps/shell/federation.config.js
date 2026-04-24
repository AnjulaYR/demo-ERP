const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'shell',
  remotes: {
    customers: 'http://localhost:4201/remoteEntry.json',
    inventory: 'http://localhost:4202/remoteEntry.json',
    sales: 'http://localhost:4203/remoteEntry.json',
    finance: 'http://localhost:4204/remoteEntry.json',
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
  skip: ['@angular/forms', 'rxjs/ajax', 'rxjs/fetch', 'rxjs/testing', 'rxjs/webSocket'],
});
