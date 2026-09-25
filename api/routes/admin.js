const express = require('express');
const prisma = require('../prisma/client');
const { requireAdmin } = require('../auth-middleware');
const { createSqlBackup } = require('../services/databaseBackup');

const router = express.Router();

router.get('/database', requireAdmin, async (req, res) => {
    try {
        const [roles, users, customers, cars, items, invoices, invoiceDetails] = await prisma.$transaction([
            prisma.role.findMany({ orderBy: { id: 'asc' } }),
            prisma.user.findMany({ orderBy: { id: 'asc' } }),
            prisma.customer.findMany({ orderBy: { id: 'asc' } }),
            prisma.car.findMany({ orderBy: { id: 'asc' } }),
            prisma.item.findMany({ orderBy: { id: 'asc' } }),
            prisma.invoice.findMany({ orderBy: { id: 'asc' } }),
            prisma.invoiceDetail.findMany({ orderBy: { id: 'asc' } }),
        ]);

        const exportedAt = new Date();
        const filenameDate = exportedAt.toISOString().slice(0, 10);
        const sql = createSqlBackup({ roles, users, customers, cars, items, invoices, invoiceDetails }, exportedAt);

        res.setHeader('Content-Type', 'application/sql; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="htoo-heavy-vehicle-backup-${filenameDate}.sql"`);
        res.status(200).send(sql);
    } catch (error) {
        res.status(500).json({ error: 'Could not create the database backup' });
    }
});

module.exports = router;
