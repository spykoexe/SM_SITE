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
exports.getProfile = getProfile;
exports.updateProfile = updateProfile;
exports.changePassword = changePassword;
exports.getSessions = getSessions;
exports.revokeSession = revokeSession;
exports.getActivity = getActivity;
exports.getNotifications = getNotifications;
exports.markNotificationRead = markNotificationRead;
const userService = __importStar(require("../services/userService"));
const validation_1 = require("../utils/validation");
async function getProfile(req, res, next) {
    try {
        const profile = await userService.getProfile(req.user.id);
        res.json({ success: true, data: profile });
    }
    catch (err) {
        next(err);
    }
}
async function updateProfile(req, res, next) {
    try {
        const data = validation_1.updateProfileSchema.parse(req.body);
        const profile = await userService.updateProfile(req.user.id, data);
        res.json({ success: true, data: profile });
    }
    catch (err) {
        next(err);
    }
}
async function changePassword(req, res, next) {
    try {
        const data = validation_1.passwordChangeSchema.parse(req.body);
        await userService.changePassword(req.user.id, data);
        res.json({ success: true, message: "Mot de passe modifié" });
    }
    catch (err) {
        next(err);
    }
}
async function getSessions(req, res, next) {
    try {
        const sessions = await userService.getSessions(req.user.id);
        res.json({ success: true, data: sessions });
    }
    catch (err) {
        next(err);
    }
}
async function revokeSession(req, res, next) {
    try {
        await userService.revokeSession(req.user.id, req.params.sessionId);
        res.json({ success: true, message: "Session révoquée" });
    }
    catch (err) {
        next(err);
    }
}
async function getActivity(req, res, next) {
    try {
        const activity = await userService.getActivity(req.user.id);
        res.json({ success: true, data: activity });
    }
    catch (err) {
        next(err);
    }
}
async function getNotifications(req, res, next) {
    try {
        const notifications = await userService.getNotifications(req.user.id);
        res.json({ success: true, data: notifications });
    }
    catch (err) {
        next(err);
    }
}
async function markNotificationRead(req, res, next) {
    try {
        await userService.markNotificationRead(req.user.id, req.params.id);
        res.json({ success: true, message: "Notification marquée comme lue" });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=userController.js.map