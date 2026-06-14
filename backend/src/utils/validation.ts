import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Email invalide").min(5).max(255),
  username: z.string().min(3, "Minimum 3 caractères").max(30, "Maximum 30 caractères").regex(/^[a-zA-Z0-9_]+$/, "Lettres, chiffres et underscore uniquement"),
  password: z.string().min(8, "Minimum 8 caractères").max(128).regex(/[A-Z]/, "Au moins une majuscule").regex(/[0-9]/, "Au moins un chiffre"),
  displayName: z.string().min(1).max(100).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const updateProfileSchema = z.object({
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  displayName: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  bio: z.string().max(500).optional(),
  language: z.enum(["fr", "en", "es", "de"]).optional(),
  timezone: z.string().max(50).optional(),
  theme: z.enum(["LIGHT", "DARK", "SYSTEM"]).optional(),
  notificationEmail: z.boolean().optional(),
  notificationPush: z.boolean().optional(),
});

export const createUserSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(8).max(128),
  role: z.enum(["USER", "PREMIUM", "MODERATOR", "ADMIN", "SUPER_ADMIN"]),
  isActive: z.boolean().optional(),
});

export const reviewSchema = z.object({
  authorName: z.string().min(1).max(100),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1).max(2000),
  staffName: z.string().max(100).optional(),
});

export const ticketSchema = z.object({
  discordPseudo: z.string().min(1).max(100),
  discordId: z.string().min(10).max(30),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(128).regex(/[A-Z]/).regex(/[0-9]/),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type TicketInput = z.infer<typeof ticketSchema>;
export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;
