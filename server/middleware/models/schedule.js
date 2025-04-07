const mongoose = require("mongoose");
const { Schema } = mongoose;

const scheduleSchema = new Schema(
  {
    className: String, //[Cardio, HIIT, Yoga, Weight Training, Pilates, Meditation]
    difficultyLevel: String, // [Beginner,Intermediate,Advanced]
    instructorId: {
      type: String,
      required: true,
      ref: "Trainer",
    },
    instructorFirstName: String,
    instructorLastName: String,
    startDateTime: Date,
    endDateTime: Date,
    studentCapacity: {
      type: Number,
      min: 1,
      max: 15,
      default: 5,
    },
    currentReserved: { type: Number, default: 0 },
    studentList: { type: [String], default: [] },
    location: { type: String, default: "" }, // online OR onsite
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
