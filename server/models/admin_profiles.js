const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Admin schema
const adminProfilesSchema = new Schema(
  {
    profileId: {
      type: String,
      required: true,
      unique: true, // Ensures each admin has a unique profileId
      ref: "All_User", // Reference to the all_users collection (profileId will reference an entry in the 'all_users' collection)
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
  },
  {
    collection: "admin_profiles", // collection name
    timestamps: true,
  }
);

const AdminProfiles = mongoose.model("Admin_Profile", adminProfilesSchema);
// Mongoose will create the collection with the pluralized version
// the collection name in mongo will be admin_profiles
module.exports = AdminProfiles;
