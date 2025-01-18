const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  className: String,
  classType: String,
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: "Trainer" },
  day: String,
  startDateTime: Date,
  endDateTime: Date,
  studentCapacity: Number,
  currentReserved: { type: Number, default: 0 },
  studentList: [String],
  location: String,
  classDetails: {
    description: String,
    equipmentRequired: [String],
  },
});

const Schedule = mongoose.model("Schedule", scheduleSchema);
// Mongoose will create the collection with the pluralized version
// the collection name in mongo will be schedules
module.exports = Schedule;
