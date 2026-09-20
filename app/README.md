# HTOO Heavy Vehicle frontend

Responsive React + TypeScript + Vite frontend for the invoice management API.

## Run locally

```bash
npm install
npm run dev
```

The Vite dev server proxies `/api` to `http://localhost:3000`. Set `VITE_API_URL` when the API is hosted elsewhere. The app includes demo data and demo sign-in (`demo@htoo.com` / `password`) so the UI can be previewed before the database is populated.

## Included

- JWT sign-in/sign-up flow wired to `/api/auth`
- Dashboard overview with revenue, payment mix, and activity charts
- Searchable and paginated invoices, customers, vehicles, and service catalog
- CRUD dialogs for customers, vehicles, services, and invoices
- Invoice print layout with browser PDF support
- Excel export wired to `/api/invoices/export/excel`
- Responsive desktop/mobile shell with shadcn-inspired design tokens and primitives
