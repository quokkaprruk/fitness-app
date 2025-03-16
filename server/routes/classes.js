const express = require("express");
const logger = require("../middleware/logger"); // use logger
const Schedule = require("../models/schedule");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
      const schedule = await Schedule.find();
      if (schedule.length > 0) {
        logger.info(`Successfully found ${schedule.length} schedule(s).`);
        res.status(200).json(schedule);
      } else {
        logger.info("No records of schedules found");
        res.status(200).json([]);
      }
    } catch (error) {
      logger.error(`Error fetching schedules: ${error.message}`);
      res
        .status(500)
        .json({ message: "Error fetching schedules", error: error.message });
    }
  });