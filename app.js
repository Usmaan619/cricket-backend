const express = require("express");
const cors = require("cors");
const dbConnect = require("./config/db");
const matchRoutes = require("./app/src/routes/matchRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
dbConnect();

// Routes
app.use("/api/matches", matchRoutes);

module.exports = app;
