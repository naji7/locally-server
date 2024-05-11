import { NextFunction, Request, Response } from "express";

import { prisma } from "../services/prisma";
import AppError from "../errors/app";
import { cancelSubscription } from "../services/stripe";
import { GiveawayType } from "../constant";

export class GiveawayController {
  public async addGiveaways(req: Request, res: Response, next: NextFunction) {
    try {
      const sub = await prisma.giveaway.create({ data: req.body });

      const allUsers = await prisma.user.findMany({
        select: {
          id: true,
          subscriptionPlan: true,
          subscription: true,
        },
      });

      for (const user of allUsers) {
        if (user.subscription[0].endsAt > new Date(Date.now())) {
          await prisma.entries.create({
            data: {
              giveawayId: sub.id,
              userId: user.id,
              entries: user.subscriptionPlan.entries,
            },
          });
        }
      }

      res.status(200).send({
        data: sub,
        message: `Giveaway successfully added`,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getUpcomingGiveaways(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const currentDate = new Date();

      const sub = await prisma.giveaway.findMany({
        where: {
          startDate: {
            gt: currentDate,
          },
          status: 0,
        },
      });

      res.status(200).send(sub);
    } catch (error) {
      next(error);
    }
  }

  public async getActiveUserEntries(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.id;
      const sub = await prisma.entries.findMany({
        where: {
          userId: userId,
          giveaway: {
            status: 0,
          },
        },
        select: {
          id: true,
          giveaway: true,
          entries: true,
          userId: true,
        },
      });

      res.status(200).send(sub);
    } catch (error) {
      next(error);
    }
  }
}
