const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const logger = require("../middleware/logger"); // use logger
const MemberProfiles = require("../models/member_profiles");
const MemberSubscriptionPlan = require("../models/member_subscription");
const router = express.Router();

router.post("/checkout", async (req, res) => {
  const { user, plan_name, price } = req.body;
  console.log("User info received:", user);
  try {
    // from member_profiles schema
    const memberProfile = await MemberProfiles.findOne({
      profileId: user.profileId,
    });

    if (!memberProfile) {
      return res.status(404).json({ error: "Member profile not found" });
    }

    await MemberSubscriptionPlan.deleteMany({
      memberProfileObjectId: memberProfile._id,
    });

    // from member_subscription schema
    // const subscription = await MemberSubscriptionPlan.findOne({
    //   memberProfileObjectId: profile._id,
    // });

    await MemberSubscriptionPlan.deleteMany({
      memberProfileObjectId: memberProfile._id,
    });

    const newSubscription = await MemberSubscriptionPlan.create({
      memberProfileObjectId: memberProfile._id,
      planType: plan_name.toLowerCase(),
      price,
      subscriptionStatus: "active",
      paymentStatus: price === 0 ? "N/A" : "pending",
    });

    // if (price === 0) {
    //   return res.status(200).json({
    //     message: "Free subscription activated",
    //     subscriptionId: newSubscription._id,
    //   });
    // }

    memberProfile.subscriptionPlan = newSubscription._id;
    await memberProfile.save();

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan_name,
            },
            unit_amount: price * 100, // Stripe uses cents
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription", // should be subscription mode
      // success_url: `${process.env.FRONTEND_URL}/success`,
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    return res.status(200).json({ session });
  } catch (error) {
    console.error("Error during checkout:", error);
    return res.status(500).json({ error: "Server error during checkout" });
  }
});

module.exports = router;
