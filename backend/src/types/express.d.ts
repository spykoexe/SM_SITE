import { User, UserRole } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: Pick<User, "id" | "email" | "username" | "role">;
    }
  }
}

export type JwtPayload = {
  userId: string;
  email: string;
  role: UserRole;
  type: "access" | "refresh";
};
