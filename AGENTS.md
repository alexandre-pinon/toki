# Toki

Shopping list, meal planning and recipe app. Expo Router + Supabase, iOS first.

## Environment

- pnpm, never npm or yarn.
- No test runner. Verify changes as tracer bullets on the iOS simulator, not with tests.
- UI copy is French.

## Builds

- EAS profiles in `eas.json` set `APP_PROFILE` (`dev`, `preview`, `prod`), which selects the app name, bundle id and channel in `app.config.js`. Never hardcode a bundle id outside that switch.
- `eas.json` sets `appVersionSource: remote`, so the app version lives in EAS, not only in `app.config.js`.

## Supabase

- The remote database is the source of truth for schema state. Before claiming anything about the schema, check it live via the Supabase MCP (`list_migrations`, `execute_sql`), do not trust repo docs.
- The live migration list must match `supabase/migrations` exactly. A migration applied to remote from somewhere else is a divergence to surface, not to replicate blindly.

## App

- Expo Router with typed routes enabled (`experiments.typedRoutes`).
- Colors and sizing live in `theme.ts`, never inline hex values in components.
- Auth is Google-only on iOS so far, `contexts/AuthContext.tsx` holds the single configuration point.
