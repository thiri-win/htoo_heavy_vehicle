# HTOO Heavy Vehicle API

Express and Prisma backend for the HTOO Heavy Vehicle invoice management system.

## Local development

```bash
npm install
npm run dev
```

The server listens on `PORT` (default `3000`). Configure `DATABASE_URL` for PostgreSQL and `JWT_SECRET` for token signing. `npm run build` generates the Prisma client.

## Useful commands

- `npm start` — run the server.
- `npm run dev` — run with Nodemon.
- `npm run build` — generate the Prisma client.
- `npm run db:reset-and-seed` — reset and seed a development database; do not use against production.

See [SPEC.md](./SPEC.md) for the endpoint and domain contract and [AGENTS.md](./AGENTS.md) for backend boundaries and constraints.
