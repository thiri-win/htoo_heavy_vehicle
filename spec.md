# HTOO Heavy Vehicle product specification

This document describes the shared, changeable product scope across the frontend and API. Project-specific implementation details belong in [`api/SPEC.md`](./api/SPEC.md) and [`app/SPEC.md`](./app/SPEC.md).

## Product purpose

HTOO Heavy Vehicle is an invoice management system for recording vehicle service work, managing customers and vehicles, tracking payments, and producing invoice reports.

## Core capabilities

- User sign-up and sign-in with JWT-based sessions.
- Role-aware access for administrators, managers, and users.
- Customer and vehicle records.
- Service/item catalog used by invoice details.
- Invoice creation, viewing, editing, searching, and payment tracking.
- Automatic invoice numbering and total fields.
- Browser-friendly invoice printing and PDF output.
- Excel invoice reporting.
- Administrator database backup download.

## Shared domain concepts

Invoices belong to a customer and vehicle and contain one or more invoice details. Each detail references a service/item and records quantity and price. Invoices track subtotal, advance payment, grand total, payment type, and optional payment date.

## Product rules

- Authenticated users can work with operational records according to their role.
- Destructive management actions and team-access changes are administrator-controlled.
- The UI must represent loading, empty, unavailable, validation, and authorization states clearly.
- The frontend must use the API as the source of persisted data; it must not fabricate production records.

## Change coordination

When a feature changes both user flow and API behavior, update this file plus the relevant project specs and verify both projects. The Prisma schema is authoritative for the persisted data model.
