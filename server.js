const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose"); // ✅ Keep this ONE time
const cors = require("cors");
const bodyparser = require("body-parser");
const router = require("./Routers/Router");

dotenv.config();
const port = process.env.PORT || 8096;

app.use(cors());
app.use(bodyparser.json());

// ✅ Your MongoDB connection (no duplicate mongoose declaration)
mongoose.connect(process.env.mongo_url);

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected! Reconnecting...");
  mongoose.connect(process.env.MONGODB_URI);
});

app.listen(port, "0.0.0.0", () => {
    console.log(`port connected on ${port}`);
  });

app.use("/home", (req, res) => {
  res.json({ message: "welcome" });
});

app.use("/api", router);