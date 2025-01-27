const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Trainer profile schema
const trainerProfilesSchema = new Schema(
  {
    profileId: {
      type: String,
      required: true,
      unique: true, // Ensures each trainer has a unique profileId
      ref: "All_User", // Reference to the All_user model, and mongo will know the collection related to that model
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    specialty: {
      type: [String],
      required: true,
      default: [],
    },
    teachingMode: {
      type: [String], // can be ["online"],["on-site"], or ["online","on-site"]
      required: true,
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    history: {
      type: [Schema.Types.Mixed], // Can store an array of objects for the history
      default: [], // empty by default
    },
  },
  {
    collection: "trainer_profiles", // collection name
  }
);

const TrainerProfiles = mongoose.model(
  "Trainer_Profile",
  trainerProfilesSchema
);
// Mongoose will create the collection with the pluralized version
// the collection name in mongo will be trainer_profiles
module.exports = TrainerProfiles;
