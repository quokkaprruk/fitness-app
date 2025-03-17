const express = require("express");
const logger = require("../middleware/logger"); // use logger
const {
  generateMonthlySchedule,
} = require("../utils/monthlyScheduleGenerator");
const Trainer = require("../models/trainer_profiles");
const Schedule = require("../models/schedule");
const MemberProfile = require("../models/member_profiles");
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
    logger.info('Student: ', memberId);

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

    schedule.currentReserved += 1;
    schedule.studentList.push(memberId);
    await schedule.save();

    logger.info(
      `Reserved class for member ${memberId} to schedule ${schedule.id}`
    );

    return res.status(200).json({ message: "Successfully reserved class" });
  } catch (error) {
    logger.error(`Error reserving class ${error.message}`);
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

module.exports = router;
