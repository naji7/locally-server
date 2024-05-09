import { Router } from "express";

import { GiveawayController } from "../controllers";

const router = Router();
const giveawayController: GiveawayController = new GiveawayController();

router.post("/giveaway", giveawayController.addGiveaways);

router.get("/upcomingGiveaways", giveawayController.getUpcomingGiveaways);

export { router as giveaway };
