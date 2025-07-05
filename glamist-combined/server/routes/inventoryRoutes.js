import express from 'express';
import {
    getProducts,
    getCategories,
    createProduct,
    updateProduct,
    deleteProduct,
    bulkDeleteProducts,
    useProduct,
    generateReport,
    getDashboardData,
    getUsageReport,
    isAdmin
} from '../controllers/inventoryController.js';
import userAuth from '../middleware/userAuth.js';

const inventoryRouter = express.Router();

// Public routes
inventoryRouter.get('/', getProducts);
inventoryRouter.get('/categories', getCategories);

// Admin-only routes
inventoryRouter.post('/', userAuth, isAdmin, createProduct);
inventoryRouter.put('/:id', userAuth, isAdmin, updateProduct);
inventoryRouter.delete('/:id', userAuth, isAdmin, deleteProduct);
inventoryRouter.post('/bulk-delete', userAuth, isAdmin, bulkDeleteProducts);
inventoryRouter.post('/use/:id', userAuth, isAdmin, useProduct);
inventoryRouter.post('/reports', userAuth, isAdmin, generateReport);

// New dashboard and report routes
inventoryRouter.get('/dashboard', userAuth, isAdmin, getDashboardData);
inventoryRouter.get('/usage-report', userAuth, isAdmin, getUsageReport);

export default inventoryRouter;