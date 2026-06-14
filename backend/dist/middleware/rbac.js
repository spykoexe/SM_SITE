"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = requireRole;
exports.requireAdmin = requireAdmin;
exports.requireSuperAdmin = requireSuperAdmin;
const client_1 = require("@prisma/client");
const roleHierarchy = {
    [client_1.UserRole.USER]: 1,
    [client_1.UserRole.PREMIUM]: 2,
    [client_1.UserRole.MODERATOR]: 3,
    [client_1.UserRole.ADMIN]: 4,
    [client_1.UserRole.SUPER_ADMIN]: 5,
};
function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ success: false, message: "Authentification requise" });
            return;
        }
        const userRoleLevel = roleHierarchy[req.user.role];
        const minRequiredLevel = Math.min(...allowedRoles.map((r) => roleHierarchy[r]));
        if (userRoleLevel < minRequiredLevel) {
            res.status(403).json({ success: false, message: "Accès interdit — droits insuffisants" });
            return;
        }
        next();
    };
}
function requireAdmin(req, res, next) {
    return requireRole(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN)(req, res, next);
}
function requireSuperAdmin(req, res, next) {
    return requireRole(client_1.UserRole.SUPER_ADMIN)(req, res, next);
}
//# sourceMappingURL=rbac.js.map