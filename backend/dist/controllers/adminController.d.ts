import type { Request, Response, NextFunction } from "express";
export declare function getDashboardStats(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function createUser(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function updateUser(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function deleteUser(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function resetUserPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getActivityLogs(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getSystemHealth(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=adminController.d.ts.map