const express = require("express");
const Trainer = require("../models/trainer");
const logger = require("../middleware/logger"); // use logger
const router = express.Router();

// Siripa: GET: all trainer route
router.get("/all-trainers", async (req, res) => {
  try {
    const trainers = await Trainer.find();

    if (trainers.length > 0) {
      logger.info(`Successfully found ${trainers.length} trainer(s).`);
      res.status(200).json(trainers);
    } else {
      logger.info("No records of schedules found");
      res.status(200).json([]);
    }
  } catch (error) {
    logger.error(`Error fetching all trainers: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
