const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user");
const trainerRoutes = require("./routes/trainer");
const scheduleRoutes = require("./routes/schedule");
const logger = require("./middleware/logger");
const pino = require("pino-http")({ logger });
require("dotenv").config();

const app = express();

app.use(pino);
app.use(cors());
app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("MongoDB connection success!");
  } catch (err) {
    logger.error("MongoDB connection failed");
  }
};

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

app.use("/api/users", userRoutes);
app.use("/api/trainers", trainerRoutes);
app.use("/api/schedules", scheduleRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB();
  logger.info(`Server running on http://localhost:${PORT}`);
});
