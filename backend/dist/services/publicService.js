"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReviews = getReviews;
exports.createReview = createReview;
exports.createTicket = createTicket;
exports.getPublicStats = getPublicStats;
const database_1 = require("../config/database");
async function getReviews() {
    return database_1.prisma.review.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
        include: { user: { select: { username: true, avatarUrl: true } } },
    });
}
async function createReview(data, userId) {
    return database_1.prisma.review.create({
        data: { userId, authorName: data.authorName, rating: data.rating, comment: data.comment, staffName: data.staffName },
    });
}
async function createTicket(data, userId) {
    return database_1.prisma.ticket.create({
        data: { userId, discordPseudo: data.discordPseudo, discordId: data.discordId, subject: data.subject, message: data.message },
    });
}
async function getPublicStats() {
    const [members, reviewsCount, ticketsCount] = await Promise.all([
        database_1.prisma.user.count(),
        database_1.prisma.review.count(),
        database_1.prisma.ticket.count(),
    ]);
    return { members, reviews: reviewsCount, tickets: ticketsCount, servers: 5 };
}
//# sourceMappingURL=publicService.js.map