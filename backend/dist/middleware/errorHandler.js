"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
const logger_1 = require("../utils/logger");
function errorHandler(err, _req, res, _next) {
    if (err instanceof zod_1.ZodError) {
        res.status(400).json({
            success: false,
            message: "Données invalides",
            errors: err.errors.map((e) => ({ path: e.path.join("."), message: e.message })),
        });
        return;
    }
    logger_1.logger.error(err);
    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === "production" ? "Erreur interne du serveur" : err.message,
    });
}
//# sourceMappingURL=errorHandler.js.map