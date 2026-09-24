const express = require('express');
const router = express.Router();
const prisma = require("../prisma/client");
const ExcelJs = require('exceljs');

router.get('/export/excel', async (req, res) => {
    try {
        const { startDate, endDate, payment_type } = req.query;
        const where = {};
        if (payment_type) {
            where.payment_type = payment_type;
        }

        const now = new Date();
        const defaultStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const start = startDate ? new Date(startDate) : defaultStartDate;
        const end = endDate ? new Date(endDate) : new Date();
        end.setHours(23, 59, 59, 999);

        where.date = {
            gte: start,
            lte: end
        }

        const invoices = await prisma.invoice.findMany({
            where,
            orderBy: { date: 'desc' },
            include: {
                customer: true,
                car: true
            }
        });
        const workbook = new ExcelJs.Workbook();
        const worksheet = workbook.addWorksheet('Invoice Report');

        worksheet.columns = [
            { header: 'Invoice No', key: 'invoice_number', width: 18 },
            { header: 'Date', key: 'date', width: 15 },
            { header: 'Customer Name', key: 'customer_name', width: 22 },
            { header: 'Phone', key: 'phone', width: 16 },
            { header: 'Car Number', key: 'car_number', width: 16 },
            { header: 'Payment Type', key: 'payment_type', width: 15 },
            { header: 'Payment Date', key: 'payment_date', width: 15 },
            { header: 'Sub Total (Ks)', key: 'sub_total', width: 18 },
            { header: 'Advance (Ks)', key: 'advance', width: 18 },
            { header: 'Grand Total (Ks)', key: 'grand_total', width: 18 },
        ]

        const headerRow = worksheet.getRow(1);
        headerRow.font = { name: 'Pyidaungsu', size: 11, bold: true };

        invoices.forEach(inv => {
            const row = worksheet.addRow({
                invoice_number: inv.invoice_number,
                date: new Date(inv.date).toLocaleDateString(),
                customer_name: inv.customer?.name || 'N/A',
                phone: inv.customer?.phone || 'N/A',
                car_number: inv.car?.number || 'N/A',
                payment_type: inv.payment_type,
                payment_date: inv.payment_date ? new Date(inv.payment_date).toLocaleDateString() : '-',
                sub_total: inv.sub_total,
                advance: inv.advance,
                grand_total: inv.grand_total,
            })
            row.font = { name: 'Pyidaungsu', size: 10 }
        })
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=Invoices_Report_${Date.now()}.xlsx`
        );

        await workbook.xlsx.write(res);
        res.status(200).end();

    } catch (error) {
        console.log("Excel Export Error:", error);
        res.status(500).json({ error: error.message });
    }
})

router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid invoice' })
        }

        const invoice = await prisma.invoice.findUnique({
            where: { id },
            include: {
                customer: true,
                car: true,
                details: {
                    include: {
                        item: true
                    }
                }
            }
        })
        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }
        res.status(200).json({ message: "Invoice is ready", data: invoice });
    } catch (error) {
        console.error('error', error);
        res.status(500).json({ error: error.message });
    }
})

async function processCustomer(tx, customerData) {
    if (!customerData || !customerData.name) return null;
    let customer = await tx.customer.findFirst({
        where: { name: customerData.name }
    });
    if (!customer) {
        customer = await tx.customer.create({
            data: { name: customerData.name }
        });
    }
    return customer.id;
}

async function processCar(tx, carData, customerId) {
    if (!carData || !carData.number) return null;
    const car = await tx.car.upsert({
        where: { number: carData.number },
        update: {
            model: carData.model,
            brand: carData.brand,
            customer_id: customerId
        },
        create: {
            number: carData.number,
            model: carData.model,
            brand: carData.brand,
            customer_id: customerId
        }
    });
    return car.id;
}

async function processItems(tx, invoiceDetails) {
    if (!invoiceDetails || !Array.isArray(invoiceDetails) || invoiceDetails.length === 0) return [];

    const itemNames = invoiceDetails.map(d => d.name);

    const existingItems = await tx.item.findMany({
        where: { name: { in: itemNames } }
    });
    const existingItemMap = new Map(existingItems.map(i => [i.name, i.id]));

    const newItemNames = itemNames.filter(name => !existingItemMap.has(name));

    if (newItemNames.length > 0) {
        await tx.item.createMany({
            data: newItemNames.map(name => ({ name })),
            skipDuplicates: true
        });

        const allItems = await tx.item.findMany({
            where: { name: { in: itemNames } }
        });
        allItems.forEach(i => existingItemMap.set(i.name, i.id));
    }

    return invoiceDetails.map(itemData => ({
        item_id: existingItemMap.get(itemData.name),
        quantity: itemData.quantity,
        price: itemData.price,
    }));
}

router.post('/', async (req, res) => {
    try {
        const { date, customer, car, invoice_details, sub_total, advance, grand_total, payment_type, payment_date } = req.body;

        const newInvoice = await prisma.$transaction(async (tx) => {

            const customerId = await processCustomer(tx, customer);
            const carId = await processCar(tx, car, customerId);
            const formattedItems = await processItems(tx, invoice_details);

            const now = date ? new Date(date) : new Date();
            const datePrefix = `${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;

            const lastInvoice = await tx.invoice.findFirst({
                where: { invoice_number: { startsWith: datePrefix } },
                orderBy: { id: 'desc' }
            });

            let sequence = 1;
            if (lastInvoice) {
                const lastSeqNum = parseInt(lastInvoice.invoice_number.slice(-3));
                if (!isNaN(lastSeqNum)) sequence = lastSeqNum + 1;
            }
            const invoice_number = `${datePrefix}${String(sequence).padStart(3, '0')}`;

            return await tx.invoice.create({
                data: {
                    customer_id: customerId,
                    car_id: carId,
                    date: now,
                    invoice_number,
                    sub_total,
                    advance,
                    grand_total,
                    payment_type: payment_type || 'PENDING',
                    payment_date: payment_date ? new Date(payment_date) : null,
                    details: {
                        create: formattedItems
                    }
                },
                include: { customer: true, car: true, details: { include: { item: true } } }
            });
        });

        res.status(201).json({ message: "Invoice created successfully!", data: newInvoice });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const invoiceId = parseInt(req.params.id);
        const { date, customer, car, invoice_details, sub_total, advance, grand_total, payment_type, payment_date } = req.body;

        const updatedInvoice = await prisma.$transaction(async (tx) => {

            const existingInvoice = await tx.invoice.findUnique({ where: { id: invoiceId } });
            if (!existingInvoice) throw new Error("Invoice not found");

            let customerId = existingInvoice.customer_id;
            if (customer) {
                customerId = await processCustomer(tx, customer);
            }

            let carId = existingInvoice.car_id;
            if (car) {
                carId = await processCar(tx, car, customerId);
            }

            const invoiceDataToUpdate = { customer_id: customerId, car_id: carId };
            if (date) invoiceDataToUpdate.date = new Date(date);
            if (sub_total !== undefined) invoiceDataToUpdate.sub_total = sub_total;
            if (advance !== undefined) invoiceDataToUpdate.advance = advance;
            if (grand_total !== undefined) invoiceDataToUpdate.grand_total = grand_total;
            if (payment_type) invoiceDataToUpdate.payment_type = payment_type;
            if (payment_date !== undefined) {
                invoiceDataToUpdate.payment_date = payment_date ? new Date(payment_date) : null;
            }

            await tx.invoice.update({
                where: { id: invoiceId },
                data: invoiceDataToUpdate
            });

            if (invoice_details && Array.isArray(invoice_details)) {
                const formattedItems = await processItems(tx, invoice_details);

                await tx.invoiceDetail.deleteMany({
                    where: { invoice_id: invoiceId }
                });

                await tx.invoiceDetail.createMany({
                    data: formattedItems.map(item => ({
                        invoice_id: invoiceId,
                        item_id: item.item_id,
                        quantity: item.quantity,
                        price: item.price
                    }))
                });
            }

            return await tx.invoice.findUnique({
                where: { id: invoiceId },
                include: { customer: true, car: true, details: { include: { item: true } } }
            });
        });

        res.status(200).json({ message: "Invoice updated successfully!", data: updatedInvoice });
    } catch (error) {
        console.error(error);
        const statusCode = error.message === "Invoice not found" ? 404 : 500;
        res.status(statusCode).json({ error: error.message });
    }
});

