import type { Request, Response, NextFunction } from "express";
export declare function register(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function login(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function verify2FA(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function refresh(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function logout(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function logoutAll(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function setup2FA(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function confirm2FA(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function disable2FA(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=authController.d.ts.map