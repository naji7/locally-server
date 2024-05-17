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

  public async getUserUpcomingGiveaways(
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
        select: {
          id: true,
          title: true,
          startDate: true,
          imageUrl: true,
          reqEntries: true,
          type: true,
          entries: {
            where: {
              userId: req.user?.id,
            },
          },
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

  public async getAllGiveaways(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const giveaways = await prisma.giveaway.findMany();

      res.status(200).send(giveaways);
    } catch (error) {
      next(error);
    }
  }

  public async drawGiveaway(req: Request, res: Response, next: NextFunction) {
    try {
      const { giveawayId } = req.body;

      const giveaway = await prisma.giveaway.findUnique({
        where: {
          id: giveawayId,
        },
      });

      if (!giveaway) throw new AppError("Giveaway not found", 404);

      if (giveaway.status !== 0) throw new AppError("Draw already made", 400);

      const getEntries = await prisma.entries.findMany({
        where: {
          giveawayId: giveawayId,
        },
      });

      const reqEntries = giveaway.reqEntries;
      const userIds: any = [];
      const selectedUsers: any = [];

      getEntries.forEach((item) => {
        if (item.entries >= reqEntries) {
          selectedUsers.push(item.userId);
          const pushCount = Math.floor(item.entries / reqEntries);
          for (let i = 0; i < pushCount; i++) {
            userIds.push(item.userId);
          }
        }
      });

      const winningUser = userIds[Math.floor(Math.random() * userIds.length)];

      const updatedGiveaway = await prisma.giveaway.update({
        where: {
          id: giveawayId,
        },
        data: {
          winningUserId: winningUser,
          selectedUsers: selectedUsers,
          drawedAt: new Date(Date.now()),
          drawStatus: 1,
        },
      });

      res.status(200).send({
        updatedGiveaway,
        message: "Giveaway drawn successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  public async getPreviousWinners(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const sub = await prisma.giveaway.findMany({
        where: {
          drawStatus: 1,
        },
        select: {
          imageUrl: true,
          title: true,
          drawedAt: true,
          winningUser: {
            select: {
              fullName: true,
            },
          },
        },
      });

      res.status(200).send(sub);
    } catch (error) {
      next(error);
    }
  }
}
