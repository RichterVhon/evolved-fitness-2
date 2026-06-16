"use server";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { createMemberSchema, updateMemberSchema } from "../member.schema";
import * as memberService from "../member.service";

async function requireStaff() {
  const session = await getSession();
  if (session?.user.role !== "staff") {
    throw new Error("Unauthorized");
  }
}

export type ActionState = { error: Record<string, string[]> } | null;

export async function createMemberAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireStaff();

  const raw = Object.fromEntries(formData);
  const parsed = createMemberSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    await memberService.createMember(parsed.data);
  } catch (e: unknown) {
    const isPrismaUniqueViolation =
      e instanceof Error && "code" in e && (e as { code: string }).code === "P2002";
    if (isPrismaUniqueViolation) {
      return { error: { _form: ["Membership ID conflict — please try again."] } };
    }
    return { error: { _form: ["Failed to create member. Please try again."] } };
  }

  redirect("/dashboard/members");
}

export async function updateMemberAction(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireStaff();

  const raw = Object.fromEntries(formData);
  const parsed = updateMemberSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    await memberService.updateMember(id, parsed.data);
  } catch {
    return { error: { _form: ["Failed to update member. Please try again."] } };
  }

  redirect(`/dashboard/members/${id}`);
}

export async function getMembersAction(search?: string) {
  await requireStaff();
  return memberService.listMembers(search);
}

export async function getMemberAction(id: string) {
  await requireStaff();
  return memberService.getMember(id);
}
