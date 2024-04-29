"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionController = void 0;
const prisma_1 = require("../services/prisma");
class SubscriptionController {
    addSubscription(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sub = yield prisma_1.prisma.subscriptionPlan.create({ data: req.body });
                res.status(200).send({
                    data: sub,
                    message: `Subscription successfully added`,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateSubscription(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const sub = yield prisma_1.prisma.subscriptionPlan.updateMany({
                    where: {
                        id: id,
                    },
                    data: req.body,
                });
                res.status(204).send({
                    data: { sub },
                    message: `Subscription successfully updated`,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getSubscriptions(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sub = yield prisma_1.prisma.subscriptionPlan.findMany();
                res.status(200).send(sub);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.SubscriptionController = SubscriptionController;
//# sourceMappingURL=subscription.js.map