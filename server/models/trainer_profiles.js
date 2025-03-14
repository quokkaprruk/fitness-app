const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Trainer profile schema
const trainerProfilesSchema = new Schema(
  {
    profileId: {
      type: String,
      required: true,
      unique: true,
      ref: "All_User", // Reference to the All_user model
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure email is unique
    },
    specialty: {
      type: [String],
      required: true,
      default: [],
    },
    teachingMode: {
      type: [String], // Example: ["online"], ["on-site"], or ["online", "on-site"]
      required: true,
      default: [],
    },
    experience: {
      type: Number,
      required: true, // Since the frontend asks for it
    },
    history: {
      type: [Schema.Types.Mixed], // Can store an array of objects for the history
      default: [], // empty by default
    },
  },
  {
    collection: "trainer_profiles",
    timestamps: true,
  }
);
const TrainerProfiles = mongoose.model(
  "Trainer_Profile",
  trainerProfilesSchema
);
// Mongoose will create the collection with the pluralized version
// the collection name in mongo will be trainer_profiles
module.exports = TrainerProfiles;
