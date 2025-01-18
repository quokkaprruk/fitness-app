const express = require("express");
const logger = require("../middleware/logger"); // use logger
const Schedule = require("../models/schedule");
const router = express.Router();

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
// Siripa: POST route
// when admin clicks 'add classes'
router.post("/add-schedule", async (req, res) => {
  try {
    const {
      className,
      classType,
      startDateTime,
      endDateTime,
      instructorId,
      studentCapacity,
    } = req.body;

    if (
      !className ||
      !classType ||
      !startDateTime ||
      !endDateTime ||
      !instructorId ||
      !studentCapacity
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const day = weekDays[new Date(startDateTime).getDay()];

    const newSchedule = new Schedule({
      className,
      classType,
      day,
      startDateTime,
      endDateTime,
      instructorId,
      studentCapacity,
    });

    const savedSchedule = await newSchedule.save();
    res.status(200).json({
      message: "Class schedule saved successfully",
      schedule: savedSchedule,
    });
  } catch (error) {
    logger.error(`Error saving class schedule: ${error.message}`);
    res
      .status(500)
      .json({ message: "Error saving class schedule", error: error.message });
  }
});

module.exports = router;
