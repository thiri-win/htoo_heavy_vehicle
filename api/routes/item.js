const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');
const { requireAdmin } = require('../auth-middleware');

router.get('/', async (req, res) => {
    try {
        const items = await prisma.item.findMany({
            orderBy: { id: 'asc' }
        });
        res.status(200).json({ data: items });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.get("/:id", async (req, res) => {
    try {
        const item = await prisma.item.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { invoiceDetails: true }
        });
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.status(200).json({ data: item });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.post('/', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: 'Item name is required' });
        
        const newItem = await prisma.item.create({
            data: { name }
        });
        res.status(201).json({ message: 'Item created', data: newItem });
    } catch (error) {
        if (error.code === 'P2002') return res.status(400).json({ error: 'Item name is already existed' });
        res.status(500).json({ error: error.message });
    }
})

router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name } = req.body;
        
        const updatedItem = await prisma.item.update({
            where: { id },
            data: { name }
        });
        res.status(200).json({ message: 'Item updated', data: updatedItem })
    } catch (error) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Item Not Found' });
        if (error.code === 'P2002') return res.status(400).json({ error: 'Item name is already existed' });
        res.status(500).json({ error: error.message });
    }
})

router.delete('/:id', requireAdmin, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await prisma.item.delete({ where: { id } });
        res.status(200).json({ message: 'Item deleted' });
    } catch (error) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Item not found' });
        if (error.code === 'P2003') return res.status(400).json({ error: 'Cannot delete item associated with invoices' });
        res.status(500).json({ error: error.message });
    }
})

module.exports = router;
