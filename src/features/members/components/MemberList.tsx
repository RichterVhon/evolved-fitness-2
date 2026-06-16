"use client";

import { useState, useTransition, useCallback } from "react";
import type { Member } from "@/generated/prisma/client";
import { getMembersAction } from "../actions/member.actions";
import { MemberCard } from "./MemberCard";

type MemberWithEmail = Member & { user: { email: string } };

type Props = {
  initialMembers: MemberWithEmail[];
};

export function MemberList({ initialMembers }: Props) {
  const [members, setMembers] = useState(initialMembers);
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    startTransition(async () => {
      const results = await getMembersAction(value || undefined);
      setMembers(results as MemberWithEmail[]);
    });
  }, []);

  return (
    <div>
      <input
        type="search"
        placeholder="Search by name…"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="mb-4 block w-full max-w-sm rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />

      {isPending && <p className="text-sm text-gray-400">Searching…</p>}

      {!isPending && members.length === 0 && (
        <p className="text-sm text-gray-500">No members found.</p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((m) => (
          <MemberCard key={m.id} member={m} />
        ))}
      </div>
    </div>
  );
}
