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
    workout: {
      type: Number,
      min: 0,
      default: 0,
    },
    workoutLogged: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "member_todos",
    timestamps: true,
  },
);

const MemberTodo = mongoose.model("Member_Todo", todoSchema);

module.exports = MemberTodo;
