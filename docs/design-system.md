# Design System

## Principles

- Tokens first: color, type, spacing, elevation, radius, and motion are expressed as reusable tokens.
- Components second: Angular UI primitives consume tokens and expose stable APIs.
- Product composition third: ERP screens assemble primitives into workflows.

## Token Layers

- `core`: raw palette, font sizes, spacing scale, shadow scale.
- `semantic`: product meaning such as surface, text, border, success, warning, danger.
- `component`: button, card, field, table, nav, badge, dialog, and toast decisions.

## Starter Components

- Button
- Card
- Data table
- Form field
- Page header
- Empty state
- Status badge
- Confirm dialog
- Page not found
- Login screen composition

## Current Token Usage

The shell, login page, page-not-found component, and domain list screens use CSS custom properties from `libs/design-tokens/src/styles/tokens.css`. The next design-system step is to replace repeated page/table styles with reusable Angular UI primitives in `libs/ui`.
