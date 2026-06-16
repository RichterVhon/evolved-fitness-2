import bcrypt from "bcryptjs";
import type { Member } from "@/generated/prisma/client";
import * as memberRepository from "./member.repository";
import type { CreateMemberInput, UpdateMemberInput } from "./member.schema";

// Sequential per-year counter. Low-concurrency context (single desk); the unique
// constraint on membershipId is the safety net for the unlikely collision.
async function generateMembershipId(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await memberRepository.countMembersForYear(year);
  const seq = String(count + 1).padStart(4, "0");
  return `EVF-${year}-${seq}`;
}

export async function createMember(
  input: CreateMemberInput
): Promise<Member> {
  const passwordHash = await bcrypt.hash(input.password, 12);
  const membershipId = await generateMembershipId();

  return memberRepository.createUserAndMember({
    email: input.email,
    passwordHash,
    membershipId,
    fullName: input.fullName,
    address: input.address,
    emergencyContact: input.emergencyContact,
  });
}

export async function getMember(
  id: string
): Promise<(Member & { user: { email: string } }) | null> {
  return memberRepository.findMemberById(id);
}

export async function listMembers(
  search?: string
): Promise<(Member & { user: { email: string } })[]> {
  return memberRepository.findAllMembers(search);
}

export async function updateMember(
  id: string,
  input: UpdateMemberInput
): Promise<Member> {
  return memberRepository.updateMember(id, input);
}
