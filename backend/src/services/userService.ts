import { prisma } from "../config/database";
import { comparePassword, hashPassword } from "../security/encryption";
import { logger } from "../utils/logger";
import type { UpdateProfileInput, PasswordChangeInput } from "../utils/validation";

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true, email: true, username: true, displayName: true,
      firstName: true, lastName: true, phone: true, bio: true,
      avatarUrl: true, role: true, language: true, timezone: true,
      theme: true, notificationEmail: true, notificationPush: true,
      twoFactorEnabled: true, lastLoginAt: true, createdAt: true,
    },
  });
  if (!user) throw new Error("Utilisateur non trouvé");
  return user;
}

export async function updateProfile(userId: string, data: UpdateProfileInput) {
  const user = await prisma.user.update({
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
  await prisma.activityLog.create({ data: { userId, action: "UPDATE_PROFILE", entity: "User", entityId: userId } });
  logger.info(`Profile updated: ${userId}`);
  return user;
}

export async function changePassword(userId: string, data: PasswordChangeInput) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("Utilisateur non trouvé");

  const valid = await comparePassword(data.currentPassword, user.passwordHash);
  if (!valid) throw new Error("Mot de passe actuel incorrect");

  const newHash = await hashPassword(data.newPassword);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash: newHash } });
  await prisma.activityLog.create({ data: { userId, action: "CHANGE_PASSWORD", entity: "User", entityId: userId } });
  logger.info(`Password changed: ${userId}`);
}

export async function getSessions(userId: string) {
  return prisma.session.findMany({
    where: { userId },
    select: { id: true, ipAddress: true, userAgent: true, createdAt: true, expiresAt: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function revokeSession(userId: string, sessionId: string) {
  await prisma.session.deleteMany({ where: { id: sessionId, userId } });
  await prisma.activityLog.create({ data: { userId, action: "REVOKE_SESSION", entity: "Session", entityId: sessionId } });
}

export async function getActivity(userId: string) {
  return prisma.activityLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function getNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function getUnreadCount(userId: string) {
  return prisma.notification.count({ where: { userId, read: false } });
}

export async function markNotificationRead(userId: string, notificationId: string) {
  await prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { read: true },
  });
}

export async function markAllRead(userId: string) {
  await prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
}

export async function uploadAvatar(userId: string, filename: string) {
  const url = `/uploads/${filename}`;
  await prisma.user.update({ where: { id: userId }, data: { avatarUrl: url } });
  await prisma.media.create({
    data: { userId, filename, originalName: filename, mimeType: "image/*", size: 0, url, category: "avatar" },
  });
  return { url };
}
