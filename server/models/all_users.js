const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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

const AllUsers = mongoose.model("All_user", allUsersSchema);
// Mongoose will create the collection with the pluralized version
// the collection name in mongo will be 'all_users'

module.exports = AllUsers;
