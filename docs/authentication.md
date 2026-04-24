# Authentication

## Current Demo Mode

Authentication is currently frontend-only and lives in the shell application.

Demo users:

- `admin / admin123`
- `operations / ops123`

The shell stores the signed-in demo user in `localStorage` and protects ERP routes with Angular route guards. The login page is public at `/login`; dashboard and domain routes require authentication.

## Implementation Files

- `apps/shell/src/app/auth/auth.service.ts`
- `apps/shell/src/app/auth/mock-auth.provider.ts`
- `apps/shell/src/app/auth/auth.guard.ts`
- `apps/shell/src/app/login/login.component.ts`

## Future Upgrade Path

The mock provider implements a provider-style boundary so it can be replaced later without rewriting the shell:

- API-backed username/password sessions using `auth.users`, `auth.roles`, `auth.permissions`, and `auth.sessions`.
- OpenID Connect or OAuth through Keycloak, Authentik, Zitadel, Supabase Auth, or another identity provider.
- Database-backed permissions for route-level and feature-level access.

## Route Protection

The shell owns authentication because it owns composition, layout, and global navigation. Remotes should trust shell-level route access for now, then add API-side authorization once backend endpoints are active.

