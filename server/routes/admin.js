const express = require("express");
const logger = require("../middleware/logger");
const Schedule = require("../models/schedule");
const AllUsers = require("../models/all_users");
const Trainer = require("../models/trainer_profiles");
const moment = require("moment");
const router = express.Router();
const { notify } = require("../utils/notify");

router.post("/add-schedule", async (req, res) => {
  try {
    const classes = req.body; // receive an array of class objects

    if (!Array.isArray(classes)) {
      return res.status(400).json({ message: "Expected an array of classes" });
    }

    const savedSchedules = [];

    for (const classData of classes) {
      const {
        className,
        difficultyLevel,
        location,
        studentCapacity,
        startDateTime,
        endDateTime,
        instructorId,
        instructorFirstName,
        instructorLastName,
      } = classData;

      if (
        !className ||
        !difficultyLevel ||
        !location ||
        !studentCapacity ||
        !startDateTime ||
        !endDateTime ||
        !instructorId
      ) {
        return res
          .status(400)
          .json({ message: "All fields are required for each class" });
      }

      // Check for duplicates
      const existingSchedule = await Schedule.findOne({
        instructorId: instructorId,
        startDateTime: startDateTime,
      });

      let savedSchedule;

      if (existingSchedule) {
        // Replace existing schedule
        await Schedule.findByIdAndDelete(existingSchedule._id);
        const newSchedule = new Schedule({
          className,
          difficultyLevel,
          location,
          startDateTime,
          endDateTime,
          instructorId,
          instructorFirstName,
          instructorLastName,
          studentCapacity,
        });
        savedSchedule = await newSchedule.save();
      } else {
        // Create new schedule
        const newSchedule = new Schedule({
          className,
          difficultyLevel,
          location,
          startDateTime,
          endDateTime,
          instructorId,
          instructorFirstName,
          instructorLastName,
          studentCapacity,
        });
        savedSchedule = await newSchedule.save();
      }

      savedSchedules.push(savedSchedule);

      // Notify trainer
      logger.info(`Finding trainer with ID ${instructorId}`);
      const trainer = await Trainer.findById(instructorId);

      if (trainer) {
        logger.info(`Finding user with profileId ${trainer.profileId}`);
        const instructor = await AllUsers.findOne({
          profileId: trainer.profileId,
        });

        if (instructor) {
          const dateStr = new Date(startDateTime).toLocaleDateString();
          const startTimeStr = new Date(startDateTime).toLocaleTimeString();
          const endTimeStr = new Date(endDateTime).toLocaleTimeString();

          const subject = "New class scheduled!";
          const message = `
            New class has been scheduled:
            Class: ${className}
            Instructor: ${instructorFirstName} ${instructorLastName}
            Type: ${difficultyLevel}
            Date: ${dateStr}
            Time: ${startTimeStr} - ${endTimeStr}
            Capacity: ${studentCapacity} students
          `;

          notify(instructor.email, subject, message);
        } else {
          logger.error(`No user found with profileId ${trainer.profileId}`);
        }
      } else {
        logger.error(`No trainer found with ID ${instructorId}`);
      }
    }

    res.status(200).json({
      message: "Class schedules saved successfully",
      schedules: savedSchedules,
    });
  } catch (error) {
    logger.error(`Error saving class schedules: ${error.message}`);
    res
      .status(500)
      .json({ message: "Error saving class schedules", error: error.message });
  }
});

router.post("/save-generated-schedule", async (req, res) => {
  try {
    // res.setHeader(
    //   "Access-Control-Allow-Origin",
    //   "https://fitness-app-frontend-prj666.vercel.app"
    // );
    // res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    // res.setHeader(
    //   "Access-Control-Allow-Headers",
    //   "Content-Type, Authorization"
    // );
    console.log("Parsing schedule data...");
    const scheduleData = req.body.schedule;

    if (!Array.isArray(scheduleData)) {
      return res
        .status(400)
        .json({ message: "Schedule data must be an array" });
    }

    console.log("Deleting existing schedules...");
    await Schedule.deleteMany({});

    const savedSchedules = [];

    console.log("Starting schedule item loop...");
    for (const classItem of scheduleData) {
      // Validate each classItem before saving
      if (
        !classItem.className ||
        !classItem.difficultyLevel ||
        !classItem.instructorId ||
        !classItem.instructorFirstName ||
        !classItem.instructorLastName ||
        !classItem.startDateTime ||
        !classItem.endDateTime ||
        !classItem.studentCapacity ||
        !classItem.location
      ) {
        return res.status(400).json({ message: "Invalid schedule item data." });
      }

      console.log("Parsing date strings...");
      // Ensure date strings are correctly parsed
      const startDateTime = moment(classItem.startDateTime).toDate();
      const endDateTime = moment(classItem.endDateTime).toDate();

      if (!moment(startDateTime).isValid() || !moment(endDateTime).isValid()) {
        return res.status(400).json({ message: "Invalid date format." });
      }

      console.log("Creating schedule document...");
      const schedule = new Schedule({
        className: classItem.className,
        difficultyLevel: classItem.difficultyLevel,
        instructorId: classItem.instructorId,
        instructorFirstName: classItem.instructorFirstName,
        instructorLastName: classItem.instructorLastName,
        startDateTime: startDateTime,
        endDateTime: endDateTime,
        studentCapacity: classItem.studentCapacity,
        location: classItem.location,
      });

      console.log("Saving schedule document...");
      const savedSchedule = await schedule.save();
      savedSchedules.push(savedSchedule);
      console.log("Schedule document saved:", savedSchedule);
    }

    res.status(201).json({
      message: "Schedules saved successfully",
      savedSchedules: savedSchedules,
    });
  } catch (err) {
    console.error("Error saving schedules:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

module.exports = router;
