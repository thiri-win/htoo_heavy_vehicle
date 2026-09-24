const jwt = require('jsonwebtoken');
const prisma = require('./prisma/client');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secrete_key';

async function authenticate(req, res, next) {
    try {
        const header = req.headers.authorization || '';
        const token = header.startsWith('Bearer ') ? header.slice(7) : null;
        if (!token) return res.status(401).json({ error: 'Authentication required' });
        const payload = jwt.verify(token, JWT_SECRET);
        const user = await prisma.user.findUnique({ where: { id: Number(payload.userId) }, include: { role: true } });
        if (!user) return res.status(401).json({ error: 'User not found' });
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

function requireAdmin(req, res, next) {
    if (req.user?.role_id !== 1) return res.status(403).json({ error: 'Only administrators can manage team access' });
    next();
}

module.exports = { authenticate, requireAdmin };
