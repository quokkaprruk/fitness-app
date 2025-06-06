const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
// Import API routes
const userRoutes = require("./routes/user");
const announcementRoutes = require("./routes/announcements");
const trainerRoutes = require("./routes/trainer");
const adminRoutes = require("./routes/admin");
const scheduleRoutes = require("./routes/schedule");
const upcomingRoutes = require("./routes/upcoming");
const paymentRoutes = require("./routes/payment");
const eventRoutes = require("./routes/events");
const communityRoutes = require("./routes/community");
const goalsRoutes = require("./routes/goals");

const logger = require("./middleware/logger");
const { checkAdminRole, checkTrainerRole } = require("./middleware/roleAuth");
const pino = require("pino-http")({ logger });

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://fitness-app-frontend-prj666.vercel.app",
  ], // Local development frontend & Vercel production frontend
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // if using cookies or sessions
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));

app.use(pino);

// app.use((req, res, next) => {
//   const allowedOrigins = [
//     "http://localhost:5173",
//     "https://fitness-app-frontend-prj666.vercel.app",
//   ];

//   const origin = req.headers.origin;
//   if (allowedOrigins.includes(origin)) {
//     res.header("Access-Control-Allow-Origin", origin);
//   }

//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

//   if (req.method === "OPTIONS") {
//     return res.status(200).end();
//   }

//   next();
// });

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

    // API routes
    app.use("/api/users", userRoutes);
    app.use("/api/trainers", checkTrainerRole, trainerRoutes);
    app.use("/api/admin", checkAdminRole, adminRoutes);
    app.use("/api/schedules", scheduleRoutes);
    app.use("/api/classes", scheduleRoutes);
    app.use("/api/upcoming", upcomingRoutes);
    app.use("/api/payment", paymentRoutes);
    app.use("/api/announcements", announcementRoutes);
    app.use("/api/events", eventRoutes);
    app.use("/api/community", communityRoutes);
    app.use("/api/goals", goalsRoutes);

    app.use((err, _req, res, _next) => {
      if (err.name === "UnauthorizedError") {
        res.status(401).json({ message: "Invalid token" });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    });
  })
  .catch((error) => {
    logger.error("MongoDB connection failed:", error);
    process.exit(1); //exit the process if connection fails
  });
