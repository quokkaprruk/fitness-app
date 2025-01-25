const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Admin schema
const adminSchema = new Schema(
  {
    profileId: {
      type: String,
      required: true,
      unique: true, // Ensures each trainer has a unique profileId
      ref: "All_user", // Reference to the all_users collection (profileId will reference an entry in the 'all_users' collection)
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "admin_profiles", // collection name
  }
);

const AdminProfiles = mongoose.model("Admin_Profile", adminSchema);
// Mongoose will create the collection with the pluralized version
// the collection name in mongo will be admins
module.exports = AdminProfiles;
