const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use("/uploads", express.static("uploads"));

// Product Routes
app.use("/api/products", require("./routes/product"));

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/ecommerce")
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("MongoDB Error:", err));

// Server
const PORT = 5000;


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});