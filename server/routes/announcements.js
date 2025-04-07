const express = require("express");
const router = express.Router();
const Announcement = require("../models/announcement");
const { checkAdminRole } = require("../middleware/roleAuth");

// Create a new announcement
router.post("/", checkAdminRole, async (req, res) => {
  const { title, message, eventDate } = req.body;

  try {
    const newAnnouncement = new Announcement({
      title,
      message,
      eventDate,
    });
    await newAnnouncement.save();
    res.status(201).json(newAnnouncement);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating announcement", error: err });
  }
});

// Get all announcements (no admin restriction for reading)
router.get("/", async (req, res) => {
  try {
    const announcements = await Announcement.find.sort({ createdAt: -1 });
    res.status(200).json(announcements);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching announcements", error: err });
  }
});

// Update an existing announcement
router.put("/:id", checkAdminRole, async (req, res) => {
  const { title, message, eventDate } = req.body;

  try {
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      req.params.id,
      {
        title,
        message,
        eventDate,
      },
      { new: true },
    );
    if (!updatedAnnouncement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    res.status(200).json(updatedAnnouncement);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating announcement", error: err });
  }
});

// Delete an announcement
router.delete("/:id", checkAdminRole, async (req, res) => {
  try {
    const deletedAnnouncement = await Announcement.findByIdAndDelete(
      req.params.id,
    );

    if (!deletedAnnouncement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    res.status(200).json({ message: "Announcement deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting announcement", error: err });
  }
});

module.exports = router;