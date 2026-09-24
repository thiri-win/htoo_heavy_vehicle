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

app.use('/api/auth', authRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ message: "API is running successfully!" });
});

module.exports = app;

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running localhost:${PORT}`);
})
