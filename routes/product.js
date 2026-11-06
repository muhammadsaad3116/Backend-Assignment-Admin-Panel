const express = require("express");
const multer = require("multer");
const Product = require("../models/product");

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// Upload Product
router.post("/upload", upload.single("image"), async (req, res) => {
    try {
        const product = await Product.create({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: req.file ? req.file.filename : null
        });

        res.status(201).json({
            status: 201,
            data: product,
            error: false
        });
    } catch (error) {
        res.status(400).json({
            status: 400,
            error: true,
            errorMsg: error.message
        });
    }
});

// Get Products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();

const updatedProducts = products.map((product) => ({
    ...product.toObject(),
    imageUrl: `${req.protocol}://${req.get("host")}/uploads/${product.image}`
}));

        res.status(200).json({
            status: 200,
            data: updatedProducts,
            error: false
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            error: true,
            errorMsg: error.message
        });
    }
});

module.exports = router;