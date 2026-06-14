import type { Request, Response, NextFunction } from "express";
import * as adminService from "../services/adminService";
import { createUserSchema } from "../utils/validation";

export async function getDashboardStats(req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await adminService.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
}

export async function getUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await adminService.getUsers({
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      search: req.query.search as string,
      role: req.query.role as string,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as string,
    });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createUserSchema.parse(req.body);
    const user = await adminService.createUser(data, req.user!.id);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await adminService.updateUser(req.user!.id, req.params.id, req.body);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    await adminService.deleteUser(req.user!.id, req.params.id);
    res.json({ success: true, message: "Utilisateur supprimé" });
  } catch (err) {
    next(err);
  }
}

export async function resetUserPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 8) throw new Error("Mot de passe trop court");
    await adminService.resetUserPassword(req.user!.id, req.params.id, newPassword);
    res.json({ success: true, message: "Mot de passe réinitialisé" });
  } catch (err) {
    next(err);
  }
}

export async function getActivityLogs(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await adminService.getActivityLogs({
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      userId: req.query.userId as string,
    });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getSystemHealth(req: Request, res: Response, next: NextFunction) {
  try {
    const health = await adminService.getSystemHealth();
    res.json({ success: true, data: health });
  } catch (err) {
    next(err);
  }
}

export async function createAnnouncement(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, message, type = "INFO" } = req.body;
    if (!title || !message) throw new Error("Titre et message requis");
    const result = await adminService.createAnnouncement(req.user!.id, title, message, type);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
