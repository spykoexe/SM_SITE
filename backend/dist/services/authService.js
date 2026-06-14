"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.verify2FA = verify2FA;
exports.refreshTokens = refreshTokens;
exports.logout = logout;
exports.logoutAll = logoutAll;
exports.setup2FA = setup2FA;
exports.confirm2FA = confirm2FA;
exports.disable2FA = disable2FA;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const speakeasy_1 = __importDefault(require("speakeasy"));
const qrcode_1 = __importDefault(require("qrcode"));
const env_1 = require("../config/env");
const database_1 = require("../config/database");
const encryption_1 = require("../security/encryption");
const logger_1 = require("../utils/logger");
function generateTokens(userId, email, role) {
    const accessToken = jsonwebtoken_1.default.sign({ userId, email, role, type: "access" }, env_1.env.JWT_SECRET, { expiresIn: env_1.env.JWT_EXPIRATION });
    const refreshToken = jsonwebtoken_1.default.sign({ userId, email, role, type: "refresh" }, env_1.env.JWT_REFRESH_SECRET, { expiresIn: env_1.env.JWT_REFRESH_EXPIRATION });
    return { accessToken, refreshToken };
}
async function register(data) {
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
            displayName: data.displayName || data.username,
            passwordHash,
        },
        select: { id: true, email: true, username: true, role: true, createdAt: true },
    });
    await database_1.prisma.activityLog.create({
        data: { action: "REGISTER", entity: "User", entityId: user.id },
    });
    logger_1.logger.info(`User registered: ${user.email}`);
    return { user };
}
async function login(data, ip, userAgent) {
    const user = await database_1.prisma.user.findUnique({ where: { email: data.email } });
    if (!user)
        throw new Error("Identifiants invalides");
    if (!user.isActive)
        throw new Error("Compte désactivé");
    const valid = await (0, encryption_1.comparePassword)(data.password, user.passwordHash);
    if (!valid)
        throw new Error("Identifiants invalides");
    if (user.twoFactorEnabled) {
        return { requires2FA: true, tempToken: jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role, type: "2fa_temp" }, env_1.env.JWT_SECRET, { expiresIn: "5m" }) };
    }
    const tokens = generateTokens(user.id, user.email, user.role);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await database_1.prisma.session.create({
        data: { userId: user.id, token: tokens.accessToken, refreshToken: tokens.refreshToken, ipAddress: ip, userAgent, expiresAt },
    });
    await database_1.prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
    });
    await database_1.prisma.activityLog.create({
        data: { userId: user.id, action: "LOGIN", entity: "User", entityId: user.id, ipAddress: ip },
    });
    logger_1.logger.info(`User login: ${user.email} from ${ip}`);
    return { user: { id: user.id, email: user.email, username: user.username, role: user.role }, tokens };
}
async function verify2FA(tempToken, code, ip, userAgent) {
    const decoded = jsonwebtoken_1.default.verify(tempToken, env_1.env.JWT_SECRET);
    if (decoded.type !== "2fa_temp")
        throw new Error("Token invalide");
    const user = await database_1.prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user || !user.twoFactorSecret)
        throw new Error("Utilisateur non trouvé");
    const verified = speakeasy_1.default.totp.verify({
        secret: user.twoFactorSecret,
        encoding: "base32",
        token: code,
        window: 2,
    });
    if (!verified)
        throw new Error("Code 2FA invalide");
    const tokens = generateTokens(user.id, user.email, user.role);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await database_1.prisma.session.create({
        data: { userId: user.id, token: tokens.accessToken, refreshToken: tokens.refreshToken, ipAddress: ip, userAgent, expiresAt },
    });
    await database_1.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    await database_1.prisma.activityLog.create({ data: { userId: user.id, action: "LOGIN_2FA", entity: "User", entityId: user.id, ipAddress: ip } });
    logger_1.logger.info(`User login with 2FA: ${user.email}`);
    return { user: { id: user.id, email: user.email, username: user.username, role: user.role }, tokens };
}
async function refreshTokens(refreshToken) {
    const decoded = jsonwebtoken_1.default.verify(refreshToken, env_1.env.JWT_REFRESH_SECRET);
    if (decoded.type !== "refresh")
        throw new Error("Token invalide");
    const session = await database_1.prisma.session.findFirst({
        where: { refreshToken, userId: decoded.userId },
        include: { user: true },
    });
    if (!session || session.expiresAt < new Date())
        throw new Error("Session invalide ou expirée");
    const tokens = generateTokens(session.user.id, session.user.email, session.user.role);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await database_1.prisma.session.update({
        where: { id: session.id },
        data: { token: tokens.accessToken, refreshToken: tokens.refreshToken, expiresAt },
    });
    return { tokens };
}
async function logout(userId, token) {
    await database_1.prisma.session.deleteMany({ where: { userId, token } });
    await database_1.prisma.activityLog.create({ data: { userId, action: "LOGOUT", entity: "User", entityId: userId } });
    logger_1.logger.info(`User logout: ${userId}`);
}
async function logoutAll(userId) {
    await database_1.prisma.session.deleteMany({ where: { userId } });
    await database_1.prisma.activityLog.create({ data: { userId, action: "LOGOUT_ALL", entity: "User", entityId: userId } });
    logger_1.logger.info(`User logout all sessions: ${userId}`);
}
async function setup2FA(userId) {
    const user = await database_1.prisma.user.findUnique({ where: { id: userId } });
    if (!user)
        throw new Error("Utilisateur non trouvé");
    if (user.twoFactorEnabled)
        throw new Error("2FA déjà activée");
    const secret = speakeasy_1.default.generateSecret({
        name: `SM Platform (${user.email})`,
        length: 32,
    });
    await database_1.prisma.user.update({
        where: { id: userId },
        data: { twoFactorSecret: secret.base32 },
    });
    const qrCodeUrl = await qrcode_1.default.toDataURL(secret.otpauth_url);
    return { secret: secret.base32, qrCodeUrl };
}
async function confirm2FA(userId, code) {
    const user = await database_1.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.twoFactorSecret)
        throw new Error("Configuration 2FA non trouvée");
    const verified = speakeasy_1.default.totp.verify({
        secret: user.twoFactorSecret,
        encoding: "base32",
        token: code,
        window: 2,
    });
    if (!verified)
        throw new Error("Code invalide");
    const backupCodes = (0, encryption_1.generateBackupCodes)();
    await database_1.prisma.user.update({
        where: { id: userId },
        data: { twoFactorEnabled: true, twoFactorBackupCodes: JSON.stringify(backupCodes) },
    });
    await database_1.prisma.activityLog.create({ data: { userId, action: "ENABLE_2FA", entity: "User", entityId: userId } });
    return { backupCodes };
}
async function disable2FA(userId, password) {
    const user = await database_1.prisma.user.findUnique({ where: { id: userId } });
    if (!user)
        throw new Error("Utilisateur non trouvé");
    const valid = await (0, encryption_1.comparePassword)(password, user.passwordHash);
    if (!valid)
        throw new Error("Mot de passe incorrect");
    await database_1.prisma.user.update({
        where: { id: userId },
        data: { twoFactorEnabled: false, twoFactorSecret: null, twoFactorBackupCodes: null },
    });
    await database_1.prisma.activityLog.create({ data: { userId, action: "DISABLE_2FA", entity: "User", entityId: userId } });
}
//# sourceMappingURL=authService.js.map