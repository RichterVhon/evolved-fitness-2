import { prisma } from "@/lib/prisma";
import type { Member, PrismaClient } from "@/generated/prisma/client";

type TxClient = Parameters<PrismaClient["$transaction"]>[0] extends (
  tx: infer T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...rest: any[]
) => unknown
  ? T
  : never;

export async function findMemberById(id: string): Promise<Member & { user: { email: string } } | null> {
  return prisma.member.findUnique({
    where: { id },
    include: { user: { select: { email: true } } },
  });
}

export async function findAllMembers(search?: string): Promise<(Member & { user: { email: string } })[]> {
  return prisma.member.findMany({
    where: search
      ? { fullName: { contains: search, mode: "insensitive" } }
      : undefined,
    include: { user: { select: { email: true } } },
    orderBy: { joinedAt: "desc" },
  });
}

export async function countMembersForYear(year: number): Promise<number> {
  return prisma.member.count({
    where: {
      joinedAt: {
        gte: new Date(`${year}-01-01T00:00:00.000Z`),
        lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
      },
    },
  });
}

export async function createUserAndMember(data: {
  email: string;
  passwordHash: string;
  membershipId: string;
  fullName: string;
  address: string;
  emergencyContact: string;
}): Promise<Member> {
  return prisma.$transaction(async (tx: TxClient) => {
    const user = await tx.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        role: "customer",
      },
    });

    return tx.member.create({
      data: {
        userId: user.id,
        membershipId: data.membershipId,
        fullName: data.fullName,
        address: data.address,
        emergencyContact: data.emergencyContact,
      },
    });
  });
}

export async function updateMember(
  id: string,
  data: { fullName?: string; address?: string; emergencyContact?: string }
): Promise<Member> {
  return prisma.member.update({ where: { id }, data });
}
