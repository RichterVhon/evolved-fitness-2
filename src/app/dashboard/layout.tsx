import Link from "next/link";
import { getSession } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-56 border-r border-gray-200 bg-white p-4">
        <p className="mb-6 text-lg font-bold text-gray-900">Evolved Fitness</p>
        <nav className="space-y-1">
          {session?.user.role === "staff" && (
            <Link
              href="/dashboard/members"
              className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Members
            </Link>
          )}
        </nav>
        <div className="mt-auto pt-4">
          <p className="text-xs text-gray-400">{session?.user.email}</p>
          <p className="text-xs font-medium text-gray-500 capitalize">{session?.user.role}</p>
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
