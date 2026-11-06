const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const serverless = require("serverless-http");
require("dotenv").config();

const productRoutes = require("./routes/product");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));
app.use("/products", productRoutes);

const handler = serverless(app);

module.exports = async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        return handler(req, res);
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message
        });
    }
};