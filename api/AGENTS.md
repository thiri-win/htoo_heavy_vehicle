# API agent instructions

## Boundary

This directory is the backend for HTOO Heavy Vehicle. It owns HTTP routes, authentication and authorization, invoice/business rules, persistence, exports, and database backup generation.

The API must not contain frontend presentation or browser-only behavior. Keep client-facing changes in `../app`. Treat the API response shapes and route prefixes as a contract with the frontend.

## Stable technology and architecture

- Node.js with CommonJS modules.
- Express is the HTTP server and routing layer.
- PostgreSQL is the database; Prisma is the ORM and schema source of truth in `prisma/schema.prisma`.
- JWT authenticates requests; `bcryptjs` hashes passwords.
- `index.js` owns middleware and route mounting. Resource-specific behavior belongs in `routes/`; reusable cross-cutting logic belongs in focused modules such as `auth-middleware.js` and `services/`.
- Protected resources are mounted below `/api` and use `authenticate`; administrator-only mutations use `requireAdmin`.
- Database writes that span invoices, customers, cars, or invoice details must remain transactional.

## Constraints

- Never expose password hashes in a new response. Prefer explicit Prisma `select` clauses for user data.
- Preserve existing route prefixes, authentication behavior, and response envelopes unless the frontend is updated in the same change.
- Validate required identifiers and monetary values at the API boundary. Keep monetary values precise in PostgreSQL/Prisma.
- Do not put secrets or production connection strings in source control. Use environment variables such as `DATABASE_URL` and `JWT_SECRET`.
- Schema changes require a corresponding Prisma migration/deployment decision and an update to `SPEC.md` when they change product behavior.
- Do not silently add seed/demo data to production paths.

## Verification

Run `npm run build` after Prisma or dependency changes. For route changes, exercise the affected authenticated and unauthorized paths when a test harness is not available.
