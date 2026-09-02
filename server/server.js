require("dotenv").config();
const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const generateRoute = require("./routes/generate");
const historyRoute = require("./routes/history");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/generate", generateRoute);
app.use("/api/history", historyRoute);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Serve React build if available
const buildPath = path.join(__dirname, "../client/dist");
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));

  app.use((req, res) => {
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ error: "Not found" });
    }
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

// Connect to MongoDB (optional — app works without it)
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.warn("⚠️  MongoDB not connected (history disabled):", err.message));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
