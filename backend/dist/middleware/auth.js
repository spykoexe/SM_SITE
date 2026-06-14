"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const database_1 = require("../config/database");
async function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ success: false, message: "Token manquant" });
            return;
        }
        const token = authHeader.slice(7);
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        if (decoded.type !== "access") {
            res.status(401).json({ success: false, message: "Token invalide" });
            return;
        }
        const user = await database_1.prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, username: true, role: true, isActive: true },
        });
        if (!user || !user.isActive) {
            res.status(401).json({ success: false, message: "Utilisateur non trouvé ou inactif" });
            return;
        }
        req.user = user;
        next();
    }
    catch (err) {
        res.status(401).json({ success: false, message: "Token invalide ou expiré" });
    }
}
//# sourceMappingURL=auth.js.map