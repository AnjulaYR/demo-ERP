# ADR 0001: Angular Micro Frontend Workspace

## Status

Proposed

## Context

The demo ERP needs multiple business domains, shared design consistency, and room for future backend integration.

## Decision

Use a single Angular workspace with a shell application and route-level domain micro frontends. Share only design tokens, UI primitives, lightweight models, and shell contracts.

## Consequences

- Domain teams can work independently.
- The shell can provide consistent navigation and cross-cutting UX.
- Shared libraries need governance to avoid accidental coupling.
- Backend integration can be introduced domain by domain.

