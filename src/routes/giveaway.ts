import { Router } from "express";

import { GiveawayController } from "../controllers";

const router = Router();
const giveawayController: GiveawayController = new GiveawayController();

router.post("/giveaways", giveawayController.addGiveaways);

router.get("/activeGiveaways", giveawayController.retrieveGiveaways);

export { router as giveaway };
