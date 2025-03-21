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
    profileImage: {
      type: String,
      default: "", //store img url
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      default: "",
      match: /^\d+$/,
    },
    address1: {
      type: String,
      default: "",
    },
    address2: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    province: {
      type: String,
      default: "",
    },
    postal: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      default: "",
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    height: {
      type: Number,
      default: null,
    },
    weight: {
      type: Number,
      default: null,
    },
    condition: {
      type: String,
      default: "",
    },
    allergy: {
      type: String,
      default: "",
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
