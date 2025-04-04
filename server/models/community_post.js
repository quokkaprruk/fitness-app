const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommunityPostSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Pre-save hook to update updatedAt timestamp
CommunityPostSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("CommunityPost", CommunityPostSchema);
