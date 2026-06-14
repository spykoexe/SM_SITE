import type { Request, Response, NextFunction } from "express";
import * as authService from "../services/authService";
import { registerSchema, loginSchema } from "../utils/validation";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const data = registerSchema.parse(req.body);
    const result = await authService.register(data);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const data = loginSchema.parse(req.body);
    const ip = req.ip || req.socket.remoteAddress;
    const result = await authService.login(data, ip, req.headers["user-agent"]);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function verify2FA(req: Request, res: Response, next: NextFunction) {
  try {
    const { tempToken, code } = req.body;
    if (!tempToken || !code) throw new Error("tempToken et code requis");
    const ip = req.ip || req.socket.remoteAddress;
    const result = await authService.verify2FA(tempToken, code, ip, req.headers["user-agent"]);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new Error("refreshToken requis");
    const result = await authService.refreshTokens(refreshToken);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : "";
    await authService.logout(req.user!.id, token);
    res.json({ success: true, message: "Déconnecté" });
  } catch (err) {
    next(err);
  }
}

export async function logoutAll(req: Request, res: Response, next: NextFunction) {
  try {
    await authService.logoutAll(req.user!.id);
    res.json({ success: true, message: "Toutes les sessions ont été révoquées" });
  } catch (err) {
    next(err);
  }
}

export async function setup2FA(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.setup2FA(req.user!.id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function confirm2FA(req: Request, res: Response, next: NextFunction) {
  try {
    const { code } = req.body;
    if (!code) throw new Error("Code requis");
    const result = await authService.confirm2FA(req.user!.id, code);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function disable2FA(req: Request, res: Response, next: NextFunction) {
  try {
    const { password } = req.body;
    if (!password) throw new Error("Mot de passe requis");
    await authService.disable2FA(req.user!.id, password);
    res.json({ success: true, message: "2FA désactivée" });
  } catch (err) {
    next(err);
  }
}
