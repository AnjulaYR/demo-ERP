# Demo ERP Micro Frontend

This repository is the starting point for a demo ERP platform built with Angular, micro frontends, shared design systems, and design tokens.

## Workspace Shape

- `apps/shell` hosts the global application shell, navigation, layout, authentication boundary, and remote routes.
- `apps/customers` owns customer and supplier master data workflows.
- `apps/inventory` owns products, stock, warehouses, and movement workflows.
- `apps/sales` owns quotes, orders, invoices, and fulfillment workflows.
- `apps/finance` owns chart of accounts, payments, journals, and reporting workflows.
- `libs/design-tokens` stores cross-app visual decisions as tokens.
- `libs/ui` stores reusable Angular UI primitives built from the tokens.
- `libs/shared` stores shared contracts, models, utilities, and shell integration types.
- `docs` stores architecture notes and decision records.

## Suggested First Commands

```bash
npm install
npm run start:all
```

Remote apps can be served independently on ports `4201` through `4204`.
The `start:all` command runs PostgreSQL, the API, the shell, and all remotes in one terminal using `concurrently`.

The local API runs on `http://localhost:3000` and is proxied from Angular through `/api`.

`start:all:with-api` is kept as an alias for the full stack:

```bash
npm run start:all:with-api
```

PostgreSQL data is stored in the named Docker volume `demo_erp_postgres_data`, so entered data survives container stops and restarts.

Demo login:

- Username: `admin`, password: `admin123`
- Username: `operations`, password: `ops123`

## Architecture Direction

The initial plan is to use Angular standalone applications with native federation-style runtime composition. The shell should own cross-cutting concerns, while each ERP domain remains independently buildable and deployable.

See [docs/architecture.md](docs/architecture.md) for the first architecture draft.
See [docs/backend.md](docs/backend.md) for the PostgreSQL and API setup.
See [docs/authentication.md](docs/authentication.md) for the current demo auth flow.
See [docs/local-development.md](docs/local-development.md) for local run and troubleshooting notes.
