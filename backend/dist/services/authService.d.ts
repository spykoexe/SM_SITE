import type { RegisterInput, LoginInput } from "../utils/validation";
export declare function register(data: RegisterInput): Promise<{
    user: {
        email: string;
        username: string;
        role: import(".prisma/client").$Enums.UserRole;
        id: string;
        createdAt: Date;
    };
}>;
export declare function login(data: LoginInput, ip?: string, userAgent?: string): Promise<{
    requires2FA: boolean;
    tempToken: string;
    user?: undefined;
    tokens?: undefined;
} | {
    user: {
        id: string;
        email: string;
        username: string;
        role: import(".prisma/client").$Enums.UserRole;
    };
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
    requires2FA?: undefined;
    tempToken?: undefined;
}>;
export declare function verify2FA(tempToken: string, code: string, ip?: string, userAgent?: string): Promise<{
    user: {
        id: string;
        email: string;
        username: string;
        role: import(".prisma/client").$Enums.UserRole;
    };
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
}>;
export declare function refreshTokens(refreshToken: string): Promise<{
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
}>;
export declare function logout(userId: string, token: string): Promise<void>;
export declare function logoutAll(userId: string): Promise<void>;
export declare function setup2FA(userId: string): Promise<{
    secret: string;
    qrCodeUrl: string;
}>;
export declare function confirm2FA(userId: string, code: string): Promise<{
    backupCodes: string[];
}>;
export declare function disable2FA(userId: string, password: string): Promise<void>;
//# sourceMappingURL=authService.d.ts.map