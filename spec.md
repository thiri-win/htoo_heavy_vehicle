# Project Specification: Invoice Management System

## 1. Tech Stack
- **Frontend:** React, Tailwind CSS, shadcn/ui
- **Backend:** Express.js, Node.js, Prisma ORM
- **Database:** PostgreSQL (Supabase)
- **Authentication:** JWT (JSON Web Token) / bcrypt for password hashing

---

## 2. Database Schema Design (Prisma Schema compatible)

### Roles Table
- `id` (PK, Int/UUID)
- `name` (String: 'admin' | 'manager')

### Users Table
- `id` (PK, Int/UUID)
- `name` (String)
- `email` (String, Unique)
- `password` (String, Hashed)
- `role_id` (FK -> Roles.id)
- `created_at` (DateTime)

### Customers Table
- `id` (PK, Int/UUID)
- `name` (String)
- `phone` (String, Nullable)
- `created_at` (DateTime)

### Cars Table
- `id` (PK, Int/UUID)
- `date` (DateTime)
- `car_number` (String)
- `car_model` (String)
- `car_brand` (String)
- `customer_id` (FK -> Customers.id)

### Items Table
- `id` (PK, Int/UUID)
- `description` (String)
- `unit_price` (Decimal)

### Invoice Table
- `id` (PK, Int/UUID)
- `invoice_number` (String, Unique)
- `car_id` (FK -> Cars.id)
- `sub_total` (Decimal)
- `advance` (Decimal)
- `grand_total` (Decimal)
- `payment_type` (String: 'cash' | 'credit' | etc.)
- `created_at` (DateTime)

### Invoice Detail Table
- `id` (PK, Int/UUID)
- `invoice_id` (FK -> Invoice.id)
- `item_id` (FK -> Items.id)
- `qty` (Int)
- `price` (Decimal)
- `total` (Decimal)

---

## 3. Core Features & Functional Requirements

### A. Authentication & Authorization
- **Sign Up / Sign In:** Users can register and log in securely. Passwords must be hashed using `bcrypt`.
- **Role-Based Access Control (RBAC):** Admin and Manager roles with specific permissions.

### B. Invoice Management & CRUD Operations
- **Invoice:** Full CRUD support (Create, Read/Search, Update, Delete).
  - Select or add a customer and car details.
  - Add multiple items with quantities and prices.
  - Automatic calculation of `sub_total`, `advance`, and `grand_total`.
- **PDF Printing:** 
  - Ability to print the invoice directly from the browser (using window.print() with custom print CSS via shadcn/ui styling).
- **Advanced Search & Filtering:**
  - Search invoices dynamically by:
    - Date range
    - Car Number
    - Customer Name
    - Item description

### C. Customers, Cars & Items Management
- Full CRUD operations for Customers, Cars, and Items/Services.

---

## 4. API Endpoints Structure (Express.js)

### Auth Routes
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Login user and return JWT token

### Customer Routes
- `GET /api/customers` - List all customers
- `POST /api/customers` - Create a customer
- `PUT /api/customers/:id` - Update customer information
- `DELETE /api/customers/:id` - Delete a customer

### Car Routes
- `GET /api/cars` - List cars / search cars
- `POST /api/cars` - Add a car profile
- `PUT /api/cars/:id` - Update car details
- `DELETE /api/cars/:id` - Delete a car profile

### Item Routes
- `GET /api/items` - List service/item types
- `POST /api/items` - Add a new item
- `PUT /api/items/:id` - Update item description/price
- `DELETE /api/items/:id` - Delete an item

### Invoice Routes
- `POST /api/invoices` - Create a new invoice with details
- `GET /api/invoices` - Get all invoices with search/filter query params (`?search=...&date=...`)
- `GET /api/invoices/:id` - Get a specific invoice detail for viewing/printing
- `PUT /api/invoices/:id` - Update/Modify an existing invoice and its items
- `DELETE /api/invoices/:id` - Delete or cancel an invoice record