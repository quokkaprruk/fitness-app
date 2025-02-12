const express = require("express");
const path = require("path"); // for referencing the static files
// for referencing the static files
const mongoose = require("mongoose");
const cors = require("cors");
//import API routes
const userRoutes = require("./routes/user");
const trainerRoutes = require("./routes/trainer");
const adminRoutes = require("./routes/admin");
const scheduleRoutes = require("./routes/schedule");
const logger = require("./middleware/logger");
const pino = require("pino-http")({ logger });

require("dotenv").config();

const app = express();

app.use(pino);
app.use(cors());
app.use(express.json());
const mongoURL = `${process.env.MONGO_URL}/${process.env.DB_NAME}`;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURL);
    logger.info("MongoDB connection success!");
  } catch (err) {
    logger.error("MongoDB connection failed");
  }
};

// app.get("/api", (req, res) => {
//   res.send("Welcome to the API!");
// });

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

app.use("/api/users", userRoutes);
app.use("/api/trainers", trainerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/schedule", scheduleRoutes);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  // Send index.html for all other requests (client-side routing)
  app.get("*", (req, res) => {
    return res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB();
  logger.info(`Server running on http://localhost:${PORT}`);
});

export default app;
