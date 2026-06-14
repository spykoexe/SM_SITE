"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const encryption_1 = require("../src/security/encryption");
const prisma = new client_1.PrismaClient();
async function main() {
    const adminExists = await prisma.user.findFirst({ where: { role: client_1.UserRole.SUPER_ADMIN } });
    if (!adminExists) {
        const password = process.env.ADMIN_DEFAULT_PASSWORD || "AdminSecure123!";
        await prisma.user.create({
            data: {
                email: process.env.ADMIN_DEFAULT_EMAIL || "admin@sm-reseau.fr",
                username: "superadmin",
                displayName: "Super Administrateur",
                passwordHash: await (0, encryption_1.hashPassword)(password),
                role: client_1.UserRole.SUPER_ADMIN,
                isActive: true,
            },
        });
        console.log("Super admin created");
    }
    // Seed sample reviews
    const reviewCount = await prisma.review.count();
    if (reviewCount === 0) {
        await prisma.review.createMany({
            data: [
                { authorName: "AlexDev", rating: 5, comment: "Excellente communauté, très actives et bienveillantes !", staffName: "SM Staff" },
                { authorName: "MarieRP", rating: 4, comment: "Le serveur RP est incroyable, l'ambiance est top.", staffName: "SM Staff" },
                { authorName: "CodeMaster", rating: 5, comment: "SM Développement m'a aidé à progresser énormément.", staffName: "SM Staff" },
            ],
        });
        console.log("Sample reviews created");
    }
    console.log("Seed completed");
}
main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map