const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { clerkMiddleware } = require('@clerk/express');
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.use("/api/trips", require("./routes/tripRoutes"));
app.use("/api/translate", require("./routes/translate"));

app.get("/", (req, res) => {
  res.send("🚀 Travique.ai API Running");
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

module.exports = app;