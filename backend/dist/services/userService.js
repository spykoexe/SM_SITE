"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = getProfile;
exports.updateProfile = updateProfile;
exports.changePassword = changePassword;
exports.getSessions = getSessions;
exports.revokeSession = revokeSession;
exports.getActivity = getActivity;
exports.getNotifications = getNotifications;
exports.markNotificationRead = markNotificationRead;
exports.uploadAvatar = uploadAvatar;
const database_1 = require("../config/database");
const encryption_1 = require("../security/encryption");
const logger_1 = require("../utils/logger");
async function getProfile(userId) {
    const user = await database_1.prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true, email: true, username: true, displayName: true,
            firstName: true, lastName: true, phone: true, bio: true,
            avatarUrl: true, role: true, language: true, timezone: true,
            theme: true, notificationEmail: true, notificationPush: true,
            twoFactorEnabled: true, lastLoginAt: true, createdAt: true,
        },
    });
    if (!user)
        throw new Error("Utilisateur non trouvé");
    return user;
}
async function updateProfile(userId, data) {
    const user = await database_1.prisma.user.update({
        where: { id: userId },
        data: { ...data, updatedAt: new Date() },
        select: {
            id: true, email: true, username: true, displayName: true,
            firstName: true, lastName: true, phone: true, bio: true,
            avatarUrl: true, role: true, language: true, timezone: true,
            theme: true, notificationEmail: true, notificationPush: true,
            twoFactorEnabled: true, lastLoginAt: true, createdAt: true,
        },
    });
    await database_1.prisma.activityLog.create({ data: { userId, action: "UPDATE_PROFILE", entity: "User", entityId: userId } });
    logger_1.logger.info(`Profile updated: ${userId}`);
    return user;
}
async function changePassword(userId, data) {
    const user = await database_1.prisma.user.findUnique({ where: { id: userId } });
    if (!user)
        throw new Error("Utilisateur non trouvé");
    const valid = await (0, encryption_1.comparePassword)(data.currentPassword, user.passwordHash);
    if (!valid)
        throw new Error("Mot de passe actuel incorrect");
    const newHash = await (0, encryption_1.hashPassword)(data.newPassword);
    await database_1.prisma.user.update({ where: { id: userId }, data: { passwordHash: newHash } });
    await database_1.prisma.activityLog.create({ data: { userId, action: "CHANGE_PASSWORD", entity: "User", entityId: userId } });
    logger_1.logger.info(`Password changed: ${userId}`);
}
async function getSessions(userId) {
    return database_1.prisma.session.findMany({
        where: { userId },
        select: { id: true, ipAddress: true, userAgent: true, createdAt: true, expiresAt: true },
        orderBy: { createdAt: "desc" },
    });
}
async function revokeSession(userId, sessionId) {
    await database_1.prisma.session.deleteMany({ where: { id: sessionId, userId } });
    await database_1.prisma.activityLog.create({ data: { userId, action: "REVOKE_SESSION", entity: "Session", entityId: sessionId } });
}
async function getActivity(userId) {
    return database_1.prisma.activityLog.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 50,
    });
}
async function getNotifications(userId) {
    return database_1.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 50,
    });
}
async function markNotificationRead(userId, notificationId) {
    await database_1.prisma.notification.updateMany({
        where: { id: notificationId, userId },
        data: { read: true },
    });
}
async function uploadAvatar(userId, filename) {
    const url = `/uploads/${filename}`;
    await database_1.prisma.user.update({ where: { id: userId }, data: { avatarUrl: url } });
    await database_1.prisma.media.create({
        data: { userId, filename, originalName: filename, mimeType: "image/*", size: 0, url, category: "avatar" },
    });
    return { url };
}
//# sourceMappingURL=userService.js.map