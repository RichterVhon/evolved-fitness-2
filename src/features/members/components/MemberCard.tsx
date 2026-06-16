import Link from "next/link";
import type { Member } from "@/generated/prisma/client";

type Props = {
  member: Member & { user: { email: string } };
};

export function MemberCard({ member }: Props) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-mono text-gray-400">{member.membershipId}</p>
          <h3 className="mt-1 text-base font-semibold text-gray-900">{member.fullName}</h3>
          <p className="text-sm text-gray-500">{member.user.email}</p>
        </div>
        <Link
          href={`/dashboard/members/${member.id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          View
        </Link>
      </div>
      <p className="mt-2 text-xs text-gray-400">
        Joined {new Date(member.joinedAt).toLocaleDateString()}
      </p>
    </div>
  );
}
