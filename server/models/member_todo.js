const mongoose = require("mongoose");
const { Schema } = mongoose;

const todoSchema = new Schema(
  {
    profileId: {
      type: Schema.Types.ObjectId,
      ref: "Member_Profile",
      required: true,
    },
    currentGoals: {
      type: [String], // string array
      default: [],
    },
    achievedGoals: {
      type: [String],
      default: [],
    },
  },
  {
    collection: "member_todos",
  }
);

const MemberTodo = mongoose.model("Member_Todo", todoSchema);

module.exports = MemberTodo;
