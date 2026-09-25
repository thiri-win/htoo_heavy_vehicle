# Repository agent instructions

## Boundary

This repository contains two sibling projects for HTOO Heavy Vehicle:

- [`api/`](./api) — the Express/Prisma backend and database-facing business logic.
- [`app/`](./app) — the React/Vite browser frontend.

Changes that cross this boundary must keep the HTTP contract synchronized. Backend implementation belongs in `api`; browser presentation and client state belong in `app`.

## Stable architecture and technology

- The system is a web-based invoice management application.
- The frontend is React 19 + TypeScript + Vite.
- The backend is Node.js + Express with Prisma connected to PostgreSQL.
- JWT provides authentication and `bcryptjs` hashes passwords.
- The frontend communicates with the backend over `/api` routes and does not access the database directly.
- Project-specific rules are authoritative in [`api/AGENTS.md`](./api/AGENTS.md) and [`app/AGENTS.md`](./app/AGENTS.md).

## Repository constraints

- Keep changes scoped to the project that owns the behavior; update both projects when a shared API contract changes.
- Do not commit secrets, production credentials, generated dependencies, or local environment files.
- Do not introduce demo data or authentication bypasses into production paths.
- Preserve existing route prefixes and response shapes unless the coordinated frontend/backend change intentionally updates them.
- Keep `SPEC.md` files focused on changeable behavior, while stable engineering constraints remain in `AGENTS.md`.

## Verification

From the repository root, run the relevant project checks:

```bash
(cd app && npm run lint && npm run build)
(cd api && npm run build)
```

Read the project-level `AGENTS.md` before making changes inside either sibling directory.
