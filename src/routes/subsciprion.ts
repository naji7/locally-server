import { Router } from "express";

import { SubscriptionController } from "../controllers";
import { authenticateJwt } from "../middlewares";

const router = Router();
const subscriptionController: SubscriptionController =
  new SubscriptionController();

router.post("/subscription", subscriptionController.addSubscription);

router.put("/subscription/:id", subscriptionController.updateSubscription);

router.get("/subscription", subscriptionController.getSubscriptions);

router.post(
  "/unsubscribe",
  authenticateJwt,
  subscriptionController.unsubscribe
);

router.post(
  "/renew",
  authenticateJwt,
  subscriptionController.renewSubscription
);

export { router as subscription };
