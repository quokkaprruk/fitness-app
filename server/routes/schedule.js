const express = require("express");
const logger = require("../middleware/logger"); // use logger
const {
  generateMonthlySchedule,
} = require("../utils/monthlyScheduleGenerator");
const Trainer = require("../models/trainer");
const Schedule = require("../models/schedule");
const router = express.Router();

// Siripa: POST route to generate the schedule
// : use when admin clicks on 'generate-schedule' button
router.post("/generate-schedule", async (req, res) => {
  try {
    const trainers = await Trainer.find(); // fetch trainer from the database
    if (trainers.length === 0) {
      return res.status(404).json({ message: "No trainers found" });
    }
    const schedule = generateMonthlySchedule(trainers); // use the function in utils folder

    if (schedule.length === 0) {
      return res.status(404).json({ message: "No schedule found" });
    } else {
      res.status(200).json(schedule);
    }
  } catch (error) {
    logger.error(`Error generating schedule: ${error.message}`);
    res
      .status(500)
      .json({ message: "Error generating schedule", error: error.message });
  }
});

// Siripa: POST route to save the confirmed schedule + insert to database
// : use when want to save the generated schedule to the database
router.post("/save-generated-schedule", async (req, res) => {
  try {
    const { schedule } = req.body; // front-end must send generated schedule data in the req.body

    // insert to the database
    const savedSchedules = await Schedule.insertMany(schedule);

    res.status(200).json({
      message: "Schedule saved successfully",
      schedules: savedSchedules,
    });
  } catch (error) {
    logger.error(`Error saving schedule: ${error.message}`);
    res
      .status(500)
      .json({ message: "Error saving schedule", error: error.message });
  }
});

// Siripa: GET route to get all schedules
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

module.exports = router;
