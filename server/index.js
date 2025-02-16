const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
// Import API routes
const userRoutes = require("./routes/user");
const trainerRoutes = require("./routes/trainer");
const adminRoutes = require("./routes/admin");
const scheduleRoutes = require("./routes/schedule");
const logger = require("./middleware/logger");
const pino = require("pino-http")({ logger });

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:5173", // Local development frontend
    "https://fitness-app-frontend-prj666.vercel.app", // Vercel production frontend
  ],
  methods: "GET,POST,PUT,DELETE",
  credentials: true, // If you're using cookies or sessions
  allowedHeaders: "Content-Type, Authorization",
};

app.use(cors(corsOptions));

app.use(pino);
app.use(cors());

const mongoURL = `${process.env.MONGO_URL}/${process.env.DB_NAME}`;

mongoose
  .connect(mongoURL)
  .then(() => {
    logger.info("MongoDB connection success!");

    // Start the server only after a successful MongoDB connection
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
    });

    app.use(express.json());

    // API routes
    app.use("/api/users", userRoutes);
    app.use("/api/trainers", trainerRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/schedule", scheduleRoutes);
  })
  .catch((error) => {
    logger.error("MongoDB connection failed:", error);
    process.exit(1); // Exit the process if MongoDB connection fails
  });
