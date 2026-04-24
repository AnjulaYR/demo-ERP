# Micro Frontends

## Composition Style

The shell should load domains as remote Angular applications at route boundaries. Remotes expose route arrays rather than implementation details. This keeps remote apps independently testable and limits shared runtime coupling.

## Development Ports

- Shell: `4200`
- Customers: `4201`
- Inventory: `4202`
- Sales: `4203`
- Finance: `4204`

## Shared Contracts

Use `libs/shared/shell-contract` for remote metadata such as route path, display label, icon, required permissions, and remote entry configuration.

## Local Federation Configuration

The shell loads remotes through `loadRemoteModule` and `apps/shell/src/assets/federation.manifest.json`.

Workspace libraries are currently bundled from source in dev mode instead of exposed through `sharedMappings`. This avoids Vite/module-shim MIME errors for path-mapped libraries in the handcrafted workspace. Core Angular packages are still shared through `shareAll`, with selected skips documented in [local-development.md](local-development.md).
