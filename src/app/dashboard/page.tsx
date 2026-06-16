import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getSession();
  if (session?.user.role === "staff") {
    redirect("/dashboard/members");
  }
  return (
    <p className="text-gray-500">Welcome, {session?.user.email}</p>
  );
}
