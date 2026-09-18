const express = require('express');
const app = express();
// const cors = require('cors');

// app.use(cors());
app.use(express.json());


const authRoutes = require('./routes/auth')
const invoiceRoutes = require('./routes/invoice')
const customerRoutes = require('./routes/customer')
const carRoutes = require('./routes/car');
const { car } = require('./prisma/client');

app.use('/api/auth', authRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/cars', carRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running localhost:${PORT}`);
})