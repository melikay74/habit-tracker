"use client";

import { signIn } from "next-auth/react";

export function SignInButtons() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        onClick={() => signIn("github")}
        className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-ink/90"
      >
        Continue with GitHub
      </button>
      <button
        onClick={() => signIn("google")}
        className="rounded-full bg-surface px-5 py-2.5 text-sm font-medium text-ink ring-1 ring-black/10 hover:bg-black/5"
      >
        Continue with Google
      </button>
    </div>
  );
}
