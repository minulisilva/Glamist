import express from "express";

import { getProducts,createProduct,updateProduct,deleteProduct } from "../controllers/product.controller.js";

const router = express.Router();

// ✅ GET all LookBook entries
router.get("/",getProducts);

// ✅ POST - Create a new LookBook entry
router.post("/",createProduct);

// ✅ PUT - Update a LookBook entry by ID
router.put("/:id",updateProduct);

// ✅ DELETE - Delete a LookBook entry by ID
router.delete("/:id",deleteProduct);

export default router;
