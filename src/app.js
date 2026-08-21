const express = require("express");
const authRoutes = require("./routes/adminRoutes");
const cartRoutes = require("./routes/cartRoutes");
require("dotenv").config();
const connectDB=require("./Config/db")
const path = require("path")
const app = express();
const cors = require("cors")

connectDB()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use("/uploads",express.static(path.join(__dirname,"uploads")))

app.use("/admin", authRoutes);

app.use("/api/cart", cartRoutes);

module.exports = app;