export declare function hashPassword(password: string): Promise<string>;
export declare function comparePassword(password: string, hash: string): Promise<boolean>;
export declare function generateSecureToken(length?: number): string;
export declare function generateBackupCodes(count?: number): string[];
//# sourceMappingURL=encryption.d.ts.map