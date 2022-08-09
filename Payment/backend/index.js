require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

app.post("/create-user", async (req, res) => {
  try {
    console.log("req :>> ", req.body);
    const customer = await stripe.customers.create({
      name: req.body.name,
      email: req.body.email,
    });
    return res.status(200).json({ data: customer });
  } catch (error) {
    return throwError(500, res, error.message);
  }
});

app.post("/pay", async (req, res) => {
  try {
    console.log("req :>> ", req.body);
    const amount = 2000; // lowest denomination
    const paymentIntent = await stripe.paymentIntents.create({
      customer: req.body.customerId,
      amount,
      currency: "inr",
      payment_method_types: ["card"],
      metadata: {
        name: "value",
      },
    });
    const clientSecret = paymentIntent.client_secret;
    res.json({ clientSecret, message: "Payment Initiated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/stripe", (req, res) => {
  if (req.body.type === "payment_intent.created") {
    console.log(`${req.body.data.object.metadata.name} initated payment!`);
  }
  if (req.body.type === "payment_intent.succeeded") {
    console.log(`${req.body.data.object.metadata.name} succeeded payment!`);
  }
});

app.listen(5000, () => console.log(`Server running on port 5000`));
