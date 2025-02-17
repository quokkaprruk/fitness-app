const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
//import API routes
const userRoutes = require("./routes/user");
const trainerRoutes = require("./routes/trainer");
const adminRoutes = require("./routes/admin");
const scheduleRoutes = require("./routes/schedule");
const logger = require("./middleware/logger");
const pino = require("pino-http")({ logger });

const app = express();

app.use(pino);
app.use(cors());

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});

const mongoURL = `${process.env.MONGO_URL}/${process.env.DB_NAME}`;

mongoose
  .connect(mongoURL)
  .then(() => logger.info("MongoDB connection success!"))
  .catch((error) => logger.error("MongoDB connection failed"));

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/trainers", trainerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/schedule", scheduleRoutes);
