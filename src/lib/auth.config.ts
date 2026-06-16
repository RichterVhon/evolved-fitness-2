import type { NextAuthConfig } from "next-auth";

// Edge-safe config: no Prisma, no Node.js-only modules.
// Used by the proxy (middleware) which runs in the Edge Runtime.
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token["role"] = (user as { role?: string }).role;
        token["userId"] = user.id;
      }
      return token;
    },
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          role: (token["role"] as "staff" | "customer") ?? "customer",
          userId: (token["userId"] as string) ?? "",
        },
      };
    },
  },
  providers: [],
} satisfies NextAuthConfig;
