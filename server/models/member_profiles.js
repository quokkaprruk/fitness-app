const mongoose = require("mongoose");
const { Schema } = mongoose;

const memberProfilesSchema = new Schema(
  {
    profileId: {
      type: String,
      required: true,
      unique: true, // Ensures each trainer has a unique profileId
      ref: "All_User", // link to the model, and mongo will handle the collection of that model
    },
    firstName: {
      type: String,
      default: "",
    },
    lastName: {
      type: String,
      default: "",
    },
    history: {
      type: Array,
      default: [],
    },
    subscriptionPlan: {
      type: Schema.Types.ObjectId,
      ref: "Member_Subscription",
    },
  },
  {
    collection: "member_profiles", // collection name
    timestamps: true,
  }
);

const MemberProfiles = mongoose.model("Member_Profile", memberProfilesSchema);
// Mongoose will create the collection with the pluralized version
// the collection name in mongo will be 'member_profiles'

module.exports = MemberProfiles;
