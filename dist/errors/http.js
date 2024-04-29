"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unauthorized = void 0;
class HttpError extends Error {
}
class Unauthorized extends HttpError {
    constructor(message = "Unauthorized") {
        super(message);
        this.status = 401;
    }
}
exports.Unauthorized = Unauthorized;
//# sourceMappingURL=http.js.map