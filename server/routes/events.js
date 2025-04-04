const express = require("express");
const router = express.Router();
const Event = require("../models/event");

// Create a new event
router.post("/", async (req, res) => {
  const { title, description, date, time, location, category } = req.body;

  try {
    const newEvent = new Event({ title, description, date, time, location, category });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ message: "Error creating event", error: err });
  }
});

// Get all events (optional: you can add date filters here)
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: "Error fetching events", error: err });
  }
});

// Get events for a specific date range
router.get("/range", async (req, res) => {
  const { startDate, endDate } = req.query;  // Date range from query params
  try {
    const events = await Event.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: "Error fetching events", error: err });
  }
});

module.exports = router;
