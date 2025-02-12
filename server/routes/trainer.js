const express = require("express");
<<<<<<< HEAD
const TrainerProfile = require("../models/trainer_profiles");
=======
const Trainer = require("../models/trainer_profiles");
>>>>>>> d91dfa20f0c75a68c0eca259ce3009ffb5b67a14
const logger = require("../middleware/logger"); // use logger
const router = express.Router();

// Siripa: GET: all trainer route
router.get("/", async (req, res) => {
  try {
    const trainers = await TrainerProfile.find();

    // res.setHeader("Cache-Control", "no-store"); // Disable caching
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