// Any authenticated user may delete invoices. The parent route is protected by authenticate.
router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid invoice' });
        await prisma.invoice.delete({ where: { id } });
        res.status(200).json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Invoice not found' });
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            customer_name,
            car_number,
            item_name,
            startDate,
            endDate
        } = req.query;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const where = {};

        if (search) {
            where.OR = [
                { invoice_number: { contains: search, mode: 'insensitive' } },
                { customer: { name: { contains: search, mode: 'insensitive' } } },
                { car: { number: { contains: search, mode: 'insensitive' } } },
                { details: { some: { item: { name: { contains: search, mode: 'insensitive' } } } } }
            ];
        }

        if (customer_name) {
            where.customer = { name: { contains: customer_name, mode: 'insensitive' } };
        }

        if (car_number) {
            where.car = { number: { contains: car_number, mode: 'insensitive' } };
        }

        if (item_name) {
            where.details = {
                some: {
                    item: { name: { contains: item_name, mode: 'insensitive' } }
                }
            };
        }

        if (startDate || endDate) {
            where.date = {};
            if (startDate) {
                where.date.gte = new Date(startDate);
            }
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                where.date.lte = end;
            }
        }

        const [totalItems, invoices] = await prisma.$transaction([
            prisma.invoice.count({ where }),
            prisma.invoice.findMany({
                where,
                skip,
                take: limitNum,
                orderBy: { date: 'desc' },
                include: {
                    customer: true,
                    car: true,
                    details: {
                        include: { item: true }
                    }
                }
            })
        ]);

        const totalPages = Math.ceil(totalItems / limitNum);

        res.status(200).json({
            message: 'Invoices',
            data: invoices,
            pagination: {
                total_items: totalItems,
                current_page: pageNum,
                per_page: limitNum,
                total_pages: totalPages,
                has_next_page: pageNum < totalPages,
                has_prev_page: pageNum > 1
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
