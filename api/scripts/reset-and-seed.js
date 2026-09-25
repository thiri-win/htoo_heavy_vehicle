const path = require('node:path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const tables = [
    '"InvoiceDetail"',
    '"Invoice"',
    '"Car"',
    '"Customer"',
    '"Item"',
    '"User"',
    '"Role"',
].join(', ');

async function resetAndSeed() {
    if (process.env.RESET_DB_CONFIRM !== 'reset') {
        throw new Error('Set RESET_DB_CONFIRM=reset to confirm that all application data will be erased.');
    }

    const name = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (!name || !email || !password) {
        throw new Error('ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD are required.');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await prisma.$transaction(async (transaction) => {
        await transaction.$executeRawUnsafe(`TRUNCATE TABLE ${tables} RESTART IDENTITY CASCADE`);

        const adminRole = await transaction.role.create({ data: { name: 'Admin' } });
        await transaction.role.create({ data: { name: 'Manager' } });
        await transaction.role.create({ data: { name: 'User' } });
        const admin = await transaction.user.create({
            data: { name, email, password: hashedPassword, role_id: adminRole.id },
            select: { id: true, name: true, email: true, role_id: true },
        });

        return { roleIds: [adminRole.id, adminRole.id + 1, adminRole.id + 2], admin };
    });

    console.log(JSON.stringify({
        reset: true,
        roles: [
            { id: result.roleIds[0], name: 'Admin' },
            { id: result.roleIds[1], name: 'Manager' },
            { id: result.roleIds[2], name: 'User' },
        ],
        admin: result.admin,
    }, null, 2));
}

resetAndSeed()
    .catch((error) => {
        console.error(`Database reset failed: ${error.message}`);
        process.exitCode = 1;
    })
    .finally(async () => prisma.$disconnect());
