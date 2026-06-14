import { prisma } from "../config/database";
import type { ReviewInput, TicketInput } from "../utils/validation";

export async function getReviews() {
  return prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: { select: { username: true, avatarUrl: true } } },
  });
}

export async function createReview(data: ReviewInput, userId?: string) {
  return prisma.review.create({
    data: { userId, authorName: data.authorName, rating: data.rating, comment: data.comment, staffName: data.staffName },
  });
}

export async function createTicket(data: TicketInput, userId?: string) {
  return prisma.ticket.create({
    data: { userId, discordPseudo: data.discordPseudo, discordId: data.discordId, subject: data.subject, message: data.message },
  });
}

export async function getServers() {
  return prisma.discordServer.findMany({
    orderBy: { memberCount: "desc" },
    select: { guildId: true, name: true, memberCount: true, onlineCount: true, inviteUrl: true, updatedAt: true },
  });
}

export async function upsertServerStats(guildId: string, name: string, memberCount: number, onlineCount: number, inviteUrl: string) {
  return prisma.discordServer.upsert({
    where: { guildId },
    update: { memberCount, onlineCount, updatedAt: new Date() },
    create: { guildId, name, memberCount, onlineCount, inviteUrl },
  });
}

export async function getPublicStats() {
  const [members, reviewsCount, ticketsCount] = await Promise.all([
    prisma.user.count(),
    prisma.review.count(),
    prisma.ticket.count(),
  ]);
  return { members, reviews: reviewsCount, tickets: ticketsCount, servers: 5 };
}
