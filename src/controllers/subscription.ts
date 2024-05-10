import { NextFunction, Request, Response } from "express";

import { prisma } from "../services/prisma";
import AppError from "../errors/app";
import { cancelSubscription, renewSubscription } from "../services/stripe";

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
          subsciption: true,
        },
      });

      if (!existingUser) throw new AppError("User doesn't exists", 404);

      const subId = existingUser.subsciption[0].id;

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
          subsciption: true,
        },
      });

      if (!existingUser) throw new AppError("User doesn't exists", 404);

      const subId = existingUser.subsciption[0].id;

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
}
