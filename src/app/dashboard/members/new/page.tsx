import Link from "next/link";
import { MemberForm } from "@/features/members/components/MemberForm";

export default function NewMemberPage() {
  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard/members"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Back to Members
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">New Member</h1>
      </div>
      <MemberForm />
    </div>
  );
}
