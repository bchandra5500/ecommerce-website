import express from "express";
import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import { purgeProducts, seedProducts } from "../data/productManager.js";

const router = express.Router();

// Purge all products
router.post(
  "/purge",
  asyncHandler(async (req, res) => {
    const result = await purgeProducts();
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  })
);

// Seed products with standardized data
router.post(
  "/seed",
  asyncHandler(async (req, res) => {
    const result = await seedProducts();
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  })
);

// Get all products with optional category filter
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const products = await Product.find(filter);
    res.json(products);
  })
);

// Get single product
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  })
);

// Get products by category
router.get(
  "/category/:category",
  asyncHandler(async (req, res) => {
    const products = await Product.find({ category: req.params.category });
    res.json(products);
  })
);

// Create new product
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const product = new Product({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      description: req.body.description,
      image: req.body.image,
      specs: req.body.specs || {},
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  })
);

// Delete all products
router.delete(
  "/",
  asyncHandler(async (req, res) => {
    await Product.deleteMany({});
    res.json({ message: "All products deleted" });
  })
);

export default router;
