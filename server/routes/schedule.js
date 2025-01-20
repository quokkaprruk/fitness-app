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
    const { schedule } = req.body; //front-end must send generated schedule data in the req.body
    // const schedule = require("../utils/monthlySchedule.json"); // for testing

    // check if there's existing schedule in db
    const existingSchedules = await Schedule.find({});
    if (existingSchedules.length > 0) {
      await Schedule.deleteMany({});
    }
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

  // GET route to get all online schedules
  router.get("/online", async (req, res) => {
    try {
      const onlineSchedule = await Schedule.find({ classType: "online" }); // Filter by classType: "online"
      if (onlineSchedule.length > 0) {
        logger.info(
          `Successfully found ${onlineSchedule.length} online schedule(s).`
        );
        res.status(200).json(onlineSchedule);
      } else {
        logger.info("No online schedules found");
        res.status(200).json([]); // Return empty array if no schedules found
      }
    } catch (error) {
      logger.error(`Error fetching online schedules: ${error.message}`);
      res.status(500).json({
        message: "Error fetching online schedules",
        error: error.message,
      });
    }
  });

  // GET route to get all on-site schedules
  router.get("/onsite", async (req, res) => {
    try {
      const onSiteSchedule = await Schedule.find({ classType: "on-site" }); // Filter by classType: "online"
      if (onSiteSchedule.length > 0) {
        logger.info(
          `Successfully found ${onSiteSchedule.length} on-site schedule(s).`
        );
        res.status(200).json(onSiteSchedule);
      } else {
        logger.info("No on-site schedules found");
        res.status(200).json([]); // Return empty array if no schedules found
      }
    } catch (error) {
      logger.error(`Error fetching on-site schedules: ${error.message}`);
      res.status(500).json({
        message: "Error fetching on-site schedules",
        error: error.message,
      });
    }
  });
});

module.exports = router;
