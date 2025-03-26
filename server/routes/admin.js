const express = require("express");
const logger = require("../middleware/logger"); // use logger
const Schedule = require("../models/schedule");
const AllUsers = require("../models/all_users");
const Trainer = require("../models/trainer_profiles");
const router = express.Router();
const { notify } = require("../utils/notify");

// Siripa: POST route
// when admin clicks 'add classes'
router.post("/add-schedule", async (req, res) => {
  try {
    const {
      className,
      difficultyLevel,
      location,
      studentCapacity,
      startDateTime,
      endDateTime,
      instructorId,
    } = req.body;

    if (
      !className ||
      !difficultyLevel ||
      !location ||
      !studentCapacity ||
      !startDateTime ||
      !endDateTime ||
      !instructorId
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // avoid duplicate
    const existingSchedule = await Schedule.findOne({
      instructorId: instructorId,
      startDateTime: startDateTime,
    });

    let savedSchedule;

    if (existingSchedule) {
      // If a duplicate, delete the old one and replace with the new one
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
      res.status(200).json({
        message: "Old schedule replaced with new schedule.",
        schedule: savedSchedule,
      });
    } else {
      // If no duplicate, create and save the new schedule
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

      res.status(200).json({
        message: "Class schedule saved successfully",
        schedule: savedSchedule,
      });
    }

    // Notify trainer of new schedule
    logger.info(`Finding trainer with ID ${instructorId}`);
    const trainer = await Trainer.findById(instructorId);

    if (!trainer) {
      logger.error(`No trainer found with ID ${instructorId}`);
      return res.status(200).json({
        message:
          "Class schedule saved successfully, but couldn't notify instructor",
        schedule: savedSchedule,
      });
    }

    // Then find the corresponding user to get their email
    logger.info(`Finding user with profileId ${trainer.profileId}`);
    const instructor = await AllUsers.findOne({ profileId: trainer.profileId });

    if (instructor) {
      // Format the date and time for the email
      const dateStr = new Date(startDateTime).toLocaleDateString();
      const startTimeStr = new Date(startDateTime).toLocaleTimeString();
      const endTimeStr = new Date(endDateTime).toLocaleTimeString();

      // Create email message
      const subject = "New class scheduled!";
      const message = `
        New class has been scheduled:
        Class: ${className}
        Type: ${classType}
        Date: ${dateStr}
        Time: ${startTimeStr} - ${endTimeStr}
        Capacity: ${studentCapacity} students
      `;

      // Send notification
      notify(instructor.email, subject, message);
    } else {
      logger.error(`No user found with profileId ${trainer.profileId}`);
    }
  } catch (error) {
    logger.error(`Error saving class schedule: ${error.message}`);
    res
      .status(500)
      .json({ message: "Error saving class schedule", error: error.message });
  }
});

module.exports = router;
