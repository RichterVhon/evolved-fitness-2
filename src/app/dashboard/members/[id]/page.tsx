import Link from "next/link";
import { notFound } from "next/navigation";
import { getMember } from "@/features/members/member.service";
import { MemberForm } from "@/features/members/components/MemberForm";

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = await getMember(id);
  if (!member) notFound();

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard/members"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Back to Members
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">{member.fullName}</h1>
        <p className="font-mono text-sm text-gray-400">{member.membershipId}</p>
      </div>
      <MemberForm member={member} />
    </div>
  );
}
