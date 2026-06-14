"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = getDashboardStats;
exports.getUsers = getUsers;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.resetUserPassword = resetUserPassword;
exports.getActivityLogs = getActivityLogs;
exports.getSystemHealth = getSystemHealth;
const database_1 = require("../config/database");
const encryption_1 = require("../security/encryption");
const logger_1 = require("../utils/logger");
async function getDashboardStats() {
    const [totalUsers, activeUsers, newUsersToday, newUsersWeek, newUsersMonth, totalSessions, totalReviews, totalTickets,] = await Promise.all([
        database_1.prisma.user.count(),
        database_1.prisma.user.count({ where: { lastLoginAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } }),
        database_1.prisma.user.count({ where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } }),
        database_1.prisma.user.count({ where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
        database_1.prisma.user.count({ where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } }),
        database_1.prisma.session.count(),
        database_1.prisma.review.count(),
        database_1.prisma.ticket.count(),
    ]);
    const activityByDay = await database_1.prisma.activityLog.groupBy({
        by: ["action"],
        _count: { action: true },
        where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    });
    return {
        users: { total: totalUsers, active: activeUsers, newToday: newUsersToday, newWeek: newUsersWeek, newMonth: newUsersMonth },
        sessions: totalSessions,
        reviews: totalReviews,
        tickets: totalTickets,
        activity: activityByDay,
    };
}
async function getUsers(query) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;
    const where = {};
    if (query.search) {
        where.OR = [
            { email: { contains: query.search, mode: "insensitive" } },
            { username: { contains: query.search, mode: "insensitive" } },
            { displayName: { contains: query.search, mode: "insensitive" } },
        ];
    }
    if (query.role)
        where.role = query.role;
    const [users, total] = await Promise.all([
        database_1.prisma.user.findMany({
            where,
            select: {
                id: true, email: true, username: true, displayName: true,
                role: true, isActive: true, twoFactorEnabled: true,
                lastLoginAt: true, createdAt: true,
            },
            skip,
            take: limit,
            orderBy: { [query.sortBy || "createdAt"]: query.sortOrder === "asc" ? "asc" : "desc" },
        }),
        database_1.prisma.user.count({ where }),
    ]);
    return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
}
async function createUser(data, adminId) {
    const exists = await database_1.prisma.user.findFirst({
        where: { OR: [{ email: data.email }, { username: data.username }] },
    });
    if (exists)
        throw new Error("Email ou nom d'utilisateur déjà utilisé");
    const passwordHash = await (0, encryption_1.hashPassword)(data.password);
    const user = await database_1.prisma.user.create({
        data: {
            email: data.email,
            username: data.username,
            displayName: data.username,
            passwordHash,
            role: data.role,
            isActive: data.isActive ?? true,
        },
    });
    await database_1.prisma.activityLog.create({
        data: { userId: adminId, action: "ADMIN_CREATE_USER", entity: "User", entityId: user.id },
    });
    logger_1.logger.info(`Admin ${adminId} created user ${user.id}`);
    return user;
}
async function updateUser(adminId, userId, data) {
    const updateData = {};
    if (data.email)
        updateData.email = data.email;
    if (data.username)
        updateData.username = data.username;
    if (data.role)
        updateData.role = data.role;
    if (data.isActive !== undefined)
        updateData.isActive = data.isActive;
    if (data.password)
        updateData.passwordHash = await (0, encryption_1.hashPassword)(data.password);
    const user = await database_1.prisma.user.update({ where: { id: userId }, data: updateData });
    await database_1.prisma.activityLog.create({
        data: { userId: adminId, action: "ADMIN_UPDATE_USER", entity: "User", entityId: userId, metadata: updateData },
    });
    logger_1.logger.info(`Admin ${adminId} updated user ${userId}`);
    return user;
}
async function deleteUser(adminId, userId) {
    await database_1.prisma.user.delete({ where: { id: userId } });
    await database_1.prisma.activityLog.create({
        data: { userId: adminId, action: "ADMIN_DELETE_USER", entity: "User", entityId: userId },
    });
    logger_1.logger.info(`Admin ${adminId} deleted user ${userId}`);
}
async function resetUserPassword(adminId, userId, newPassword) {
    const hash = await (0, encryption_1.hashPassword)(newPassword);
    await database_1.prisma.user.update({ where: { id: userId }, data: { passwordHash: hash } });
    await database_1.prisma.activityLog.create({
        data: { userId: adminId, action: "ADMIN_RESET_PASSWORD", entity: "User", entityId: userId },
    });
    logger_1.logger.info(`Admin ${adminId} reset password for user ${userId}`);
}
async function getActivityLogs(query) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 50));
    const skip = (page - 1) * limit;
    const where = {};
    if (query.userId)
        where.userId = query.userId;
    const [logs, total] = await Promise.all([
        database_1.prisma.activityLog.findMany({
            where,
            include: { user: { select: { email: true, username: true } } },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        database_1.prisma.activityLog.count({ where }),
    ]);
    return { logs, total, page, limit, totalPages: Math.ceil(total / limit) };
}
async function getSystemHealth() {
    const dbTime = Date.now();
    await database_1.prisma.$queryRaw `SELECT 1`;
    const dbLatency = Date.now() - dbTime;
    return {
        status: "healthy",
        timestamp: new Date().toISOString(),
        database: { status: "connected", latencyMs: dbLatency },
        uptime: process.uptime(),
        memory: process.memoryUsage(),
    };
}
//# sourceMappingURL=adminService.js.map