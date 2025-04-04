const express = require("express");
const router = express.Router();
const Announcement = require("../models/announcement");

// Create a new announcement
router.post("/", async (req, res) => {
  const { title, message, date } = req.body;

  try {
    const newAnnouncement = new Announcement({ title, message, date });
    await newAnnouncement.save();
    res.status(201).json(newAnnouncement);
  } catch (err) {
    res.status(500).json({ message: "Error creating announcement", error: err });
  }
});

// Get all announcements
router.get("/", async (req, res) => {
  try {
    const announcements = await Announcement.find();
    res.status(200).json(announcements);
  } catch (err) {
    res.status(500).json({ message: "Error fetching announcements", error: err });
  }
});

module.exports = router;
