# ERP Capability Map

## Shared CRUD Pattern

Every primary entity should support:

- List with filtering, sorting, and pagination.
- Create with validation.
- Read detail view.
- Update with optimistic save feedback.
- Delete or archive with confirmation.
- Audit fields such as created date, updated date, and status.

## Initial Domain Entities

- Customers: customer, supplier, contact, address.
- Inventory: product, warehouse, stock item, stock movement.
- Sales: quote, sales order, invoice, shipment.
- Finance: account, payment, journal entry, tax code.

## Cross-Cutting ERP Features

- Dashboard summaries.
- Global search.
- Notifications and task queue.
- Role-aware navigation.
- Import/export placeholders.
- Activity timeline.
- Approval workflow placeholders.

