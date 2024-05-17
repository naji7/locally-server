import { Router } from "express";

import { GiveawayController } from "../controllers";
import { authenticateJwt, validateBodyParams } from "../middlewares";

const router = Router();
const giveawayController: GiveawayController = new GiveawayController();

router.post("/giveaway", giveawayController.addGiveaways);

router.get("/giveaway", giveawayController.getAllGiveaways);

router.get(
  "/upcomingGiveaways",
  authenticateJwt,
  giveawayController.getUserUpcomingGiveaways
);

router.get(
  "/activeUserEntries",
  authenticateJwt,
  giveawayController.getActiveUserEntries
);

router.post(
  "/draw",
  validateBodyParams("giveawayId"),
  giveawayController.drawGiveaway
);

router.get("/winners", authenticateJwt, giveawayController.getPreviousWinners);

export { router as giveaway };
