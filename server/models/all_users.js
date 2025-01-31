const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { hashPassword } = require("../middleware/auth");

// For login functionality !
const allUsersSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["trainer", "admin", "member"],
      required: true,
    },
    profileId: {
      /* Convention:
    1. profileId of role admin start with "A" follow by number
    2. profileId of role trainer start with "T" follow by number
    3. profileId of role member start with "M" follow by number
    */
      //when sign up, by default => everyone is "M+number" (profile id must be unique)
      type: String,
      required: true,
      unique: true,
    },
    subscriptionPlan: {
      type: String,
      enum: ["basic", "standard", "premium"],
    },
  },
  {
    collection: "all_users", // collection name
    timestamps: true,
  }
);

allUsersSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await hashPassword(this.password);
    next();
  } catch (err) {
    next(err);
  }
});

const AllUsers = mongoose.model("All_User", allUsersSchema);
// Mongoose will create the collection with the pluralized version
// the collection name in mongo will be 'all_users'

module.exports = AllUsers;
