import { Router } from "express";

import { GiveawayController } from "../controllers";
import { authenticateJwt, validateBodyParams } from "../middlewares";
import { UserController } from "../controllers/user";

const router = Router();
const userController: UserController = new UserController();

router.get("/users", userController.getSubscribedUsers);

router.post("/partner", userController.addPartner);

router.put("/partner/:id", userController.updatePartner);

router.get("/partner", userController.getPartners);

export { router as user };
