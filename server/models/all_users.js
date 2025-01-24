const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

// For login functionality !
const allUsersSchema = new Schema(
  {
    email: {
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
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "all_users", // collection name
  }
);

allUsersSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

allUsersSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const AllUsers = mongoose.model("All_user", allUsersSchema);
// Mongoose will create the collection with the pluralized version
// the collection name in mongo will be 'all_users'

module.exports = AllUsers;
