"use client";

import { useState, useTransition } from "react";
import { toggleCheckIn } from "@/app/actions/habits";

interface CheckInButtonProps {
  habitId: string;
  initialCheckedIn: boolean;
}

export function CheckInButton({
  habitId,
  initialCheckedIn,
}: CheckInButtonProps) {
  const [checkedIn, setCheckedIn] = useState(initialCheckedIn);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    const next = !checkedIn;
    // Flip the button immediately so the tap feels instant, then reconcile
    // with the server; roll back only if the action actually fails.
    setCheckedIn(next);
    startTransition(async () => {
      try {
        await toggleCheckIn(habitId);
      } catch {
        setCheckedIn(!next);
      }
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={checkedIn}
      className={`w-full rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${
        checkedIn
          ? "bg-moss-light text-moss-dark hover:bg-moss-light/80"
          : "bg-moss text-white hover:bg-moss-dark"
      }`}
    >
      {checkedIn ? "Checked in today" : "Check in today"}
    </button>
  );
}
