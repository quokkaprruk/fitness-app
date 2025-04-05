const express = require("express");
const logger = require("../middleware/logger"); // use logger
const {
  generateMonthlySchedule,
} = require("../utils/monthlyScheduleGenerator");
const moment = require("moment");
const Trainer = require("../models/trainer_profiles");
const Schedule = require("../models/schedule");
const MemberProfile = require("../models/member_profiles");
const router = express.Router();

// Siripa: POST route to generate the schedule
// : use when admin clicks on 'generate-schedule' button
router.post("/generate-schedule", async (req, res) => {
  try {
    // fetch trainer necessary data from the database
    const trainers = await Trainer.find(
      {},
      "firstName lastName teachingMode specialty"
    );

    if (trainers.length === 0) {
      return res.status(404).json({ message: "No trainers found" });
    }
    const schedule = generateMonthlySchedule(trainers); // use the function in utils folder

    if (schedule.length === 0) {
      return res.status(404).json({ message: "No schedule found" });
    } else {
      res.status(200).json({ trainers: trainers, schedule: schedule }); // send trainers and schedule
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

// Siripa: GET route to get all online schedules
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

// Siripa: GET route to get all on-site schedules
router.get("/onsite", async (req, res) => {
  try {
    const onSiteSchedule = await Schedule.find({ classType: "on-site" }); // Filter by classType: "onsite"
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

// Luis Mario: Reservation POST route
router.post("/reserve/:classId", async (req, res) => {
  try {
    const { scheduleId, memberId } = req.body;

    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    // Check if class is full
    if (schedule.currentReserved >= schedule.studentCapacity) {
      return res
        .status(400)
        .json({ message: `Class is full (max ${schedule.studentCapacity})` });
    }

    // Check if already registered
    if (schedule.studentList.includes(memberId)) {
      return res.status(400).json({ message: "Already registered" });
    }

    // Update class capacity
    schedule.currentReserved += 1;
    schedule.studentCapacity = Math.max(0, schedule.studentCapacity - 1); // Prevent negative values
    schedule.studentList.push(memberId);
    await schedule.save();

    return res.status(200).json({
      message: "Successfully reserved class",
      updatedCapacity: schedule.studentCapacity, // Return new capacity
    });
  } catch (error) {
    res.status(500).json({
      message: "Error reserving class",
      error: error.message,
    });
  }
});

// Luis Mario: GET route to view all classes for a given member
router.get("/member/:profileId", async (req, res) => {
  try {
    const { profileId } = req.params;

    const memberSchedules = await Schedule.find({
      studentList: profileId,
    });

    // Log the result
    if (memberSchedules.length === 0) {
      logger.info(`No schedules found for member ${profileId}`);
    } else {
      logger.info(
        `Successfully found ${memberSchedules.length} schedule(s) for member ${profileId}`
      );
    }

    res.status(200).json(memberSchedules);
  } catch (error) {
    logger.error(`Error fetching schedules: ${error.message}`);
    res.status(500).json({
      message: "Error fetching schedules",
      error: error.message,
    });
  }
});

// Anthony: GET route for Instuctor's Home Page. Will display their schedules
router.get("/:instructorId", async (req, res) => {
  const { instructorId } = req.params;
  try {
    const schedules = await Schedule.find({ instructorId: instructorId });
    res.json(schedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).json({ message: "Error fetching schedules" });
  }
});

//Siripa: put to save 'an' updated class
router.put("/:scheduleId", async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const updateData = req.body;

    //avoid duplicate schedule that has the same instructor and startDateTime
    const existingSchedule = await Schedule.findOne({
      instructorId: updateData.instructorId,
      startDateTime: updateData.startDateTime,
      _id: { $ne: scheduleId },
    });

    if (existingSchedule) {
      return res.status(400).json({
        message:
          "Duplicate schedule found. Instructor already has a schedule at this time.",
      });
    }

    // update
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      scheduleId,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Schedule updated successfully",
      schedule: updatedSchedule,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating class",
      error: error.message,
    });
  }
});

//Siripa: delete a class
router.delete("/:scheduleId", async (req, res) => {
  try {
    const { scheduleId } = req.params;

    const deletedSchedule = await Schedule.findByIdAndDelete(scheduleId);

    if (!deletedSchedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    return res.status(200).json({ message: "Schedule deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting class",
      error: error.message,
    });
  }
});
module.exports = router;
