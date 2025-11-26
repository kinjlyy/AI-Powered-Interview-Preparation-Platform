const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

// Simple health check route for the frontend
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working" });
});

module.exports = app;







