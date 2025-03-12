const mongoose = require("mongoose");
const { Schema } = mongoose;

const todoSchema = new Schema(
  {
    memberProfileObjectId: {
      type: Schema.Types.ObjectId,
      ref: "Member_Profile",
      required: true,
    },
    currentGoals: [
      {
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    achievedGoals: [
      {
        text: String,
        createdAt: Date,
        achievedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    collection: "member_todos",
  },
);

const MemberTodo = mongoose.model("Member_Todo", todoSchema);

module.exports = MemberTodo;
