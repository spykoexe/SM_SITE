import type { ReviewInput, TicketInput } from "../utils/validation";
export declare function getReviews(): Promise<({
    user: {
        username: string;
        avatarUrl: string | null;
    } | null;
} & {
    authorName: string;
    rating: number;
    comment: string;
    staffName: string | null;
    userId: string | null;
    id: string;
    createdAt: Date;
})[]>;
export declare function createReview(data: ReviewInput, userId?: string): Promise<{
    authorName: string;
    rating: number;
    comment: string;
    staffName: string | null;
    userId: string | null;
    id: string;
    createdAt: Date;
}>;
export declare function createTicket(data: TicketInput, userId?: string): Promise<{
    message: string;
    status: import(".prisma/client").$Enums.TicketStatus;
    discordPseudo: string;
    discordId: string;
    subject: string;
    userId: string | null;
    id: string;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare function getPublicStats(): Promise<{
    members: number;
    reviews: number;
    tickets: number;
    servers: number;
}>;
//# sourceMappingURL=publicService.d.ts.map