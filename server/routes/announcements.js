const express = require("express");
const router = express.Router();
const Announcement = require("../models/Announcement");
const { checkAdminRole } = require("../middleware/roleAuth");

// Create announcement (Admin only)
router.post("/", checkAdminRole, async (req, res) => {
  try {
    const { title, message } = req.body;
    const newAnnouncement = new Announcement({
      title,
      message,
      date: new Date()
    });
    await newAnnouncement.save();
    res.status(201).json(newAnnouncement);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all announcements
router.get("/", async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ date: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;