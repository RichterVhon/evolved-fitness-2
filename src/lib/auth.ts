import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });
        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash
        );
        if (!passwordsMatch) return null;

        return { id: user.id, email: user.email, role: user.role } as {
          id: string;
          email: string;
          role: "staff" | "customer";
        };
      },
    }),
  ],
});

export type AppSession = {
  user: {
    email: string | null | undefined;
    name?: string | null;
    image?: string | null;
    role: "staff" | "customer";
    userId: string;
  };
  expires: string;
} | null;

export async function getSession(): Promise<AppSession> {
  const session = await auth();
  return session as AppSession;
}
