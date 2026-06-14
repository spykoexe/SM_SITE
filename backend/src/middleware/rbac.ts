import type { Request, Response, NextFunction } from "express";
import { UserRole } from "@prisma/client";

const roleHierarchy: Record<string, number> = {
  [UserRole.USER]: 1,
  [UserRole.PREMIUM]: 2,
  [UserRole.MODERATOR]: 3,
  [UserRole.ADMIN]: 4,
  [UserRole.SUPER_ADMIN]: 5,
};

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentification requise" });
      return;
    }

    const userRoleLevel = roleHierarchy[req.user.role];
    const minRequiredLevel = Math.min(...allowedRoles.map((r) => roleHierarchy[r]));

    if (userRoleLevel < minRequiredLevel) {
      res.status(403).json({ success: false, message: "Accès interdit — droits insuffisants" });
      return;
    }

    next();
  };
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  return requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN)(req, res, next);
}

export function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
  return requireRole(UserRole.SUPER_ADMIN)(req, res, next);
}
