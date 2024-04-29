"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBodyParams = void 0;
function validateBodyParams(...params) {
    const middleware = (req, res, next) => {
        for (const param of params) {
            if (!(param in req.body)) {
                return res.status(400).json({ error: `${param} is required` });
            }
        }
        next();
    };
    return middleware;
}
exports.validateBodyParams = validateBodyParams;
//# sourceMappingURL=validation.js.map