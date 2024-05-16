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

export const createSessionForOneOff = async ({
  oneOffName,
  price,
  token,
  giveawayId,
  oneOffId,
}: any) => {
  const session = await stripe.checkout.sessions.create({
    success_url: `${CLIENT_URL}/subscriptionComplete/?token=${token}&session_id={CHECKOUT_SESSION_ID}&giveawayId=${giveawayId}&oneOffId=${oneOffId}`,
    line_items: [
      {
        price_data: {
          currency: "aud",
          unit_amount: price,
          product_data: {
            name: oneOffName,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    allow_promotion_codes: true,
  });

  return session;
};

export const retrieveSession = async ({ sessionId, type }: any) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: [type],
  });

  return session;
};

export const cancelSubscription = async ({ subscriptionId }: any) => {
  const sub = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });

  return sub;
};

export const renewSubscription = async ({ subscriptionId }: any) => {
  const stripeSub = await stripe.subscriptions.retrieve(subscriptionId);

  if (
    stripeSub.cancel_at_period_end === true &&
    stripeSub.status === "active"
  ) {
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    });
  }

  return stripeSub;
};
