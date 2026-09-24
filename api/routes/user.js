const express = require('express');
const prisma = require('../prisma/client');
const { authenticate, requireAdmin } = require('../auth-middleware');

const router = express.Router();

router.get('/', authenticate, requireAdmin, async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, role_id: true, createdAt: true, role: { select: { id: true, name: true } } },
            orderBy: { id: 'asc' },
        });
        res.status(200).json({ data: users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/:id/role', authenticate, requireAdmin, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const role_id = Number(req.body.role_id);
        if (![1, 2, 3].includes(role_id)) return res.status(400).json({ error: 'Role must be 1 (Admin), 2 (Manager), or 3 (User)' });
        if (id === req.user.id && role_id !== 1) return res.status(400).json({ error: 'You cannot remove your own administrator access' });
        const role = await prisma.role.findUnique({ where: { id: role_id } });
        if (!role) return res.status(400).json({ error: `Role ${role_id} is not configured` });
        const user = await prisma.user.update({
            where: { id },
            data: { role_id },
            select: { id: true, name: true, email: true, role_id: true, createdAt: true, role: { select: { id: true, name: true } } },
        });
        res.status(200).json({ data: user });
    } catch (error) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'User not found' });
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
