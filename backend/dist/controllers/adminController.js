"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = getDashboardStats;
exports.getUsers = getUsers;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.resetUserPassword = resetUserPassword;
exports.getActivityLogs = getActivityLogs;
exports.getSystemHealth = getSystemHealth;
const adminService = __importStar(require("../services/adminService"));
const validation_1 = require("../utils/validation");
async function getDashboardStats(req, res, next) {
    try {
        const stats = await adminService.getDashboardStats();
        res.json({ success: true, data: stats });
    }
    catch (err) {
        next(err);
    }
}
async function getUsers(req, res, next) {
    try {
        const result = await adminService.getUsers({
            page: Number(req.query.page),
            limit: Number(req.query.limit),
            search: req.query.search,
            role: req.query.role,
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder,
        });
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function createUser(req, res, next) {
    try {
        const data = validation_1.createUserSchema.parse(req.body);
        const user = await adminService.createUser(data, req.user.id);
        res.status(201).json({ success: true, data: user });
    }
    catch (err) {
        next(err);
    }
}
async function updateUser(req, res, next) {
    try {
        const user = await adminService.updateUser(req.user.id, req.params.id, req.body);
        res.json({ success: true, data: user });
    }
    catch (err) {
        next(err);
    }
}
async function deleteUser(req, res, next) {
    try {
        await adminService.deleteUser(req.user.id, req.params.id);
        res.json({ success: true, message: "Utilisateur supprimé" });
    }
    catch (err) {
        next(err);
    }
}
async function resetUserPassword(req, res, next) {
    try {
        const { newPassword } = req.body;
        if (!newPassword || newPassword.length < 8)
            throw new Error("Mot de passe trop court");
        await adminService.resetUserPassword(req.user.id, req.params.id, newPassword);
        res.json({ success: true, message: "Mot de passe réinitialisé" });
    }
    catch (err) {
        next(err);
    }
}
async function getActivityLogs(req, res, next) {
    try {
        const result = await adminService.getActivityLogs({
            page: Number(req.query.page),
            limit: Number(req.query.limit),
            userId: req.query.userId,
        });
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function getSystemHealth(req, res, next) {
    try {
        const health = await adminService.getSystemHealth();
        res.json({ success: true, data: health });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=adminController.js.map