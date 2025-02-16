const mongoose = require("mongoose");
const { Schema } = mongoose;

const subscriptionPlanSchema = new Schema(
  {
    profileId: {
      type: Schema.Types.ObjectId,
      ref: "Member_Profile",
      required: true,
    },
    planType: {
      type: String,
      enum: ["basic", "standard", "premium"],
      required: true,
      default: "basic",
    },
    price: {
      type: Number,
      required: true,
      enum: [0, 40.99, 100.99], // Remove quotes to use numbers
      default: 0,
    },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date }, //endDate of subscription if member chose paid plan
    subscriptionStatus: {
      type: String,
      enum: ["active", "cancelled"],
      default: "active",
    },
    paymentStatus: {
      type: String,
      enum: ["N/A", "paid", "pending", "failed", "refunded"],
      default: "N/A",
    },
    paymentMethod: {
      type: String, // paypal, credit card, etc.?
    },
    transactionId: { type: String }, // ref to the payment transaction, if needed in the future
  },
  {
    collection: "member_subscriptions",
    timestamps: true,
  }
);

const MemberSubscriptionPlan = mongoose.model(
  "Member_Subscription",
  subscriptionPlanSchema
);

module.exports = MemberSubscriptionPlan;
