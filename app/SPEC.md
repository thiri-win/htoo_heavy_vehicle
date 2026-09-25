# HTOO Heavy Vehicle frontend specification

This document describes the changeable user-facing feature scope. Update it when screens, workflows, or supported API behavior changes.

## Authentication

Users can sign in or sign up through the API. An authenticated session opens the workspace; signing out clears the local session. The UI must show authentication failures clearly.

## Workspace

The authenticated workspace provides:

- Dashboard overview with revenue, payment mix, and recent activity.
- Searchable, paginated invoice, customer, vehicle, and service catalog views.
- Customer and vehicle CRUD dialogs.
- Invoice creation and editing with customer, vehicle, service lines, quantities, prices, totals, payment type, and payment date.
- Invoice detail view with a print-friendly layout and browser PDF support.
- Excel invoice export through `/api/invoices/export/excel`.
- Responsive desktop and mobile navigation.

## Data and empty states

The current API has no standalone service-price catalog; the service catalog is derived from live invoice details. The app must display empty, unavailable, and error states instead of inventing demo records.

## API environment

Local Vite development proxies `/api` to the configured API target. `VITE_API_URL` can point to another API environment. The frontend should use the same endpoint and field names documented in `../api/SPEC.md`.
