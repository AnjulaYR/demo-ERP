# Local Development

## Frontend

The Angular shell and remotes run on separate ports:

- Shell: `http://localhost:4200`
- Customers: `http://localhost:4201`
- Inventory: `http://localhost:4202`
- Sales: `http://localhost:4203`
- Finance: `http://localhost:4204`

Start commands:

```bash
npm run start:shell
npm run start:customers
npm run start:inventory
npm run start:sales
npm run start:finance
```

On Windows, if PowerShell blocks `npm`, use `npm.cmd`.

## Backend

Docker is required for PostgreSQL.

```bash
npm run db:up
npm run api:dev
```

The API runs at `http://localhost:3000`. Angular dev servers proxy `/api` to the API through `proxy.conf.json`.

## Native Federation Notes

This repo uses Angular Native Federation with route-level remotes. Workspace UI libraries are bundled from source rather than shared as `sharedMappings` because the handcrafted workspace currently works more reliably with Vite dev serving that way.

The federation configs intentionally skip:

- `@angular/forms`
- `rxjs/ajax`
- `rxjs/fetch`
- `rxjs/testing`
- `rxjs/webSocket`

Skipping `@angular/forms` prevents Vite/module-shims from trying to load `/@id/@angular/forms` as a runtime shared module, which caused MIME-type errors in local development.

## Troubleshooting

If the browser shows stale federation or MIME errors, hard refresh with a cache-busting URL such as:

```text
http://localhost:4200/?fresh=1
```

If dev servers hit Windows file locks while starting together, start them sequentially. OneDrive can briefly lock files in `node_modules` during parallel builds.

