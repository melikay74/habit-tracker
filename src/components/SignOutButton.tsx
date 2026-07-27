"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="font-mono text-xs uppercase tracking-wide text-sage hover:text-ink"
    >
      Sign out
    </button>
  );
}
