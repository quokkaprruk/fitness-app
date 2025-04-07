const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,  // You can store time as a string (e.g., "10:00 AM")
      required: true,
    },
    location: {
      type: String,  // Location of the event (could be an address or online)
    },
    category: {
      type: String,  // Type of event like "class", "workout", etc.
      enum: ["class", "workout", "special event", "meeting"],
      required: true,
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
