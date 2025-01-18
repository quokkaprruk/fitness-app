const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Trainer schema
const trainerSchema = new Schema(
  {
    profileId: {
      type: String,
      required: true,
      unique: true, // Ensures each trainer has a unique profileId
      ref: "all_users", // Reference to the all_users collection (profileId will reference an entry in the 'all_users' collection)
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
    },
    teachingMode: {
      type: [String], // can be ["online"],["on-site"], or ["online","on-site"]
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    history: {
      type: [Schema.Types.Mixed], // Can store an array of objects for the history (can be empty as per your example)
      default: [], // empty by default
    },
  },
  {
    collection: "trainers", // collection name
  }
);

const Trainer = mongoose.model("Trainer", trainerSchema);
// Mongoose will create the collection with the pluralized version
// the collection name in mongo will be trainers
module.exports = Trainer;
