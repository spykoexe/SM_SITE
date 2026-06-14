import type { Request, Response, NextFunction } from "express";
import { UserRole } from "@prisma/client";
export declare function requireRole(...allowedRoles: UserRole[]): (req: Request, res: Response, next: NextFunction) => void;
export declare function requireAdmin(req: Request, res: Response, next: NextFunction): void;
export declare function requireSuperAdmin(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=rbac.d.ts.map