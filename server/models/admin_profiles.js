const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Admin schema
const adminProfilesSchema = new Schema(
  {
    profileId: {
      type: String,
      required: true,
      unique: true, // Ensures each trainer has a unique profileId
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
