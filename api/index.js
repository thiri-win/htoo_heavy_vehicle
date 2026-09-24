const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

const authRoutes = require('./routes/auth')
const invoiceRoutes = require('./routes/invoice')
const customerRoutes = require('./routes/customer')
const carRoutes = require('./routes/car');
const itemRoutes = require('./routes/item');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const { authenticate } = require('./auth-middleware');

app.use('/api/auth', authRoutes);
app.use('/api/invoices', authenticate, invoiceRoutes);
app.use('/api/customers', authenticate, customerRoutes);
app.use('/api/cars', authenticate, carRoutes);
app.use('/api/items', authenticate, itemRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', authenticate, adminRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ message: "API is running successfully!" });
});

module.exports = app;

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running localhost:${PORT}`);
})
