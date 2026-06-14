import type { Request, Response, NextFunction } from "express";
export declare function getProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function updateProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function changePassword(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getSessions(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function revokeSession(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getActivity(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getNotifications(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function markNotificationRead(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=userController.d.ts.map