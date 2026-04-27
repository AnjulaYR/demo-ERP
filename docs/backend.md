# Backend Architecture

## Local Stack

- PostgreSQL runs through Docker Compose from `infra/postgres/Dockerfile`.
- The API runs as a Node/Express TypeScript service in `apps/api`.
- Angular dev servers call the API through `/api`, proxied to `http://localhost:3000`.
- PostgreSQL data persists in the named Docker volume `demo_erp_postgres_data`.

## Database Shape

The schema separates authentication from ERP domain data:

- `auth.users`, `auth.roles`, `auth.permissions`, `auth.sessions`
- `erp.organizations`, `erp.business_units`
- `erp.parties`, `erp.party_contacts`, `erp.addresses`
- `erp.products`, `erp.warehouses`, `erp.inventory_balances`, `erp.stock_movements`
- `erp.sales_orders`, `erp.sales_order_lines`, `erp.invoices`
- `erp.chart_of_accounts`, `erp.journal_entries`, `erp.journal_lines`, `erp.payments`
- `erp.audit_events`

`erp.parties` generalizes customers, suppliers, employees, and partners so contact and address data can be shared instead of duplicated.

## Startup

```bash
npm install
npm run start:all
```

`npm run start:all` starts PostgreSQL, the API, the shell, and all remotes. `npm run start:all:with-api` is kept as an alias for the same full-stack command.

The database initialization scripts run only when the Docker volume is created for the first time. Stopping the container keeps the data because the database files live in `demo_erp_postgres_data`.

## Docker Requirement

Docker must be installed and available in `PATH` before the database-backed stack can run. If Docker is unavailable, use `npm run start:all:frontend` to run only the Angular shell and remotes.

## API Upgrade Path

The first API exposes CRUD endpoints for priority ERP data. Next steps are:

- Add migration tooling instead of relying only on Docker initialization scripts.
- Add password hashing and session issuance for `auth.users`.
- Add API authorization middleware using role permissions.
- Expand `libs/shared/api-client` services domain by domain.

## Frontend Data Access

Angular applications should access backend data through `libs/shared/api-client` instead of calling `HttpClient` directly from components. The shared client provides:

- `HttpCrudResource` for generic list/create/update/delete HTTP operations.
- `ResourceStore` for reusable loading/error/item state around any CRUD resource.
- Domain services such as `CustomersDataService` and `ProductsDataService`.

This keeps the UI independent from the transport details. Later, the same domain services can be backed by generated OpenAPI clients, GraphQL, offline storage, or event streams without rewriting page components.
