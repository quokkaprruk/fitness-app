const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const announcementsFile = path.join(__dirname, "../data/announcements.json");

// Auto-create announcements.json if it doesn't exist
if (!fs.existsSync(announcementsFile)) {
  fs.writeFileSync(announcementsFile, JSON.stringify([], null, 2));
}

// POST new announcement
router.post("/", (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  const newAnnouncement = {
    title: "Announcement",
    message: message,
    date: new Date().toISOString(),
  };

  try {
    const data = fs.readFileSync(announcementsFile, "utf-8");
    const announcements = JSON.parse(data);

    announcements.unshift(newAnnouncement);
    fs.writeFileSync(announcementsFile, JSON.stringify(announcements, null, 2));

    res.status(201).json({ message: "Announcement posted", newAnnouncement });
  } catch (err) {
    console.error("Error saving announcement:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET all announcements
router.get("/", (req, res) => {
  try {
    const data = fs.readFileSync(announcementsFile, "utf-8");
    const announcements = JSON.parse(data);
    res.status(200).json(announcements);
  } catch (err) {
    console.error("Error reading announcements:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
