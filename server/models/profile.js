const mongoose = require("mongoose");
const { Schema } = mongoose;

const profilesSchema = new Schema(
  {
    profileId: {
      type: String,
      required: true,
      unique: true, // Ensures each trainer has a unique profileId
      ref: "All_user", // link to the model, and mongo will handle the collection of that model
    },
    firstName: {
      type: String,
      default: "",
    },
    lastName: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    history: {
      type: Array,
      default: [],
    },
  },
  {
    collection: "profiles", // collection name
  }
);

const Profiles = mongoose.model("Profile", profilesSchema);
// Mongoose will create the collection with the pluralized version
// the collection name in mongo will be 'all_users'

module.exports = Profiles;
