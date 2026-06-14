import { prisma } from "../config/database";
import { hashPassword } from "../security/encryption";
import { logger } from "../utils/logger";
import type { CreateUserInput } from "../utils/validation";

export async function getDashboardStats() {
  const [
    totalUsers,
    activeUsers,
    newUsersToday,
    newUsersWeek,
    newUsersMonth,
    totalSessions,
    totalReviews,
    totalTickets,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { lastLoginAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } }),
    prisma.user.count({ where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } }),
    prisma.user.count({ where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
    prisma.user.count({ where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } }),
    prisma.session.count(),
    prisma.review.count(),
    prisma.ticket.count(),
  ]);

  const activityByDay = await prisma.activityLog.groupBy({
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

export async function getUsers(query: { page?: number; limit?: number; search?: string; role?: string; sortBy?: string; sortOrder?: string }) {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(100, Math.max(1, query.limit || 20));
  const skip = (page - 1) * limit;

  const where: any = {};
  if (query.search) {
    where.OR = [
      { email: { contains: query.search, mode: "insensitive" } },
      { username: { contains: query.search, mode: "insensitive" } },
      { displayName: { contains: query.search, mode: "insensitive" } },
    ];
  }
  if (query.role) where.role = query.role;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
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
    prisma.user.count({ where }),
  ]);

  return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function createUser(data: CreateUserInput, adminId: string) {
  const exists = await prisma.user.findFirst({
    where: { OR: [{ email: data.email }, { username: data.username }] },
  });
  if (exists) throw new Error("Email ou nom d'utilisateur déjà utilisé");

  const passwordHash = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      username: data.username,
      displayName: data.username,
      passwordHash,
      role: data.role,
      isActive: data.isActive ?? true,
    },
  });

  await prisma.activityLog.create({
    data: { userId: adminId, action: "ADMIN_CREATE_USER", entity: "User", entityId: user.id },
  });
  logger.info(`Admin ${adminId} created user ${user.id}`);
  return user;
}

export async function updateUser(adminId: string, userId: string, data: Partial<CreateUserInput & { isActive?: boolean }>) {
  const updateData: any = {};
  if (data.email) updateData.email = data.email;
  if (data.username) updateData.username = data.username;
  if (data.role) updateData.role = data.role;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;
  if (data.password) updateData.passwordHash = await hashPassword(data.password);

  const user = await prisma.user.update({ where: { id: userId }, data: updateData });

  await prisma.activityLog.create({
    data: { userId: adminId, action: "ADMIN_UPDATE_USER", entity: "User", entityId: userId, metadata: updateData },
  });
  logger.info(`Admin ${adminId} updated user ${userId}`);
  return user;
}

export async function deleteUser(adminId: string, userId: string) {
  await prisma.user.delete({ where: { id: userId } });
  await prisma.activityLog.create({
    data: { userId: adminId, action: "ADMIN_DELETE_USER", entity: "User", entityId: userId },
  });
  logger.info(`Admin ${adminId} deleted user ${userId}`);
}

export async function resetUserPassword(adminId: string, userId: string, newPassword: string) {
  const hash = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash: hash } });
  await prisma.activityLog.create({
    data: { userId: adminId, action: "ADMIN_RESET_PASSWORD", entity: "User", entityId: userId },
  });
  logger.info(`Admin ${adminId} reset password for user ${userId}`);
}

export async function getActivityLogs(query: { page?: number; limit?: number; userId?: string }) {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(100, Math.max(1, query.limit || 50));
  const skip = (page - 1) * limit;

  const where: any = {};
  if (query.userId) where.userId = query.userId;

  const [logs, total] = await Promise.all([
    prisma.activityLog.findMany({
      where,
      include: { user: { select: { email: true, username: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.activityLog.count({ where }),
  ]);

  return { logs, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getSystemHealth() {
  const dbTime = Date.now();
  await prisma.$queryRaw`SELECT 1`;
  const dbLatency = Date.now() - dbTime;

  return {
    status: "healthy",
    timestamp: new Date().toISOString(),
    database: { status: "connected", latencyMs: dbLatency },
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  };
}

export async function createAnnouncement(adminId: string, title: string, message: string, type: string = "INFO") {
  const users = await prisma.user.findMany({ where: { isActive: true }, select: { id: true } });
  const notifType = type as any;
  await prisma.notification.createMany({
    data: users.map((u) => ({ userId: u.id, title, message, type: notifType })),
  });
  await prisma.activityLog.create({
    data: { userId: adminId, action: "CREATE_ANNOUNCEMENT", entity: "Notification", metadata: { title, message, recipients: users.length } },
  });
  logger.info(`Admin ${adminId} created announcement for ${users.length} users`);
  return { recipients: users.length };
}
