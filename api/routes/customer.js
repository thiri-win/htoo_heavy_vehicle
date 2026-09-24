const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');
const { requireAdmin } = require('../auth-middleware');

router.get('/', async (req, res) => {
    try {
        const customers = await prisma.customer.findMany({
            include: { _count: { select: { invoices: true, cars: true } } },
            orderBy: { id: 'asc' }
        })
        res.status(200).json({ data: customers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.get('/:id', async (req, res) => {
    try {
        const customer = await prisma.customer.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { cars: true, invoices: true }
        });
        if (!customer) return res.status(404).json({ error: 'Customer not found' });
        res.status(200).json({ data: customer })
    } catch (error) {

    }
})

router.post('/', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: 'Customer name is required' });
        const newCustomer = await prisma.customer.create({
            data: { name }
        });
        res.status(201).json({ message: 'Customer created successfully', data: newCustomer })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.patch('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name } = req.body;
        const updatedCustomer = await (prisma.customer.update({
            where: { id },
            data: { name }
        }));
        res.status(200).json({ message: 'Customer updateed', data: updatedCustomer });
    } catch (error) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Customer not found' });
        res.status(500).json({ error: error.message });
    }
})

router.delete('/:id', requireAdmin, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await prisma.customer.delete({ where: { id } });
        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Customer not found' });
        if (error.code === 'P2003') return res.status(400).json({ error: 'Cannot delete that customer has invoices' });
        res.status(500).json({ error: error.message });
    }
})

module.exports = router;
