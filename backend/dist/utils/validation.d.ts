import { z } from "zod";
export declare const registerSchema: z.ZodObject<{
    email: z.ZodString;
    username: z.ZodString;
    password: z.ZodString;
    displayName: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    username: string;
    password: string;
    displayName?: string | undefined;
}, {
    email: string;
    username: string;
    password: string;
    displayName?: string | undefined;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const updateProfileSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    displayName: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
    language: z.ZodOptional<z.ZodEnum<["fr", "en", "es", "de"]>>;
    timezone: z.ZodOptional<z.ZodString>;
    theme: z.ZodOptional<z.ZodEnum<["LIGHT", "DARK", "SYSTEM"]>>;
    notificationEmail: z.ZodOptional<z.ZodBoolean>;
    notificationPush: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    displayName?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    phone?: string | undefined;
    bio?: string | undefined;
    language?: "fr" | "en" | "es" | "de" | undefined;
    timezone?: string | undefined;
    theme?: "LIGHT" | "DARK" | "SYSTEM" | undefined;
    notificationEmail?: boolean | undefined;
    notificationPush?: boolean | undefined;
}, {
    displayName?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    phone?: string | undefined;
    bio?: string | undefined;
    language?: "fr" | "en" | "es" | "de" | undefined;
    timezone?: string | undefined;
    theme?: "LIGHT" | "DARK" | "SYSTEM" | undefined;
    notificationEmail?: boolean | undefined;
    notificationPush?: boolean | undefined;
}>;
export declare const createUserSchema: z.ZodObject<{
    email: z.ZodString;
    username: z.ZodString;
    password: z.ZodString;
    role: z.ZodEnum<["USER", "PREMIUM", "MODERATOR", "ADMIN", "SUPER_ADMIN"]>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    email: string;
    username: string;
    password: string;
    role: "USER" | "PREMIUM" | "MODERATOR" | "ADMIN" | "SUPER_ADMIN";
    isActive?: boolean | undefined;
}, {
    email: string;
    username: string;
    password: string;
    role: "USER" | "PREMIUM" | "MODERATOR" | "ADMIN" | "SUPER_ADMIN";
    isActive?: boolean | undefined;
}>;
export declare const reviewSchema: z.ZodObject<{
    authorName: z.ZodString;
    rating: z.ZodNumber;
    comment: z.ZodString;
    staffName: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    authorName: string;
    rating: number;
    comment: string;
    staffName?: string | undefined;
}, {
    authorName: string;
    rating: number;
    comment: string;
    staffName?: string | undefined;
}>;
export declare const ticketSchema: z.ZodObject<{
    discordPseudo: z.ZodString;
    discordId: z.ZodString;
    subject: z.ZodString;
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
    discordPseudo: string;
    discordId: string;
    subject: string;
}, {
    message: string;
    discordPseudo: string;
    discordId: string;
    subject: string;
}>;
export declare const passwordChangeSchema: z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    currentPassword: string;
    newPassword: string;
}, {
    currentPassword: string;
    newPassword: string;
}>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type TicketInput = z.infer<typeof ticketSchema>;
export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;
//# sourceMappingURL=validation.d.ts.map