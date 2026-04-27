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
npm run start:all
```

`npm run start:all` starts PostgreSQL, the API, the shell, and all remotes in one terminal using `concurrently`.

Open `http://localhost:4200` after the shell and remotes finish compiling.

If you only want the frontend apps without Docker/PostgreSQL:

```bash
npm run start:all:frontend
```

Individual app commands:

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
npm run start:all:with-api
```

`npm run start:all:with-api` is an alias for `npm run start:all`. The API runs at `http://localhost:3000`. Angular dev servers proxy `/api` to the API through `proxy.conf.json`.

PostgreSQL uses the named Docker volume `demo_erp_postgres_data`, so data entered through the ERP remains available after the container is stopped and started again.

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

If dev servers hit Windows file locks while starting together, stop everything with `npm run stop`, then start the individual apps one at a time with the `start:*` scripts. OneDrive can briefly lock files in `node_modules` during parallel builds.
