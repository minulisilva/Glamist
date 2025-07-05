import Product from '../models/productModel.js';
import usermodel from '../models/usermodel.js';
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';
import transporter from '../config/nodemailer.js'; // Import nodemailer transporter

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
    try {
        const user = await usermodel.findById(req.userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Admin access required' });
        }
        next();
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Send low stock email
const sendLowStockEmail = async (product) => {
    try {
        const subject = `Low Stock Alert: ${product.name}`;
        const text = `
            Dear Admin,

            The following product is running low on stock:
            - Name: ${product.name}
            - Category: ${product.category || 'N/A'}
            - Current Quantity: ${product.quantity}
            - Price: $${product.price}
            - Supplier: ${product.supplier || 'N/A'}

            Please consider restocking soon.

            Best regards,
            Salon Manager System
        `;
        const html = `
            <h2>Low Stock Alert</h2>
            <p>Dear Admin,</p>
            <p>The following product is running low on stock:</p>
            <ul>
                <li><strong>Name:</strong> ${product.name}</li>
                <li><strong>Category:</strong> ${product.category || 'N/A'}</li>
                <li><strong>Current Quantity:</strong> ${product.quantity}</li>
                <li><strong>Price:</strong> $${product.price}</li>
                <li><strong>Supplier:</strong> ${product.supplier || 'N/A'}</li>
            </ul>
            <p>Please consider restocking soon.</p>
            <p>Best regards,<br>Salon Manager System</p>
        `;
        await transporter.sendMail({
            from: '"Salon Manager" <dulminidilhara2001@8967304.brevosend.com>',
            to: '002dasuni@gmail.com',
            subject,
            text,
            html,
        });
        console.log(`Low stock email sent for ${product.name} to 002dasuni@gmail.com`);
        return true;
    } catch (err) {
        console.error('Low Stock Email Error:', {
            product: product.name,
            error: err.message,
            stack: err.stack,
        });
        return false;
    }
};

// Get all products
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        return res.json({ success: true, data: products });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get distinct categories
export const getCategories = async (req, res) => {
    try {
        const categories = await Product.distinct('category').where('category').ne('');
        return res.json({ success: true, data: categories });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Create a new product
export const createProduct = async (req, res) => {
    try {
        const { name, quantity, price, supplier, description, category } = req.body;
        if (!name || !quantity || !price) {
            return res.status(400).json({ success: false, message: 'Name, quantity, and price are required' });
        }

        const product = new Product({
            name,
            quantity,
            price,
            supplier,
            description,
            category,
            history: [{ action: 'added', quantityChanged: quantity }],
            lowStockEmailSent: quantity <= 10, // Set initial email status
        });

        if (quantity <= 10) {
            const emailSent = await sendLowStockEmail(product);
            product.lowStockEmailSent = emailSent;
        }

        await product.save();
        return res.status(201).json({ success: true, data: product });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Update a product
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, quantity, price, supplier, description, category } = req.body;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const quantityChanged = quantity - product.quantity;

        product.name = name || product.name;
        product.quantity = quantity;
        product.price = price || product.price;
        product.supplier = supplier || product.supplier;
        product.description = description || product.description;
        product.category = category || product.category;

        if (quantityChanged !== 0) {
            product.history.push({
                action: 'updated',
                quantityChanged,
                reason: 'Quantity updated',
            });
        }

        // Handle low stock email
        if (quantity <= 10 && !product.lowStockEmailSent) {
            const emailSent = await sendLowStockEmail(product);
            product.lowStockEmailSent = emailSent;
        } else if (quantity > 10 && product.lowStockEmailSent) {
            product.lowStockEmailSent = false; // Reset when stock is replenished
        }

        await product.save();
        return res.json({ success: true, data: product });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a product
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        return res.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Bulk delete products
export const bulkDeleteProducts = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ success: false, message: 'No product IDs provided' });
        }

        const result = await Product.deleteMany({ _id: { $in: ids } });
        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'No products found to delete' });
        }

        return res.json({ success: true, message: `${result.deletedCount} products deleted` });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Record product usage
