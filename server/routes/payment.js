const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const logger = require("../middleware/logger"); // use logger
const router = express.Router();

router.post("/checkout", async (req, res) => {
  //get the plan from the frontend
  const { plan_name, price } = req.body;
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
    success_url: `${process.env.FRONTEND_URL}/success`,
    // success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/cancel`,
  });

  return res.status(200).json({ session });
  // return res.status(200).json({ url: session.url }); //Return JSON to let frontend decides how to redirect
});

module.exports = router;
