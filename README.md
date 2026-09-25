# HTOO Heavy Vehicle

HTOO Heavy Vehicle is a full-stack invoice management system for vehicle service operations.

## Projects

- [`app/`](./app) — React/Vite frontend. See [`app/README.md`](./app/README.md).
- [`api/`](./api) — Express/Prisma backend. See [`api/README.md`](./api/README.md).

## Run locally

Install dependencies in each project, then start the API and frontend in separate terminals:

```bash
cd api
npm install
npm run dev
```

```bash
cd app
npm install
npm run dev
```

The frontend runs through Vite and proxies `/api` requests to the configured backend target. The API requires a PostgreSQL `DATABASE_URL`; configure `JWT_SECRET` for token signing. See each project README for details.

## Documentation

- [`AGENTS.md`](./AGENTS.md) — stable repository boundaries and constraints.
- [`SPEC.md`](./SPEC.md) — shared product behavior.
- [`api/SPEC.md`](./api/SPEC.md) — backend endpoint and domain contract.
- [`app/SPEC.md`](./app/SPEC.md) — frontend screens and user flows.
