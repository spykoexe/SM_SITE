import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { env } from "../config/env";
import { prisma } from "../config/database";
import { hashPassword, comparePassword, generateBackupCodes } from "../security/encryption";
import { logger } from "../utils/logger";
import type { RegisterInput, LoginInput } from "../utils/validation";

function generateTokens(userId: string, email: string, role: string) {
  const accessToken = jwt.sign(
    { userId, email, role, type: "access" },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRATION } as any
  );
  const refreshToken = jwt.sign(
    { userId, email, role, type: "refresh" },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRATION } as any
  );
  return { accessToken, refreshToken };
}

export async function register(data: RegisterInput) {
  const exists = await prisma.user.findFirst({
    where: { OR: [{ email: data.email }, { username: data.username }] },
  });
  if (exists) throw new Error("Email ou nom d'utilisateur déjà utilisé");

  const passwordHash = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      username: data.username,
      displayName: data.displayName || data.username,
      passwordHash,
    },
    select: { id: true, email: true, username: true, role: true, createdAt: true },
  });

  await prisma.activityLog.create({
    data: { action: "REGISTER", entity: "User", entityId: user.id },
  });

  logger.info(`User registered: ${user.email}`);
  return { user };
}

export async function login(data: LoginInput, ip?: string, userAgent?: string) {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) throw new Error("Identifiants invalides");
  if (!user.isActive) throw new Error("Compte désactivé");

  const valid = await comparePassword(data.password, user.passwordHash);
  if (!valid) throw new Error("Identifiants invalides");

  if (user.twoFactorEnabled) {
    return { requires2FA: true, tempToken: jwt.sign(
      { userId: user.id, email: user.email, role: user.role, type: "2fa_temp" },
      env.JWT_SECRET,
      { expiresIn: "5m" } as any
    )};
  }

  const tokens = generateTokens(user.id, user.email, user.role);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: { userId: user.id, token: tokens.accessToken, refreshToken: tokens.refreshToken, ipAddress: ip, userAgent, expiresAt },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  await prisma.activityLog.create({
    data: { userId: user.id, action: "LOGIN", entity: "User", entityId: user.id, ipAddress: ip },
  });

  logger.info(`User login: ${user.email} from ${ip}`);
  return { user: { id: user.id, email: user.email, username: user.username, role: user.role }, tokens };
}

export async function verify2FA(tempToken: string, code: string, ip?: string, userAgent?: string) {
  const decoded = jwt.verify(tempToken, env.JWT_SECRET) as any;
  if (decoded.type !== "2fa_temp") throw new Error("Token invalide");

  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
  if (!user || !user.twoFactorSecret) throw new Error("Utilisateur non trouvé");

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token: code,
    window: 2,
  });

  if (!verified) throw new Error("Code 2FA invalide");

  const tokens = generateTokens(user.id, user.email, user.role);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: { userId: user.id, token: tokens.accessToken, refreshToken: tokens.refreshToken, ipAddress: ip, userAgent, expiresAt },
  });

  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await prisma.activityLog.create({ data: { userId: user.id, action: "LOGIN_2FA", entity: "User", entityId: user.id, ipAddress: ip } });

  logger.info(`User login with 2FA: ${user.email}`);
  return { user: { id: user.id, email: user.email, username: user.username, role: user.role }, tokens };
}

export async function refreshTokens(refreshToken: string) {
  const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as any;
  if (decoded.type !== "refresh") throw new Error("Token invalide");

  const session = await prisma.session.findFirst({
    where: { refreshToken, userId: decoded.userId },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) throw new Error("Session invalide ou expirée");

  const tokens = generateTokens(session.user.id, session.user.email, session.user.role);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.session.update({
    where: { id: session.id },
    data: { token: tokens.accessToken, refreshToken: tokens.refreshToken, expiresAt },
  });

  return { tokens };
}

export async function logout(userId: string, token: string) {
  await prisma.session.deleteMany({ where: { userId, token } });
  await prisma.activityLog.create({ data: { userId, action: "LOGOUT", entity: "User", entityId: userId } });
  logger.info(`User logout: ${userId}`);
}

export async function logoutAll(userId: string) {
  await prisma.session.deleteMany({ where: { userId } });
  await prisma.activityLog.create({ data: { userId, action: "LOGOUT_ALL", entity: "User", entityId: userId } });
  logger.info(`User logout all sessions: ${userId}`);
}

export async function setup2FA(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("Utilisateur non trouvé");
  if (user.twoFactorEnabled) throw new Error("2FA déjà activée");

  const secret = speakeasy.generateSecret({
    name: `SM Platform (${user.email})`,
    length: 32,
  });

  await prisma.user.update({
    where: { id: userId },
    data: { twoFactorSecret: secret.base32 },
  });

  const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);
  return { secret: secret.base32, qrCodeUrl };
}

export async function confirm2FA(userId: string, code: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.twoFactorSecret) throw new Error("Configuration 2FA non trouvée");

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token: code,
    window: 2,
  });

  if (!verified) throw new Error("Code invalide");

  const backupCodes = generateBackupCodes();
  await prisma.user.update({
    where: { id: userId },
    data: { twoFactorEnabled: true, twoFactorBackupCodes: JSON.stringify(backupCodes) },
  });

  await prisma.activityLog.create({ data: { userId, action: "ENABLE_2FA", entity: "User", entityId: userId } });
  return { backupCodes };
}

export async function disable2FA(userId: string, password: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("Utilisateur non trouvé");

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) throw new Error("Mot de passe incorrect");

  await prisma.user.update({
    where: { id: userId },
    data: { twoFactorEnabled: false, twoFactorSecret: null, twoFactorBackupCodes: null },
  });

  await prisma.activityLog.create({ data: { userId, action: "DISABLE_2FA", entity: "User", entityId: userId } });
}
