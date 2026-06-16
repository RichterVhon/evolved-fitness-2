"use client";

import { useActionState } from "react";
import type { Member } from "@/generated/prisma/client";
import {
  createMemberAction,
  updateMemberAction,
  type ActionState,
} from "../actions/member.actions";

type Props = {
  member?: Member & { user: { email: string } };
};

const initialState: ActionState = null;

export function MemberForm({ member }: Props) {
  const isEdit = !!member;

  const action = isEdit
    ? updateMemberAction.bind(null, member.id)
    : createMemberAction;

  const [state, formAction, isPending] = useActionState(action, initialState);

  const fieldError = (field: string) =>
    state?.error?.[field]?.[0];

  return (
    <form action={formAction} className="space-y-4 max-w-lg">
      {state?.error?.["_form"] && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {state.error["_form"][0]}
        </div>
      )}

      {!isEdit && (
        <>
          <Field label="Email" name="email" type="email" error={fieldError("email")} />
          <Field label="Password" name="password" type="password" error={fieldError("password")} />
        </>
      )}

      {isEdit && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Membership ID</label>
          <p className="mt-1 font-mono text-sm text-gray-500">{member.membershipId}</p>
        </div>
      )}

      <Field
        label="Full Name"
        name="fullName"
        defaultValue={member?.fullName}
        error={fieldError("fullName")}
      />
      <Field
        label="Address"
        name="address"
        defaultValue={member?.address}
        error={fieldError("address")}
      />
      <Field
        label="Emergency Contact"
        name="emergencyContact"
        defaultValue={member?.emergencyContact}
        error={fieldError("emergencyContact")}
      />

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? "Saving…" : isEdit ? "Save Changes" : "Create Member"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
