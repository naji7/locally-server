"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscription = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
exports.subscription = router;
const subscriptionController = new controllers_1.SubscriptionController();
router.post("/subscription", subscriptionController.addSubscription);
router.put("/subscription/:id", subscriptionController.updateSubscription);
router.get("/subscription", subscriptionController.getSubscriptions);
//# sourceMappingURL=subsciprion.js.map