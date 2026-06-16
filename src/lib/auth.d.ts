import { type DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      userId: string;
      role: "staff" | "customer";
    } & DefaultSession["user"];
  }

  interface User {
    role?: "staff" | "customer";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "staff" | "customer";
    userId?: string;
  }
}
