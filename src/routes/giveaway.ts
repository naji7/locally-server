import { Router } from "express";

import { GiveawayController } from "../controllers";
import { authenticateJwt } from "../middlewares";

const router = Router();
const giveawayController: GiveawayController = new GiveawayController();

router.post("/giveaway", giveawayController.addGiveaways);

router.get("/upcomingGiveaways", giveawayController.getUpcomingGiveaways);

router.get(
  "/activeUserEntries",
  authenticateJwt,
  giveawayController.getActiveUserEntries
);

export { router as giveaway };
