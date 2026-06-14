import type { Request, Response, NextFunction } from "express";
import * as publicService from "../services/publicService";
import { reviewSchema, ticketSchema } from "../utils/validation";

export async function getReviews(req: Request, res: Response, next: NextFunction) {
  try {
    const reviews = await publicService.getReviews();
    res.json({ success: true, data: reviews });
  } catch (err) {
    next(err);
  }
}

export async function createReview(req: Request, res: Response, next: NextFunction) {
  try {
    const data = reviewSchema.parse(req.body);
    const review = await publicService.createReview(data, req.user?.id);
    res.status(201).json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
}

export async function createTicket(req: Request, res: Response, next: NextFunction) {
  try {
    const data = ticketSchema.parse(req.body);
    const ticket = await publicService.createTicket(data, req.user?.id);
    res.status(201).json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
}

export async function getServers(req: Request, res: Response, next: NextFunction) {
  try {
    const servers = await publicService.getServers();
    res.json({ success: true, data: servers });
  } catch (err) {
    next(err);
  }
}

export async function updateServerStats(req: Request, res: Response, next: NextFunction) {
  try {
    const { guildId, name, memberCount, onlineCount, inviteUrl, secret } = req.body;
    if (secret !== process.env.BOT_SECRET) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const server = await publicService.upsertServerStats(guildId, name, memberCount, onlineCount, inviteUrl);
    res.json({ success: true, data: server });
  } catch (err) {
    next(err);
  }
}

export async function getStats(req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await publicService.getPublicStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
}
