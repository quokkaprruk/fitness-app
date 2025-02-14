const mongoose = require("mongoose");
const { Schema } = mongoose;

const todoSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Member_Profile",
      required: true,
    },
    goal: {
      type: String,
      default: "",
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
    collection: "member_todo",
  }
);

const MemberTodo = mongoose.model("Member_Todo", todoSchema);

module.exports = MemberTodo;
