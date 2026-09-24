const express = require('express');
const prisma = require('../prisma/client');
const { requireAdmin } = require('../auth-middleware');

const router = express.Router();

router.get('/database', requireAdmin, async (req, res) => {
    try {
        const [roles, users, customers, cars, items, invoices, invoiceDetails] = await prisma.$transaction([
            prisma.role.findMany({ orderBy: { id: 'asc' } }),
            prisma.user.findMany({
                select: { id: true, name: true, email: true, role_id: true, createdAt: true },
                orderBy: { id: 'asc' },
            }),
            prisma.customer.findMany({ orderBy: { id: 'asc' } }),
            prisma.car.findMany({ orderBy: { id: 'asc' } }),
            prisma.item.findMany({ orderBy: { id: 'asc' } }),
            prisma.invoice.findMany({ orderBy: { id: 'asc' } }),
            prisma.invoiceDetail.findMany({ orderBy: { id: 'asc' } }),
        ]);

        const exportedAt = new Date();
        const filenameDate = exportedAt.toISOString().slice(0, 10);
        const backup = {
            format: 'htoo-heavy-vehicle-json-backup',
            version: 1,
            exportedAt: exportedAt.toISOString(),
            data: { roles, users, customers, cars, items, invoices, invoiceDetails },
        };

        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="htoo-heavy-vehicle-backup-${filenameDate}.json"`);
        res.status(200).send(JSON.stringify(backup, (_, value) => typeof value === 'bigint' ? value.toString() : value));
    } catch (error) {
        res.status(500).json({ error: 'Could not create the database backup' });
    }
});

module.exports = router;
