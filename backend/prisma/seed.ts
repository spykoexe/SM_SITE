import { PrismaClient, UserRole } from "@prisma/client";
import { hashPassword } from "../src/security/encryption";

const prisma = new PrismaClient();

async function main() {
  // Création des comptes créateurs
  const creators = [
    {
      username: "Mysty.mtz57",
      displayName: "Mysty.mtz57",
      password: "Mysty.mtz57K798744147",
      email: "mysty@sm-reseau.fr"
    },
    {
      username: "Spyko.exe",
      displayName: "Spyko.exe",
      password: "Spyko.exe548964889478446948",
      email: "spyko@sm-reseau.fr"
    }
  ];

  for (const creator of creators) {
    const existingUser = await prisma.user.findUnique({ where: { username: creator.username } });
    if (!existingUser) {
      await prisma.user.create({
        data: {
          email: creator.email,
          username: creator.username,
          displayName: creator.displayName,
          passwordHash: await hashPassword(creator.password),
          role: UserRole.CREATOR,
          isActive: true,
        },
      });
      console.log(`Creator account created: ${creator.username}`);
    } else {
      console.log(`Creator account already exists: ${creator.username}`);
    }
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
