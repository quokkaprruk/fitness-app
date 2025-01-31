const subscriptionPlanSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Member_Profile",
      required: true,
    },
    planType: {
      type: String,
      enum: ["basic", "standard", "premium"],
      required: true,
    },
    price: {
      type: Number, // Store the price of the plan in cents to avoid decimal issues
      required: true,
    },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["active", "cancelled"],
      default: "active",
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "failed", "refunded"],
      default: "paid",
    },
    paymentMethod: {
      type: String, // "PayPal", "Stripe", "CreditCard", etc.
      required: true,
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
