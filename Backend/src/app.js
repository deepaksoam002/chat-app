const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const app = express();
// routes import ----
const authRoutes = require("./routes/authRoutes.js")
const userRoutes = require('./routes/userRoutes.js');

// Cors Setup ----
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
}))


// middleware Setup ----
app.use(cookieParser());
app.use(express.json({ limit : "16kb"}));
app.use(express.urlencoded({extended : true, limit : "16kb"}));


// routes declaration ----

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/users", userRoutes)




module.exports = app;