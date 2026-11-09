const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const multer = require("multer");
const path = require("path");

// Image storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// CREATE PRODUCT
router.post("/", upload.single("image"), async (req, res) => {
    try {
        const product = await Product.create({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            stock: req.body.stock,
            image: req.file ? req.file.filename : ""
        });

        res.status(201).json({
            message: "Product created successfully",
            product
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET SINGLE PRODUCT
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// UPDATE PRODUCT
router.put("/:id", upload.single("image"), async (req, res) => {
    try {
        const updateData = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            stock: req.body.stock
        };

        if (req.file) {
            updateData.image = req.file.filename;
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({
            message: "Product updated successfully",
            product
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE PRODUCT
router.delete("/:id", async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;