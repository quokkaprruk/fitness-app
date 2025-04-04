const express = require("express");
const logger = require("../middleware/logger");
const Schedule = require("../models/schedule");
const AllUsers = require("../models/all_users");
const Trainer = require("../models/trainer_profiles");
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

module.exports = router;
