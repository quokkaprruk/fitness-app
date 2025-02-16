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
      type: String,
      required: true,
      unique: true,
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
