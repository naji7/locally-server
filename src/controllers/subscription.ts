import { NextFunction, Request, Response } from "express";

import { prisma } from "../services/prisma";
import AppError from "../errors/app";
import {
  cancelSubscription,
  createSessionForOneOff,
  renewSubscription,
  retrieveSession,
} from "../services/stripe";
import { generateJWT, toCent } from "../utils";

export class SubscriptionController {
  public async addSubscription(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const sub = await prisma.subscriptionPlan.create({ data: req.body });

      res.status(200).send({
        data: sub,
        message: `Subscription successfully added`,
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateSubscription(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      const sub = await prisma.subscriptionPlan.updateMany({
        where: {
          id: id,
        },
        data: req.body,
      });

      res.status(204).send({
        data: { sub },
        message: `Subscription successfully updated`,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getSubscriptions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const sub = await prisma.subscriptionPlan.findMany();

      res.status(200).send(sub);
    } catch (error) {
      next(error);
    }
  }

  public async unsubscribe(req: Request, res: Response, next: NextFunction) {
    try {
      const existingUser = await prisma.user.findUnique({
        where: {
          id: req.user?.id,
        },
        select: {
          subscription: true,
        },
      });

      if (!existingUser) throw new AppError("User doesn't exists", 404);

      const subId = existingUser.subscription[0].id;

      const subscription = await prisma.subscription.findUnique({
        where: {
          id: subId,
        },
      });

      if (!subscription) throw new AppError("Subscription doesn't exists", 404);

      await cancelSubscription({
        subscriptionId: subscription?.stripeSubscriptionId,
      });

      const updateSub = await prisma.subscription.update({
        where: {
          id: subId,
        },
        data: {
          status: "CANCELLED",
          cancelledAt: new Date(Date.now()),
        },
      });

      res.status(200).send(updateSub);
    } catch (error) {
      next(error);
    }
  }

  public async renewSubscription(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const existingUser = await prisma.user.findUnique({
        where: {
          id: req.user?.id,
        },
        select: {
          subscription: true,
        },
      });

      if (!existingUser) throw new AppError("User doesn't exists", 404);

      const subId = existingUser.subscription[0].id;

      const subscription = await prisma.subscription.findUnique({
        where: {
          id: subId,
        },
      });

      if (!subscription) throw new AppError("Subscription doesn't exists", 404);

      await renewSubscription({
        subscriptionId: subscription?.stripeSubscriptionId,
      });

      const updateSub = await prisma.subscription.update({
        where: {
          id: subId,
        },
        data: {
          status: "ACTIVE",
        },
      });

      res.status(200).send(updateSub);
    } catch (error) {
      next(error);
    }
  }

  public async buyOneOffPackage(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { method } = req.query;
      const { giveawayId, oneOffId } = req.body;
      const userId = req.user?.id;

      // TODO : we can get from req.user
      const userExist = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!userExist) throw new AppError("User doesn't exists", 404);

      const oneOffExist = await prisma.oneOffPackage.findUnique({
        where: {
          id: oneOffId,
        },
      });

      if (!oneOffExist) throw new AppError("Giveaway doesn't exists", 404);

      if (method === "points") {
        if (oneOffExist.price > userExist.balance)
          throw new AppError("Insufficient balance", 400);

        const userEntryRes = await prisma.entries.findFirst({
          where: {
            userId: userId,
            giveawayId: giveawayId,
          },
        });

        if (!userEntryRes) throw new AppError("User entry doesn't exist", 404);

        await prisma.entries.update({
          where: {
            id: userEntryRes?.id,
          },
          data: {
            entries: userEntryRes?.entries + oneOffExist.entries,
          },
        });

        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            balance: userExist.balance - oneOffExist.price,
          },
        });

        const txn = await prisma.transaction.create({
          data: {
            txnType: "DR",
            txnMethod: "POINTS",
            amount: oneOffExist.price,
            currency: "",
            customer: "",
            customerEmail: req.user?.email as string,
            mode: "One Off Payment",
            paymentInternet: "",
            startAt: new Date(),
            endsAt: new Date(),
            paymentMethod: "POINTS",
            invoice: "",
            user: {
              connect: {
                id: req.user?.id,
              },
            },
          },
        });

        res
          .status(200)
          .send({ txn, message: "Successfully bought one off package" });
      } else if (method === "stripe") {
        const payload = {
          id: userExist.id,
          fullName: userExist.fullName,
          email: userExist.email,
        };

        const token = generateJWT(payload);

        const price = toCent(oneOffExist.price);

        const session = await createSessionForOneOff({
          token: token,
          giveawayId: giveawayId,
          oneOffId: oneOffExist.id,
          oneOffName: oneOffExist.title,
          price: price,
        });

        res.json({
          status: 200,
          message: "Pay link accepted",
          payurl: session?.url,
        });
      } else {
        throw new AppError("Invalid method", 400);
      }
    } catch (error) {
      console.log("error : ", error);
      next(error);
    }
  }

  public async updateUserOneOffStripe(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { sessionId, giveawayId, oneOffId } = req.body;

      const session: any = await retrieveSession({
        sessionId,
        type: "payment_intent",
      });

      if (!session) throw new Error("Invalid session");

      if (session) {
        if (session.payment_status === "paid") {
          const userEntryRes = await prisma.entries.findFirst({
            where: {
              userId: req.user?.id,
              giveawayId: giveawayId,
            },
          });

          if (!userEntryRes)
            throw new AppError("User entry doesn't exist", 404);

          const oneOffExist = await prisma.oneOffPackage.findUnique({
            where: {
              id: oneOffId,
            },
          });

          if (!oneOffExist) throw new AppError("Giveaway doesn't exists", 404);

          await prisma.entries.update({
            where: {
              id: userEntryRes?.id,
            },
            data: {
              entries: userEntryRes?.entries + oneOffExist.entries,
            },
          });

          const txn = await prisma.transaction.create({
            data: {
              txnType: "DR",
              txnMethod: "STRIPE",
              amount: session.amount_total / 100,
              currency: session.currency as string,
              customerEmail: session.customer_details?.email as string,
              mode: "One Off Payment",
              paymentInternet: session.payment_intent.id,
              startAt: new Date(),
              paymentMethod: "STRIPE",
              user: {
                connect: {
                  id: req.user?.id,
                },
              },
            },
          });

          res
            .status(200)
            .send({ txn, message: "Successfully bought one off package" });
        }
      }
    } catch (error) {
      next(error);
    }
  }

  public async addOneOffPackage(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const oneOff = await prisma.oneOffPackage.create({ data: req.body });

      res.status(200).send({
        data: oneOff,
        message: `one off package successfully added`,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getActiveOneOffPackages(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const packages = await prisma.oneOffPackage.findMany({
        where: {
          status: "ACTIVE",
        },
      });

      res.status(200).send(packages);
    } catch (error) {
      next(error);
    }
  }
}
