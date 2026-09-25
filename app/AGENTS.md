# App agent instructions

## Boundary

This directory is the browser frontend for HTOO Heavy Vehicle. It owns navigation, authentication state in the browser, data fetching, dashboard/list/detail forms, responsive layout, and invoice printing/export controls.

The frontend must not access PostgreSQL, Prisma, or server secrets. Backend behavior belongs in `../api`; use its HTTP contract through `src/lib/api.ts`.

## Stable technology and architecture

- React 19 with TypeScript and Vite.
- React Router provides browser navigation.
- CSS is maintained in `src/index.css`; shared visual primitives live in `src/components/`.
- Page-level features live in `src/pages/`; API types and requests live in `src/lib/api.ts`; shared client helpers live in `src/lib/`.
- `App.tsx` owns login gating and persisted user state. `WorkspaceApp.tsx` owns the authenticated shell.
- The app consumes the deployed API by default and uses the Vite `/api` proxy during local development. `VITE_API_URL` may override the API base URL.

## Constraints

- Keep authentication token handling and API response parsing centralized; do not scatter ad-hoc fetch logic across pages.
- Treat API response shapes as contracts. Coordinate backend changes with `../api` and update both projects' specs when behavior changes.
- Preserve usable loading, empty, error, and unauthorized states. Never seed fake records or bypass authentication in the UI.
- Keep print layouts independent from the normal responsive layout and preserve browser PDF/print support.
- Use accessible controls, labels, keyboard interaction, and responsive layouts for desktop and mobile widths.

## Verification

Run `npm run lint` and `npm run build` after frontend changes. Check the affected route in a browser when changing layout, forms, printing, or authentication flow.
