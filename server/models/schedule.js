const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    className: String,
    classType: String,
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: "Trainer" },
    day: String,
    startDateTime: Date,
    endDateTime: Date,
    studentCapacity: Number,
    currentReserved: { type: Number, default: 0 },
    studentList: { type: [String], default: [] },
    location: { type: String, default: "" },
    classDetails: {
      description: { type: String, default: "" },
      equipmentRequired: { type: [String], default: [] },
    },
  },
  {
    collection: "schedules", // collection name
  }
);

const Schedule = mongoose.model("Schedule", scheduleSchema);
// Mongoose will create the collection with the pluralized version
// the collection name in mongo will be schedules
module.exports = Schedule;
