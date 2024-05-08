import nodemailer from "nodemailer";
import Stripe from "stripe";

import { CLIENT_URL, STRIPE_API_KEY } from "../../constant";

const stripe = new Stripe(STRIPE_API_KEY);

export const createSession = async ({ token, priceId, subId }: any) => {
  const session = await stripe.checkout.sessions.create({
    success_url: `${CLIENT_URL}/subscriptionComplete/?token=${token}&session_id={CHECKOUT_SESSION_ID}&subId=${subId}`,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    allow_promotion_codes: true,
  });

  return session;
};

export const retrieveSession = async ({ sessionId }: any) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["subscription"],
  });

  return session;
};

export const cancelSubscription = async ({ subscriptionId }: any) => {
  const sub = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });

  return sub;
};
