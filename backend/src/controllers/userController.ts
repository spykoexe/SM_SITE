import type { Request, Response, NextFunction } from "express";
import * as userService from "../services/userService";
import { updateProfileSchema, passwordChangeSchema } from "../utils/validation";

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const profile = await userService.getProfile(req.user!.id);
    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateProfileSchema.parse(req.body);
    const profile = await userService.updateProfile(req.user!.id, data);
    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
}

export async function changePassword(req: Request, res: Response, next: NextFunction) {
  try {
    const data = passwordChangeSchema.parse(req.body);
    await userService.changePassword(req.user!.id, data);
    res.json({ success: true, message: "Mot de passe modifié" });
  } catch (err) {
    next(err);
  }
}

export async function getSessions(req: Request, res: Response, next: NextFunction) {
  try {
    const sessions = await userService.getSessions(req.user!.id);
    res.json({ success: true, data: sessions });
  } catch (err) {
    next(err);
  }
}

export async function revokeSession(req: Request, res: Response, next: NextFunction) {
  try {
    await userService.revokeSession(req.user!.id, req.params.sessionId);
    res.json({ success: true, message: "Session révoquée" });
  } catch (err) {
    next(err);
  }
}

export async function getActivity(req: Request, res: Response, next: NextFunction) {
  try {
    const activity = await userService.getActivity(req.user!.id);
    res.json({ success: true, data: activity });
  } catch (err) {
    next(err);
  }
}

export async function getNotifications(req: Request, res: Response, next: NextFunction) {
  try {
    const notifications = await userService.getNotifications(req.user!.id);
    res.json({ success: true, data: notifications });
  } catch (err) {
    next(err);
  }
}

export async function getUnreadCount(req: Request, res: Response, next: NextFunction) {
  try {
    const count = await userService.getUnreadCount(req.user!.id);
    res.json({ success: true, data: { count } });
  } catch (err) {
    next(err);
  }
}

export async function markNotificationRead(req: Request, res: Response, next: NextFunction) {
  try {
    await userService.markNotificationRead(req.user!.id, req.params.id);
    res.json({ success: true, message: "Notification marquée comme lue" });
  } catch (err) {
    next(err);
  }
}

export async function markAllRead(req: Request, res: Response, next: NextFunction) {
  try {
    await userService.markAllRead(req.user!.id);
    res.json({ success: true, message: "Toutes les notifications marquées comme lues" });
  } catch (err) {
    next(err);
  }
}
