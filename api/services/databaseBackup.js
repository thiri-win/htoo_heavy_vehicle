const schema = [
    {
        table: 'Role',
        columns: ['id', 'name'],
        ddl: `CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "Role_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Role_name_key" UNIQUE ("name")
);`,
    },
    {
        table: 'User',
        columns: ['id', 'name', 'email', 'password', 'role_id', 'createdAt'],
        ddl: `CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "User_email_key" UNIQUE ("email"),
    CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);`,
    },
    {
        table: 'Customer',
        columns: ['id', 'name', 'createdAt'],
        ddl: `CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Customer_name_key" UNIQUE ("name")
);`,
    },
    {
        table: 'Car',
        columns: ['id', 'customer_id', 'number', 'model', 'brand', 'createdAt'],
        ddl: `CREATE TABLE "Car" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "number" TEXT NOT NULL,
    "model" TEXT,
    "brand" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Car_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Car_number_key" UNIQUE ("number"),
    CONSTRAINT "Car_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE
);`,
    },
    {
        table: 'Item',
        columns: ['id', 'name', 'createdAt'],
        ddl: `CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Item_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Item_name_key" UNIQUE ("name")
);`,
    },
    {
        table: 'Invoice',
        columns: ['id', 'date', 'invoice_number', 'customer_id', 'car_id', 'sub_total', 'advance', 'grand_total', 'payment_type', 'payment_date', 'createdAt'],
        ddl: `CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "invoice_number" TEXT NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "car_id" INTEGER NOT NULL,
    "sub_total" DECIMAL(10,2) NOT NULL,
    "advance" DECIMAL(10,2) NOT NULL,
    "grand_total" DECIMAL(10,2) NOT NULL,
    "payment_type" TEXT NOT NULL DEFAULT 'PENDING',
    "payment_date" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Invoice_invoice_number_key" UNIQUE ("invoice_number"),
    CONSTRAINT "Invoice_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Invoice_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);`,
    },
    {
        table: 'InvoiceDetail',
        columns: ['id', 'invoice_id', 'item_id', 'quantity', 'price'],
        ddl: `CREATE TABLE "InvoiceDetail" (
    "id" SERIAL NOT NULL,
    "invoice_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    CONSTRAINT "InvoiceDetail_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "InvoiceDetail_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "InvoiceDetail_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);`,
    },
];

const numericColumns = new Set(['id', 'role_id', 'customer_id', 'car_id', 'invoice_id', 'item_id', 'quantity', 'sub_total', 'advance', 'grand_total', 'price']);

function toSqlValue(value, column) {
    if (value === null || value === undefined) return 'NULL';
    if (value instanceof Date) {
        const timestamp = value.toISOString().replace('T', ' ').replace('Z', '');
        return `TIMESTAMP '${timestamp}'`;
    }
    if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';

    const stringValue = String(value);
    if (numericColumns.has(column)) {
        if (!/^-?\d+(\.\d+)?$/.test(stringValue)) throw new Error(`Invalid numeric value for ${column}`);
        return stringValue;
    }
    return `'${stringValue.replaceAll("'", "''")}'`;
}

function createSqlBackup({ roles, users, customers, cars, items, invoices, invoiceDetails }, exportedAt = new Date()) {
    const rowsByTable = { Role: roles, User: users, Customer: customers, Car: cars, Item: items, Invoice: invoices, InvoiceDetail: invoiceDetails };
    const statements = [
        '-- HTOO Heavy Vehicle PostgreSQL database backup',
        `-- Exported at ${exportedAt.toISOString()}`,
        '-- Restore into PostgreSQL with psql. Existing application tables will be replaced.',
        'BEGIN;',
        'DROP TABLE IF EXISTS "InvoiceDetail", "Invoice", "Car", "User", "Item", "Customer", "Role";',
        ...schema.map(({ ddl }) => ddl),
    ];

    for (const { table, columns } of schema) {
        for (const row of rowsByTable[table] || []) {
            const values = columns.map((column) => toSqlValue(row[column], column));
            statements.push(`INSERT INTO "${table}" (${columns.map((column) => `"${column}"`).join(', ')}) VALUES (${values.join(', ')});`);
        }
    }

    for (const { table } of schema) {
        statements.push(`SELECT setval(pg_get_serial_sequence('"${table}"', 'id'), COALESCE(MAX("id"), 1), MAX("id") IS NOT NULL) FROM "${table}";`);
    }

    statements.push('COMMIT;', '');
    return statements.join('\n\n');
}

module.exports = { createSqlBackup };
