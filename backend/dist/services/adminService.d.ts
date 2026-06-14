import type { CreateUserInput } from "../utils/validation";
export declare function getDashboardStats(): Promise<{
    users: {
        total: number;
        active: number;
        newToday: number;
        newWeek: number;
        newMonth: number;
    };
    sessions: number;
    reviews: number;
    tickets: number;
    activity: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.ActivityLogGroupByOutputType, "action"[]> & {
        _count: {
            action: number;
        };
    })[];
}>;
export declare function getUsers(query: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    sortBy?: string;
    sortOrder?: string;
}): Promise<{
    users: {
        email: string;
        username: string;
        displayName: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
        id: string;
        twoFactorEnabled: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
    }[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}>;
export declare function createUser(data: CreateUserInput, adminId: string): Promise<{
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
    isActive: boolean;
    id: string;
    avatarUrl: string | null;
    passwordHash: string;
    emailVerified: boolean;
    twoFactorSecret: string | null;
    twoFactorEnabled: boolean;
    twoFactorBackupCodes: string | null;
    lastLoginAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}>;
export declare function updateUser(adminId: string, userId: string, data: Partial<CreateUserInput & {
    isActive?: boolean;
}>): Promise<{
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
    isActive: boolean;
    id: string;
    avatarUrl: string | null;
    passwordHash: string;
    emailVerified: boolean;
    twoFactorSecret: string | null;
    twoFactorEnabled: boolean;
    twoFactorBackupCodes: string | null;
    lastLoginAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}>;
export declare function deleteUser(adminId: string, userId: string): Promise<void>;
export declare function resetUserPassword(adminId: string, userId: string, newPassword: string): Promise<void>;
export declare function getActivityLogs(query: {
    page?: number;
    limit?: number;
    userId?: string;
}): Promise<{
    logs: ({
        user: {
            email: string;
            username: string;
        } | null;
    } & {
        userId: string | null;
        id: string;
        createdAt: Date;
        action: string;
        entity: string | null;
        entityId: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        ipAddress: string | null;
    })[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}>;
export declare function getSystemHealth(): Promise<{
    status: string;
    timestamp: string;
    database: {
        status: string;
        latencyMs: number;
    };
    uptime: number;
    memory: NodeJS.MemoryUsage;
}>;
//# sourceMappingURL=adminService.d.ts.map