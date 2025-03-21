const express = require("express");
const logger = require("../middleware/logger");
const Schedule = require("../models/schedule");
const router = express.Router();

router.get("/", async (req, res) => {
    logger.info("Base upcoming route");
    
    try {
      const { memberId } = req.query;
  
      if (!memberId) {
        return res.status(400).json({ message: "User ID is required" });
      }
  
      logger.info("Fetching reserved classes for member:", memberId);
  
      // Find all schedules where the student is in the studentList
      const reservedClasses = await Schedule.find({ studentList: memberId });
  
      if (!reservedClasses || reservedClasses.length === 0) {
        return res.status(200).json({ message: "No upcoming classes", classes: [] });
      }
  
      res.status(200).json({ classes: reservedClasses });
    } catch (error) {
      console.error("Error fetching reserved classes:", error.message);
      res.status(500).json({ message: "Error fetching reserved classes" });
    }
});
  
router.post("/cancel/:classId", async (req, res) => {
  try {
    const { memberId } = req.body; // Get the user ID from request body
    const { classId } = req.params; // Get the class ID from the URL

    if (!memberId) {
      return res.status(400).json({ message: "Member ID is required" });
    }

    console.log(`Canceling reservation for member ${memberId} from class ${classId}`);

    // Find the schedule
    const schedule = await Schedule.findById(classId);
    if (!schedule) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Check if the user is actually registered
    if (!schedule.studentList.includes(memberId)) {
      return res.status(400).json({ message: "You are not registered for this class" });
    }

    // Remove student from the class list
    schedule.studentList = schedule.studentList.filter((id) => id.toString() !== memberId);
    schedule.currentReserved = Math.max(0, schedule.currentReserved - 1); // Ensure it doesn't go below 0
    schedule.studentCapacity += 1; // Increase available capacity
    await schedule.save();

    console.log(`Reservation canceled for member ${memberId} in class ${classId}`);

    res.status(200).json({
      message: "Successfully canceled reservation",
      updatedCapacity: schedule.studentCapacity, // Send updated capacity
    });
  } catch (error) {
    console.error("Error canceling reservation:", error.message);
    res.status(500).json({ message: "Error canceling reservation" });
  }
});

  
  
  
  
  
  module.exports = router;