import Link from "next/link";
import { listMembers } from "@/features/members/member.service";
import { MemberList } from "@/features/members/components/MemberList";

export default async function MembersPage() {
  const members = await listMembers();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Members</h1>
        <Link
          href="/dashboard/members/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + New Member
        </Link>
      </div>
      <MemberList initialMembers={members} />
    </div>
  );
}
