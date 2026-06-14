"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordChangeSchema = exports.ticketSchema = exports.reviewSchema = exports.createUserSchema = exports.updateProfileSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email("Email invalide").min(5).max(255),
    username: zod_1.z.string().min(3, "Minimum 3 caractères").max(30, "Maximum 30 caractères").regex(/^[a-zA-Z0-9_]+$/, "Lettres, chiffres et underscore uniquement"),
    password: zod_1.z.string().min(8, "Minimum 8 caractères").max(128).regex(/[A-Z]/, "Au moins une majuscule").regex(/[0-9]/, "Au moins un chiffre"),
    displayName: zod_1.z.string().min(1).max(100).optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
exports.updateProfileSchema = zod_1.z.object({
    firstName: zod_1.z.string().max(100).optional(),
    lastName: zod_1.z.string().max(100).optional(),
    displayName: zod_1.z.string().max(100).optional(),
    phone: zod_1.z.string().max(20).optional(),
    bio: zod_1.z.string().max(500).optional(),
    language: zod_1.z.enum(["fr", "en", "es", "de"]).optional(),
    timezone: zod_1.z.string().max(50).optional(),
    theme: zod_1.z.enum(["LIGHT", "DARK", "SYSTEM"]).optional(),
    notificationEmail: zod_1.z.boolean().optional(),
    notificationPush: zod_1.z.boolean().optional(),
});
exports.createUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    username: zod_1.z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
    password: zod_1.z.string().min(8).max(128),
    role: zod_1.z.enum(["USER", "PREMIUM", "MODERATOR", "ADMIN", "SUPER_ADMIN"]),
    isActive: zod_1.z.boolean().optional(),
});
exports.reviewSchema = zod_1.z.object({
    authorName: zod_1.z.string().min(1).max(100),
    rating: zod_1.z.number().int().min(1).max(5),
    comment: zod_1.z.string().min(1).max(2000),
    staffName: zod_1.z.string().max(100).optional(),
});
exports.ticketSchema = zod_1.z.object({
    discordPseudo: zod_1.z.string().min(1).max(100),
    discordId: zod_1.z.string().min(10).max(30),
    subject: zod_1.z.string().min(1).max(200),
    message: zod_1.z.string().min(1).max(5000),
});
exports.passwordChangeSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1),
    newPassword: zod_1.z.string().min(8).max(128).regex(/[A-Z]/).regex(/[0-9]/),
});
//# sourceMappingURL=validation.js.map