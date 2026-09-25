# HTOO Heavy Vehicle API specification

This document describes the changeable backend feature contract. Update it when product behavior, data shape, or API behavior changes.

## Current domain

The API manages:

- Users and roles (`Admin`, `Manager`, and `User` role IDs are currently supported).
- Customers and their vehicles.
- Service/item names used by invoice details.
- Invoices, invoice details, payment state, and payment dates.
- Excel invoice reports and administrator-only SQL database backups.

## Authentication and authorization

- `POST /api/auth/signup` creates a user with a hashed password.
- `POST /api/auth/signin` returns a one-day JWT and user data.
- Protected resources require `Authorization: Bearer <token>`.
- Administrator-only operations include destructive customer/car/item operations, user-role management, and database backup generation.

## Resource endpoints

- Customers: `GET /api/customers`, `GET /api/customers/:id`, `POST /api/customers`, `PATCH /api/customers/:id`, `DELETE /api/customers/:id`.
- Cars: `GET /api/cars`, `GET /api/cars/:id`, `POST /api/cars`, `PUT /api/cars/:id`, `DELETE /api/cars/:id`.
- Items: `GET /api/items`, `GET /api/items/:id`, `POST /api/items`, `PUT /api/items/:id`, `DELETE /api/items/:id`.
- Invoices: `GET /api/invoices/:id`, `POST /api/invoices`, `PATCH /api/invoices/:id`, and `GET /api/invoices/export/excel`.
- Users: `GET /api/users` and `PATCH /api/users/:id/role`.
- Admin: `GET /api/admin/database` downloads a SQL backup.

## Invoice behavior

Creating an invoice can upsert the customer, vehicle, and item names from the request. Invoice numbers are generated from the invoice date followed by a three-digit sequence. Invoice totals, payment type, and optional payment date are stored with the invoice. Invoice details reference catalog items and store quantity and price.

## Data model notes

The Prisma schema is authoritative. In particular, the current schema uses `Customer.name` without a phone field, `Car.number`, `Item.name`, and decimal invoice totals. Do not copy older field names from the former root specification into new API code.
