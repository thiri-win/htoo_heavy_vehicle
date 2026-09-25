# HTOO Heavy Vehicle frontend

Responsive React + TypeScript + Vite frontend for the invoice management API.

## Run locally

```bash
npm install
npm run dev
```

The app uses the live API at `https://api-six-xi-11.vercel.app/api`. During local development, Vite proxies same-origin `/api` requests to that live API so Firefox does not block them with CORS. Set `VITE_API_URL` to override it for another environment. The UI does not seed demo records or bypass authentication; empty and unavailable API responses are shown as empty/error states.

## Included

- JWT sign-in/sign-up flow wired to `/api/auth`
- Dashboard overview with revenue, payment mix, and activity charts
- Searchable and paginated invoices, customers, vehicles, and service catalog
- CRUD dialogs for customers, vehicles, and invoices
- Service catalog derived from live invoice details (the current API has no standalone items route)
- Invoice print layout with browser PDF support
- Excel export wired to `/api/invoices/export/excel`
- Responsive desktop/mobile shell with shadcn-inspired design tokens and primitives

See [SPEC.md](./SPEC.md) for current user-facing behavior and [AGENTS.md](./AGENTS.md) for frontend boundaries and constraints.