export const useProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity, reason } = req.body;

        if (!quantity) {
            return res.status(400).json({ success: false, message: 'Quantity is required' });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const newQuantity = product.quantity - quantity;
        if (newQuantity < 0) {
            return res.status(400).json({ success: false, message: 'Insufficient stock' });
        }

        product.quantity = newQuantity;
        product.history.push({
            action: 'used',
            quantityChanged: -quantity,
            reason,
        });

        // Handle low stock email
        if (newQuantity <= 10 && !product.lowStockEmailSent) {
            const emailSent = await sendLowStockEmail(product);
            product.lowStockEmailSent = emailSent;
        } else if (newQuantity > 10 && product.lowStockEmailSent) {
            product.lowStockEmailSent = false; // Reset when stock is replenished
        }

        await product.save();
        return res.json({ success: true, data: product });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get dashboard data
export const getDashboardData = async (req, res) => {
    try {
        const totalItems = await Product.countDocuments();
        const categories = await Product.distinct('category').where('category').ne('');
        const lowStock = await Product.countDocuments({ quantity: { $lte: 10 } });
        const totalValue = await Product.aggregate([
            { $group: { _id: null, total: { $sum: { $multiply: ['$quantity', '$price'] } } } }
        ]).then(result => result[0]?.total || 0);
        const unitsUsed = await Product.aggregate([
            { $unwind: '$history' },
            { $match: { 'history.action': 'used' } },
            { $group: { _id: null, total: { $sum: { $abs: '$history.quantityChanged' } } } }
        ]).then(result => result[0]?.total || 0);

        return res.json({
            success: true,
            data: {
                totalItems,
                categories: categories.length,
                lowStock,
                totalValue: `$${totalValue.toFixed(2)}`,
                unitsUsed,
            },
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get product usage report
export const getUsageReport = async (req, res) => {
    try {
        const { category, productId } = req.query;
        let query = { 'history.action': 'used' };

        if (category && category !== 'All Categories') {
            query.category = category;
        }
        if (productId && productId !== 'All Products') {
            query._id = productId;
        }

        const products = await Product.find(query).select('name category history');

        if (products.length === 0) {
            return res.json({ success: true, data: [], message: 'No usage events recorded yet' });
        }

        return res.json({ success: true, data: products });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Generate PDF report
export const generateReport = async (req, res) => {
    try {
        const { period, startDate } = req.body;
        if (!startDate) {
            return res.status(400).json({ success: false, message: 'Start date is required' });
        }

        const start = new Date(startDate);
        let end = new Date(start);

        switch (period) {
            case 'weekly':
                end.setDate(start.getDate() + 7);
                break;
            case 'monthly':
                end.setMonth(start.getMonth() + 1);
                break;
            case 'quarterly':
                end.setMonth(start.getMonth() + 3);
                break;
            default:
                return res.status(400).json({ success: false, message: 'Invalid period' });
        }

        const products = await Product.find({
            'history.timestamp': { $gte: start, $lte: end },
        });

        const doc = new PDFDocument({ margin: 50 });
        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            const stream = new Readable();
            stream.push(pdfData);
            stream.push(null);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=inventory_report_${period}_${startDate}.pdf`);
            stream.pipe(res);
        });

        doc.fontSize(20).text('Inventory Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Period: ${period}`);
        doc.text(`From: ${start.toISOString().split('T')[0]}`);
        doc.text(`To: ${end.toISOString().split('T')[0]}`);
        doc.moveDown();

        if (products.length === 0) {
            doc.text('No inventory activity in this period.');
        } else {
            products.forEach((product, index) => {
                doc.fontSize(14).text(`Product: ${product.name}`);
                doc.fontSize(12).text(`Category: ${product.category || 'N/A'}`);
                doc.text(`Current Quantity: ${product.quantity}`);
                doc.text('History:');
                product.history
                    .filter(h => new Date(h.timestamp) >= start && new Date(h.timestamp) <= end)
                    .forEach(h => {
                        doc.text(`- ${h.action} ${h.quantityChanged} units on ${h.timestamp.toISOString().split('T')[0]} (${h.reason || 'N/A'})`);
                    });
                if (index < products.length - 1) doc.moveDown();
            });
        }

        doc.end();
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Export isAdmin middleware for use in routes
export { isAdmin };