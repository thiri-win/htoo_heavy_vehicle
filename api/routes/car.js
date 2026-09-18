const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');

router.get('/', async (req, res) => {
    try {
        const cars = await prisma.car.findMany({
            include: { customer: true },
            orderBy: { id: 'asc' }
        });
        res.status(200).json({ data: cars });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.get("/:id", async (req, res) => {
    try {
        const car = await prisma.car.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { customer: true, invoices: true }
        });
        if (!car) return res.status(404).json({ error: 'Car not found' });
        res.status(200).json({ data: car });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.post('/', async (req, res) => {
    try {
        const { number, model, brand, customer_id } = req.body;
        if (!number) return res.status(400).json({ error: 'Car number is required' });
        const newCar = await prisma.car.create({
            data: { number, model, brand, customer_id }
        });
        res.status(201).json({ message: 'Car created', data: newCar });
    } catch (error) {
        if (error.code === 'P2002') return res.status(400).json({ error: 'Car number is already existed' });
        res.status(500).json({ error: error.message });
    }
})

router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { number, model, brand, customer_id } = req.body;
        const updatedCar = await prisma.car.update({
            where: { id },
            data: { number, model, brand, customer_id }
        });
        res.status(200).json({ message: 'Car updated', data: updatedCar })
    } catch (error) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Car Not Found' });
        res.status(500).json({ error: error.message });
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const id = parstInt(req.params.id);
        await prisma.car.delete({ where: { id } });
        res.status(200).json({ message: 'Car deleted' });
    } catch (error) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Car not found' });
        if (error.code === 'P2003') return res.status(400).json({ error: 'Cannot delete car associated with invoices' });
        res.status(500).json({ error: error.message });
    }
})

module.exports = router;