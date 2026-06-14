import type { UpdateProfileInput, PasswordChangeInput } from "../utils/validation";
export declare function getProfile(userId: string): Promise<{
    email: string;
    username: string;
    displayName: string | null;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    bio: string | null;
    language: string;
    timezone: string;
    theme: import(".prisma/client").$Enums.Theme;
    notificationEmail: boolean;
    notificationPush: boolean;
    role: import(".prisma/client").$Enums.UserRole;
    id: string;
    avatarUrl: string | null;
    twoFactorEnabled: boolean;
    lastLoginAt: Date | null;
    createdAt: Date;
}>;
export declare function updateProfile(userId: string, data: UpdateProfileInput): Promise<{
    email: string;
    username: string;
    displayName: string | null;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    bio: string | null;
    language: string;
    timezone: string;
    theme: import(".prisma/client").$Enums.Theme;
    notificationEmail: boolean;
    notificationPush: boolean;
    role: import(".prisma/client").$Enums.UserRole;
    id: string;
    avatarUrl: string | null;
    twoFactorEnabled: boolean;
    lastLoginAt: Date | null;
    createdAt: Date;
}>;
export declare function changePassword(userId: string, data: PasswordChangeInput): Promise<void>;
export declare function getSessions(userId: string): Promise<{
    id: string;
    createdAt: Date;
    ipAddress: string | null;
    userAgent: string | null;
    expiresAt: Date;
}[]>;
export declare function revokeSession(userId: string, sessionId: string): Promise<void>;
export declare function getActivity(userId: string): Promise<{
    userId: string | null;
    id: string;
    createdAt: Date;
    action: string;
    entity: string | null;
    entityId: string | null;
    metadata: import("@prisma/client/runtime/library").JsonValue | null;
    ipAddress: string | null;
}[]>;
export declare function getNotifications(userId: string): Promise<{
    message: string;
    type: import(".prisma/client").$Enums.NotificationType;
    userId: string;
    id: string;
    createdAt: Date;
    title: string;
    read: boolean;
    actionUrl: string | null;
}[]>;
export declare function markNotificationRead(userId: string, notificationId: string): Promise<void>;
export declare function uploadAvatar(userId: string, filename: string): Promise<{
    url: string;
}>;
//# sourceMappingURL=userService.d.ts.map