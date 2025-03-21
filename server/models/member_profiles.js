const mongoose = require("mongoose");
const { Schema } = mongoose;

const memberProfilesSchema = new Schema(
  {
    profileId: {
      type: String,
      required: true, // should 'type: Schema.Types.ObjectId'
      unique: true, // Ensures each trainer has a unique profileId
      ref: "All_User", // link to the model, and mongo will handle the collection of that model
    },
    profileImage: {
      type: String,
      default: "", //store img url
    },
    firstName: {
      type: String,
      default: "",
    },
    lastName: {
      type: String,
      default: "",
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
    history: [
      //class reserved history
      { type: mongoose.Schema.Types.ObjectId, ref: "Schedule", default: [] },
    ],
    subscriptionPlan: {
      type: Schema.Types.ObjectId,
      ref: "Member_Subscription",
    },
    todoPlan: [
      {
        type: Schema.Types.ObjectId,
        ref: "Member_Todo",
      },
    ],
    
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
