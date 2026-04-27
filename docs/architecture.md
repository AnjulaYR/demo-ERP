# Architecture Draft

## Goal

Create a modular demo ERP that feels like one cohesive product while allowing ERP domains to evolve as independent Angular micro frontends.

## Proposed Application Topology

```text
apps/
  shell/        Global composition, navigation, auth boundary, layout
  customers/    Customer, supplier, and contact master data
  inventory/    Products, warehouses, stock levels, stock movements
  sales/        Quotes, orders, invoices, and fulfillment
  finance/      Accounts, payments, journals, and reporting
  api/          Local Node API for PostgreSQL-backed ERP data

libs/
  design-tokens/       Brand, color, typography, spacing, radius, shadow tokens
  ui/                  Shared Angular components built on tokens
  shared/api-client/   Reusable API resources, CRUD stores, and domain data services
  shared/models/       Cross-domain TypeScript models
  shared/shell-contract/ Remote registration and navigation contracts
  shared/util/         Cross-app utilities
```

## Micro Frontend Boundary

The shell composes remote apps at route level. Each domain owns its feature routes, screens, local state, and API adapter layer. Shared code should stay intentionally small to avoid turning the monorepo into a tightly coupled modular monolith.

Recommended remote boundaries:

- `customers`: customer records, supplier records, contact records, address book, customer activity.
- `inventory`: item master, stock balances, warehouse locations, stock transfers, adjustments.
- `sales`: quote to order to invoice workflow, sales dashboards, order statuses.
- `finance`: account master, payment entries, journal entries, receivables and payables summaries.

## Design System Boundary

Design tokens are the source of truth for visual decisions. Shared UI components consume tokens through CSS custom properties, not hardcoded values. Product-specific screens should compose UI primitives rather than recreating visual rules.

## Backend And Data Access

Backend integration starts with a local PostgreSQL database and a small Node/Express API. The local full-stack command starts PostgreSQL, the API, the shell, and all remotes together.

Frontend screens should not call `HttpClient` directly. Domain screens should consume services from `libs/shared/api-client`, which wraps transport details behind generic CRUD resources and reusable loading/error state. Customers and Inventory now use this pattern for PostgreSQL-backed CRUD.

## Authentication Boundary

The shell owns login state and route protection. Authentication is currently mock-provider based, with a clear upgrade path to API-backed sessions or OAuth/OpenID Connect. Backend auth tables already exist for users, roles, permissions, and sessions.

## First Build Phases

1. Establish shell routing, app frame, and remote registration.
2. Build token pipeline and basic UI primitives.
3. Implement CRUD shell pattern: list, details, create, edit, delete confirmation.
4. Connect priority domains to PostgreSQL through the shared API data layer.
5. Expand API-backed CRUD across Sales, Finance, and authentication workflows.
