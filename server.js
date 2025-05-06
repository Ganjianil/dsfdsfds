const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./Routers/Router");

// Load environment variables
dotenv.config();
const port = process.env.PORT || 8096;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ MongoDB Connection (Optimized)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected!");
});

// ✅ API Endpoints
app.use("/home", (req, res) => {
  res.json({ message: "Welcome!s" });
});

app.use("/api", router);

// ✅ Start Server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});